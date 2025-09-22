# Project Structure

This document outlines the complete directory structure and organization of the Slot Booking System.

## 📁 Complete Directory Structure

```
slot-booking-system/
├── client/                 # Frontend React Application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── SlotCard.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── UserDashboard.jsx
│   │   │   └── booking/
│   │   │       ├── BookingModal.jsx
│   │   │       ├── SlotCalendar.jsx
│   │   │       └── BookingForm.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Login/
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── DashboardPage.jsx
│   │   │   ├── Booking/
│   │   │   │   ├── BookSlotPage.jsx
│   │   │   │   └── ViewSlotsPage.jsx
│   │   │   └── Admin/
│   │   │       └── AdminPage.jsx
│   │   ├── stores/        # Zustand state stores
│   │   │   ├── authStore.js
│   │   │   ├── slotStore.js
│   │   │   └── bookingStore.js
│   │   ├── services/      # API services
│   │   │   ├── authAPI.js
│   │   │   ├── slotAPI.js
│   │   │   └── bookingAPI.js
│   │   ├── utils/         # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── server/                 # Backend Node.js Application
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── slotController.js
│   │   └── bookingController.js
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Slot.js
│   │   └── Booking.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── slots.js
│   │   └── bookings.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── config/            # Configuration files
│   │   └── database.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── docs/                   # Documentation files
│   ├── PROJECT_STRUCTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── STATE_MANAGEMENT.md
│   ├── API_DOCUMENTATION.md
│   └── USER_ROLES.md
│   
│
├── README.md
├── .gitignore
└── LICENSE
```

## 📂 Directory Descriptions

### Frontend (`/client`)

#### `/src/components`
Contains all reusable React components organized by feature:

- **`/common`**: Shared components used across the application
  - `Header.jsx`: Navigation header component
  - `Footer.jsx`: Application footer
  - `LoadingSpinner.jsx`: Loading indicator component
  - `SlotCard.jsx`: Individual slot display component

- **`/auth`**: Authentication-related components
  - `LoginForm.jsx`: User login form
  - `RegisterForm.jsx`: User registration form

- **`/dashboard`**: Dashboard components
  - `AdminDashboard.jsx`: Administrative dashboard
  - `UserDashboard.jsx`: Regular user dashboard

- **`/booking`**: Booking-related components
  - `BookingModal.jsx`: Modal for booking confirmation
  - `SlotCalendar.jsx`: Calendar view for slots
  - `BookingForm.jsx`: Form for creating bookings

#### `/src/pages`
Page-level components that represent different routes:

- **`/Login`**: Authentication pages
- **`/Dashboard`**: Dashboard pages
- **`/Booking`**: Booking management pages
- **`/Admin`**: Administrative pages

#### `/src/stores`
Zustand state management stores:

- `authStore.js`: Authentication and user state
- `slotStore.js`: Slot data and operations
- `bookingStore.js`: Booking management state

#### `/src/services`
API service modules for backend communication:

- `authAPI.js`: Authentication API calls
- `slotAPI.js`: Slot-related API calls
- `bookingAPI.js`: Booking API calls

#### `/src/utils`
Utility functions and constants:

- `helpers.js`: Common helper functions
- `constants.js`: Application constants

### Backend (`/server`)

#### `/controllers`
Request handlers and business logic:

- `authController.js`: Authentication logic
- `slotController.js`: Slot management logic
- `bookingController.js`: Booking operations

#### `/models`
MongoDB/Mongoose schemas:

- `User.js`: User data model
- `Slot.js`: Slot data model
- `Booking.js`: Booking data model

#### `/routes`
Express.js route definitions:

- `auth.js`: Authentication routes
- `slots.js`: Slot management routes
- `bookings.js`: Booking routes

#### `/middleware`
Custom Express middleware:

- `auth.js`: Authentication middleware
- `validation.js`: Input validation middleware

#### `/config`
Configuration files:

- `database.js`: MongoDB connection configuration

### Documentation (`/docs`)

Organized documentation files:

- `PROJECT_STRUCTURE.md`: This file - project organization
- `DATABASE_SCHEMA.md`: Database schemas and models
- `STATE_MANAGEMENT.md`: Zustand store implementations
- `API_DOCUMENTATION.md`: Complete API reference
- `USER_ROLES.md`: User roles and permissions
- `DEVELOPMENT_WORKFLOW.md`: Development processes

## 🎯 Key Design Principles

### Component Organization
- **Feature-based grouping**: Components are organized by functionality
- **Reusability**: Common components are separated for reuse
- **Clear separation**: Pages vs components distinction

### State Management
- **Centralized stores**: Each domain has its own Zustand store
- **Co-location**: Related state and actions are grouped together
- **Clear boundaries**: Separate concerns between auth, slots, and bookings

### Backend Structure
- **MVC pattern**: Clear separation of routes, controllers, and models
- **Middleware approach**: Reusable middleware for common functionality
- **Configuration management**: Environment-specific settings

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `SlotCard.jsx`)
- **Stores**: camelCase with "Store" suffix (e.g., `authStore.js`)
- **Services**: camelCase with "API" suffix (e.g., `slotAPI.js`)
- **Pages**: PascalCase with "Page" suffix (e.g., `LoginPage.jsx`)
- **Controllers**: camelCase with "Controller" suffix (e.g., `authController.js`)