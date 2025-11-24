// Bill functionality
document.addEventListener('DOMContentLoaded', function () {
    setupBackButton();
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
        loadBill(orderId);
    }
});

function setupBackButton() {
    // Detect if user came from orders page or is a customer
    const referrer = document.referrer;
    const backBtn = document.getElementById('back-btn');

    if (referrer.includes('orders.html')) {
        // User came from orders page - go back to orders
        backBtn.onclick = () => window.history.back();
        backBtn.textContent = 'Back to Orders';
    } else {
        // Customer viewing their bill - go to menu
        backBtn.onclick = () => window.location.href = 'index.html';
        backBtn.textContent = 'Back to Menu';
    }
}

function loadBill(orderId) {
    fetch(`/CanteenManagementSystem/bill?orderId=${orderId}`)
        .then(response => response.json())
        .then(data => {
            const billContainer = document.getElementById('bill-container');

            if (data.error) {
                billContainer.innerHTML = `<p>Error: ${data.error}</p>`;
                return;
            }

            const order = data.order;
            const items = data.items;

            let billHTML = `
                <h2>Order Bill #${order.orderId}</h2>
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Order Time:</strong> ${new Date(order.time).toLocaleString()}</p>
                <hr>
                <h3>Items:</h3>
            `;

            items.forEach(item => {
                billHTML += `
                    <div class="bill-item">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>₹${item.subtotal.toFixed(2)}</span>
                    </div>
                `;
            });

            billHTML += `
                <hr>
                <div class="bill-total">
                    <strong>Total: ₹${order.total}</strong>
                </div>
                <p style="text-align: center; margin-top: 2rem;">Thank you for your order!</p>
            `;

            billContainer.innerHTML = billHTML;
        })
        .catch(error => {
            console.error('Error loading bill:', error);
            document.getElementById('bill-container').innerHTML = '<p>Error loading bill</p>';
        });
}

