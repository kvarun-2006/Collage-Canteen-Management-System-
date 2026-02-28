package com.canteen.servlets;

import com.canteen.models.User;
import com.canteen.utils.DatabaseConnection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class LoginServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        Map<String, Object> responseData = new HashMap<>();

        if (session != null && session.getAttribute("role") != null) {
            responseData.put("role", session.getAttribute("role"));
            responseData.put("user", session.getAttribute("user"));
        } else {
            responseData.put("role", "guest");
        }

        response.getWriter().write(new ObjectMapper().writeValueAsString(responseData));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String plainPassword = request.getParameter("password");
        String hashedPassword = hashPassword(plainPassword);

        System.out.println("Login attempt: user=" + username);

        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);
            stmt.setString(2, hashedPassword);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    HttpSession session = request.getSession();
                    session.setAttribute("user", username);
                    String role = rs.getString("role");
                    session.setAttribute("role", role);

                    Map<String, Object> responseData = new HashMap<>();
                    responseData.put("success", true);
                    responseData.put("message", "Login successful");

                    if ("admin".equals(role)) {
                        responseData.put("redirect", "admin-dashboard.html");
                    } else if ("staff".equals(role)) {
                        responseData.put("redirect", "staff-dashboard.html");
                    } else {
                        responseData.put("redirect", "admin-login.html?error=1");
                    }

                    response.setContentType("application/json");
                    response.getWriter().write(new ObjectMapper().writeValueAsString(responseData));
                } else {
                    Map<String, Object> responseData = new HashMap<>();
                    responseData.put("success", false);
                    responseData.put("message", "Invalid username or password");

                    response.setContentType("application/json");
                    response.getWriter().write(new ObjectMapper().writeValueAsString(responseData));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (int i = 0; i < encodedhash.length; i++) {
                String hex = Integer.toHexString(0xff & encodedhash[i]);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
