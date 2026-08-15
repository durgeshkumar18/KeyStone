# 🔷 Keystone

### Full-Stack Service Management System

Keystone is a **role-based full-stack service management platform** designed to centralize and streamline the management of **customers, technicians, service requests, work orders, authentication, and operational dashboards**.

The application provides different access levels for **Admin, Dispatcher, Technician, and Customer** users using secure **JWT-based authentication and role-based authorization**.

---

## 📌 Overview

In traditional service-management workflows, customer requests, technician assignments, work orders, and service status are often managed through disconnected systems, spreadsheets, or manual communication.

**Keystone** provides a centralized platform where organizations can manage the complete service lifecycle:

```text
Customer
   ↓
Service Request
   ↓
Dispatcher
   ↓
Technician Assignment
   ↓
Work Order
   ↓
Service Completion
   ↓
Dashboard & Reports
```

The system is designed with a modern architecture using:

* React
* TypeScript
* Spring Boot
* Java 17
* PostgreSQL
* Spring Security
* JWT Authentication
* Maven
* Vite

---

# ✨ Features

## 🔐 Authentication & Authorization

* User registration
* User login
* JWT-based authentication
* Secure password handling
* Role-based authorization
* Protected API endpoints
* Token-based session management
* Logout functionality

### Supported Roles

| Role         | Description                                |
| ------------ | ------------------------------------------ |
| `ADMIN`      | Complete system administration             |
| `DISPATCHER` | Manage requests and technician assignments |
| `TECHNICIAN` | Handle assigned service work               |
| `CUSTOMER`   | Create and track service requests          |

---

# 👥 User Management

Administrators can manage users and their roles.

### Capabilities

* Create users
* View users
* Assign roles
* Manage customer accounts
* Manage technician accounts
* Manage dispatcher accounts
* Control system access

---

# 🧑‍💼 Customer Management

Keystone maintains centralized customer information.

### Customer Features

* Customer registration
* Customer profile
* Customer contact information
* Service request history
* Request status tracking
* Work order history

---

# 🛠️ Technician Management

Technicians can access and manage their assigned service work.

### Technician Features

* View assigned work orders
* View service request details
* Update work status
* Add service information
* Complete assigned work
* Track service history

---

# 📩 Service Request Management

Customers can create service requests which can then be processed by dispatchers.

### Service Request Lifecycle

```text
Created
   ↓
Pending
   ↓
Assigned
   ↓
In Progress
   ↓
Completed
```

### Features

* Create service request
* View service requests
* Update request status
* Assign technicians
* Track request history
* View pending requests
* View completed requests

---

# 📋 Work Order Management

Work orders represent actual service work assigned to technicians.

### Features

* Create work orders
* Assign technicians
* Track work order status
* Update work progress
* Complete work orders
* View open work orders
* View closed work orders

---

# 📊 Dashboard

Keystone provides an operational dashboard for quick system insights.

### Dashboard Metrics

* Total Customers
* Total Technicians
* Total Service Requests
* Total Work Orders
* Completed Requests
* Pending Requests
* Open Work Orders
* Closed Work Orders

Example:

```text
┌─────────────────────────────────────────┐
│              KEYSTONE DASHBOARD         │
├─────────────────────────────────────────┤
│ Customers       │ Technicians            │
│     120         │      25                │
├─────────────────┼───────────────────────┤
│ Service Requests│ Work Orders            │
│     350         │      280               │
├─────────────────┼───────────────────────┤
│ Pending         │ Completed              │
│     70          │      280               │
└─────────────────────────────────────────┘
```

---

# 🏗️ System Architecture

Keystone follows a **three-layer full-stack architecture**.

```text
                 ┌─────────────────────┐
                 │      Frontend       │
                 │ React + TypeScript  │
                 │       + Vite        │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                 ┌──────────▼──────────┐
                 │       Backend       │
                 │    Spring Boot      │
                 │   Spring Security   │
                 │        JWT          │
                 └──────────┬──────────┘
                            │
                          JDBC
                            │
                 ┌──────────▼──────────┐
                 │      PostgreSQL      │
                 │      Database        │
                 └─────────────────────┘
```

---

# 🧰 Technology Stack

## Frontend

| Technology | Purpose               |
| ---------- | --------------------- |
| React      | UI development        |
| TypeScript | Type-safe JavaScript  |
| Vite       | Frontend build tool   |
| CSS        | Styling               |
| REST API   | Backend communication |

## Backend

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| Java 17         | Programming language        |
| Spring Boot     | Backend framework           |
| Spring Security | Security & authorization    |
| JWT             | Authentication              |
| Spring Data JPA | Database interaction        |
| Hibernate       | ORM                         |
| Maven           | Dependency management/build |

## Database

| Technology | Purpose               |
| ---------- | --------------------- |
| PostgreSQL | Relational database   |
| Flyway     | Database migration    |
| JDBC       | Database connectivity |

---

# 📁 Project Structure

```text
keystone/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── keystone/
│   │   │   │           └── backend/
│   │   │   │               │
│   │   │   │               ├── controller/
│   │   │   │               │
│   │   │   │               ├── service/
│   │   │   │               │
│   │   │   │               ├── repository/
│   │   │   │               │
│   │   │   │               ├── entity/
│   │   │   │               │
│   │   │   │               ├── dto/
│   │   │   │               │
│   │   │   │               ├── security/
│   │   │   │               │
│   │   │   │               └── BackendApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🔄 Application Workflow

## 1. Authentication

```text
User
 ↓
Login
 ↓
Spring Security
 ↓
Validate Credentials
 ↓
Generate JWT
 ↓
Frontend Stores Token
 ↓
Authenticated User
```

---

## 2. Customer Service Request

```text
Customer Login
       ↓
Create Service Request
       ↓
Request Stored in PostgreSQL
       ↓
Dispatcher Reviews Request
       ↓
Technician Assigned
       ↓
Work Order Created
       ↓
Technician Performs Service
       ↓
Work Completed
       ↓
Request Marked Completed
```

---

# 🔐 Security

Keystone uses **Spring Security + JWT** for securing the application.

### Security Flow

```text
Login Request
     ↓
Username / Email + Password
     ↓
Authentication
     ↓
JWT Token Generated
     ↓
Client
     ↓
Authorization Header
     ↓
Bearer <JWT>
     ↓
JWT Validation
     ↓
Protected API
```

Example HTTP header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🗄️ Database

Keystone uses **PostgreSQL** as its primary relational database.

The database stores information related to:

* Users
* Roles
* Customers
* Technicians
* Service Requests
* Work Orders
* Service status
* Authentication-related data

### Database

```text
PostgreSQL
    │
    ├── Users
    ├── Customers
    ├── Technicians
    ├── Service Requests
    └── Work Orders
```

---

# ⚙️ Prerequisites

Before running Keystone, install:

### Required

* Java 17+
* Node.js
* npm
* PostgreSQL
* Git

### Verify Installation

```bash
java -version
```

```bash
node -v
```

```bash
npm -v
```

```bash
git --version
```

For PostgreSQL:

```bash
psql --version
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd keystone
```

---

# 🗄️ PostgreSQL Setup

Create the database:

```sql
CREATE DATABASE keystone;
```

Then configure the backend database connection.

Open:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/keystone
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.flyway.enabled=true
```

Replace:

```text
YOUR_POSTGRES_PASSWORD
```

with your PostgreSQL password.

> Never commit your real database password to GitHub.

---

# ▶️ Running the Backend

Open PowerShell or terminal:

```bash
cd backend
```

Compile the project:

```bash
.\mvnw.cmd clean compile
```

Start Spring Boot:

```bash
.\mvnw.cmd spring-boot:run
```

The backend will normally start at:

```text
http://localhost:8080
```

---

# ▶️ Running the Frontend

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Vite will display the local frontend URL, typically:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 🏭 Production Build

## Backend

```bash
cd backend
```

```bash
.\mvnw.cmd clean package
```

---

## Frontend

```bash
cd frontend
```

```bash
npm run build
```

The production frontend build will be generated in:

```text
frontend/dist/
```

---

# 🧪 Testing

Backend compilation:

```bash
.\mvnw.cmd clean compile
```

Backend tests:

```bash
.\mvnw.cmd test
```

Frontend build verification:

```bash
npm run build
```

---

# 🔌 API Overview

The backend exposes REST APIs for authentication and service management.

## Authentication

Typical endpoints include:

```text
POST /api/auth/register
POST /api/auth/login
```

---

## Users

```text
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

---

## Service Requests

```text
GET    /api/service-requests
GET    /api/service-requests/{id}
POST   /api/service-requests
PUT    /api/service-requests/{id}
DELETE /api/service-requests/{id}
```

---

## Work Orders

Typical work-order operations include:

```text
GET    /api/work-orders
GET    /api/work-orders/{id}
POST   /api/work-orders
PUT    /api/work-orders/{id}
DELETE /api/work-orders/{id}
```

> Exact endpoints may vary depending on the current backend controller implementation.

---

# 🧪 API Testing

API endpoints can be tested using tools such as:

* Postman
* Thunder Client
* cURL
* Browser Developer Tools

Example:

```bash
curl http://localhost:8080/api/health
```

For protected endpoints:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🖥️ Frontend ↔ Backend Communication

The frontend communicates with the Spring Boot backend through REST APIs.

```text
React Application
       │
       │ HTTP Request
       ▼
Spring Boot REST API
       │
       ▼
Spring Service Layer
       │
       ▼
Spring Data JPA
       │
       ▼
PostgreSQL
```

Responses are returned to the React frontend as JSON.

---

# 🧩 Backend Architecture

Keystone follows a layered Spring Boot architecture.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller Layer

Handles HTTP requests and responses.

### Service Layer

Contains business logic.

### Repository Layer

Handles database operations using Spring Data JPA.

### Entity Layer

Represents database entities.

### Security Layer

Handles:

* Authentication
* JWT generation
* JWT validation
* Authorization
* Protected routes

---

# 🎨 Frontend Architecture

The React frontend is organized around reusable components and application pages.

```text
React
 │
 ├── Components
 │
 ├── Pages
 │
 ├── Services
 │
 ├── Authentication
 │
 └── Application State
```

TypeScript interfaces are used to provide type safety for API data.

---

# 👤 Role-Based Access

Keystone follows the principle of **least privilege**.

### Admin

```text
Admin
 ├── User Management
 ├── Customer Management
 ├── Technician Management
 ├── Service Requests
 ├── Work Orders
 └── Dashboard
```

### Dispatcher

```text
Dispatcher
 ├── Service Requests
 ├── Technician Assignment
 └── Work Orders
```

### Technician

```text
Technician
 ├── Assigned Requests
 ├── Assigned Work Orders
 └── Work Status
```

### Customer

```text
Customer
 ├── Profile
 ├── Create Request
 ├── View Requests
 └── Track Service Status
```

---

# 🐳 Docker

Keystone includes a `docker-compose.yml` file for containerized infrastructure.

Example architecture:

```text
Docker Compose
     │
     ├── PostgreSQL
     │
     └── Application Services
```

If Docker configuration is enabled in the project, start services using:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

---

# 🌱 Environment Configuration

Sensitive configuration should be stored using environment variables rather than hard-coded values.

Example:

```properties
DB_URL=jdbc:postgresql://localhost:5432/keystone
DB_USERNAME=postgres
DB_PASSWORD=********
JWT_SECRET=********
```

Recommended secrets:

* Database password
* JWT secret
* API keys
* Production credentials

Do not commit secrets to Git.

---

# 🔒 .gitignore

Make sure the following are excluded from Git:

```text
.env
*.env
target/
node_modules/
dist/
.idea/
.vscode/
*.log
```

Never upload:

```text
passwords
JWT secrets
database credentials
private API keys
```

---

# 🛠️ Development Commands

## Backend

Start:

```bash
.\mvnw.cmd spring-boot:run
```

Clean:

```bash
.\mvnw.cmd clean
```

Compile:

```bash
.\mvnw.cmd clean compile
```

Package:

```bash
.\mvnw.cmd clean package
```

Test:

```bash
.\mvnw.cmd test
```

---

## Frontend

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 🐛 Troubleshooting

## Backend Does Not Start

Check Java:

```bash
java -version
```

Make sure Java 17+ is installed.

---

## Maven Command Not Recognized

Use the Maven Wrapper:

```bash
.\mvnw.cmd spring-boot:run
```

instead of:

```bash
mvn spring-boot:run
```

---

## PostgreSQL Connection Error

Verify:

```text
PostgreSQL is running
Database name is correct
Username is correct
Password is correct
Port is 5432
```

Expected database URL:

```text
jdbc:postgresql://localhost:5432/keystone
```

---

## Frontend Cannot Connect to Backend

Check that the backend is running:

```text
http://localhost:8080
```

Then check the frontend API configuration.

Also inspect the browser:

```text
Developer Tools → Network
```

Look for:

```text
CORS errors
404 errors
401 errors
403 errors
500 errors
```

---

## 401 Unauthorized

Usually means:

```text
JWT missing
JWT expired
JWT invalid
Authentication failed
```

Make sure the request contains:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 403 Forbidden

Usually indicates an authorization problem.

Check:

```text
User role
Spring Security configuration
JWT authorities
Protected endpoint
```

---

# 📈 Future Enhancements

Potential future improvements include:

* Real-time notifications
* Email notifications
* SMS notifications
* Advanced analytics
* Service scheduling
* Technician location tracking
* Customer feedback and ratings
* File/image attachments
* Invoice management
* Payment integration
* Advanced reporting
* Audit logs
* Redis caching
* WebSocket-based real-time updates
* Cloud deployment
* CI/CD pipeline
* Automated testing
* Dockerized production deployment

---

# ☁️ Deployment Roadmap

A production deployment can follow:

```text
GitHub
   ↓
CI/CD
   ↓
Docker
   ↓
Cloud Infrastructure
   ↓
Spring Boot
   ↓
PostgreSQL
   ↓
React Frontend
```

Possible deployment infrastructure:

```text
Frontend
   ↓
CDN / Static Hosting

Backend
   ↓
Cloud Server / Container

Database
   ↓
Managed PostgreSQL
```

---

# 📊 Project Goals

Keystone aims to provide:

* Centralized service management
* Secure authentication
* Role-based access control
* Efficient technician assignment
* Service request tracking
* Work order management
* Operational visibility
* Scalable backend architecture
* Modern responsive frontend

---

# 🎯 Why Keystone?

Keystone is designed around a simple idea:

> **Put the complete service operation in one place.**

Instead of managing customers, requests, technicians, and work orders across different systems, Keystone provides one centralized platform.

---

# 🧠 Key Engineering Concepts Demonstrated

This project demonstrates practical implementation of:

* Full-stack application development
* REST API development
* React
* TypeScript
* Java
* Spring Boot
* Spring Security
* JWT authentication
* Role-based authorization
* PostgreSQL
* JPA / Hibernate
* Database migrations
* Maven
* API integration
* Frontend-backend architecture
* Error handling
* Application security
* CRUD operations
* Layered architecture

---

# 📚 Learning Outcomes

By building Keystone, developers gain practical experience with:

```text
Frontend Development
        +
Backend Development
        +
Database Management
        +
Authentication
        +
Authorization
        +
REST APIs
        +
Full-Stack Integration
```

---

# 🤝 Contributing

Contributions are welcome.

### Basic workflow

```bash
git clone <repository-url>
```

Create a branch:

```bash
git checkout -b feature/new-feature
```

Make your changes and commit:

```bash
git add .
git commit -m "Add new feature"
```

Push:

```bash
git push origin feature/new-feature
```

Then create a Pull Request.

---

# 📜 License

This project is currently intended for **educational, portfolio, and development purposes**.

If a specific open-source license is added later, replace this section with the appropriate license information.

---

# 👨‍💻 Author

**Durgesh Nishad**

Electronics & Communication Engineering

Interested in:

* Full-Stack Development
* Java
* Spring Boot
* Embedded Systems
* VLSI
* Semiconductor Technology
* Software Engineering

---

# ⭐ Project Status

```text
Project: Keystone
Status: Active Development
Backend: Spring Boot
Frontend: React + TypeScript
Database: PostgreSQL
Authentication: JWT
Java: 17
Build Tool: Maven
Frontend Tool: Vite
```

---

# 🚀 Quick Start

For a quick local setup:

### Terminal 1 — Backend

```bash
cd keystone/backend
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```

### Terminal 2 — Frontend

```bash
cd keystone/frontend
npm install
npm run dev
```

### Open

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8080
```

---

# 🔷 Keystone

**A centralized service management platform built for modern service operations.**

```text
React + TypeScript
        │
        ▼
   REST APIs
        │
        ▼
Spring Boot + JWT
        │
        ▼
   PostgreSQL
```

**Build. Manage. Track. Resolve.**
