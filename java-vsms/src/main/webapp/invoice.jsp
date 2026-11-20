<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.vsms.model.*" %>
<%
    Booking b = (Booking) request.getAttribute("invoiceBooking");
    if (b == null) { response.sendRedirect(request.getContextPath() + "/bookings"); return; }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice <%= b.getInvoiceNumber() %> — ApexDrive Service</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<main class="container" style="max-width:760px; padding-top:40px; padding-bottom:64px;">
    <div class="no-print" style="display:flex; justify-content:space-between; margin-bottom:16px;">
        <a href="${pageContext.request.contextPath}/bookings" class="btn btn-secondary">Back to Dashboard</a>
        <button onclick="window.print()" class="btn btn-primary">Print Invoice</button>
    </div>

    <% if ("true".equals(request.getParameter("paid"))) { %>
        <div class="alert alert-success no-print">Simulated payment recorded successfully!</div>
    <% } %>

    <div class="card">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding-bottom:16px; margin-bottom:20px;">
            <div>
                <h1>ApexDrive Service Center</h1>
                <p style="color:#64748b; font-size:0.875rem;">420 Precision Parkway · support@apexdrive.com</p>
            </div>
            <div style="text-align:right;">
                <strong>INVOICE <%= b.getInvoiceNumber() %></strong>
                <div style="color:#64748b; font-size:0.875rem;">Booking ID: <%= b.getBookingCode() %></div>
                <div style="font-weight:700; margin-top:4px;">Status: <%= b.getPaymentStatus() %></div>
            </div>
        </div>

        <div class="form-grid" style="margin-bottom:20px;">
            <div>
                <div style="color:#64748b; font-size:0.8125rem;">Customer</div>
                <strong><%= b.getCustomerName() %></strong>
                <div style="font-size:0.875rem;"><%= b.getCustomerEmail() %> · <%= b.getCustomerPhone() %></div>
            </div>
            <div>
                <div style="color:#64748b; font-size:0.8125rem;">Vehicle</div>
                <strong><%= b.getVehicleBrand() %> <%= b.getVehicleModel() %> (<%= b.getRegistrationNumber() %>)</strong>
                <div style="font-size:0.875rem;">Service Date: <%= b.getPreferredDate() %></div>
            </div>
        </div>

        <table>
            <thead>
            <tr><th>Charge Item</th><th style="text-align:right;">Amount</th></tr>
            </thead>
            <tbody>
            <tr><td><%= b.getServiceName() %> (Base Service Charge)</td><td style="text-align:right;">$<%= b.getServiceCharge() %></td></tr>
            <tr><td>Additional Parts & Labor Charges</td><td style="text-align:right;">$<%= b.getAdditionalCharges() %></td></tr>
            <tr><td>Tax (10%)</td><td style="text-align:right;">$<%= b.getTaxAmount() %></td></tr>
            <tr><td><strong>Total Amount Due</strong></td><td style="text-align:right;"><strong>$<%= b.getTotalAmount() %></strong></td></tr>
            </tbody>
        </table>

        <% if ("Pending".equalsIgnoreCase(b.getPaymentStatus())) { %>
            <form action="${pageContext.request.contextPath}/payments" method="post" class="no-print" style="margin-top:24px; display:flex; gap:12px; align-items:center;">
                <input type="hidden" name="bookingId" value="<%= b.getBookingId() %>">
                <select name="paymentMethod" required>
                    <option value="Simulated Card">Simulated Credit/Debit Card</option>
                    <option value="Simulated UPI">Simulated UPI / Instant Transfer</option>
                    <option value="Workshop Cash">Workshop Counter Cash</option>
                </select>
                <button type="submit" class="btn btn-primary">Complete Simulated Payment</button>
            </form>
        <% } %>
    </div>
</main>
</body>
</html>
