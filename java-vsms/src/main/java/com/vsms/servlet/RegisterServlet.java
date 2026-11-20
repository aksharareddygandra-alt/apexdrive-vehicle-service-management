package com.vsms.servlet;

import com.vsms.dao.UserDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/register.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String fullName = req.getParameter("fullName");
        String email = req.getParameter("email");
        String phone = req.getParameter("phone");
        String password = req.getParameter("password");
        String confirmPassword = req.getParameter("confirmPassword");

        if (fullName == null || fullName.trim().length() < 2 ||
            email == null || !email.contains("@") ||
            phone == null || phone.trim().length() < 7 ||
            password == null || password.length() < 6) {
            req.setAttribute("errorMessage", "Please complete all fields with valid details (password min 6 chars).");
            req.getRequestDispatcher("/register.jsp").forward(req, resp);
            return;
        }

        if (!password.equals(confirmPassword)) {
            req.setAttribute("errorMessage", "Passwords do not match.");
            req.getRequestDispatcher("/register.jsp").forward(req, resp);
            return;
        }

        try {
            if (userDAO.emailExists(email)) {
                req.setAttribute("errorMessage", "An account with this email already exists.");
                req.getRequestDispatcher("/register.jsp").forward(req, resp);
                return;
            }

            userDAO.registerCustomer(fullName, email, phone, password);
            req.setAttribute("successMessage", "Registration successful! You can now sign in.");
            req.getRequestDispatcher("/login.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Database error during customer registration.", e);
        }
    }
}
