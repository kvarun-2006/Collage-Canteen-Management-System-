package com.canteen.servlets;

import com.canteen.models.MenuItem;
import com.canteen.utils.DatabaseConnection;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MenuServlet extends HttpServlet {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<MenuItem> menuItems = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT * FROM menu_items";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                MenuItem item = new MenuItem(rs.getInt("id"), rs.getString("name"),
                                          rs.getBigDecimal("price"));
                menuItems.add(item);
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Database error: " + e.getMessage());
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return;
        }

        response.getWriter().write(objectMapper.writeValueAsString(menuItems));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        Map<String, Object> result = new HashMap<>();

        try (Connection conn = DatabaseConnection.getConnection()) {
            if ("add".equals(action)) {
                String name = request.getParameter("name");
                BigDecimal price = new BigDecimal(request.getParameter("price"));

                String sql = "INSERT INTO menu_items (name, price) VALUES (?, ?)";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, name);
                stmt.setBigDecimal(2, price);
                stmt.executeUpdate();

                result.put("success", true);
                result.put("message", "Menu item added successfully");

            } else if ("update".equals(action)) {
                int id = Integer.parseInt(request.getParameter("id"));
                String name = request.getParameter("name");
                BigDecimal price = new BigDecimal(request.getParameter("price"));

                String sql = "UPDATE menu_items SET name = ?, price = ? WHERE id = ?";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, name);
                stmt.setBigDecimal(2, price);
                stmt.setInt(3, id);
                stmt.executeUpdate();

                result.put("success", true);
                result.put("message", "Menu item updated successfully");

            } else if ("delete".equals(action)) {
                int id = Integer.parseInt(request.getParameter("id"));

                String sql = "DELETE FROM menu_items WHERE id = ?";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setInt(1, id);
                stmt.executeUpdate();

                result.put("success", true);
                result.put("message", "Menu item deleted successfully");
            }
        } catch (SQLException e) {
            result.put("success", false);
            result.put("message", "Database error: " + e.getMessage());
        }

        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
