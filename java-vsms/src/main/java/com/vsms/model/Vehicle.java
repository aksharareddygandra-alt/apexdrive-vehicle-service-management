package com.vsms.model;

import java.sql.Timestamp;

/**
 * Vehicle entity mapped to the vehicles table.
 */
public class Vehicle {
    private int vehicleId;
    private int userId;
    private String registrationNumber;
    private String brand;
    private String model;
    private String vehicleType;
    private int manufacturingYear;
    private Timestamp createdAt;

    // Optional owner metadata for admin views
    private String ownerName;

    public Vehicle() {
    }

    public Vehicle(int vehicleId, int userId, String registrationNumber, String brand, String model,
                   String vehicleType, int manufacturingYear) {
        this.vehicleId = vehicleId;
        this.userId = userId;
        this.registrationNumber = registrationNumber;
        this.brand = brand;
        this.model = model;
        this.vehicleType = vehicleType;
        this.manufacturingYear = manufacturingYear;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public int getManufacturingYear() {
        return manufacturingYear;
    }

    public void setManufacturingYear(int manufacturingYear) {
        this.manufacturingYear = manufacturingYear;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
}
