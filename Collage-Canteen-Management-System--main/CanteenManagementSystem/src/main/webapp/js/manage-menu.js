// Manage menu functionality
document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();

    document.getElementById('add-item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addMenuItem();
    });
});

function loadMenuItems() {
    fetch('/CanteenManagementSystem-1.0-SNAPSHOT/menu')
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
    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;

    const formData = new URLSearchParams();
    formData.append('action', 'add');
    formData.append('name', name);
    formData.append('price', price);

    fetch('/CanteenManagementSystem-1.0-SNAPSHOT/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Menu item added successfully');
            document.getElementById('add-item-form').reset();
            loadMenuItems();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding menu item');
    });
}

function editMenuItem(id, currentName, currentPrice) {
    const newName = prompt('Enter new name:', currentName);
    const newPrice = prompt('Enter new price:', currentPrice);

    if (newName && newPrice) {
        const formData = new URLSearchParams();
        formData.append('action', 'update');
        formData.append('id', id);
        formData.append('name', newName);
        formData.append('price', newPrice);

        fetch('/CanteenManagementSystem-1.0-SNAPSHOT/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Menu item updated successfully');
                loadMenuItems();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating menu item');
        });
    }
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        const formData = new URLSearchParams();
        formData.append('action', 'delete');
        formData.append('id', id);

        fetch('/CanteenManagementSystem-1.0-SNAPSHOT/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Menu item deleted successfully');
                loadMenuItems();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting menu item');
        });
    }
}

