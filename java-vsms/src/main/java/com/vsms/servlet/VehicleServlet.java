package com.vsms.servlet;

import com.vsms.dao.VehicleDAO;
import com.vsms.model.User;
import com.vsms.model.Vehicle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/vehicles")
public class VehicleServlet extends HttpServlet {

    private final VehicleDAO vehicleDAO = new VehicleDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = session != null ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            resp.sendRedirect(req.getContextPath() + "/login");
            return;
        }

        try {
            List<Vehicle> vehicles = vehicleDAO.getVehiclesByUser(user.getUserId());
            req.setAttribute("vehicles", vehicles);
            req.getRequestDispatcher("/vehicles.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Unable to load vehicles.", e);
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

        String action = req.getParameter("action");
        try {
            if ("add".equals(action)) {
                Vehicle v = buildVehicleFromRequest(req, user.getUserId());
                vehicleDAO.addVehicle(v);
                resp.sendRedirect(req.getContextPath() + "/vehicles?msg=added");
            } else if ("update".equals(action)) {
                Vehicle v = buildVehicleFromRequest(req, user.getUserId());
                v.setVehicleId(Integer.parseInt(req.getParameter("vehicleId")));
                vehicleDAO.updateVehicle(v);
                resp.sendRedirect(req.getContextPath() + "/vehicles?msg=updated");
            } else if ("delete".equals(action)) {
                int vehicleId = Integer.parseInt(req.getParameter("vehicleId"));
                vehicleDAO.deleteVehicle(vehicleId, user.getUserId());
                resp.sendRedirect(req.getContextPath() + "/vehicles?msg=deleted");
            } else {
                resp.sendRedirect(req.getContextPath() + "/vehicles");
            }
        } catch (SQLException e) {
            req.setAttribute("errorMessage", "Database error: " + e.getMessage());
            doGet(req, resp);
        }
    }

    private Vehicle buildVehicleFromRequest(HttpServletRequest req, int userId) {
        Vehicle v = new Vehicle();
        v.setUserId(userId);
        v.setRegistrationNumber(req.getParameter("registrationNumber"));
        v.setBrand(req.getParameter("brand"));
        v.setModel(req.getParameter("model"));
        v.setVehicleType(req.getParameter("vehicleType"));
        v.setManufacturingYear(Integer.parseInt(req.getParameter("manufacturingYear")));
        return v;
    }
}
