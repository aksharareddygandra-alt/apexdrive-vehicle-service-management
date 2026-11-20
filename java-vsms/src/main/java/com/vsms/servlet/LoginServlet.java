package com.vsms.servlet;

import com.vsms.dao.UserDAO;
import com.vsms.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/login.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String email = req.getParameter("email");
        String password = req.getParameter("password");

        if (email == null || email.trim().isEmpty() || password == null || password.isEmpty()) {
            req.setAttribute("errorMessage", "Email and password are required.");
            req.getRequestDispatcher("/login.jsp").forward(req, resp);
            return;
        }

        try {
            User user = userDAO.authenticate(email, password);
            if (user == null) {
                req.setAttribute("errorMessage", "Invalid email or password. Please verify your credentials.");
                req.getRequestDispatcher("/login.jsp").forward(req, resp);
                return;
            }

            HttpSession oldSession = req.getSession(false);
            if (oldSession != null) {
                oldSession.invalidate();
            }
            HttpSession session = req.getSession(true);
            session.setMaxInactiveInterval(30 * 60);
            session.setAttribute("loggedUser", user);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userRole", user.getRole());

            resp.sendRedirect(req.getContextPath() + user.getDashboardRoute());
        } catch (SQLException e) {
            throw new ServletException("Database error during login.", e);
        }
    }
}
