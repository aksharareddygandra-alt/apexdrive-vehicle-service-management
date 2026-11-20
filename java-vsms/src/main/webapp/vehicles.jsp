<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*, com.vsms.model.*" %>
<%
    User loggedUser = (User) session.getAttribute("loggedUser");
    if (loggedUser == null) { response.sendRedirect(request.getContextPath() + "/login"); return; }
    List<Vehicle> vehicles = (List<Vehicle>) request.getAttribute("vehicles");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Vehicles — ApexDrive Service</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <script src="${pageContext.request.contextPath}/js/app.js" defer></script>
</head>
<body>
<div class="dashboard-shell">
    <aside class="sidebar">
        <strong style="font-size:1.125rem; padding:8px 14px;">ApexDrive Service</strong>
        <a href="${pageContext.request.contextPath}/bookings" class="sidebar-link">Dashboard</a>
        <a href="${pageContext.request.contextPath}/vehicles" class="sidebar-link active">My Vehicles</a>
        <a href="${pageContext.request.contextPath}/bookings?view=new" class="sidebar-link">Book a Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=track" class="sidebar-link">Track Service</a>
        <a href="${pageContext.request.contextPath}/bookings?view=history" class="sidebar-link">Service History</a>
        <a href="${pageContext.request.contextPath}/logout" class="sidebar-link" style="margin-top:auto; color:#fca5a5;">Sign Out</a>
    </aside>

    <main class="main-viewport">
        <h1 style="margin-bottom:20px;">Vehicle Management</h1>

        <% if (request.getAttribute("errorMessage") != null) { %>
            <div class="alert alert-error"><%= request.getAttribute("errorMessage") %></div>
        <% } %>
        <% if (request.getParameter("msg") != null) { %>
            <div class="alert alert-success">Vehicle record <%= request.getParameter("msg") %> successfully.</div>
        <% } %>

        <div class="card">
            <h2 style="margin-bottom:16px;">Add New Vehicle</h2>
            <form action="${pageContext.request.contextPath}/vehicles" method="post" onsubmit="return validateVehicleForm(this);">
                <input type="hidden" name="action" value="add">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Registration Number</label>
                        <input type="text" name="registrationNumber" required placeholder="CA-09-AX-4421">
                    </div>
                    <div class="form-group">
                        <label>Brand</label>
                        <input type="text" name="brand" required placeholder="Toyota">
                    </div>
                    <div class="form-group">
                        <label>Model</label>
                        <input type="text" name="model" required placeholder="Camry Hybrid">
                    </div>
                    <div class="form-group">
                        <label>Vehicle Type</label>
                        <select name="vehicleType" required>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Truck">Truck</option>
                            <option value="Motorcycle">Motorcycle</option>
                            <option value="Electric/Hybrid">Electric/Hybrid</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Manufacturing Year</label>
                        <input type="number" name="manufacturingYear" required min="1960" max="2027" value="2023">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Add Vehicle</button>
            </form>
        </div>

        <div class="card">
            <h2 style="margin-bottom:16px;">Registered Vehicles</h2>
            <div class="table-wrap">
                <table>
                    <thead>
                    <tr>
                        <th>Reg. Number</th>
                        <th>Brand & Model</th>
                        <th>Type</th>
                        <th>Year</th>
                        <th>Edit / Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    <% if (vehicles != null && !vehicles.isEmpty()) {
                        for (Vehicle v : vehicles) { %>
                        <tr>
                            <form action="${pageContext.request.contextPath}/vehicles" method="post">
                                <input type="hidden" name="vehicleId" value="<%= v.getVehicleId() %>">
                                <td><input type="text" name="registrationNumber" value="<%= v.getRegistrationNumber() %>" required></td>
                                <td style="display:flex; gap:6px;">
                                    <input type="text" name="brand" value="<%= v.getBrand() %>" required>
                                    <input type="text" name="model" value="<%= v.getModel() %>" required>
                                </td>
                                <td>
                                    <select name="vehicleType">
                                        <option <%= "Sedan".equals(v.getVehicleType()) ? "selected" : "" %>>Sedan</option>
                                        <option <%= "SUV".equals(v.getVehicleType()) ? "selected" : "" %>>SUV</option>
                                        <option <%= "Hatchback".equals(v.getVehicleType()) ? "selected" : "" %>>Hatchback</option>
                                        <option <%= "Truck".equals(v.getVehicleType()) ? "selected" : "" %>>Truck</option>
                                        <option <%= "Motorcycle".equals(v.getVehicleType()) ? "selected" : "" %>>Motorcycle</option>
                                        <option <%= "Electric/Hybrid".equals(v.getVehicleType()) ? "selected" : "" %>>Electric/Hybrid</option>
                                    </select>
                                </td>
                                <td><input type="number" name="manufacturingYear" value="<%= v.getManufacturingYear() %>" style="width:90px;"></td>
                                <td style="white-space:nowrap;">
                                    <button type="submit" name="action" value="update" class="btn btn-secondary" style="padding:6px 10px;">Save</button>
                                    <button type="submit" name="action" value="delete" class="btn btn-danger" style="padding:6px 10px;" onclick="return confirm('Delete this vehicle?');">Delete</button>
                                </td>
                            </form>
                        </tr>
                    <% } } else { %>
                        <tr><td colspan="5" style="color:#64748b;">No vehicles registered yet.</td></tr>
                    <% } %>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>
</body>
</html>
