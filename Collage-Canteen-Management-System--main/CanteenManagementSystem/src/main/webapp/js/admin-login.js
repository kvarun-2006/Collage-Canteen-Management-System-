// Admin login functionality
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    fetch('/CanteenManagementSystem/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(loginData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Login response data:', data);
            const messageElement = document.getElementById('login-message');
            if (data.success) {
                messageElement.style.color = 'green';
                messageElement.textContent = data.message;
                console.log('Redirecting to:', data.redirect);
                // Redirect to dashboard based on role
                setTimeout(() => {
                    window.location.href = data.redirect;
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

