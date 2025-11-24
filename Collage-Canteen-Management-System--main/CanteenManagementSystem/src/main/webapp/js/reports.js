// Reports functionality
document.addEventListener('DOMContentLoaded', function() {
    loadReport();
});

function loadReport() {
    fetch('/CanteenManagementSystem/report')
        .then(response => response.json())
        .then(data => {
            const reportContainer = document.getElementById('report-container');

            if (data.error) {
                reportContainer.innerHTML = `<p>Error: ${data.error}</p>`;
                return;
            }

            let reportHTML = `
                <h2>Sales Report</h2>
                <div class="report-summary">
                    <div class="summary-item">
                        <h3>Total Orders Today</h3>
                        <p class="summary-value">${data.totalOrdersToday}</p>
                    </div>
                    <div class="summary-item">
                        <h3>Total Earnings Today</h3>
                        <p class="summary-value">₹${data.totalEarningsToday}</p>
                    </div>
                </div>
                <h3>All Orders</h3>
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Total</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.orders.forEach(order => {
                reportHTML += `
                    <tr>
                        <td>${order.orderId}</td>
                        <td>${order.customerName}</td>
                        <td>₹${order.total}</td>
                        <td>${new Date(order.time).toLocaleString()}</td>
                    </tr>
                `;
            });

            reportHTML += `
                    </tbody>
                </table>
            `;

            reportContainer.innerHTML = reportHTML;
        })
        .catch(error => {
            console.error('Error loading report:', error);
            document.getElementById('report-container').innerHTML = '<p>Error loading report</p>';
        });
}

