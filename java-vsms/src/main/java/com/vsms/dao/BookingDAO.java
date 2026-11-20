package com.vsms.dao;

import com.vsms.model.Booking;
import com.vsms.model.Payment;
import com.vsms.model.ServiceHistory;
import com.vsms.util.DatabaseConnection;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Data Access Object for Customer Service Bookings, Tracking, History, and Simulated Billing.
 */
public class BookingDAO {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.10");

    public String createBooking(int userId, int vehicleId, int serviceId, Date preferredDate, String problemDescription)
            throws SQLException {
        String bookingCode = "VSMS-" + (1000 + new Random().nextInt(9000));
        String invoiceNumber = "INV-2026-" + (1000 + new Random().nextInt(9000));

        String fetchPriceSql = "SELECT base_price FROM services WHERE service_id = ?";
        String insertBookingSql = "INSERT INTO bookings (booking_code, user_id, vehicle_id, service_id, preferred_date, problem_description, status) " +
                                  "VALUES (?, ?, ?, ?, ?, ?, 'Booking Confirmed')";
        String insertPaymentSql = "INSERT INTO payments (booking_id, invoice_number, service_charge, additional_charges, tax_amount, total_amount, payment_status) " +
                                  "VALUES (?, ?, ?, 0.00, ?, ?, 'Pending')";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            BigDecimal basePrice = BigDecimal.ZERO;
            try (PreparedStatement pricePs = conn.prepareStatement(fetchPriceSql)) {
                pricePs.setInt(1, serviceId);
                try (ResultSet rs = pricePs.executeQuery()) {
                    if (rs.next()) {
                        basePrice = rs.getBigDecimal("base_price");
                    } else {
                        throw new SQLException("Selected service category does not exist.");
                    }
                }
            }

            int generatedBookingId;
            try (PreparedStatement bookPs = conn.prepareStatement(insertBookingSql, Statement.RETURN_GENERATED_KEYS)) {
                bookPs.setString(1, bookingCode);
                bookPs.setInt(2, userId);
                bookPs.setInt(3, vehicleId);
                bookPs.setInt(4, serviceId);
                bookPs.setDate(5, preferredDate);
                bookPs.setString(6, problemDescription != null ? problemDescription.trim() : "");
                bookPs.executeUpdate();
                try (ResultSet keys = bookPs.getGeneratedKeys()) {
                    if (keys.next()) {
                        generatedBookingId = keys.getInt(1);
                    } else {
                        throw new SQLException("Failed to retrieve generated booking ID.");
                    }
                }
            }

            BigDecimal taxAmount = basePrice.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalAmount = basePrice.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

            try (PreparedStatement payPs = conn.prepareStatement(insertPaymentSql)) {
                payPs.setInt(1, generatedBookingId);
                payPs.setString(2, invoiceNumber);
                payPs.setBigDecimal(3, basePrice);
                payPs.setBigDecimal(4, taxAmount);
                payPs.setBigDecimal(5, totalAmount);
                payPs.executeUpdate();
            }

            conn.commit();
            return bookingCode;
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

    public List<Booking> getBookingsByUser(int userId) throws SQLException {
        String sql = baseBookingSelect() + " WHERE b.user_id = ? ORDER BY b.created_at DESC";
        List<Booking> list = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapBooking(rs));
                }
            }
        }
        return list;
    }

    public Booking getBookingByCode(String bookingCode) throws SQLException {
        String sql = baseBookingSelect() + " WHERE b.booking_code = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, bookingCode.trim().toUpperCase());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapBooking(rs);
                }
            }
        }
        return null;
    }

    public Booking getBookingById(int bookingId) throws SQLException {
        String sql = baseBookingSelect() + " WHERE b.booking_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, bookingId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapBooking(rs);
                }
            }
        }
        return null;
    }

    public boolean processSimulatedPayment(int bookingId, int userId, String paymentMethod) throws SQLException {
        String sql = "UPDATE payments p JOIN bookings b ON p.booking_id = b.booking_id " +
                     "SET p.payment_status = 'Paid', p.payment_method = ?, p.paid_at = CURRENT_TIMESTAMP " +
                     "WHERE p.booking_id = ? AND b.user_id = ? AND p.payment_status = 'Pending'";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, paymentMethod != null && !paymentMethod.isEmpty() ? paymentMethod : "Simulated Card");
            ps.setInt(2, bookingId);
            ps.setInt(3, userId);
            return ps.executeUpdate() > 0;
        }
    }

    public Payment getPaymentByBookingId(int bookingId) throws SQLException {
        String sql = "SELECT payment_id, booking_id, invoice_number, service_charge, additional_charges, " +
                     "tax_amount, total_amount, payment_status, payment_method, paid_at " +
                     "FROM payments WHERE booking_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, bookingId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Payment p = new Payment();
                    p.setPaymentId(rs.getInt("payment_id"));
                    p.setBookingId(rs.getInt("booking_id"));
                    p.setInvoiceNumber(rs.getString("invoice_number"));
                    p.setServiceCharge(rs.getBigDecimal("service_charge"));
                    p.setAdditionalCharges(rs.getBigDecimal("additional_charges"));
                    p.setTaxAmount(rs.getBigDecimal("tax_amount"));
                    p.setTotalAmount(rs.getBigDecimal("total_amount"));
                    p.setPaymentStatus(rs.getString("payment_status"));
                    p.setPaymentMethod(rs.getString("payment_method"));
                    p.setPaidAt(rs.getTimestamp("paid_at"));
                    return p;
                }
            }
        }
        return null;
    }

    public List<ServiceHistory> getServiceHistoryByUser(int userId) throws SQLException {
        String sql = "SELECT h.*, b.booking_code, v.brand, v.model, v.registration_number, s.service_name " +
                     "FROM service_history h " +
                     "JOIN bookings b ON h.booking_id = b.booking_id " +
                     "JOIN vehicles v ON h.vehicle_id = v.vehicle_id " +
                     "JOIN services s ON h.service_id = s.service_id " +
                     "WHERE h.user_id = ? ORDER BY h.service_date DESC";
        List<ServiceHistory> list = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
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
                    sh.setVehicleInfo(rs.getString("brand") + " " + rs.getString("model"));
                    sh.setRegistrationNumber(rs.getString("registration_number"));
                    sh.setServiceName(rs.getString("service_name"));
                    list.add(sh);
                }
            }
        }
        return list;
    }

    public Map<String, Integer> getCustomerStats(int userId) throws SQLException {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("totalVehicles", 0);
        stats.put("totalBookings", 0);
        stats.put("pendingBookings", 0);
        stats.put("completedBookings", 0);

        String vehicleSql = "SELECT COUNT(*) FROM vehicles WHERE user_id = ?";
        String bookingSql = "SELECT COUNT(*) AS total, " +
                "SUM(CASE WHEN status NOT IN ('Completed', 'Rejected') THEN 1 ELSE 0 END) AS pending, " +
                "SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed " +
                "FROM bookings WHERE user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection()) {
            try (PreparedStatement ps = conn.prepareStatement(vehicleSql)) {
                ps.setInt(1, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        stats.put("totalVehicles", rs.getInt(1));
                    }
                }
            }
            try (PreparedStatement ps = conn.prepareStatement(bookingSql)) {
                ps.setInt(1, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        stats.put("totalBookings", rs.getInt("total"));
                        stats.put("pendingBookings", rs.getInt("pending"));
                        stats.put("completedBookings", rs.getInt("completed"));
                    }
                }
            }
        }
        return stats;
    }

    public static String baseBookingSelect() {
        return "SELECT b.*, u.full_name AS customer_name, u.email AS customer_email, u.phone AS customer_phone, " +
               "v.registration_number, v.brand AS vehicle_brand, v.model AS vehicle_model, v.vehicle_type, " +
               "s.service_name, p.invoice_number, p.service_charge, p.additional_charges, p.tax_amount, " +
               "p.total_amount, p.payment_status " +
               "FROM bookings b " +
               "JOIN users u ON b.user_id = u.user_id " +
               "JOIN vehicles v ON b.vehicle_id = v.vehicle_id " +
               "JOIN services s ON b.service_id = s.service_id " +
               "LEFT JOIN payments p ON b.booking_id = p.booking_id";
    }

    public static Booking mapBooking(ResultSet rs) throws SQLException {
        Booking b = new Booking();
        b.setBookingId(rs.getInt("booking_id"));
        b.setBookingCode(rs.getString("booking_code"));
        b.setUserId(rs.getInt("user_id"));
        b.setVehicleId(rs.getInt("vehicle_id"));
        b.setServiceId(rs.getInt("service_id"));
        b.setPreferredDate(rs.getDate("preferred_date"));
        b.setProblemDescription(rs.getString("problem_description"));
        b.setStatus(rs.getString("status"));
        b.setAdminRemarks(rs.getString("admin_remarks"));
        b.setCreatedAt(rs.getTimestamp("created_at"));
        b.setCustomerName(rs.getString("customer_name"));
        b.setCustomerEmail(rs.getString("customer_email"));
        b.setCustomerPhone(rs.getString("customer_phone"));
        b.setRegistrationNumber(rs.getString("registration_number"));
        b.setVehicleBrand(rs.getString("vehicle_brand"));
        b.setVehicleModel(rs.getString("vehicle_model"));
        b.setVehicleType(rs.getString("vehicle_type"));
        b.setServiceName(rs.getString("service_name"));
        b.setInvoiceNumber(rs.getString("invoice_number"));
        b.setServiceCharge(rs.getBigDecimal("service_charge"));
        b.setAdditionalCharges(rs.getBigDecimal("additional_charges"));
        b.setTaxAmount(rs.getBigDecimal("tax_amount"));
        b.setTotalAmount(rs.getBigDecimal("total_amount"));
        b.setPaymentStatus(rs.getString("payment_status"));
        return b;
    }
}
