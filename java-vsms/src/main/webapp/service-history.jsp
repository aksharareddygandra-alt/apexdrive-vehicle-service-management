<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*, com.vsms.model.*" %>
<%
    User loggedUser = (User) session.getAttribute("loggedUser");
    if (loggedUser == null) { response.sendRedirect(request.getContextPath() + "/login"); return; }
    List<ServiceHistory> historyList = (List<ServiceHistory>) request.getAttribute("historyList");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service History — ApexDrive Service</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<div class="dashboard-shell">
    <aside class="sidebar">
        <strong style="font-size:1.125rem; padding:8px 14px;">ApexDrive Service</strong>
        <a href="${pageContext.request.contextPath}/bookings" class="sidebar-link">Dashboard</a>
        <a href="${pageContext.request.contextPath}/vehicles" class="sidebar-link">My Vehicles</a>
        <a href="${pageContext.request.contextPath}/bookings?view=new" class="sidebar-link">Book a Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=track" class="sidebar-link">Track Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=history" class="sidebar-link active">Service History</a>
        <a href="${pageContext.request.contextPath}/logout" class="sidebar-link" style="margin-top:auto; color:#fca5a5;">Sign Out</a>
    </aside>

    <main class="main-viewport">
        <h1 style="margin-bottom:20px;">Completed Service History</h1>
        <div class="card">
            <div class="table-wrap">
                <table>
                    <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Vehicle</th>
                        <th>Service Date</th>
                        <th>Service Category</th>
                        <th>Final Cost</th>
                        <th>Status</th>
                        <th>Technician Notes</th>
                    </tr>
                    </thead>
                    <tbody>
                    <% if (historyList != null && !historyList.isEmpty()) {
                        for (ServiceHistory h : historyList) { %>
                        <tr>
                            <td><strong><%= h.getBookingCode() %></strong></td>
                            <td><%= h.getVehicleInfo() %> (<%= h.getRegistrationNumber() %>)</td>
                            <td><%= h.getServiceDate() %></td>
                            <td><%= h.getServiceName() %></td>
                            <td>$<%= h.getFinalCost() %></td>
                            <td><%= h.getStatus() %></td>
                            <td><%= h.getTechnicianNotes() %></td>
                        </tr>
                    <% } } else { %>
                        <tr><td colspan="7" style="color:#64748b;">No completed service records found yet.</td></tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>
</body>
</html>
