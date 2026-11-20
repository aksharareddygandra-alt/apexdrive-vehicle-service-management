<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*, com.vsms.model.*" %>
<%
    User loggedUser = (User) session.getAttribute("loggedUser");
    if (loggedUser == null) { response.sendRedirect(request.getContextPath() + "/login"); return; }
    Map<String, Integer> stats = (Map<String, Integer>) request.getAttribute("stats");
    List<Booking> bookings = (List<Booking>) request.getAttribute("bookings");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Dashboard — ApexDrive Service</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <script src="${pageContext.request.contextPath}/js/app.js" defer></script>
</head>
<body>
<div class="dashboard-shell">
    <aside class="sidebar">
        <strong style="font-size:1.125rem; padding:8px 14px;">ApexDrive Service</strong>
        <a href="${pageContext.request.contextPath}/bookings" class="sidebar-link active">Dashboard</a>
        <a href="${pageContext.request.contextPath}/vehicles" class="sidebar-link">My Vehicles</a>
        <a href="${pageContext.request.contextPath}/bookings?view=new" class="sidebar-link">Book a Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=track" class="sidebar-link">Track Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=history" class="sidebar-link">Service History</a>
        <a href="${pageContext.request.contextPath}/logout" class="sidebar-link" style="margin-top:auto; color:#fca5a5;">Sign Out</a>
    </aside>

    <main class="main-viewport">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
            <div>
                <h1>Welcome, <%= loggedUser.getFullName() %></h1>
                <p style="color:#64748b; font-size:0.875rem;">Manage your vehicles, service bookings, and invoices.</p>
            </div>
            <a href="${pageContext.request.contextPath}/bookings?view=new" class="btn btn-primary">New Service Booking</a>
        </div>

        <% if (request.getParameter("confirmed") != null) { %>
            <div class="alert alert-success">
                Booking Confirmed! Your unique Booking ID is <strong><%= request.getParameter("confirmed") %></strong>.
            </div>
        <% } %>

        <div class="stats-grid">
            <div class="stat-box"><div class="stat-label">Registered Vehicles</div><div class="stat-value"><%= stats != null ? stats.get("totalVehicles") : 0 %></div></div>
            <div class="stat-box"><div class="stat-label">Total Bookings</div><div class="stat-value"><%= stats != null ? stats.get("totalBookings") : 0 %></div></div>
            <div class="stat-box"><div class="stat-label">Pending Services</div><div class="stat-value"><%= stats != null ? stats.get("pendingBookings") : 0 %></div></div>
            <div class="stat-box"><div class="stat-label">Completed Services</div><div class="stat-value"><%= stats != null ? stats.get("completedBookings") : 0 %></div></div>
        </div>

        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:12px; flex-wrap:wrap;">
                <h2>Recent Service Bookings</h2>
                <input type="text" id="tableSearchInput" placeholder="Filter bookings..." style="max-width:260px;">
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Vehicle</th>
                        <th>Service Category</th>
                        <th>Preferred Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <% if (bookings != null && !bookings.isEmpty()) {
                        for (Booking b : bookings) { %>
                        <tr data-searchable>
                            <td><strong><%= b.getBookingCode() %></strong></td>
                            <td><%= b.getVehicleBrand() %> <%= b.getVehicleModel() %> (<%= b.getRegistrationNumber() %>)</td>
                            <td><%= b.getServiceName() %></td>
                            <td><%= b.getPreferredDate() %></td>
                            <td><%= b.getStatus() %></td>
                            <td>$<%= b.getTotalAmount() %></td>
                            <td><%= b.getPaymentStatus() %></td>
                            <td>
                                <a href="${pageContext.request.contextPath}/bookings?view=track&bookingCode=<%= b.getBookingCode() %>" class="btn btn-secondary" style="padding:6px 10px;">Track</a>
                                <a href="${pageContext.request.contextPath}/payments?bookingId=<%= b.getBookingId() %>" class="btn btn-primary" style="padding:6px 10px;">Invoice</a>
                            </td>
                        </tr>
                    <% } } else { %>
                        <tr><td colspan="8" style="color:#64748b;">No bookings yet. Register a vehicle and book your first service.</td></tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>
</body>
</html>
