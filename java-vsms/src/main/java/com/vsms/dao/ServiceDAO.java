package com.vsms.dao;

import com.vsms.model.Service;
import com.vsms.util.DatabaseConnection;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for managing master service categories and pricing.
 */
public class ServiceDAO {

    public List<Service> getAllActiveServices() throws SQLException {
        String sql = "SELECT service_id, service_name, description, base_price, estimated_hours, is_active " +
                     "FROM services WHERE is_active = 1 ORDER BY service_id ASC";
        List<Service> services = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                services.add(mapService(rs));
            }
        }
        return services;
    }

    public Service getServiceById(int serviceId) throws SQLException {
        String sql = "SELECT service_id, service_name, description, base_price, estimated_hours, is_active " +
                     "FROM services WHERE service_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, serviceId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapService(rs);
                }
            }
        }
        return null;
    }

    public boolean updateServicePrice(int serviceId, BigDecimal basePrice) throws SQLException {
        String sql = "UPDATE services SET base_price = ? WHERE service_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBigDecimal(1, basePrice);
            ps.setInt(2, serviceId);
            return ps.executeUpdate() > 0;
        }
    }

    private Service mapService(ResultSet rs) throws SQLException {
        Service s = new Service();
        s.setServiceId(rs.getInt("service_id"));
        s.setServiceName(rs.getString("service_name"));
        s.setDescription(rs.getString("description"));
        s.setBasePrice(rs.getBigDecimal("base_price"));
        s.setEstimatedHours(rs.getDouble("estimated_hours"));
        s.setActive(rs.getInt("is_active") == 1);
        return s;
    }
}
