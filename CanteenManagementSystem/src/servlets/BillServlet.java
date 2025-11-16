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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BillServlet extends HttpServlet {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String orderIdParam = request.getParameter("orderId");
        if (orderIdParam == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Order ID is required");
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return;
        }

        int orderId = Integer.parseInt(orderIdParam);
        Map<String, Object> billData = new HashMap<>();

        try (Connection conn = DatabaseConnection.getConnection()) {
            // Get order details
            String orderSql = "SELECT * FROM orders WHERE order_id = ?";
            PreparedStatement orderStmt = conn.prepareStatement(orderSql);
            orderStmt.setInt(1, orderId);
            ResultSet orderRs = orderStmt.executeQuery();

            if (orderRs.next()) {
                Order order = new Order(orderRs.getInt("order_id"), orderRs.getString("customer_name"),
                                      orderRs.getBigDecimal("total"), orderRs.getTimestamp("time"));

                billData.put("order", order);

                // Get order items
                String itemsSql = "SELECT oi.*, mi.name FROM order_items oi JOIN menu_items mi ON oi.item_id = mi.id WHERE oi.order_id = ?";
                PreparedStatement itemsStmt = conn.prepareStatement(itemsSql);
                itemsStmt.setInt(1, orderId);
                ResultSet itemsRs = itemsStmt.executeQuery();

                List<Map<String, Object>> items = new ArrayList<>();
                while (itemsRs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", itemsRs.getString("name"));
                    item.put("quantity", itemsRs.getInt("quantity"));
                    item.put("price", itemsRs.getBigDecimal("price"));
                    item.put("subtotal", itemsRs.getBigDecimal("price").multiply(
                        new java.math.BigDecimal(itemsRs.getInt("quantity"))));
                    items.add(item);
                }

                billData.put("items", items);
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Order not found");
                response.getWriter().write(objectMapper.writeValueAsString(error));
                return;
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Database error: " + e.getMessage());
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return;
        }

        response.getWriter().write(objectMapper.writeValueAsString(billData));
    }
}
