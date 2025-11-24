package com.canteen.servlets;

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

public class ReportServlet extends HttpServlet {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> report = new HashMap<>();

        try (Connection conn = DatabaseConnection.getConnection()) {
            // Total orders today
            String todayOrdersSql = "SELECT COUNT(*) as total_orders FROM orders WHERE DATE(time) = CURDATE()";
            PreparedStatement todayStmt = conn.prepareStatement(todayOrdersSql);
            ResultSet todayRs = todayStmt.executeQuery();
            int totalOrdersToday = 0;
            if (todayRs.next()) {
                totalOrdersToday = todayRs.getInt("total_orders");
            }
            report.put("totalOrdersToday", totalOrdersToday);

            // Total earnings today
            String todayEarningsSql = "SELECT SUM(total) as total_earnings FROM orders WHERE DATE(time) = CURDATE()";
            PreparedStatement earningsStmt = conn.prepareStatement(todayEarningsSql);
            ResultSet earningsRs = earningsStmt.executeQuery();
            BigDecimal totalEarningsToday = BigDecimal.ZERO;
            if (earningsRs.next()) {
                totalEarningsToday = earningsRs.getBigDecimal("total_earnings");
                if (totalEarningsToday == null) totalEarningsToday = BigDecimal.ZERO;
            }
            report.put("totalEarningsToday", totalEarningsToday);

            // List of all orders with timestamps
            String allOrdersSql = "SELECT order_id, customer_name, total, time FROM orders ORDER BY time DESC";
            PreparedStatement allOrdersStmt = conn.prepareStatement(allOrdersSql);
            ResultSet allOrdersRs = allOrdersStmt.executeQuery();

            List<Map<String, Object>> orders = new ArrayList<>();
            while (allOrdersRs.next()) {
                Map<String, Object> order = new HashMap<>();
                order.put("orderId", allOrdersRs.getInt("order_id"));
                order.put("customerName", allOrdersRs.getString("customer_name"));
                order.put("total", allOrdersRs.getBigDecimal("total"));
                order.put("time", allOrdersRs.getTimestamp("time"));
                orders.add(order);
            }
            report.put("orders", orders);

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Database error: " + e.getMessage());
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return;
        }

        response.getWriter().write(objectMapper.writeValueAsString(report));
    }
}
