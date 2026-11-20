package com.vsms.dao;

import com.vsms.model.User;
import com.vsms.util.DatabaseConnection;
import com.vsms.util.PasswordUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for User authentication, registration, and customer directory queries.
 */
public class UserDAO {

    public boolean emailExists(String email) throws SQLException {
        String sql = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim().toLowerCase());
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    public int registerCustomer(String fullName, String email, String phone, String plainPassword) throws SQLException {
        String sql = "INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'CUSTOMER')";
        String hashed = PasswordUtil.hashPassword(plainPassword);
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, fullName.trim());
            ps.setString(2, email.trim().toLowerCase());
            ps.setString(3, phone.trim());
            ps.setString(4, hashed);
            int affected = ps.executeUpdate();
            if (affected == 0) {
                throw new SQLException("Creating user failed, no rows affected.");
            }
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getInt(1);
                }
            }
        }
        return -1;
    }

    public User authenticate(String email, String plainPassword) throws SQLException {
        String sql = "SELECT user_id, full_name, email, phone, password_hash, role, created_at FROM users WHERE email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim().toLowerCase());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String storedHash = rs.getString("password_hash");
                    if (PasswordUtil.verifyPassword(plainPassword, storedHash)) {
                        return mapUser(rs);
                    }
                }
            }
        }
        return null;
    }

    public User getUserById(int userId) throws SQLException {
        String sql = "SELECT user_id, full_name, email, phone, password_hash, role, created_at FROM users WHERE user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
            }
        }
        return null;
    }

    public List<User> getAllCustomers() throws SQLException {
        String sql = "SELECT user_id, full_name, email, phone, password_hash, role, created_at " +
                     "FROM users WHERE role = 'CUSTOMER' ORDER BY created_at DESC";
        List<User> customers = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                customers.add(mapUser(rs));
            }
        }
        return customers;
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setPhone(rs.getString("phone"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setRole(rs.getString("role"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        return user;
    }
}
