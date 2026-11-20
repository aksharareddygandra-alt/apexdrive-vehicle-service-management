<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In — Vehicle Service Management System</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<header class="topbar">
    <div class="container topbar-inner">
        <a href="${pageContext.request.contextPath}/index.jsp" class="brand">ApexDrive Service</a>
        <div>
            <a href="${pageContext.request.contextPath}/register" class="btn btn-secondary">Create Account</a>
        </div>
    </div>
</header>

<main class="container" style="max-width:460px; padding-top:64px; padding-bottom:64px;">
    <div class="card">
        <h1 style="font-size:1.5rem; margin-bottom:6px;">Account Sign In</h1>
        <p style="color:#64748b; font-size:0.875rem; margin-bottom:20px;">Customers and Administrators sign in with their registered email.</p>

        <% if (request.getAttribute("errorMessage") != null) { %>
            <div class="alert alert-error"><%= request.getAttribute("errorMessage") %></div>
        <% } %>
        <% if (request.getAttribute("successMessage") != null) { %>
            <div class="alert alert-success"><%= request.getAttribute("successMessage") %></div>
        <% } %>
        <% if ("true".equals(request.getParameter("unauthorized"))) { %>
            <div class="alert alert-error">Administrator access required. Please sign in with an admin account.</div>
        <% } %>

        <form action="${pageContext.request.contextPath}/login" method="post">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="rahul@example.com">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="Enter password">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Sign In</button>
        </form>

        <p style="margin-top:16px; font-size:0.875rem; color:#64748b; text-align:center;">
            New customer? <a href="${pageContext.request.contextPath}/register" style="color:#ea580c; font-weight:600;">Register here</a>
        </p>
    </div>
</main>
</body>
</html>
