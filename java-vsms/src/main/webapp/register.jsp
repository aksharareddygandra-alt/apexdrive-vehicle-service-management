<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register — Vehicle Service Management System</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <script src="${pageContext.request.contextPath}/js/app.js" defer></script>
</head>
<body>
<header class="topbar">
    <div class="container topbar-inner">
        <a href="${pageContext.request.contextPath}/index.jsp" class="brand">ApexDrive Service</a>
        <div>
            <a href="${pageContext.request.contextPath}/login" class="btn btn-secondary">Sign In</a>
        </div>
    </div>
</header>

<main class="container" style="max-width:500px; padding-top:56px; padding-bottom:64px;">
    <div class="card">
        <h1 style="font-size:1.5rem; margin-bottom:6px;">Customer Registration</h1>
        <p style="color:#64748b; font-size:0.875rem; margin-bottom:20px;">Create an account to register vehicles and schedule service appointments.</p>

        <% if (request.getAttribute("errorMessage") != null) { %>
            <div class="alert alert-error"><%= request.getAttribute("errorMessage") %></div>
        <% } %>

        <form action="${pageContext.request.contextPath}/register" method="post" onsubmit="return validateRegistrationForm(this);">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" required placeholder="e.g. Rahul Sharma">
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="rahul@example.com">
            </div>
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required placeholder="+1 (555) 392-1140">
            </div>
            <div class="form-group">
                <label for="password">Password (min 6 characters)</label>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Create Account</button>
        </form>
    </div>
</main>
</body>
</html>
