Canteen Management System
Video Demo:  [Link to your YouTube or Streamable Video]
Project Overview
The Canteen Management System is a robust, full-stack web application designed to digitize and streamline the food ordering process in a college canteen environment. In many educational institutions, canteen ordering remains a manual, paper-based process prone to errors, long wait times, and poor record-keeping. This project solves those issues by providing a centralized digital platform that caters to three distinct user personas: Customers (Students/Faculty), Canteen Staff, and Administrators.

Built using the Model-View-Controller (MVC) architectural pattern, the application leverages Java Servlets and JSP for the backend, MySQL for persistent data storage, and a responsive frontend built with modern JavaScript and CSS. The goal was to create a system that is not only functional but also secure and scalable, moving beyond the simple Flask applications covered in the CS50 curriculum into the world of enterprise-grade Java development.

Shutterstock

Detailed File Breakdown
1. The Controller Layer (Servlets)
LoginServlet.java: This is the gateway to the administrative and staff interfaces. It handles POST requests from the login form, queries the database for credentials, and, most importantly, manages the HttpSession. By storing the user's role in the session, the app prevents unauthorized users from accessing sensitive management pages.

MenuServlet.java: Acts as the primary data provider for the menu. It handles two main tasks: serving the entire menu as a JSON array to the customer frontend (using GET) and processing administrative changes (using POST) such as adding new items or updating prices.

OrderServlet.java: This is the heart of the transaction logic. When a customer checkouts, this servlet processes the incoming cart data, generates a unique order ID, calculates the final total, and performs a multi-table SQL insertion to record both the order and the individual items within it.

BillServlet.java: A specialized controller that retrieves specific order details to generate a print-friendly receipt. It ensures that data is fetched accurately using the orderId passed via URL parameters.

ReportServlet.java: Reserved for the Admin role, this servlet performs aggregate SQL queries (like SUM and COUNT) to provide high-level sales data for the dashboard.

2. The Model Layer (POJOs)
User.java / MenuItem.java / Order.java / OrderItem.java: These are Plain Old Java Objects (POJOs) that represent our database entities within the Java environment. They allow for clean data passing between the database and the frontend without writing repetitive SQL in the middle of our business logic.

3. The Utility Layer
DatabaseConnection.java: Instead of opening a new connection in every servlet, this utility class provides a centralized method to connect to the MySQL server. It handles the loading of the JDBC driver and manages the connection credentials securely.

4. The Frontend (Webapp)
index.html & menu.js: The customer interface. The JavaScript here uses the Fetch API to asynchronously load the menu. This ensures that the page doesn't blink or reload when a user browses different categories.

cart.js: I implemented a client-side cart using localStorage. This design choice allows the user’s selected items to persist even if they accidentally close their browser or refresh the page.

styles.css: A comprehensive stylesheet that utilizes CSS Flexbox and Media Queries. This was essential to ensure that students can order easily from their mobile phones while standing in line, while staff can view the dashboard on a larger tablet or desktop.

Design Choices & Rationale
Why Java Servlets over Python/Flask?
While CS50 focuses heavily on Python and Flask, I chose to build this project using Java Servlets and JSP. I debated this choice early on but decided that the transition to a statically typed language would provide a better learning experience regarding how memory and data types are handled in a web context. Java’s strict structure made it easier to implement a formal MVC architecture, which is the industry standard for maintainable code.

The "Shopping Cart" Debate: Server vs. Client
One of the major design hurdles was deciding where to store the shopping cart data before the order is placed.

Option A (Database): Storing "pending" carts in the DB. I rejected this because it would lead to a cluttered database with abandoned carts from users who never finished their order.

Option B (Server Session): Storing the cart in the HttpSession.

Option C (Client LocalStorage): I chose Option C. By using localStorage, the server doesn't have to keep track of thousands of temporary cart objects, which saves memory. It also makes the UI feel much faster because adding an item to the cart is an instant JavaScript operation with no network latency.

Database Normalization
I spent significant time designing the database schema. I chose to split the order data into two tables: orders (for the date and total price) and order_items (for the specific quantities of each food item). This follows the Third Normal Form (3NF). Without this split, I would have had to store redundant information, which could lead to data inconsistency.

Security Implementations
In line with the security principles learned in CS50, I strictly avoided string concatenation in my SQL queries. Every single database interaction in this project uses Prepared Statements. This is my primary defense against SQL Injection, ensuring that malicious users cannot manipulate the database via the login or search forms.

Setup Instructions
Prerequisites
Java JDK 8+

Apache Tomcat 9.0

MySQL Server

Maven

Step 1: Database Setup
Run the setup.sql script in your MySQL terminal:

SQL
CREATE DATABASE canteen_db;
USE canteen_db;
-- Run the rest of the script provided in the repository
Step 2: Build and Run
Navigate to the project folder and use the Maven wrapper:

Bash
mvn clean tomcat7:run
Open your browser to http://localhost:8080/CanteenManagementSystem/.

Conclusion
This project was a journey in balancing user experience with backend stability. By implementing role-based access control and an asynchronous frontend, I have created a tool that feels modern and professional. The complexity of managing state across multiple users while maintaining database integrity has been the most challenging—and rewarding—part of my CS50 journey.
