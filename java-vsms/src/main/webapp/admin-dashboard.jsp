<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*, com.vsms.model.*" %>
<%
    User admin = (User) session.getAttribute("loggedUser");
    if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getRole())) {
        response.sendRedirect(request.getContextPath() + "/login?unauthorized=true");
        return;
    }
    Map<String, Object> stats = (Map<String, Object>) request.getAttribute("stats");
    List<Booking> bookings = (List<Booking>) request.getAttribute("bookings");
    List<User> customers = (List<User>) request.getAttribute("customers");
    List<Vehicle> vehicles = (List<Vehicle>) request.getAttribute("vehicles");
    List<Service> services = (List<Service>) request.getAttribute("services");
    List<ServiceHistory> historyList = (List<ServiceHistory>) request.getAttribute("historyList");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard — ApexDrive Service</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <script src="${pageContext.request.contextPath}/js/app.js" defer></script>
</head>
<body>
<div class="dashboard-shell">
    <aside class="sidebar">
        <strong style="font-size:1.125rem; padding:8px 14px;">ApexDrive Admin</strong>
        <a href="#bookings-sec" class="sidebar-link active">Bookings & Status</a>
        <a href="#customers-sec" class="sidebar-link">Customers</a>
        <a href="#vehicles-sec" class="sidebar-link">Vehicles</a>
        <a href="#services-sec" class="sidebar-link">Service Categories</a>
        <a href="#history-sec" class="sidebar-link">Service Records</a>
        <a href="${pageContext.request.contextPath}/logout" class="sidebar-link" style="margin-top:auto; color:#fca5a5;">Sign Out</a>
    </aside>

    <main class="main-viewport">
        <h1 style="margin-bottom:20px;">Workshop Administrator Console</h1>

        <% if (request.getParameter("msg") != null) { %>
            <div class="alert alert-success">Operation completed: <%= request.getParameter("msg") %></div>
        <% } %>

        <div class="stats-grid">
            <div class="stat-box"><div class="stat-label">Customers</div><div class="stat-value"><%= stats.get("totalCustomers") %></div></div>
            <div class="stat-box"><div class="stat-label">Vehicles</div><div class="stat-value"><%= stats.get("totalVehicles") %></div></div>
            <div class="stat-box"><div class="stat-label">Pending Requests</div><div class="stat-value"><%= stats.get("pendingBookings") %></div></div>
            <div class="stat-box"><div class="stat-label">Completed Services</div><div class="stat-value"><%= stats.get("completedBookings") %></div></div>
            <div class="stat-box"><div class="stat-label">Collected Revenue</div><div class="stat-value">$<%= stats.get("totalRevenue") %></div></div>
        </div>

        <section id="bookings-sec" class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h2>Manage Service Bookings & Billing</h2>
                <input type="text" id="tableSearchInput" placeholder="Search booking, plate, customer..." style="max-width:280px;">
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                    <tr>
                        <th>Booking</th>
                        <th>Customer & Vehicle</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Service ($)</th>
                        <th>Extra ($)</th>
                        <th>Payment</th>
                        <th>Remarks & Save</th>
                    </tr>
                    </thead>
                    <tbody>
                    <% for (Booking b : bookings) { %>
                        <tr data-searchable>
                            <form action="${pageContext.request.contextPath}/admin" method="post">
                                <input type="hidden" name="action" value="updateBooking">
                                <input type="hidden" name="bookingId" value="<%= b.getBookingId() %>">
                                <td><strong><%= b.getBookingCode() %></strong><br><small><%= b.getPreferredDate() %></small></td>
                                <td><%= b.getCustomerName() %><br><small><%= b.getVehicleBrand() %> <%= b.getVehicleModel() %> (<%= b.getRegistrationNumber() %>)</small></td>
                                <td>
                                    <select name="serviceId">
                                        <% for (Service s : services) { %>
                                            <option value="<%= s.getServiceId() %>" <%= s.getServiceId() == b.getServiceId() ? "selected" : "" %>><%= s.getServiceName() %></option>
                                        <% } %>
                                    </select>
                                </td>
                                <td>
                                    <select name="status">
                                        <option <%= "Booking Confirmed".equals(b.getStatus()) ? "selected" : "" %>>Booking Confirmed</option>
                                        <option <%= "Vehicle Received".equals(b.getStatus()) ? "selected" : "" %>>Vehicle Received</option>
                                        <option <%= "Service In Progress".equals(b.getStatus()) ? "selected" : "" %>>Service In Progress</option>
                                        <option <%= "Ready for Delivery".equals(b.getStatus()) ? "selected" : "" %>>Ready for Delivery</option>
                                        <option <%= "Completed".equals(b.getStatus()) ? "selected" : "" %>>Completed</option>
                                        <option <%= "Rejected".equals(b.getStatus()) ? "selected" : "" %>>Rejected</option>
                                    </select>
                                </td>
                                <td><input type="number" step="0.01" name="serviceCharge" value="<%= b.getServiceCharge() %>" style="width:90px;"></td>
                                <td><input type="number" step="0.01" name="additionalCharges" value="<%= b.getAdditionalCharges() %>" style="width:90px;"></td>
                                <td>
                                    <select name="paymentStatus">
                                        <option <%= "Pending".equals(b.getPaymentStatus()) ? "selected" : "" %>>Pending</option>
                                        <option <%= "Paid".equals(b.getPaymentStatus()) ? "selected" : "" %>>Paid</option>
                                    </select>
                                </td>
                                <td style="display:flex; gap:6px;">
                                    <input type="text" name="adminRemarks" value="<%= b.getAdminRemarks() != null ? b.getAdminRemarks() : "" %>" placeholder="Notes">
                                    <button type="submit" class="btn btn-primary" style="padding:6px 12px;">Update</button>
                                </td>
                            </form>
                        </tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="customers-sec" class="card">
            <h2 style="margin-bottom:14px;">Registered Customers</h2>
            <div class="table-wrap">
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                    <tbody>
                    <% for (User c : customers) { %>
                        <tr><td><%= c.getUserId() %></td><td><%= c.getFullName() %></td><td><%= c.getEmail() %></td><td><%= c.getPhone() %></td></tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="vehicles-sec" class="card">
            <h2 style="margin-bottom:14px;">All Registered Vehicles</h2>
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Reg. Number</th><th>Owner</th><th>Brand & Model</th><th>Type</th><th>Year</th></tr></thead>
                    <tbody>
                    <% for (Vehicle v : vehicles) { %>
                        <tr><td><%= v.getRegistrationNumber() %></td><td><%= v.getOwnerName() %></td><td><%= v.getBrand() %> <%= v.getModel() %></td><td><%= v.getVehicleType() %></td><td><%= v.getManufacturingYear() %></td></tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="services-sec" class="card">
            <h2 style="margin-bottom:14px;">Service Categories & Base Pricing</h2>
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Category</th><th>Description</th><th>Base Price ($)</th><th>Action</th></tr></thead>
                    <tbody>
                    <% for (Service s : services) { %>
                        <tr>
                            <form action="${pageContext.request.contextPath}/admin" method="post">
                                <input type="hidden" name="action" value="updateServicePrice">
                                <input type="hidden" name="serviceId" value="<%= s.getServiceId() %>">
                                <td><strong><%= s.getServiceName() %></strong></td>
                                <td><%= s.getDescription() %></td>
                                <td><input type="number" step="0.01" name="basePrice" value="<%= s.getBasePrice() %>" style="width:110px;"></td>
                                <td><button type="submit" class="btn btn-secondary" style="padding:6px 12px;">Save Price</button></td>
                            </form>
                        </tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="history-sec" class="card">
            <h2 style="margin-bottom:14px;">Completed Service Records</h2>
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Booking ID</th><th>Customer</th><th>Vehicle</th><th>Service</th><th>Date</th><th>Cost</th></tr></thead>
                    <tbody>
                    <% for (ServiceHistory h : historyList) { %>
                        <tr><td><%= h.getBookingCode() %></td><td><%= h.getCustomerName() %></td><td><%= h.getVehicleInfo() %> (<%= h.getRegistrationNumber() %>)</td><td><%= h.getServiceName() %></td><td><%= h.getServiceDate() %></td><td>$<%= h.getFinalCost() %></td></tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</div>
</body>
</html>
