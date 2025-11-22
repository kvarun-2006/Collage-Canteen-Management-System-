// Menu functionality
document.addEventListener('DOMContentLoaded', function () {
    loadMenu();
});

function loadMenu() {
    console.log('loadMenu called');
    // alert('Loading menu...'); // Uncomment for visible feedback if console is not accessible
    fetch('/CanteenManagementSystem-1.0-SNAPSHOT/menu')
        .then(response => {
            console.log('Response received:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const menuContainer = document.getElementById('menu-container');
            if (!menuContainer) {
                console.error('Menu container not found!');
                return;
            }
            menuContainer.innerHTML = '';

            if (data.length === 0) {
                menuContainer.innerHTML = '<p>No menu items found.</p>';
                return;
            }

            data.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <h3>${item.name}</h3>
                    <div class="price">₹${item.price}</div>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span id="quantity-${item.id}">0</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart btn-primary" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
                `;
                menuContainer.appendChild(menuItem);
            });
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            const menuContainer = document.getElementById('menu-container');
            if (menuContainer) {
                menuContainer.innerHTML = `<p style="color:red">Error loading menu: ${error.message}</p>`;
            }
        });
}

function changeQuantity(itemId, delta) {
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    let quantity = parseInt(quantityElement.textContent) + delta;
    if (quantity < 0) quantity = 0;
    quantityElement.textContent = quantity;
}

function addToCart(itemId, name, price) {
    const quantity = parseInt(document.getElementById(`quantity-${itemId}`).textContent);
    if (quantity > 0) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: itemId, name: name, price: price, quantity: quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        document.getElementById(`quantity-${itemId}`).textContent = '0';
        alert('Item added to cart!');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

