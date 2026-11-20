package com.vsms.dao;

import com.vsms.model.Booking;
import com.vsms.model.ServiceHistory;
import com.vsms.util.DatabaseConnection;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Data Access Object for Administrator Workshop Management & Analytics.
 */
public class AdminDAO {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.10");

    public List<Booking> getAllBookings() throws SQLException {
        String sql = BookingDAO.baseBookingSelect() + " ORDER BY b.created_at DESC";
        List<Booking> list = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(BookingDAO.mapBooking(rs));
            }
        }
        return list;
    }

    public boolean updateBookingAndBilling(int bookingId, int serviceId, String newStatus,
                                          String adminRemarks, BigDecimal serviceCharge,
                                          BigDecimal additionalCharges, String paymentStatus) throws SQLException {
        String updateBookingSql = "UPDATE bookings SET service_id = ?, status = ?, admin_remarks = ? WHERE booking_id = ?";
        String updatePaymentSql = "UPDATE payments SET service_charge = ?, additional_charges = ?, tax_amount = ?, " +
                                  "total_amount = ?, payment_status = ?, " +
                                  "paid_at = CASE WHEN ? = 'Paid' AND paid_at IS NULL THEN CURRENT_TIMESTAMP ELSE paid_at END " +
                                  "WHERE booking_id = ?";
        String upsertHistorySql = "INSERT INTO service_history (booking_id, user_id, vehicle_id, service_id, service_date, final_cost, status, technician_notes) " +
                                  "SELECT b.booking_id, b.user_id, b.vehicle_id, b.service_id, b.preferred_date, ?, b.status, ? " +
                                  "FROM bookings b WHERE b.booking_id = ? " +
                                  "ON DUPLICATE KEY UPDATE final_cost = VALUES(final_cost), status = VALUES(status), technician_notes = VALUES(technician_notes)";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(updateBookingSql)) {
                ps.setInt(1, serviceId);
                ps.setString(2, newStatus);
                ps.setString(3, adminRemarks != null ? adminRemarks.trim() : "");
                ps.setInt(4, bookingId);
                ps.executeUpdate();
            }

            BigDecimal subtotal = serviceCharge.add(additionalCharges);
            BigDecimal taxAmount = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalAmount = subtotal.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

            try (PreparedStatement ps = conn.prepareStatement(updatePaymentSql)) {
                ps.setBigDecimal(1, serviceCharge);
                ps.setBigDecimal(2, additionalCharges);
                ps.setBigDecimal(3, taxAmount);
                ps.setBigDecimal(4, totalAmount);
                ps.setString(5, paymentStatus);
                ps.setString(6, paymentStatus);
                ps.setInt(7, bookingId);
                ps.executeUpdate();
            }

            if ("Completed".equalsIgnoreCase(newStatus)) {
                try (PreparedStatement ps = conn.prepareStatement(upsertHistorySql)) {
                    ps.setBigDecimal(1, totalAmount);
                    ps.setString(2, adminRemarks != null ? adminRemarks.trim() : "Service completed.");
                    ps.setInt(3, bookingId);
                    ps.executeUpdate();
                }
            }

            conn.commit();
            return true;
        } catch (SQLException ex) {
            if (conn != null) {
                conn.rollback();
            }
            throw ex;
        } finally {
            if (conn != null) {
                conn.setAutoCommit(true);
                conn.close();
            }
        }
    }

    public List<ServiceHistory> getAllServiceHistory() throws SQLException {
        String sql = "SELECT h.*, b.booking_code, u.full_name AS customer_name, v.brand, v.model, " +
                     "v.registration_number, s.service_name " +
                     "FROM service_history h " +
                     "JOIN bookings b ON h.booking_id = b.booking_id " +
                     "JOIN users u ON h.user_id = u.user_id " +
                     "JOIN vehicles v ON h.vehicle_id = v.vehicle_id " +
                     "JOIN services s ON h.service_id = s.service_id " +
                     "ORDER BY h.service_date DESC";
        List<ServiceHistory> records = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                ServiceHistory sh = new ServiceHistory();
                sh.setHistoryId(rs.getInt("history_id"));
                sh.setBookingId(rs.getInt("booking_id"));
                sh.setUserId(rs.getInt("user_id"));
                sh.setVehicleId(rs.getInt("vehicle_id"));
                sh.setServiceId(rs.getInt("service_id"));
                sh.setServiceDate(rs.getDate("service_date"));
                sh.setFinalCost(rs.getBigDecimal("final_cost"));
                sh.setStatus(rs.getString("status"));
                sh.setTechnicianNotes(rs.getString("technician_notes"));
                sh.setRecordedAt(rs.getTimestamp("recorded_at"));
                sh.setBookingCode(rs.getString("booking_code"));
                sh.setCustomerName(rs.getString("customer_name"));
                sh.setVehicleInfo(rs.getString("brand") + " " + rs.getString("model"));
                sh.setRegistrationNumber(rs.getString("registration_number"));
                sh.setServiceName(rs.getString("service_name"));
                records.add(sh);
            }
        }
        return records;
    }

    public Map<String, Object> getDashboardStats() throws SQLException {
        Map<String, Object> stats = new HashMap<>();
        String sql = "SELECT " +
                     "(SELECT COUNT(*) FROM users WHERE role = 'CUSTOMER') AS total_customers, " +
                     "(SELECT COUNT(*) FROM vehicles) AS total_vehicles, " +
                     "(SELECT COUNT(*) FROM bookings) AS total_bookings, " +
                     "(SELECT COUNT(*) FROM bookings WHERE status NOT IN ('Completed', 'Rejected')) AS pending_bookings, " +
                     "(SELECT COUNT(*) FROM bookings WHERE status = 'Completed') AS completed_bookings, " +
                     "(SELECT COALESCE(SUM(total_amount), 0.00) FROM payments WHERE payment_status = 'Paid') AS total_revenue";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                stats.put("totalCustomers", rs.getInt("total_customers"));
                stats.put("totalVehicles", rs.getInt("total_vehicles"));
                stats.put("totalBookings", rs.getInt("total_bookings"));
                stats.put("pendingBookings", rs.getInt("pending_bookings"));
                stats.put("completedBookings", rs.getInt("completed_bookings"));
                stats.put("totalRevenue", rs.getBigDecimal("total_revenue"));
            }
        }
        return stats;
    }
}
