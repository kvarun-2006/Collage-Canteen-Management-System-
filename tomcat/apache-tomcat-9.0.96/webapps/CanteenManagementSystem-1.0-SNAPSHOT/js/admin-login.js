// Admin login functionality
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    fetch('/CanteenManagementSystem-1.0-SNAPSHOT/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(loginData)
    })
        .then(response => response.json())
        .then(data => {
            const messageElement = document.getElementById('login-message');
            if (data.success) {
                messageElement.style.color = 'green';
                messageElement.textContent = data.message;
                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            } else {
                messageElement.style.color = 'red';
                messageElement.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('login-message').style.color = 'red';
            document.getElementById('login-message').textContent = 'Login failed';
        });
});

