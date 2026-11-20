package com.vsms.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * JDBC Database Connection Utility for MySQL.
 * Manages driver registration and returns live connections to vehicle_service_db.
 */
public class DatabaseConnection {

    private static final String URL = System.getenv("VSMS_DB_URL") != null
            ? System.getenv("VSMS_DB_URL")
            : "jdbc:mysql://localhost:3306/vehicle_service_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

    private static final String USERNAME = System.getenv("VSMS_DB_USER") != null
            ? System.getenv("VSMS_DB_USER")
            : "root";

    private static final String PASSWORD = System.getenv("VSMS_DB_PASS") != null
            ? System.getenv("VSMS_DB_PASS")
            : "root";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("MySQL JDBC Driver not found on classpath. Add mysql-connector-j JAR.", e);
        }
    }

    private DatabaseConnection() {
        // Prevent direct instantiation
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}
