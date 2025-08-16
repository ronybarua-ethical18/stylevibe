# StyleVibe - Salon & Beauty Service Booking Platform

StyleVibe is a comprehensive full-stack salon and beauty service booking platform that connects customers with beauty professionals. Built with modern technologies, it provides a seamless experience for booking appointments, managing services, and facilitating communication between customers and service providers.

## 🌟 Features

### For Customers

- **Service Booking**: Browse and book beauty services including makeup, facial treatments, haircuts, and special occasion services
- **Real-time Chat**: Communicate directly with service providers through booking-specific chat rooms
- **Payment Processing**: Secure payment integration with Stripe
- **Booking Management**: Track booking status and history
- **Reviews & Ratings**: Rate and review completed services
- **Notifications**: Real-time notifications for booking updates

### For Service Providers (Sellers)

- **Shop Management**: Create and manage beauty shops with customizable service hours
- **Service Catalog**: Add and manage services with categories, pricing, and availability
- **Time Slot Management**: Configure available time slots and off days
- **Booking Dashboard**: Manage incoming bookings and customer communications
- **Revenue Tracking**: Monitor earnings and transaction history
- **Stripe Integration**: Receive payments directly through connected Stripe accounts

### For Administrators

- **Platform Management**: Oversee users, shops, and services
- **Content Management**: Manage FAQs, blogs, and platform content
- **Analytics Dashboard**: View platform statistics and performance metrics
- **Transaction Monitoring**: Track all platform transactions and fees

## 🏗️ Architecture

This is a Turborepo monorepo containing:

### Apps and Packages

- **`apps/frontend`**: Next.js 14 application with React 18, TypeScript, and Ant Design
- **`apps/backend`**: Express.js API server with TypeScript, MongoDB, and Socket.IO
- **`packages/ui`**: Shared React component library
- **`packages/eslint-config`**: Shared ESLint configurations
- **`packages/typescript-config`**: Shared TypeScript configurations

### Technology Stack

#### Frontend

- **Framework**: Next.js 14 with App Router
- **UI Library**: Ant Design + Custom Components
- **Styling**: Tailwind CSS + Styled Components
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: NextAuth.js
- **Real-time**: Socket.IO Client
- **Payments**: Stripe React components

#### Backend

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Payments**: Stripe API with Connect
- **File Upload**: Cloudinary integration
- **Email**: Nodemailer with Handlebars templates
- **Queue System**: BullMQ with Redis
- **Validation**: Zod schemas

#### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB 6
- **Cache/Queue**: Redis 7
- **File Storage**: Cloudinary
- **Deployment**: Production-ready Docker setup

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.15.0 (recommended package manager)
- **Docker** & **Docker Compose** (for containerized development)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd stylevibe
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   Create `.env` files in both `apps/frontend` and `apps/backend` directories:

   **Backend** (`apps/backend/.env`):

   ```env
   NODE_ENV=development
   PORT=8000
   MONGODB_URI=mongodb://admin:password@localhost:27017/stylevibe?authSource=admin
   JWT_SECRET=your-jwt-secret
   REDIS_URL=redis://localhost:6379
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   STRIPE_SECRET_KEY=your-stripe-secret-key
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   ```

   **Frontend** (`apps/frontend/.env`):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

4. **Start development servers**

   ```bash
   # Start all services
   pnpm dev

   # Or start specific apps
   pnpm dev --filter=frontend
   pnpm dev --filter=backend
   ```

### Docker Development

For a fully containerized development environment:

```bash
# Start all services with Docker
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down

# Clean up volumes
pnpm docker:clean
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 📦 Available Scripts

### Root Level Commands

```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps for production
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier
pnpm check-types      # Type check all packages
```

### Docker Commands

```bash
pnpm docker:build     # Build Docker images
pnpm docker:up        # Start containers in detached mode
pnpm docker:down      # Stop and remove containers
pnpm docker:logs      # View container logs
pnpm docker:clean     # Remove containers and volumes
pnpm dev:docker       # Start containers in development mode
```

### App-Specific Commands

```bash
# Frontend
pnpm --filter=frontend build
pnpm --filter=frontend dev
pnpm --filter=frontend start

# Backend
pnpm --filter=backend build
pnpm --filter=backend dev
pnpm --filter=backend start
```

## 🏪 Service Categories

StyleVibe supports various beauty service categories:

- **Hair Services**: Haircuts, styling, coloring
- **Makeup Services**: Facial makeup, eye makeup, special occasion makeup
- **Facial Treatments**: Skincare, anti-aging, acne treatment
- **Special Occasion Services**: Bridal styling, prom makeup, photoshoot preparation

## 💳 Payment System

- **Stripe Integration**: Secure payment processing with Stripe Connect
- **Hold & Capture**: Payments are held during booking and captured upon service completion
- **Platform Fees**: 10% application fee for platform maintenance
- **Seller Payouts**: Direct transfers to seller Stripe accounts

## 🔄 Real-time Features

- **Live Chat**: Booking-specific chat rooms between customers and providers
- **Notifications**: Instant notifications for booking updates and messages
- **Typing Indicators**: Real-time typing status in chat
- **Unread Message Counts**: Live badge updates for unread messages

## 🛠️ Development Tools

- **TypeScript**: Full type safety across the entire stack
- **ESLint**: Consistent code quality and style
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for code quality
- **Lint-staged**: Run linters on staged files

## 📱 User Roles

1. **Customer**: Book services, chat with providers, manage bookings
2. **Seller**: Manage shops, services, and customer interactions
3. **Admin**: Platform administration and oversight
4. **Super Admin**: Full system access and configuration

## 🔧 Production Deployment

1. **Build for production**

   ```bash
   pnpm build
   ```

2. **Docker production build**

   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

3. **Environment Variables**: Ensure all production environment variables are configured
4. **Database**: Set up production MongoDB instance
5. **Redis**: Configure production Redis instance
6. **Stripe**: Configure production Stripe keys and webhooks

## 📞 Support

For technical support or questions about StyleVibe, please refer to the development team or create an issue in the project repository.

## 📄 License

This project is proprietary software. All rights reserved.
