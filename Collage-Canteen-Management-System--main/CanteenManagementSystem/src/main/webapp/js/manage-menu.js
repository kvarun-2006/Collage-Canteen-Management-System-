// Manage menu functionality
document.addEventListener('DOMContentLoaded', function () {
    loadMenuItems();

    document.getElementById('add-item-form').addEventListener('submit', function (e) {
        e.preventDefault();
        addMenuItem();
    });
});

function loadMenuItems() {
    fetch('/CanteenManagementSystem/menu')
        .then(response => response.json())
        .then(data => {
            const menuItemsList = document.getElementById('menu-items-list');
            menuItemsList.innerHTML = '';

            data.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item-admin';
                menuItem.innerHTML = `
                    <div>
                        <strong>${item.name}</strong> - ₹${item.price}
                    </div>
                    <div class="actions">
                        <button onclick="editMenuItem(${item.id}, '${item.name}', ${item.price})">Edit</button>
                        <button onclick="deleteMenuItem(${item.id})" style="background-color: #e74c3c;">Delete</button>
                    </div>
                `;
                menuItemsList.appendChild(menuItem);
            });
        })
        .catch(error => console.error('Error loading menu items:', error));
}

function addMenuItem() {
    const name = document.getElementById('item-name').value.trim();
    const price = document.getElementById('item-price').value;

    // Validation
    if (!name || name.length < 2) {
        showNotification('Please enter a valid item name (at least 2 characters)', 'error');
        return;
    }

    if (!price || parseFloat(price) < 1) {
        showNotification('Please enter a valid price (minimum ₹1)', 'error');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('action', 'add');
    formData.append('name', name);
    formData.append('price', price);

    fetch('/CanteenManagementSystem/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`${name} added successfully!`, 'success');
                document.getElementById('add-item-form').reset();
                loadMenuItems();
            } else {
                showNotification('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error adding menu item. Please try again.', 'error');
        });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('success-message');
    const textElement = notification.querySelector('.success-text');
    const iconElement = notification.querySelector('.success-icon');

    textElement.textContent = message;

    if (type === 'error') {
        notification.className = 'error-notification';
        iconElement.textContent = '❌';
    } else {
        notification.className = 'success-notification';
        iconElement.textContent = '✅';
    }

    notification.style.display = 'flex';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}


function editMenuItem(id, currentName, currentPrice) {
    // Show modal instead of prompt
    document.getElementById('edit-item-id').value = id;
    document.getElementById('edit-item-name').value = currentName;
    document.getElementById('edit-item-price').value = currentPrice;
    document.getElementById('edit-modal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-item-form').reset();
}

// Handle edit form submission
document.addEventListener('DOMContentLoaded', function () {
    loadMenuItems();

    document.getElementById('add-item-form').addEventListener('submit', function (e) {
        e.preventDefault();
        addMenuItem();
    });

    // Add edit form handler
    document.getElementById('edit-item-form').addEventListener('submit', function (e) {
        e.preventDefault();
        updateMenuItem();
    });

    // Close modal when clicking outside
    window.onclick = function (event) {
        const modal = document.getElementById('edit-modal');
        if (event.target == modal) {
            closeEditModal();
        }
    };
});

function updateMenuItem() {
    const id = document.getElementById('edit-item-id').value;
    const name = document.getElementById('edit-item-name').value.trim();
    const price = document.getElementById('edit-item-price').value;

    // Validation
    if (!name || name.length < 2) {
        showNotification('Please enter a valid item name (at least 2 characters)', 'error');
        return;
    }

    if (!price || parseFloat(price) < 1) {
        showNotification('Please enter a valid price (minimum ₹1)', 'error');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('action', 'update');
    formData.append('id', id);
    formData.append('name', name);
    formData.append('price', price);

    fetch('/CanteenManagementSystem/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`${name} updated successfully!`, 'success');
                closeEditModal();
                loadMenuItems();
            } else {
                showNotification('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error updating menu item. Please try again.', 'error');
        });
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        const formData = new URLSearchParams();
        formData.append('action', 'delete');
        formData.append('id', id);

        fetch('/CanteenManagementSystem/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Menu item deleted successfully!', 'success');
                    loadMenuItems();
                } else {
                    showNotification('Error: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error deleting menu item. Please try again.', 'error');
            });
    }
}

