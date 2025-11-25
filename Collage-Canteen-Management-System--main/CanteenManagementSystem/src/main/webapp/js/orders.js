// Orders functionality
document.addEventListener('DOMContentLoaded', function () {
    setupBackButton();
    loadOrders();
});

function setupBackButton() {
    // Get user role from session via a simple API call
    fetch('/CanteenManagementSystem/login')
        .then(response => response.json())
        .then(data => {
            const backBtn = document.getElementById('back-btn');
            if (data.role === 'staff') {
                backBtn.onclick = () => window.location.href = 'staff-dashboard.html';
            } else {
                backBtn.onclick = () => window.location.href = 'admin-dashboard.html';
            }
        })
        .catch(error => {
            // Default to admin dashboard if role detection fails
            document.getElementById('back-btn').onclick = () => window.location.href = 'admin-dashboard.html';
        });
}

function loadOrders() {
    fetch('/CanteenManagementSystem/order')
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
                orderDiv.id = `order-${order.orderId}`;

                // Build items list
                let itemsList = '';
                if (order.items && order.items.length > 0) {
                    itemsList = '<p><strong>Items:</strong></p><ul>';
                    order.items.forEach(item => {
                        itemsList += `<li>${item.name} x${item.quantity} (₹${item.price})</li>`;
                    });
                    itemsList += '</ul>';
                }

                orderDiv.innerHTML = `
                    <h3>Order #${order.orderId}</h3>
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    ${itemsList}
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
    window.location.href = `bill.html?orderId=${orderId}`;
}

function markAsCompleted(orderId) {
    if (!confirm(`Are you sure you want to mark Order #${orderId} as completed? This will remove it from the system.`)) {
        return;
    }

    fetch('/CanteenManagementSystem/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=complete&orderId=${orderId}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove order from UI with animation
                const orderElement = document.getElementById(`order-${orderId}`);
                if (orderElement) {
                    orderElement.style.transition = 'opacity 0.3s';
                    orderElement.style.opacity = '0';
                    setTimeout(() => {
                        orderElement.remove();
                        // Check if there are no more orders
                        const ordersContainer = document.getElementById('orders-container');
                        if (ordersContainer.children.length === 0) {
                            ordersContainer.innerHTML = '<p>No orders found.</p>';
                        }
                    }, 300);
                }
                alert(`Order #${orderId} marked as completed and removed from the system.`);
            } else {
                alert('Error: ' + (data.message || 'Failed to complete order'));
            }
        })
        .catch(error => {
            console.error('Error completing order:', error);
            alert('Error completing order. Please try again.');
        });
}

