<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*, com.vsms.model.*" %>
<%
    Booking b = (Booking) request.getAttribute("trackedBooking");
    String[] stages = {"Booking Confirmed", "Vehicle Received", "Service In Progress", "Ready for Delivery", "Completed"};
    int currentIdx = -1;
    if (b != null) {
        for (int i = 0; i < stages.length; i++) {
            if (stages[i].equalsIgnoreCase(b.getStatus())) { currentIdx = i; break; }
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Track Service — ApexDrive Service</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<header class="topbar">
    <div class="container topbar-inner">
        <a href="${pageContext.request.contextPath}/index.jsp" class="brand">ApexDrive Service</a>
        <div>
            <a href="${pageContext.request.contextPath}/bookings" class="btn btn-secondary">Back to Dashboard</a>
        </div>
    </div>
</header>

<main class="container" style="padding-top:40px; padding-bottom:64px;">
    <div class="card">
        <h1 style="margin-bottom:12px;">Track Vehicle Service Request</h1>
        <form action="${pageContext.request.contextPath}/bookings" method="get" style="display:flex; gap:12px; flex-wrap:wrap;">
            <input type="hidden" name="view" value="track">
            <input type="text" name="bookingCode" placeholder="Enter Booking ID (e.g. VSMS-1002)" required style="flex:1; min-width:240px;">
            <button type="submit" class="btn btn-primary">Track Status</button>
        </form>
        <% if (request.getAttribute("trackError") != null) { %>
            <div class="alert alert-error" style="margin-top:16px;"><%= request.getAttribute("trackError") %></div>
        <% } %>
    </div>

    <% if (b != null) { %>
        <div class="card">
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                <div>
                    <h2>Booking <%= b.getBookingCode() %></h2>
                    <p style="color:#64748b;"><%= b.getVehicleBrand() %> <%= b.getVehicleModel() %> (<%= b.getRegistrationNumber() %>) · <%= b.getServiceName() %></p>
                </div>
                <div>
                    <strong>Current Status: <%= b.getStatus() %></strong>
                </div>
            </div>

            <div class="stepper">
                <% for (int i = 0; i < stages.length; i++) { %>
                    <div class="step <%= i <= currentIdx ? "done" : "" %>">
                        <div>Step <%= i + 1 %></div>
                        <div><%= stages[i] %></div>
                    </div>
                <% } %>
            </div>

            <p style="font-size:0.875rem; color:#475569;">
                <strong>Workshop Remarks:</strong> <%= b.getAdminRemarks() != null && !b.getAdminRemarks().isEmpty() ? b.getAdminRemarks() : "Awaiting workshop bay inspection update." %>
            </p>
        </div>
    <% } %>
</main>
</body>
</html>
