// Enhanced Reports functionality
document.addEventListener('DOMContentLoaded', function () {
    loadReport();
});

function loadReport() {
    fetch('/CanteenManagementSystem/report')
        .then(response => response.json())
        .then(data => {
            const reportContainer = document.getElementById('report-container');

            if (data.error) {
                reportContainer.innerHTML = `<p class="error-message">Error: ${data.error}</p>`;
                return;
            }

            // Calculate additional statistics
            const totalOrders = data.orders.length;
            const completedOrders = data.orders.filter(order => order.status === 'completed').length;
            const pendingOrders = data.orders.filter(order => order.status === 'pending').length;
            const totalRevenue = data.orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

            let reportHTML = `
                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card stat-card-primary">
                        <div class="stat-icon">📦</div>
                        <div class="stat-content">
                            <h3>Total Orders</h3>
                            <p class="stat-value">${totalOrders}</p>
                            <p class="stat-label">All time</p>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-card-success">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <h3>Completed</h3>
                            <p class="stat-value">${completedOrders}</p>
                            <p class="stat-label">Orders fulfilled</p>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-card-warning">
                        <div class="stat-icon">⏳</div>
                        <div class="stat-content">
                            <h3>Pending</h3>
                            <p class="stat-value">${pendingOrders}</p>
                            <p class="stat-label">In progress</p>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-card-revenue">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <h3>Total Revenue</h3>
                            <p class="stat-value">₹${totalRevenue.toFixed(2)}</p>
                            <p class="stat-label">All time earnings</p>
                        </div>
                    </div>
                </div>

                <!-- Today's Summary -->
                <div class="today-summary">
                    <h2>📅 Today's Performance</h2>
                    <div class="summary-cards">
                        <div class="summary-card">
                            <div class="summary-label">Orders Today</div>
                            <div class="summary-value">${data.totalOrdersToday}</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-label">Earnings Today</div>
                            <div class="summary-value">₹${data.totalEarningsToday}</div>
                        </div>
                    </div>
                </div>

                <!-- Orders Table -->
                <div class="table-container">
                    <h2>📋 All Orders</h2>
                    <div class="table-wrapper">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            if (data.orders.length === 0) {
                reportHTML += `
                    <tr>
                        <td colspan="5" class="no-data">No orders found</td>
                    </tr>
                `;
            } else {
                data.orders.forEach(order => {
                    const status = order.status || 'completed';
                    const statusClass = status === 'completed' ? 'status-completed' : 'status-pending';
                    const statusText = status === 'completed' ? '✓ Completed' : '⏳ Pending';

                    reportHTML += `
                        <tr>
                            <td><span class="order-id">#${order.orderId}</span></td>
                            <td>${order.customerName}</td>
                            <td class="amount">₹${parseFloat(order.total).toFixed(2)}</td>
                            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                            <td class="datetime">${new Date(order.time).toLocaleString()}</td>
                        </tr>
                    `;
                });
            }

            reportHTML += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            reportContainer.innerHTML = reportHTML;
        })
        .catch(error => {
            console.error('Error loading report:', error);
            document.getElementById('report-container').innerHTML =
                '<p class="error-message">❌ Error loading report. Please try again.</p>';
        });
}
