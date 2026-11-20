package com.vsms.model;

import java.sql.Timestamp;

/**
 * User entity representing both CUSTOMER and ADMIN accounts.
 * Inherits core identity attributes from Person.
 */
public class User extends Person {
    private String passwordHash;
    private String role; // CUSTOMER or ADMIN
    private Timestamp createdAt;

    public User() {
        super();
    }

    public User(int userId, String fullName, String email, String phone, String passwordHash, String role) {
        super(userId, fullName, email, phone);
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public int getUserId() {
        return getId();
    }

    public void setUserId(int userId) {
        setId(userId);
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String getDashboardRoute() {
        return "ADMIN".equalsIgnoreCase(this.role) ? "/admin" : "/bookings";
    }
}
