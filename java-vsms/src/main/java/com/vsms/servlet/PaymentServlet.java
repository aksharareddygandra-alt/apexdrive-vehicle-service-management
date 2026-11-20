package com.vsms.servlet;

import com.vsms.dao.BookingDAO;
import com.vsms.model.Booking;
import com.vsms.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/payments")
public class PaymentServlet extends HttpServlet {

    private final BookingDAO bookingDAO = new BookingDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = session != null ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            resp.sendRedirect(req.getContextPath() + "/login");
            return;
        }

        String bookingIdParam = req.getParameter("bookingId");
        if (bookingIdParam == null) {
            resp.sendRedirect(req.getContextPath() + user.getDashboardRoute());
            return;
        }

        try {
            int bookingId = Integer.parseInt(bookingIdParam);
            Booking booking = bookingDAO.getBookingById(bookingId);
            if (booking == null || (booking.getUserId() != user.getUserId() && !"ADMIN".equalsIgnoreCase(user.getRole()))) {
                resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Unauthorized invoice access.");
                return;
            }
            req.setAttribute("invoiceBooking", booking);
            req.getRequestDispatcher("/invoice.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Error loading invoice.", e);
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
            int bookingId = Integer.parseInt(req.getParameter("bookingId"));
            String paymentMethod = req.getParameter("paymentMethod");
            bookingDAO.processSimulatedPayment(bookingId, user.getUserId(), paymentMethod);
            resp.sendRedirect(req.getContextPath() + "/payments?bookingId=" + bookingId + "&paid=true");
        } catch (SQLException e) {
            throw new ServletException("Error processing simulated payment.", e);
        }
    }
}
