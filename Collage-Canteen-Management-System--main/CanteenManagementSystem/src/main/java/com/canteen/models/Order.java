package com.canteen.models;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class Order {
    private int orderId;
    private String customerName;
    private BigDecimal total;
    private Timestamp time;
    private List<OrderItem> items;

    public Order() {}

    public Order(int orderId, String customerName, BigDecimal total, Timestamp time) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.total = total;
        this.time = time;
    }

    // Getters and Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public Timestamp getTime() { return time; }
    public void setTime(Timestamp time) { this.time = time; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
