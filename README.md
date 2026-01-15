# DTS App

A full-stack web application built with React and Node.js for the DTS Challenge test. This application provides user authentication, task management such Create, search task by TaskID, view, update, and delete tasks.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## ✨ Features

- User authentication (Local & Google OAuth)
- Secure session management
- Responsive UI with React
- PostgreSQL database integration
- Email notifications


## 🛠 Technology Stack

### Frontend

#### Core Technologies
- **React 19.0.0** - JavaScript library for building user interfaces
- **React DOM 19.0.0** - React package for working with the DOM
- **React Scripts 5.0.1** - Scripts and configuration used by Create React App

#### Routing & Navigation
- **React Router DOM 7.2.0** - Declarative routing for React applications

#### UI & Styling
- **React Icons 5.5.0** - Popular icon library for React

#### HTTP Client
- **Axios 1.8.2** - Promise-based HTTP client for API requests

#### Testing
- **@testing-library/react 16.2.0** - React component testing utilities
- **@testing-library/jest-dom 6.6.3** - Custom Jest matchers for DOM
- **@testing-library/user-event 13.5.0** - User interaction simulation
- **@testing-library/dom 10.4.0** - DOM testing utilities

#### Performance Monitoring
- **Web Vitals 2.1.4** - Library for measuring web performance metrics

### Backend

#### Core Framework
- **Node.js** - JavaScript runtime environment
- **Express 4.21.2** - Fast, minimalist web framework for Node.js

#### Database
- **PostgreSQL** - Powerful, open-source relational database
- **pg 8.16.3** - PostgreSQL client for Node.js
- **connect-pg-simple 10.0.0** - PostgreSQL session store for Express

#### Authentication & Security
- **Passport 0.7.0** - Authentication middleware for Node.js
- **Passport Local 1.0.0** - Local username/password authentication strategy
- **Passport Google OAuth2 0.2.0** - Google OAuth 2.0 authentication strategy
- **bcrypt 5.1.1** - Password hashing library
- **Express Session 1.18.1** - Session middleware for Express


#### API & Communication
- **Axios 1.10.0** - Promise-based HTTP client
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
- **Body Parser 1.20.3** - Request body parsing middleware
- **Nodemailer 7.0.5** - Email sending module

#### Configuration & Utilities
- **dotenv 16.6.1** - Environment variable management

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database server
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DTS-Task
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback


# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Server Configuration
PORT=4000
NODE_ENV=development
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
node index.js
# or use nodemon for auto-restart
nodemon index.js
```

The backend server will run on `http://localhost:4000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend application will run on `http://localhost:3000`

## 📁 Project Structure

```
DTS-Task/
├── backend/
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables (not in repo)
│
└── frontend/
    ├── public/           # Static files
    ├── src/              # React source files
    │   ├── components/   # React components
    │   ├── admin/        # Dashboard files
    │   └── ...
    ├── package.json      # Frontend dependencies
    └── README.md         # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login with credentials
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/logout` - Logout user


## 👨‍💻 Development

### Frontend Development
- Built with Create React App
- Uses React Hooks for state management
- Implements responsive design


### Backend Development
- RESTful API architecture
- PostgreSQL for data persistence
- Session-based authentication
- Email notification system


## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Michael Ofuzor**

---

For any issues or questions, please open an issue in the repository.