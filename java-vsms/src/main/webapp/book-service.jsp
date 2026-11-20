<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*, com.vsms.model.*" %>
<%
    User loggedUser = (User) session.getAttribute("loggedUser");
    if (loggedUser == null) { response.sendRedirect(request.getContextPath() + "/login"); return; }
    List<Vehicle> vehicles = (List<Vehicle>) request.getAttribute("vehicles");
    List<Service> services = (List<Service>) request.getAttribute("services");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Service — ApexDrive Service</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <script src="${pageContext.request.contextPath}/js/app.js" defer></script>
</head>
<body>
<div class="dashboard-shell">
    <aside class="sidebar">
        <strong style="font-size:1.125rem; padding:8px 14px;">ApexDrive Service</strong>
        <a href="${pageContext.request.contextPath}/bookings" class="sidebar-link">Dashboard</a>
        <a href="${pageContext.request.contextPath}/vehicles" class="sidebar-link">My Vehicles</a>
        <a href="${pageContext.request.contextPath}/bookings?view=new" class="sidebar-link active">Book a Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=track" class="sidebar-link">Track Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=history" class="sidebar-link">Service History</a>
        <a href="${pageContext.request.contextPath}/logout" class="sidebar-link" style="margin-top:auto; color:#fca5a5;">Sign Out</a>
    </aside>

    <main class="main-viewport">
        <h1 style="margin-bottom:20px;">Schedule Vehicle Service</h1>
        <div class="card" style="max-width:720px;">
            <% if (vehicles == null || vehicles.isEmpty()) { %>
                <div class="alert alert-error">Please register a vehicle first before scheduling a service.</div>
                <a href="${pageContext.request.contextPath}/vehicles" class="btn btn-primary">Register Vehicle</a>
            <% } else { %>
                <form action="${pageContext.request.contextPath}/bookings" method="post">
                    <div class="form-group">
                        <label for="vehicleId">Select Registered Vehicle</label>
                        <select id="vehicleId" name="vehicleId" required>
                            <% for (Vehicle v : vehicles) { %>
                                <option value="<%= v.getVehicleId() %>"><%= v.getBrand() %> <%= v.getModel() %> (<%= v.getRegistrationNumber() %>)</option>
                            <% } %>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="serviceId">Service Category</label>
                        <select id="serviceId" name="serviceId" required>
                            <% if (services != null) { for (Service s : services) { %>
                                <option value="<%= s.getServiceId() %>" data-price="<%= s.getBasePrice() %>">
                                    <%= s.getServiceName() %> — $<%= s.getBasePrice() %> (<%= s.getEstimatedHours() %> hrs)
                                </option>
                            <% } } %>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="preferredDate">Preferred Service Date</label>
                        <input type="date" id="preferredDate" name="preferredDate" required>
                    </div>
                    <div class="form-group">
                        <label for="problemDescription">Additional Problems or Requirements</label>
                        <textarea id="problemDescription" name="problemDescription" rows="4" placeholder="Describe any symptoms, noises, warning lights, or special requests..."></textarea>
                    </div>
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:18px; display:flex; justify-content:space-between;">
                        <span>Estimated Base Service Charge (excl. 10% tax)</span>
                        <strong id="estimatedChargeDisplay">$0.00</strong>
                    </div>
                    <button type="submit" class="btn btn-primary">Confirm Service Booking</button>
                </form>
            <% } %>
        </div>
    </main>
</div>
</body>
</html>
