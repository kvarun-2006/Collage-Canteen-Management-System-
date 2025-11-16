package com.canteen.servlets;

import com.canteen.models.Order;
import com.canteen.models.OrderItem;
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
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OrderServlet extends HttpServlet {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<Order> orders = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT * FROM orders ORDER BY time DESC";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Order order = new Order(rs.getInt("order_id"), rs.getString("customer_name"),
                                      rs.getBigDecimal("total"), rs.getTimestamp("time"));
                orders.add(order);
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Database error: " + e.getMessage());
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return;
        }

        response.getWriter().write(objectMapper.writeValueAsString(orders));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String customerName = request.getParameter("customerName");
        String cartData = request.getParameter("cart");

        Map<String, Object> result = new HashMap<>();

        try (Connection conn = DatabaseConnection.getConnection()) {
            conn.setAutoCommit(false);

            // Parse cart data (assuming JSON format: [{"id":1,"quantity":2},...])
            List<Map<String, Object>> cartItems = objectMapper.readValue(cartData,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            BigDecimal total = BigDecimal.ZERO;

            // Calculate total
            for (Map<String, Object> item : cartItems) {
                int itemId = (Integer) item.get("id");
                int quantity = (Integer) item.get("quantity");

                String priceSql = "SELECT price FROM menu_items WHERE id = ?";
                PreparedStatement priceStmt = conn.prepareStatement(priceSql);
                priceStmt.setInt(1, itemId);
                ResultSet rs = priceStmt.executeQuery();
                if (rs.next()) {
                    BigDecimal price = rs.getBigDecimal("price");
                    total = total.add(price.multiply(BigDecimal.valueOf(quantity)));
                }
            }

            // Insert order
            String orderSql = "INSERT INTO orders (customer_name, total) VALUES (?, ?)";
            PreparedStatement orderStmt = conn.prepareStatement(orderSql, Statement.RETURN_GENERATED_KEYS);
            orderStmt.setString(1, customerName);
            orderStmt.setBigDecimal(2, total);
            orderStmt.executeUpdate();

            ResultSet keys = orderStmt.getGeneratedKeys();
            int orderId = 0;
            if (keys.next()) {
                orderId = keys.getInt(1);
            }

            // Insert order items
            String itemSql = "INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)";
            PreparedStatement itemStmt = conn.prepareStatement(itemSql);

            for (Map<String, Object> item : cartItems) {
                int itemId = (Integer) item.get("id");
                int quantity = (Integer) item.get("quantity");

                String priceSql = "SELECT price FROM menu_items WHERE id = ?";
                PreparedStatement priceStmt = conn.prepareStatement(priceSql);
                priceStmt.setInt(1, itemId);
                ResultSet rs = priceStmt.executeQuery();
                if (rs.next()) {
                    BigDecimal price = rs.getBigDecimal("price");

                    itemStmt.setInt(1, orderId);
                    itemStmt.setInt(2, itemId);
                    itemStmt.setInt(3, quantity);
                    itemStmt.setBigDecimal(4, price);
                    itemStmt.executeUpdate();
                }
            }

            conn.commit();
            result.put("success", true);
            result.put("message", "Order placed successfully");
            result.put("orderId", orderId);

        } catch (SQLException | NumberFormatException e) {
            result.put("success", false);
            result.put("message", "Error placing order: " + e.getMessage());
        }

        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
