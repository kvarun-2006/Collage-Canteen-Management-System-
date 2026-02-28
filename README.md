College Canteen Management System

Video Demo: https://youtu.be/SYkDIRStpiA

Project Overview
The College Canteen Management System is a comprehensive, full-stack web application developed to modernize food services at Sreenidhi University. In a fast-paced campus environment, manual ordering leads to bottlenecks and data inconsistency. This project provides a robust digital solution that facilitates seamless transactions between students, kitchen staff, and administrators.

By leveraging Java Servlets, JSP, and MySQL, the system moves beyond the introductory Python/Flask stack of CS50 to explore enterprise-grade development. The primary goal was to create a scalable architecture that maintains high performance under heavy peak-hour traffic while ensuring strict data integrity and security.

Shutterstock

Technical File Breakdown
1. The Controller Layer (Backend Logic)
DatabaseConnection.java: This utility class centralizes the JDBC connection logic. By using a singleton-inspired approach, it ensures the application doesn't exhaust database resources, which is critical for a high-traffic canteen environment.

LoginServlet.java: Beyond simple authentication, this servlet manages the HttpSession objects. It implements role-based logic that prevents a "Staff" user from accessing "Admin" reporting tools, ensuring a secure internal hierarchy.

MenuServlet.java: This is a multi-functional controller. For customers, it serves menu data in JSON format to allow for asynchronous frontend rendering. For admins, it handles the backend logic for adding, editing, or deleting items from the database.

OrderServlet.java: This is the most complex component of the backend. It processes incoming cart arrays, performs multi-row insertions into the database, and manages transaction atomicity to ensure that an order is only recorded if all items are successfully processed.

BillServlet.java & ReportServlet.java: These servlets handle data retrieval for specific outputs—one for generating customer receipts and the other for aggregating sales data into a dashboard view for administrators.

2. The Model Layer (Data Structures)
models/User.java: Encapsulates user credentials and role definitions.

models/MenuItem.java: Defines the properties of food items, including name, price, and category.

models/Order.java & OrderItem.java: These classes represent the parent-child relationship in a transaction, where one order can contain many individual line items.

3. The View & Frontend Layer
index.html & menu.js: The customer-facing storefront. I utilized the Fetch API to load items dynamically. This asynchronous approach was a key design choice to ensure the user experience feels like a modern mobile app rather than a traditional static website.

cart.js: I implemented a persistent shopping cart using Browser LocalStorage. This prevents data loss if a student refreshes their browser or loses connection while standing in line.

styles.css: Developed with a mobile-first mindset using CSS Flexbox. This ensures that the canteen staff can manage orders on a tablet while students order from their smartphones.

Detailed Design Choices
The Choice of Java and MVC
While Flask is excellent for rapid prototyping, I chose Java Servlets to gain experience with a statically typed, compiled language in a web context. The MVC (Model-View-Controller) pattern was strictly enforced to ensure that the "Business Logic" is entirely separate from the "UI Logic." This means if Sreenidhi University decided to change its frontend to a framework like React in the future, the backend Java Servlets and MySQL schema could remain almost entirely untouched.

Database Normalization & Integrity
I debated between a simple flat-file approach and a normalized relational database. I chose a Normalized MySQL Schema (3rd Normal Form). By splitting orders from order_items, I eliminated data redundancy. For example, if a price for a "Samosa" changes tomorrow, the historical records of past orders remain accurate because the price at the time of purchase is captured in the transaction tables.

Asynchronous Operations vs. Traditional Forms
A major hurdle was the "Shopping Cart" flow. Traditional HTML forms would require a page reload every time a user added an item. I decided to build a custom JavaScript engine that manages the cart locally and only communicates with the server once—at the final checkout. This significantly reduces server load and provides the "instant" feedback users expect from modern web applications.

Security Protocols
Preventing SQL Injection
As taught in CS50, security cannot be an afterthought. Every database query in this system uses Prepared Statements. By parameterizing inputs, the system treats user data as literal values rather than executable code, effectively neutralizing SQL Injection attacks in the login and search fields.

Session & Role Validation
The system doesn't just check if you are "logged in"; it checks "who" you are on every request. I implemented a filter-like logic in the Servlets that checks the HttpSession for an "Admin" attribute before allowing any changes to the menu or access to financial reports. This prevents "IDOR" (Insecure Direct Object Reference) vulnerabilities where a user might try to access a page by simply guessing the URL.

Setup & Implementation Guide
Prerequisites
Java JDK 8 or higher

Apache Tomcat 9.0 (for servlet deployment)

MySQL 5.7+

Maven 3.6+ (for dependency management)

Installation Steps
Clone the Project: Navigate to your local directory.

Database Setup: Execute the setup.sql script to create the canteen_db and populate initial roles and menu items.

SQL
mysql -u root -p < setup.sql
Build: Run mvn clean compile to download the MySQL Connector and other dependencies.

Run: Use the command mvn clean tomcat7:run to start the local server.

Access: Open http://localhost:8080/CanteenManagementSystem/ in your browser.

Future Roadmap
While the current version is fully functional, I have planned several enhancements to further improve the system:

UPI Payment Integration: Allowing real-time digital payments at checkout.

Email/SMS Notifications: Using an API to notify students when their food is ready for pickup.

AI-Based Analytics: Leveraging my interest in AI and Data Science to predict busy hours and suggest inventory stock levels based on historical sales data.

Conclusion
This Canteen Management System represents the culmination of my journey through CS50 and my ongoing B.Tech studies. It is a practical application of computer science principles—from algorithmic efficiency in the cart logic to secure data management in the backend. I am proud to submit this as my final project.
