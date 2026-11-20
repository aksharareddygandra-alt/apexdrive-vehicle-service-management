package com.vsms.servlet;

import com.vsms.dao.AdminDAO;
import com.vsms.dao.ServiceDAO;
import com.vsms.dao.UserDAO;
import com.vsms.dao.VehicleDAO;
import com.vsms.model.Booking;
import com.vsms.model.Service;
import com.vsms.model.ServiceHistory;
import com.vsms.model.User;
import com.vsms.model.Vehicle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@WebServlet("/admin")
public class AdminServlet extends HttpServlet {

    private final AdminDAO adminDAO = new AdminDAO();
    private final UserDAO userDAO = new UserDAO();
    private final VehicleDAO vehicleDAO = new VehicleDAO();
    private final ServiceDAO serviceDAO = new ServiceDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (!isAdmin(req)) {
            resp.sendRedirect(req.getContextPath() + "/login?unauthorized=true");
            return;
        }

        try {
            Map<String, Object> stats = adminDAO.getDashboardStats();
            List<Booking> bookings = adminDAO.getAllBookings();
            List<User> customers = userDAO.getAllCustomers();
            List<Vehicle> vehicles = vehicleDAO.getAllVehicles();
            List<Service> services = serviceDAO.getAllActiveServices();
            List<ServiceHistory> history = adminDAO.getAllServiceHistory();

            req.setAttribute("stats", stats);
            req.setAttribute("bookings", bookings);
            req.setAttribute("customers", customers);
            req.setAttribute("vehicles", vehicles);
            req.setAttribute("services", services);
            req.setAttribute("historyList", history);

            req.getRequestDispatcher("/admin-dashboard.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Error loading administrator dashboard.", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (!isAdmin(req)) {
            resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Admin privileges required.");
            return;
        }

        String action = req.getParameter("action");
        try {
            if ("updateBooking".equals(action)) {
                int bookingId = Integer.parseInt(req.getParameter("bookingId"));
                int serviceId = Integer.parseInt(req.getParameter("serviceId"));
                String status = req.getParameter("status");
                String adminRemarks = req.getParameter("adminRemarks");
                BigDecimal serviceCharge = new BigDecimal(req.getParameter("serviceCharge"));
                BigDecimal additionalCharges = new BigDecimal(req.getParameter("additionalCharges"));
                String paymentStatus = req.getParameter("paymentStatus");

                adminDAO.updateBookingAndBilling(
                    bookingId, serviceId, status, adminRemarks, serviceCharge, additionalCharges, paymentStatus
                );
                resp.sendRedirect(req.getContextPath() + "/admin?msg=updated");
            } else if ("updateServicePrice".equals(action)) {
                int serviceId = Integer.parseInt(req.getParameter("serviceId"));
                BigDecimal basePrice = new BigDecimal(req.getParameter("basePrice"));
                serviceDAO.updateServicePrice(serviceId, basePrice);
                resp.sendRedirect(req.getContextPath() + "/admin?msg=priceUpdated");
            } else {
                resp.sendRedirect(req.getContextPath() + "/admin");
            }
        } catch (SQLException e) {
            throw new ServletException("Admin update failed.", e);
        }
    }

    private boolean isAdmin(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) {
            return false;
        }
        User user = (User) session.getAttribute("loggedUser");
        return user != null && "ADMIN".equalsIgnoreCase(user.getRole());
    }
}
