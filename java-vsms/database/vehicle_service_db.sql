-- ============================================================================
-- VEHICLE SERVICE MANAGEMENT SYSTEM - MYSQL DATABASE SCRIPT
-- Database Name: vehicle_service_db
-- Compatible with MySQL 8.0+ & Apache Tomcat JDBC (Connector/J)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS vehicle_service_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vehicle_service_db;

-- Drop existing tables in reverse dependency order for clean re-initialization
DROP TABLE IF EXISTS service_history;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;

-- 1. USERS TABLE (Customers and Administrators)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. VEHICLES TABLE
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    brand VARCHAR(60) NOT NULL,
    model VARCHAR(60) NOT NULL,
    vehicle_type ENUM('Sedan', 'SUV', 'Hatchback', 'Truck', 'Motorcycle', 'Electric/Hybrid') NOT NULL,
    manufacturing_year INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicles_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. SERVICES TABLE (Master Service Categories)
CREATE TABLE services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    estimated_hours DECIMAL(4, 1) NOT NULL DEFAULT 2.0,
    is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- 4. BOOKINGS TABLE
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    service_id INT NOT NULL,
    preferred_date DATE NOT NULL,
    problem_description TEXT,
    status ENUM(
        'Booking Confirmed',
        'Vehicle Received',
        'Service In Progress',
        'Ready for Delivery',
        'Completed',
        'Rejected'
    ) NOT NULL DEFAULT 'Booking Confirmed',
    admin_remarks VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_vehicle FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_service FOREIGN KEY (service_id)
        REFERENCES services(service_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. PAYMENTS TABLE
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    invoice_number VARCHAR(30) NOT NULL UNIQUE,
    service_charge DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    additional_charges DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('Pending', 'Paid') NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(50) DEFAULT 'Pending',
    paid_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. SERVICE HISTORY TABLE
CREATE TABLE service_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    service_id INT NOT NULL,
    service_date DATE NOT NULL,
    final_cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(40) NOT NULL,
    technician_notes TEXT,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_history_vehicle FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_history_service FOREIGN KEY (service_id)
        REFERENCES services(service_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SAMPLE INSERT STATEMENTS
-- Password hashes below are SHA-256 hex digests:
--   Admin ('admin@apexdrive.com')    -> 'Admin@123'
--   Customer ('rahul@example.com')   -> 'Customer@123'
--   Customer ('priya@example.com')   -> 'Customer@123'
-- ============================================================================

INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Vikram Mehta (Workshop Admin)', 'admin@apexdrive.com', '+1 (555) 201-8800',
 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'ADMIN'),
('Rahul Sharma', 'rahul@example.com', '+1 (555) 392-1140',
 'a5850c57e0826f2b2262598276e4a8f10a3f4dc14f6c47e5c57e0b44fa95501a', 'CUSTOMER'),
('Priya Nair', 'priya@example.com', '+1 (555) 488-7732',
 'a5850c57e0826f2b2262598276e4a8f10a3f4dc14f6c47e5c57e0b44fa95501a', 'CUSTOMER');

INSERT INTO services (service_name, description, base_price, estimated_hours, is_active) VALUES
('General Service', 'Multi-point inspection, fluid top-ups, filter checks, and road test.', 149.00, 3.0, 1),
('Oil Change', 'Full synthetic motor oil drain & refill with OEM oil filter replacement.', 79.00, 1.0, 1),
('Engine Repair', 'OBD-II diagnostics, timing, gasket, and powertrain mechanical repair.', 320.00, 6.0, 1),
('Brake Service', 'Brake pad replacement, rotor resurfacing, and hydraulic fluid bleed.', 185.00, 2.5, 1),
('Battery Replacement', 'Load testing, terminal cleaning, and AGM/lithium battery installation.', 160.00, 1.0, 1),
('Tyre Service', 'Wheel alignment, dynamic balancing, rotation, and tread safety audit.', 95.00, 1.5, 1),
('AC Repair', 'Refrigerant recovery & recharge, compressor check, and cabin filter swap.', 135.00, 2.0, 1),
('Full Vehicle Inspection', 'Comprehensive 80-point safety, emissions, and suspension diagnostic report.', 110.00, 2.0, 1);

INSERT INTO vehicles (user_id, registration_number, brand, model, vehicle_type, manufacturing_year) VALUES
(2, 'CA-09-AX-4421', 'Toyota', 'Camry Hybrid', 'Sedan', 2022),
(2, 'CA-09-BX-8810', 'Ford', 'Explorer XLT', 'SUV', 2021),
(3, 'NY-14-EV-3109', 'Hyundai', 'Ioniq 5', 'Electric/Hybrid', 2023);

INSERT INTO bookings (booking_code, user_id, vehicle_id, service_id, preferred_date, problem_description, status, admin_remarks) VALUES
('VSMS-1001', 2, 1, 4, '2026-11-10', 'Squeaking sound on front brakes during low-speed stops.', 'Completed', 'Replaced front brake pads and bled hydraulic line.'),
('VSMS-1002', 2, 2, 1, '2026-11-18', '60,000 km scheduled periodic maintenance and wheel alignment check.', 'Service In Progress', 'Bay 3 technician inspecting suspension and changing cabin filter.'),
('VSMS-1003', 3, 3, 8, '2026-11-20', 'Annual pre-winter safety and battery thermal inspection.', 'Booking Confirmed', 'Scheduled with EV diagnostic specialist.');

INSERT INTO payments (booking_id, invoice_number, service_charge, additional_charges, tax_amount, total_amount, payment_status, payment_method, paid_at) VALUES
(1, 'INV-2026-1001', 185.00, 35.00, 22.00, 242.00, 'Paid', 'Simulated Card', '2026-11-10 16:30:00'),
(2, 'INV-2026-1002', 149.00, 45.00, 19.40, 213.40, 'Pending', 'Pending', NULL),
(3, 'INV-2026-1003', 110.00, 0.00, 11.00, 121.00, 'Pending', 'Pending', NULL);

INSERT INTO service_history (booking_id, user_id, vehicle_id, service_id, service_date, final_cost, status, technician_notes) VALUES
(1, 2, 1, 4, '2026-11-10', 242.00, 'Completed', 'Front ceramic pads installed; rotor thickness within OEM tolerance.');

-- ============================================================================
-- REFERENCE CRUD SQL QUERIES USED BY JDBC DAOs
-- ============================================================================
-- CREATE Vehicle:
-- INSERT INTO vehicles (user_id, registration_number, brand, model, vehicle_type, manufacturing_year) VALUES (?, ?, ?, ?, ?, ?);
-- READ Bookings with Joins:
-- SELECT b.*, u.full_name, v.registration_number, v.brand, v.model, s.service_name, s.base_price, p.total_amount, p.payment_status
-- FROM bookings b
-- JOIN users u ON b.user_id = u.user_id
-- JOIN vehicles v ON b.vehicle_id = v.vehicle_id
-- JOIN services s ON b.service_id = s.service_id
-- LEFT JOIN payments p ON b.booking_id = p.booking_id
-- WHERE b.user_id = ? ORDER BY b.created_at DESC;
-- UPDATE Booking Status:
-- UPDATE bookings SET status = ?, admin_remarks = ? WHERE booking_id = ?;
-- DELETE Vehicle:
-- DELETE FROM vehicles WHERE vehicle_id = ? AND user_id = ?;
