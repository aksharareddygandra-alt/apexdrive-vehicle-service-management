package com.vsms.servlet;

import com.vsms.dao.BookingDAO;
import com.vsms.dao.ServiceDAO;
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
import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@WebServlet("/bookings")
public class BookingServlet extends HttpServlet {

    private final BookingDAO bookingDAO = new BookingDAO();
    private final VehicleDAO vehicleDAO = new VehicleDAO();
    private final ServiceDAO serviceDAO = new ServiceDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String view = req.getParameter("view");

        // Public or logged-in tracking lookup by Booking ID
        if ("track".equals(view)) {
            String code = req.getParameter("bookingCode");
            if (code != null && !code.trim().isEmpty()) {
                try {
                    Booking tracked = bookingDAO.getBookingByCode(code);
                    req.setAttribute("trackedBooking", tracked);
                    if (tracked == null) {
                        req.setAttribute("trackError", "No booking found with ID: " + code.toUpperCase());
                    }
                } catch (SQLException e) {
                    throw new ServletException("Error tracking booking.", e);
                }
            }
            req.getRequestDispatcher("/track-service.jsp").forward(req, resp);
            return;
        }

        HttpSession session = req.getSession(false);
        User user = session != null ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            resp.sendRedirect(req.getContextPath() + "/login");
            return;
        }

        try {
            List<Vehicle> vehicles = vehicleDAO.getVehiclesByUser(user.getUserId());
            List<Service> services = serviceDAO.getAllActiveServices();
            List<Booking> bookings = bookingDAO.getBookingsByUser(user.getUserId());
            List<ServiceHistory> history = bookingDAO.getServiceHistoryByUser(user.getUserId());
            Map<String, Integer> stats = bookingDAO.getCustomerStats(user.getUserId());

            req.setAttribute("vehicles", vehicles);
            req.setAttribute("services", services);
            req.setAttribute("bookings", bookings);
            req.setAttribute("historyList", history);
            req.setAttribute("stats", stats);

            if ("new".equals(view)) {
                req.getRequestDispatcher("/book-service.jsp").forward(req, resp);
            } else if ("history".equals(view)) {
                req.getRequestDispatcher("/service-history.jsp").forward(req, resp);
            } else {
                req.getRequestDispatcher("/customer-dashboard.jsp").forward(req, resp);
            }
        } catch (SQLException e) {
            throw new ServletException("Error loading customer booking dashboard.", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = session != null ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            resp.sendRedirect(req.getContextPath() + "/login");
            return;
        }

        try {
            int vehicleId = Integer.parseInt(req.getParameter("vehicleId"));
            int serviceId = Integer.parseInt(req.getParameter("serviceId"));
            Date preferredDate = Date.valueOf(req.getParameter("preferredDate"));
            String problemDescription = req.getParameter("problemDescription");

            String bookingCode = bookingDAO.createBooking(user.getUserId(), vehicleId, serviceId, preferredDate, problemDescription);
            resp.sendRedirect(req.getContextPath() + "/bookings?confirmed=" + bookingCode);
        } catch (Exception e) {
            req.setAttribute("errorMessage", "Unable to submit booking: " + e.getMessage());
            doGet(req, resp);
        }
    }
}
