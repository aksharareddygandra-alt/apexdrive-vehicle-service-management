<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ApexDrive Service — Vehicle Service Management System</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<header class="topbar">
    <div class="container topbar-inner">
        <a href="${pageContext.request.contextPath}/index.jsp" class="brand">ApexDrive Service</a>
        <nav class="nav-links">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="${pageContext.request.contextPath}/bookings?view=track">Track Service</a>
            <a href="#why-us">Why Choose Us</a>
            <a href="#contact">Contact</a>
        </nav>
        <div>
            <a href="${pageContext.request.contextPath}/login" class="btn btn-primary">Sign In</a>
        </div>
    </div>
</header>

<section style="background:#0f172a; color:#ffffff; padding:72px 0;">
    <div class="container" style="display:grid; grid-template-columns:1.2fr 1fr; gap:40px; align-items:center;">
        <div>
            <p style="color:#fb923c; font-weight:600; margin-bottom:12px;">Precision Automotive Care & Fleet Maintenance</p>
            <h1 style="font-size:2.75rem; line-height:1.15; margin-bottom:20px;">Vehicle Service Management System</h1>
            <p style="color:#cbd5e1; margin-bottom:28px; max-width:560px;">
                Register your vehicles, schedule certified workshop appointments, monitor five-stage repair progress in real time, and download itemized service invoices.
            </p>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <a href="${pageContext.request.contextPath}/register" class="btn btn-primary">Create Customer Account</a>
                <a href="${pageContext.request.contextPath}/bookings?view=track" class="btn btn-secondary">Track Booking ID</a>
            </div>
        </div>
        <div class="card" style="background:#1e293b; border-color:#334155; color:#ffffff; margin-bottom:0;">
            <h3 style="margin-bottom:12px;">Quick Service Tracker</h3>
            <p style="color:#94a3b8; font-size:0.875rem; margin-bottom:16px;">Enter your unique booking ID (e.g., VSMS-1002) to check current bay progress.</p>
            <form action="${pageContext.request.contextPath}/bookings" method="get">
                <input type="hidden" name="view" value="track">
                <div class="form-group">
                    <input type="text" name="bookingCode" placeholder="Enter Booking ID (e.g. VSMS-1002)" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">Track Service Status</button>
            </form>
        </div>
    </div>
</section>

<section id="about" style="padding:64px 0; background:#ffffff;">
    <div class="container">
        <h2 style="font-size:1.875rem; margin-bottom:12px;">About Our Service Center</h2>
        <p style="color:#475569; max-width:780px;">
            ApexDrive Service Center combines certified master technicians, OEM diagnostic tooling, and transparent digital job-card tracking. Every vehicle passes through structured intake, inspection, mechanical servicing, and quality delivery checkpoints backed by MySQL-persisted service history records.
        </p>
    </div>
</section>

<section id="services" style="padding:64px 0;">
    <div class="container">
        <h2 style="font-size:1.875rem; margin-bottom:24px;">Available Service Categories</h2>
        <div class="stats-grid" style="grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));">
            <div class="card"><h3>01. General Service</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">Multi-point inspection, fluid top-ups, and road test — $149.00</p></div>
            <div class="card"><h3>02. Oil Change</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">Full synthetic motor oil and OEM filter replacement — $79.00</p></div>
            <div class="card"><h3>03. Engine Repair</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">OBD-II diagnostics, timing, and mechanical powertrain repair — $320.00</p></div>
            <div class="card"><h3>04. Brake Service</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">Brake pad replacement, rotor resurfacing, and fluid bleed — $185.00</p></div>
            <div class="card"><h3>05. Battery Replacement</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">Load testing and AGM/lithium battery installation — $160.00</p></div>
            <div class="card"><h3>06. Tyre Service</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">Wheel alignment, dynamic balancing, and rotation — $95.00</p></div>
            <div class="card"><h3>07. AC Repair</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">Refrigerant recharge, compressor audit, and cabin filter — $135.00</p></div>
            <div class="card"><h3>08. Full Vehicle Inspection</h3><p style="color:#475569; font-size:0.875rem; margin-top:8px;">80-point safety, emissions, and suspension diagnostic audit — $110.00</p></div>
        </div>
    </div>
</section>

<section id="why-us" style="padding:64px 0; background:#ffffff;">
    <div class="container">
        <h2 style="font-size:1.875rem; margin-bottom:24px;">Why Choose ApexDrive Service</h2>
        <div class="form-grid">
            <div class="card"><h3>Transparent Billing</h3><p style="color:#475569; font-size:0.875rem;">Itemized labor, parts, and tax invoices generated automatically per booking.</p></div>
            <div class="card"><h3>Live 5-Stage Tracking</h3><p style="color:#475569; font-size:0.875rem;">Track every step from Booking Confirmed through Ready for Delivery.</p></div>
            <div class="card"><h3>Digital Service History</h3><p style="color:#475569; font-size:0.875rem;">Permanent maintenance records archived per vehicle registration number.</p></div>
        </div>
    </div>
</section>

<footer id="contact" style="background:#0f172a; color:#cbd5e1; padding:48px 0;">
    <div class="container" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:24px;">
        <div>
            <strong style="color:#ffffff;">ApexDrive Service Center</strong>
            <p style="font-size:0.875rem; margin-top:6px;">420 Precision Parkway, Suite 100 · support@apexdrive.com · +1 (555) 201-8800</p>
        </div>
        <div style="display:flex; gap:16px;">
            <a href="${pageContext.request.contextPath}/login" style="color:#fb923c;">Customer & Admin Login</a>
            <a href="${pageContext.request.contextPath}/register" style="color:#fb923c;">Customer Registration</a>
        </div>
    </div>
</footer>
</body>
</html>
