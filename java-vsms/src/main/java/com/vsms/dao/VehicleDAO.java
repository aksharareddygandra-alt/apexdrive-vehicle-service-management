package com.vsms.dao;

import com.vsms.model.Vehicle;
import com.vsms.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Vehicle CRUD operations.
 */
public class VehicleDAO {

    public boolean addVehicle(Vehicle vehicle) throws SQLException {
        String sql = "INSERT INTO vehicles (user_id, registration_number, brand, model, vehicle_type, manufacturing_year) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, vehicle.getUserId());
            ps.setString(2, vehicle.getRegistrationNumber().trim().toUpperCase());
            ps.setString(3, vehicle.getBrand().trim());
            ps.setString(4, vehicle.getModel().trim());
            ps.setString(5, vehicle.getVehicleType().trim());
            ps.setInt(6, vehicle.getManufacturingYear());
            return ps.executeUpdate() > 0;
        }
    }

    public List<Vehicle> getVehiclesByUser(int userId) throws SQLException {
        String sql = "SELECT vehicle_id, user_id, registration_number, brand, model, vehicle_type, manufacturing_year, created_at " +
                     "FROM vehicles WHERE user_id = ? ORDER BY created_at DESC";
        List<Vehicle> list = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapVehicle(rs));
                }
            }
        }
        return list;
    }

    public Vehicle getVehicleById(int vehicleId, int userId) throws SQLException {
        String sql = "SELECT vehicle_id, user_id, registration_number, brand, model, vehicle_type, manufacturing_year, created_at " +
                     "FROM vehicles WHERE vehicle_id = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, vehicleId);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapVehicle(rs);
                }
            }
        }
        return null;
    }

    public boolean updateVehicle(Vehicle vehicle) throws SQLException {
        String sql = "UPDATE vehicles SET registration_number = ?, brand = ?, model = ?, " +
                     "vehicle_type = ?, manufacturing_year = ? WHERE vehicle_id = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, vehicle.getRegistrationNumber().trim().toUpperCase());
            ps.setString(2, vehicle.getBrand().trim());
            ps.setString(3, vehicle.getModel().trim());
            ps.setString(4, vehicle.getVehicleType().trim());
            ps.setInt(5, vehicle.getManufacturingYear());
            ps.setInt(6, vehicle.getVehicleId());
            ps.setInt(7, vehicle.getUserId());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean deleteVehicle(int vehicleId, int userId) throws SQLException {
        String sql = "DELETE FROM vehicles WHERE vehicle_id = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, vehicleId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        }
    }

    public List<Vehicle> getAllVehicles() throws SQLException {
        String sql = "SELECT v.vehicle_id, v.user_id, v.registration_number, v.brand, v.model, " +
                     "v.vehicle_type, v.manufacturing_year, v.created_at, u.full_name AS owner_name " +
                     "FROM vehicles v JOIN users u ON v.user_id = u.user_id ORDER BY v.created_at DESC";
        List<Vehicle> list = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Vehicle v = mapVehicle(rs);
                v.setOwnerName(rs.getString("owner_name"));
                list.add(v);
            }
        }
        return list;
    }

    private Vehicle mapVehicle(ResultSet rs) throws SQLException {
        Vehicle v = new Vehicle();
        v.setVehicleId(rs.getInt("vehicle_id"));
        v.setUserId(rs.getInt("user_id"));
        v.setRegistrationNumber(rs.getString("registration_number"));
        v.setBrand(rs.getString("brand"));
        v.setModel(rs.getString("model"));
        v.setVehicleType(rs.getString("vehicle_type"));
        v.setManufacturingYear(rs.getInt("manufacturing_year"));
        v.setCreatedAt(rs.getTimestamp("created_at"));
        return v;
    }
}
