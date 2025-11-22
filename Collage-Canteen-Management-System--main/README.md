# Canteen Management System

A complete full-stack web application for managing a college canteen, supporting both customer and admin roles with separate interfaces.

## Features

### Customer Interface:
- Browse menu items with dynamic loading via AJAX
- Add items to cart with quantity selection
- View and manage cart (add, remove items)
- Calculate total automatically
- Place orders and generate bills
- Responsive design for mobile devices

### Admin Interface:
- Secure login authentication
- Dashboard with navigation to different modules
- Menu management: Add, edit, delete menu items
- Order management: View all orders, mark as completed
- Sales reports: Daily orders count and earnings
- View detailed bills for each order

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Java Servlets, JSP
- **Database**: MySQL with JDBC
- **Build Tool**: Maven
- **Server**: Apache Tomcat
- **Architecture**: MVC (Model-View-Controller)

## Project Structure

```
CanteenManagementSystem/
├── pom.xml                          # Maven configuration
├── setup.sql                        # Database schema and sample data
├── README.md                        # This documentation
├── WEB-INF/
│   └── web.xml                      # Servlet mappings and configuration
└── src/
    ├── models/                      # POJO classes
    │   ├── User.java
    │   ├── MenuItem.java
    │   ├── Order.java
    │   └── OrderItem.java
    ├── servlets/                    # Servlet classes
    │   ├── LoginServlet.java
    │   ├── MenuServlet.java
    │   ├── OrderServlet.java
    │   ├── BillServlet.java
    │   └── ReportServlet.java
    └── utils/                       # Utility classes
        └── DatabaseConnection.java
└── webapp/
    ├── html/                        # HTML pages
    │   ├── index.html              # Customer menu page
    │   ├── cart.html               # Customer cart page
    │   ├── bill.html               # Bill/receipt page
    │   ├── admin-login.html        # Admin login page
    │   ├── admin-dashboard.html    # Admin dashboard
    │   ├── manage-menu.html        # Menu management
    │   ├── orders.html             # Order management
    │   └── reports.html            # Sales reports
    ├── css/
    │   └── styles.css              # Application styles
    └── js/                         # JavaScript files
        ├── menu.js
        ├── cart.js
        ├── bill.js
        ├── admin-login.js
        ├── admin-dashboard.js
        ├── manage-menu.js
        ├── orders.js
        └── reports.js
```

## Setup Instructions

### Prerequisites
- Java JDK 8 or higher
- Apache Tomcat 9 or higher
- MySQL Server 5.7 or higher
- Maven 3.6 or higher

### Database Setup
1. Start MySQL server
2. Create a database named `canteen_db`
3. Run the `setup.sql` script to create tables and insert sample data:
   ```sql
   mysql -u root -p canteen_db < setup.sql
   ```
   Or copy-paste the contents into MySQL Workbench/command line.

### Application Setup
1. Clone or download the project
2. Navigate to the project directory
3. Build the project with Maven:
   ```bash
   mvn clean compile
   ```
4. Package the application:
   ```bash
   mvn package
   ```
5. Deploy the generated WAR file (`target/CanteenManagementSystem.war`) to Tomcat's `webapps` directory
6. Start Tomcat server
7. Access the application at: `http://localhost:8080/CanteenManagementSystem/`

### Default Credentials
- **Admin Username**: admin
- **Admin Password**: admin123

## Usage

### For Customers:
1. Open the application in a web browser
2. Browse the menu items
3. Add items to cart with desired quantities
4. Click on cart icon to view/manage cart
5. Proceed to checkout, enter name, and place order
6. View the generated bill/receipt

### For Admins:
1. Go to admin login page (`admin-login.html`)
2. Login with admin credentials
3. Access dashboard with options for:
   - Managing menu items (add/edit/delete)
   - Viewing all orders
   - Generating sales reports

## API Endpoints

- `GET /menu` - Fetch all menu items (JSON)
- `POST /menu` - CRUD operations on menu items
- `GET /order` - Fetch all orders (JSON)
- `POST /order` - Place new order
- `GET /bill?orderId=X` - Get bill details for order X
- `POST /login` - Admin authentication
- `GET /report` - Get sales report data

## Sample Menu Items

- Samosa: ₹20
- Coffee: ₹25
- Sandwich: ₹35
- Juice: ₹30

## Security Features

- Prepared statements to prevent SQL injection
- Session management for admin authentication
- Input validation on client and server side

## Responsive Design

The application is designed to work on both desktop and mobile devices with a responsive CSS layout.

## Future Enhancements

- User registration and profiles
- Order status tracking
- Payment integration
- Email notifications
- Advanced reporting with charts
- Inventory management
- Multi-role support (staff, manager, etc.)

## Troubleshooting

### Common Issues:
1. **Database Connection Error**: Ensure MySQL is running and credentials in `DatabaseConnection.java` are correct
2. **Servlet Not Found**: Check that the WAR file is properly deployed and Tomcat is running
3. **AJAX Requests Failing**: Ensure CORS is not blocking requests (though same-origin in this setup)
4. **Build Errors**: Ensure all dependencies are downloaded via `mvn clean compile`

### Logs:
Check Tomcat logs in `logs/catalina.out` for server-side errors.
Browser console for client-side JavaScript errors.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License

This project is open source and available under the MIT License.
