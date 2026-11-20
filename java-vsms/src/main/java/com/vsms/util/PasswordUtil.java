package com.vsms.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility class for secure SHA-256 password hashing and verification.
 */
public class PasswordUtil {

    private PasswordUtil() {
    }

    public static String hashPassword(String plainTextPassword) {
        if (plainTextPassword == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(plainTextPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }

    public static boolean verifyPassword(String plainTextPassword, String storedHash) {
        if (plainTextPassword == null || storedHash == null) {
            return false;
        }
        return hashPassword(plainTextPassword).equalsIgnoreCase(storedHash);
    }
}
