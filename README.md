# Slot Booking System - SLOP 5.0

A comprehensive full-stack web application designed for Dhirubhai Ambani University to manage event slot bookings for various clubs and committees. This system ensures organized scheduling and prevents double-booking conflicts.

## 🚀 Project Overview

The Slot Booking System is a MERN stack application that enables authorized club administrators to book time slots for their events while maintaining a conflict-free schedule. The system provides a centralized platform for managing university event scheduling with proper authentication and authorization mechanisms.

### Key Features
- **Role-based Access Control**: Only authenticated club admins can book slots
- **Real-time Slot Availability**: Live updates on slot booking status
- **Conflict Prevention**: Automatic detection and prevention of double-booking
- **Admin Dashboard**: Comprehensive management interface
- **Responsive Design**: Mobile-friendly user interface
- **Public Slot View**: All users can view available slots (read-only)
- **State Management**: Uses Zustand for efficient state management

## 🏗️ System Architecture

### Frontend Architecture
```
Client Layer (React.js + Vite + Tailwind CSS)
├── Component Layer (UI Components)
├── State Management (Zustand Stores)
├── API Service Layer (Axios)
└── Routing Layer (React Router)
```

### Backend Architecture
```
Server Layer (Node.js/Express.js)
├── API Routes (RESTful endpoints)
├── Middleware Layer (Auth, Validation)
├── Business Logic Layer (Controllers)
├── Data Access Layer (Models)
└── Database Layer (MongoDB)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📚 Documentation

- [Project Structure](./docs/PROJECT_STRUCTURE.md) - Detailed directory structure and file organization
- [Database Schema](./docs/DATABASE_SCHEMA.md) - MongoDB schemas and data models
- [State Management](./docs/STATE_MANAGEMENT.md) - Zustand stores implementation
- [API Documentation](./docs/API_DOCUMENTATION.md) - Complete API endpoints reference
- [User Roles & Permissions](./docs/USER_ROLES.md) - Access control and permissions guide
- [Development Workflow](./docs/DEVELOPMENT_WORKFLOW.md) - Development processes and workflows

## 👥 User Roles

- **Regular User**: View available slots (read-only)
- **Club Admin**: Book slots and manage personal bookings  
- **Super Admin**: Full administrative access

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Zustand, Axios, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens
- **State Management**: Zustand

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Dhirubhai Ambani University - SLOP 5.0**
