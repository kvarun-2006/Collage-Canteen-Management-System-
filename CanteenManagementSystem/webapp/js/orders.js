// Orders functionality
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

function loadOrders() {
    fetch('/order')
        .then(response => response.json())
        .then(data => {
            const ordersContainer = document.getElementById('orders-container');
            ordersContainer.innerHTML = '';

            if (data.length === 0) {
                ordersContainer.innerHTML = '<p>No orders found.</p>';
                return;
            }

            data.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order-item';
                orderDiv.innerHTML = `
                    <h3>Order #${order.orderId}</h3>
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Total:</strong> ₹${order.total}</p>
                    <p><strong>Time:</strong> ${new Date(order.time).toLocaleString()}</p>
                    <button onclick="viewBill(${order.orderId})" class="btn-primary">View Bill</button>
                    <button onclick="markAsCompleted(${order.orderId})" class="btn-secondary">Mark as Completed</button>
                `;
                ordersContainer.appendChild(orderDiv);
            });
        })
        .catch(error => {
            console.error('Error loading orders:', error);
            document.getElementById('orders-container').innerHTML = '<p>Error loading orders</p>';
        });
}

function viewBill(orderId) {
    window.open(`bill.html?orderId=${orderId}`, '_blank');
}

function markAsCompleted(orderId) {
    // In a real application, you might want to add a status field to orders table
    // For now, just show an alert
    alert(`Order #${orderId} marked as completed`);
    // You could implement an AJAX call here to update the order status in the database
}
