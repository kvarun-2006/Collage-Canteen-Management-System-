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
- Secure login authentication with role-based access
- Dashboard with navigation to different modules
- Menu management: Add, edit, delete menu items
- Order management: View all orders, mark as completed
- Sales reports: Daily orders count and earnings
- View detailed bills for each order

### Staff Interface:
- Secure login authentication
- Limited dashboard access
- View orders only (no menu management or reports)

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
    │   ├── admin-login.html        # Admin/Staff login page
    │   ├── admin-dashboard.html    # Admin dashboard
    │   ├── staff-dashboard.html    # Staff dashboard
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
        ├── staff-dashboard.js
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
3. Run the application using Maven Tomcat plugin:
   ```bash
   mvn clean tomcat7:run
   ```
4. Access the application at: `http://localhost:8080/CanteenManagementSystem/`

**Alternative (WAR deployment):**
1. Build the project:
   ```bash
   mvn clean package
   ```
2. Deploy the generated WAR file (`target/CanteenManagementSystem.war`) to Tomcat's `webapps` directory
3. Start Tomcat server
4. Access the application at: `http://localhost:8080/CanteenManagementSystem/`

### Default Credentials
**Admin:**
- Username: `admin`
- Password: `admin123`

**Staff:**
- Username: `staff`
- Password: `staff123`

## Application URLs

### Main Entry Point
- **Landing Page** [http://localhost:8080/CanteenManagementSystem/welcome.html]

### Customer Side
- **Main Menu** [http://localhost:8080/CanteenManagementSystem/html/index.html]
- **Shopping Cart** [http://localhost:8080/CanteenManagementSystem/html/cart.html]
- **Order Bill** [http://localhost:8080/CanteenManagementSystem/html/bill.html?orderId=1]

### Admin/Staff Side
- **Login Page** [http://localhost:8080/CanteenManagementSystem/html/admin-login.html]
- **Admin Dashboard** [http://localhost:8080/CanteenManagementSystem/html/admin-dashboard.html]
- **Staff Dashboard** [http://localhost:8080/CanteenManagementSystem/html/staff-dashboard.html]
- **Manage Menu** [http://localhost:8080/CanteenManagementSystem/html/manage-menu.html]
- **View Orders** [http://localhost:8080/CanteenManagementSystem/html/orders.html]
- **Sales Reports** [http://localhost:8080/CanteenManagementSystem/html/reports.html]

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

### For Staff:
1. Go to admin login page (`admin-login.html`)
2. Login with staff credentials
3. Access staff dashboard with limited options:
   - View orders only

## API Endpoints

- `GET /menu` - Fetch all menu items (JSON)
- `POST /menu` - CRUD operations on menu items
- `GET /order` - Fetch all orders (JSON)
- `POST /order` - Place new order
- `GET /bill?orderId=X` - Get bill details for order X
- `POST /login` - Admin/Staff authentication (returns JSON with redirect URL)
- `GET /report` - Get sales report data

## Sample Menu Items

- Samosa: ₹20
- Coffee: ₹25
- Sandwich: ₹35
- Juice: ₹30

## Security Features

- Prepared statements to prevent SQL injection
- Session management for admin/staff authentication
- Role-based access control (Admin vs Staff)
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
- Additional staff permissions and roles

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
