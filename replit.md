# Cryptocurrency Mining Operations Dashboard

## Overview

This project is a production-ready cryptocurrency mining operations dashboard that implements adaptive parallel Merkle tree construction for proof-of-work optimization. The application is designed as an enterprise-grade solution for managing cryptocurrency mining operations with real-time monitoring, GPU management, mining pool integration, and advanced analytics. The system focuses on optimizing mining efficiency through intelligent Merkle tree algorithms and comprehensive hardware management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing a modern component-based architecture with the following key design decisions:

- **Component Library**: Uses shadcn/ui components built on Radix UI primitives for consistent, accessible UI components
- **State Management**: Implements React Query (TanStack Query) for server state management with real-time data fetching and caching
- **Routing**: Uses Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with a custom dark theme optimized for cryptocurrency mining interfaces
- **Real-time Updates**: WebSocket integration for live data streaming and system notifications
- **Charts and Visualization**: Recharts library for performance monitoring and analytics dashboards

### Backend Architecture
The backend follows a service-oriented architecture with Express.js and TypeScript:

- **API Layer**: RESTful API endpoints with comprehensive validation using Zod schemas
- **Service Layer**: Modular services for different domain areas (GPU management, mining pools, Merkle tree optimization, analytics)
- **Real-time Communication**: WebSocket server for broadcasting live updates to connected clients
- **Background Processing**: Scheduled tasks for metrics collection, alert processing, and system monitoring
- **Middleware**: Request validation, error handling, and logging middleware

### Data Storage Solutions
The application uses a PostgreSQL database with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL (configured for Neon serverless database)
- **ORM**: Drizzle ORM with schema-first approach and automatic migrations
- **Connection Management**: Connection pooling with @neondatabase/serverless
- **Data Models**: Comprehensive schemas for users, GPUs, mining pools, Merkle tree configurations, system metrics, alerts, and transaction batches

### Core Mining Engine Components
The system implements sophisticated mining optimization algorithms:

- **Adaptive Merkle Tree Service**: Dynamic parallel tree construction with configurable threading and caching strategies
- **GPU Management**: Real-time monitoring of GPU performance, temperature, power consumption, and optimization
- **Mining Pool Integration**: Support for multiple mining pools with automatic failover and load balancing
- **Analytics Engine**: Performance tracking, efficiency calculations, and predictive analytics

### Authentication and Authorization
Basic authentication system with role-based access control:

- **User Management**: User registration and authentication with password hashing
- **Session Management**: Express sessions with database storage
- **Role-based Access**: Admin and user roles with different permission levels

## External Dependencies

### Core Framework Dependencies
- **Express.js**: Web application framework for the backend API
- **React 18**: Frontend framework with TypeScript support
- **Vite**: Modern build tool for development and production builds

### Database and ORM
- **PostgreSQL**: Primary database (configured for Neon serverless)
- **Drizzle ORM**: Type-safe database operations with schema management
- **@neondatabase/serverless**: Serverless PostgreSQL connection adapter

### UI Component Libraries
- **Radix UI**: Headless component primitives for accessibility and flexibility
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Recharts**: Chart library for data visualization

### Real-time and State Management
- **WebSocket (ws)**: Real-time bidirectional communication
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation

### Development and Build Tools
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Zod**: Runtime type validation for API endpoints and forms

### Mining-Specific Libraries
- **date-fns**: Date manipulation for time-series data
- **class-variance-authority**: Utility for component variant management
- **clsx**: Conditional className utility for dynamic styling

The application is designed to be self-contained with minimal external service dependencies, focusing on local processing power and database storage for mining operations management.