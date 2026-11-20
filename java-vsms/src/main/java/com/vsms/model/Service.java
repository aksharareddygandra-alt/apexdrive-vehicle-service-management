package com.vsms.model;

import java.math.BigDecimal;

/**
 * Service category entity mapped to the services table.
 */
public class Service {
    private int serviceId;
    private String serviceName;
    private String description;
    private BigDecimal basePrice;
    private double estimatedHours;
    private boolean active;

    public Service() {
    }

    public Service(int serviceId, String serviceName, String description, BigDecimal basePrice,
                   double estimatedHours, boolean active) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.description = description;
        this.basePrice = basePrice;
        this.estimatedHours = estimatedHours;
        this.active = active;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public double getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
