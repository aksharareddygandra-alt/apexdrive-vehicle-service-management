package com.vsms.model;

/**
 * Abstract base class demonstrating Abstraction and Inheritance in Java OOP.
 */
public abstract class Person {
    private int id;
    private String fullName;
    private String email;
    private String phone;

    protected Person() {
    }

    protected Person(int id, String fullName, String email, String phone) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * Polymorphic contract implemented by concrete user subclasses.
     */
    public abstract String getDashboardRoute();
}
