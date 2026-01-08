# TripXplo - Holiday Package Platform

<div align="center">

![TripXplo Logo](public/tripxplologo.svg)

A modern full-stack travel package booking platform built with Next.js 16, featuring integrated REST APIs, MongoDB database, JWT authentication, Google OAuth, and comprehensive package customization options.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#️-configuration)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Project Structure](#-project-structure)
- [Using the API Client](#-using-the-api-client)
- [Database Models](#️-database-models)
- [API Response Format](#-api-response-format)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [Custom Hooks](#-custom-hooks)
- [Key Libraries & Tools](#-key-libraries--tools)
- [Troubleshooting](#-troubleshooting)
- [Code Style](#-code-style)
- [Security Considerations](#️-security-considerations)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality

- **🔐 User Authentication** - Register, login, logout with JWT tokens, Google OAuth, and OTP verification
- **📦 Package Management** - Browse, search, and filter travel packages with advanced options
- **🌍 Destination Catalog** - Explore featured and searchable destinations with rich imagery
- **📅 Booking System** - Create, view, and cancel bookings with detailed traveler information
- **🛒 Shopping Cart** - Add packages to cart with travel dates, guest configuration, and customizations
- **❤️ Wishlist** - Save favorite packages for later viewing and booking
- **💳 Payment Integration** - Initialize, process, and verify payments with transaction tracking
- **👤 User Profile** - Manage profile, view booking history, and redeem reward coins
- **🎟️ Coupon System** - Validate and apply discount coupons with percentage or fixed amount discounts

### Package Customization

- **🏨 Hotel Selection** - Change hotels and view available options per destination
- **🛏️ Room Configuration** - Select room types with meal plans
- **🚗 Cab/Vehicle Change** - Customize transportation options
- **🎯 Activity Add-ons** - Browse and add activities to your package
- **💰 Dynamic Pricing** - Real-time price quotes based on customizations

### Additional Features

- **📊 Rewards System** - Earn and redeem coins on bookings with bonus coin calculations
- **🔍 Advanced Search** - Filter by price, duration, destination, interests, and more
- **📱 Responsive Design** - Fully responsive and optimized for all devices (mobile, tablet, desktop)
- **🔄 State Persistence** - Redux with persist for seamless user experience across sessions
- **🎓 Onboarding** - Interactive tutorials using Intro.js for new user guidance
- **🖼️ Image Galleries** - Rich image displays with grid and slideshow views for packages and destinations
- **📅 Timeline Views** - Visual timeline components for package itineraries
- **🔔 Real-time Notifications** - Toast notifications for user actions and system feedback
- **📊 Price Calculator** - Dynamic price calculation based on customizations, discounts, and taxes

---

## 🛠️ Tech Stack

| Category             | Technology                                                              |
| -------------------- | ----------------------------------------------------------------------- |
| **Framework**        | Next.js 16 (App Router)                                                 |
| **Language**         | TypeScript 5                                                            |
| **Frontend**         | React 19                                                                |
| **Database**         | MongoDB with Mongoose 9 ODM                                             |
| **Authentication**   | JWT + NextAuth.js + Google OAuth + Firebase                             |
| **Styling**          | Tailwind CSS 3.4                                                        |
| **State Management** | Redux Toolkit + Redux Persist                                           |
| **Data Fetching**    | TanStack React Query 5                                                  |
| **Form Handling**    | React Hook Form + Zod + Yup validation                                  |
| **UI Components**    | Radix UI, Vaul (Drawer), Lucide Icons, FontAwesome, React Icons         |
| **HTTP Client**      | Axios                                                                   |
| **Carousel**         | Embla Carousel, Swiper                                                  |
| **Date Handling**    | date-fns, React Day Picker                                              |
| **Notifications**    | React Hot Toast, React Toastify                                         |
| **Image Galleries**  | React Grid Gallery, React Slideshow Image                               |
| **UI Enhancements**  | React Vertical Timeline, ReactJS Popup, Intro.js (Onboarding)           |
| **Utilities**        | UUID, History, bcryptjs, class-variance-authority, clsx, tailwind-merge |

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn
- Git (for cloning the repository)

### 1. Clone the repository

```bash
git clone <repository-url>
cd HolidayPackage
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/tripxplo

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=30d

# App Configuration
NEXT_PUBLIC_API_URL=/api/v1/
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Image CDN (optional)
NEXT_PUBLIC_PIC_URL=https://your-image-cdn.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

### 5. Run the development server

```bash
npm run dev
```

### 6. Open the application

Visit [http://localhost:3000](http://localhost:3000)

### 7. Build for production

```bash
npm run build
npm start
```

---

## 🚀 Quick Start

After installation, you can quickly test the application:

1. **Start the development server**: `npm run dev`
2. **Visit**: [http://localhost:3000](http://localhost:3000)
3. **Register a new account** or use Google OAuth
4. **Browse packages** from the homepage
5. **Add packages to cart** and proceed to checkout
6. **Explore destinations** and customize packages

### First Steps

- Create an account to access all features
- Browse featured packages on the homepage
- Use the search and filter options to find packages
- Add packages to wishlist for later
- Customize packages (hotels, rooms, vehicles, activities)
- Complete a test booking to see the full flow

---

## ⚙️ Configuration

### Next.js Configuration

The project uses Next.js 16 with App Router. Image optimization is configured to allow remote images from any HTTPS source. See `next.config.mjs` for details.

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured (`@/*` maps to project root)
- ES2017 target
- React JSX transform enabled

### Environment Variables

All environment variables should be set in `.env.local` file. Never commit this file to version control.

---

## 📚 API Documentation

All API routes are available under `/api/v1/`. For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Quick Reference

#### Authentication

| Endpoint             | Method | Description          | Auth |
| -------------------- | ------ | -------------------- | ---- |
| `/auth/register`     | POST   | Register new user    | ❌   |
| `/auth/login`        | POST   | Login user           | ❌   |
| `/auth/logout`       | POST   | Logout user          | ✅   |
| `/auth/refresh`      | POST   | Refresh access token | ❌   |
| `/auth/google/oauth` | POST   | Google OAuth login   | ❌   |

#### Packages

| Endpoint                   | Method | Description              | Auth |
| -------------------------- | ------ | ------------------------ | ---- |
| `/packages`                | GET    | List all packages        | ❌   |
| `/packages/featured`       | GET    | Get featured packages    | ❌   |
| `/packages/search`         | GET    | Search with filters      | ❌   |
| `/packages/:id`            | GET    | Get package details      | ❌   |
| `/packages/:id/available`  | GET    | Get availability         | ❌   |
| `/packages/:id/hotel`      | GET    | Get available hotels     | ❌   |
| `/packages/:id/vehicles`   | GET    | Get available vehicles   | ❌   |
| `/packages/:id/activities` | GET    | Get available activities | ❌   |
| `/packages/price/quote`    | POST   | Get price quote          | ❌   |

#### Hotels & Rooms

| Endpoint                 | Method | Description         | Auth |
| ------------------------ | ------ | ------------------- | ---- |
| `/hotels/:hotelId/rooms` | GET    | Get hotel rooms     | ❌   |
| `/rooms/:roomId/meals`   | GET    | Get room meal plans | ❌   |

#### Destinations

| Endpoint                 | Method | Description           | Auth |
| ------------------------ | ------ | --------------------- | ---- |
| `/destinations`          | GET    | List all destinations | ❌   |
| `/destinations/featured` | GET    | Get featured          | ❌   |
| `/destinations/search`   | GET    | Search destinations   | ❌   |
| `/destinations/:id`      | GET    | Get by ID             | ❌   |

#### User Management

| Endpoint                          | Method      | Description           | Auth |
| --------------------------------- | ----------- | --------------------- | ---- |
| `/user/profile`                   | GET/PUT     | Get/Update profile    | ✅   |
| `/user/wishlist`                  | GET         | Get wishlist          | ✅   |
| `/user/wishlist/:packageId`       | POST/DELETE | Add/Remove wishlist   | ✅   |
| `/user/wishlist/:packageId/check` | GET         | Check wishlist status | ✅   |
| `/user/bookings`                  | GET         | Get user bookings     | ✅   |

#### Bookings & Cart

| Endpoint               | Method     | Description         | Auth |
| ---------------------- | ---------- | ------------------- | ---- |
| `/bookings`            | POST       | Create booking      | ✅   |
| `/bookings/:id`        | GET        | Get booking details | ✅   |
| `/bookings/:id/cancel` | POST       | Cancel booking      | ✅   |
| `/cart`                | GET        | Get cart            | ✅   |
| `/cart/add`            | POST       | Add to cart         | ✅   |
| `/cart/:itemId`        | PUT/DELETE | Update/Remove item  | ✅   |
| `/cart/clear`          | POST       | Clear cart          | ✅   |

#### Payment

| Endpoint                     | Method | Description        | Auth |
| ---------------------------- | ------ | ------------------ | ---- |
| `/payment/initialize`        | POST   | Initialize payment | ✅   |
| `/payment/process`           | POST   | Process payment    | ✅   |
| `/payment/verify`            | POST   | Verify payment     | ✅   |
| `/payment/:paymentId/status` | GET    | Get payment status | ✅   |

#### Utility

| Endpoint            | Method | Description       | Auth |
| ------------------- | ------ | ----------------- | ---- |
| `/health`           | GET    | API health check  | ❌   |
| `/interests`        | GET    | Get all interests | ❌   |
| `/plans`            | GET    | Get all plans     | ❌   |
| `/coupons/validate` | POST   | Validate coupon   | ✅   |

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Token Flow

1. **Login/Register** → Receive `token` and `refreshToken`
2. **API Calls** → Include `token` in Authorization header
3. **Token Expired** → Use `/auth/refresh` to get new tokens

---

## 📁 Project Structure

```
HolidayPackage/
├── app/
│   ├── api/v1/                     # API Routes
│   │   ├── auth/                   # Authentication (login, register, Google OAuth)
│   │   ├── bookings/               # Booking management
│   │   ├── cart/                   # Shopping cart
│   │   ├── destinations/           # Destinations CRUD
│   │   ├── hotels/                 # Hotel rooms
│   │   ├── packages/               # Packages with customizations
│   │   ├── payment/                # Payment processing
│   │   ├── rooms/                  # Room meals
│   │   ├── user/                   # User profile & wishlist
│   │   └── health/                 # Health check
│   ├── (auth)/                     # Auth pages (sign-in, register, OTP)
│   ├── (booking)/                  # Booking & transaction pages
│   ├── (customisations)/           # Package customization pages
│   │   ├── addActivity/            # Add activities to package
│   │   ├── hotelchange/            # Change hotel selection
│   │   ├── roomchange/             # Change room configuration
│   │   ├── cabchange/              # Change vehicle/cab
│   │   └── selectroom/             # Room selection
│   ├── (package)/                  # Package listing & details
│   ├── (policies)/                 # Legal pages
│   ├── (user-area)/                # User dashboard
│   │   ├── account/                # User account settings
│   │   ├── mybookings/             # Booking history
│   │   ├── wishlists/              # Saved packages
│   │   └── rewards/                # Rewards/coins
│   ├── hooks/                      # Custom React hooks
│   ├── store/                      # Redux store & slices
│   ├── types/                      # TypeScript types
│   ├── utils/                      # Utility functions
│   └── providers/                  # Context providers
├── components/
│   └── ui/                         # Reusable UI components
├── lib/
│   ├── models/                     # MongoDB/Mongoose models
│   ├── db.ts                       # Database connection
│   ├── auth.ts                     # Auth utilities
│   ├── api-response.ts             # Response helpers
│   ├── api-middleware.ts           # Middleware utilities
│   ├── api-client.ts               # Frontend API client
│   └── firebase.config.ts          # Firebase configuration
├── public/                         # Static assets
└── @types/                         # Custom type declarations
```

---

## 🔧 Using the API Client

The project includes a ready-to-use API client for frontend integration:

```typescript
import api, { setAccessToken, setRefreshToken } from "@/lib/api-client";

// Authentication
const loginResponse = await api.auth.login({
  email: "user@example.com",
  password: "password123",
});

if (loginResponse.success) {
  setAccessToken(loginResponse.data.token);
  setRefreshToken(loginResponse.data.refreshToken);
}

// Get featured packages
const packages = await api.packages.featured(10);

// Create a booking
const booking = await api.bookings.create({
  packageId: "pkg_123",
  travelDate: "2025-03-15",
  adults: 2,
  children: 1,
});

// Manage wishlist
await api.user.addToWishlist("pkg_123");
const wishlist = await api.user.getWishlist();

// Cart operations
await api.cart.add({
  packageId: "pkg_123",
  travelDate: "2025-03-15",
  adults: 2,
});
const cart = await api.cart.get();
```

---

## 🗄️ Database Models

| Model         | Description                                 | Key Features                                                        |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| `User`        | User accounts with authentication & rewards | Email/password auth, Google OAuth, redeem coins, profile management |
| `Package`     | Travel packages with configurations         | Destinations, hotels, vehicles, activities, pricing, offers         |
| `Booking`     | User bookings with pricing & travelers      | Status tracking, payment integration, cancellation, refunds         |
| `Cart`        | Shopping cart items                         | Session persistence, item management, price calculations            |
| `Transaction` | Payment transactions                        | Payment status, order tracking, verification                        |
| `Destination` | Travel destinations                         | Featured destinations, search, categorization                       |
| `Hotel`       | Hotel information                           | Location, amenities, ratings, availability                          |
| `HotelRoom`   | Room types, pricing & meal plans            | Room configurations, meal plan options, pricing                     |
| `Vehicle`     | Transport vehicles                          | Vehicle types, capacity, pricing, availability                      |
| `Activity`    | Travel activities                           | Activity details, pricing, add-on options                           |
| `Coupon`      | Discount coupons                            | Percentage/fixed discounts, validity, usage limits                  |
| `Interest`    | Travel interests/themes                     | Package categorization, filtering                                   |
| `Plan`        | Travel plan types                           | Plan categories (Standard, Premium, Luxury, etc.)                   |
| `Inclusion`   | Package inclusions                          | What's included in packages                                         |
| `Exclusion`   | Package exclusions                          | What's not included in packages                                     |
| `Amenities`   | Hotel/room amenities                        | Amenity listings for hotels and rooms                               |

---

## 🧪 API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "Data retrieved successfully"
}
```

---

## 📜 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
# or
npm run serve

# Lint code
npm run lint
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Production Server

```bash
npm start
```

### Deployment Options

#### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Self-Hosted with PM2

1. Build the application: `npm run build`
2. Start with PM2: `pm2 start npm --name "tripxplo" -- start`
3. Save PM2 configuration: `pm2 save`

#### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### GitHub Actions (If Configured)

The project may include GitHub Actions workflows for automated deployment:

#### Production Deployment

- **Branch**: `main`
- **Workflow**: `.github/workflows/main.yml`
- Automatically builds and deploys on push to `main` branch
- Uses PM2 for process management

#### Staging Deployment

- **Branch**: `staging`
- **Workflow**: `.github/workflows/staging.yml`
- Automatically builds and deploys on push to `staging` branch
- Uses PM2 for process management

**Note**: Ensure SSH secrets (`HOST`, `USERNAME`, `SSH_PRIVATE_KEY`) are configured in GitHub repository secrets if using GitHub Actions.

---

## 🎨 Custom Hooks

The project includes several custom React hooks for common operations:

| Hook                   | Description                        |
| ---------------------- | ---------------------------------- |
| `useAuth`              | Authentication state and actions   |
| `usePackage`           | Fetch single package details       |
| `usePackageList`       | Fetch packages with pagination     |
| `useFilterPackages`    | Apply filters to package list      |
| `useDestinations`      | Fetch destinations                 |
| `useBookingList`       | Fetch user bookings                |
| `useWishlist`          | Wishlist operations                |
| `useAvailableHotels`   | Fetch available hotels for package |
| `useAvailableRooms`    | Fetch available rooms              |
| `useAvailableActivity` | Fetch available activities         |
| `useAvailableCab`      | Fetch available vehicles           |
| `useInfiniteScroll`    | Infinite scroll pagination         |
| `useApplyFilters`      | Apply search filters               |
| `useRoutes`            | Navigation routes                  |

---

## 🎯 Key Libraries & Tools

### UI & Styling

- **Radix UI** - Accessible component primitives (Dialog, Alert Dialog, Popover, Select, Tabs, Label)
- **Vaul** - Modern drawer component
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **FontAwesome** - Comprehensive icon library
- **React Icons** - Popular icon library collection

### Forms & Validation

- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation
- **Yup** - JavaScript schema validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### State & Data

- **Redux Toolkit** - Modern Redux with simplified API
- **Redux Persist** - Persist Redux state to storage
- **TanStack React Query** - Powerful data synchronization
- **TanStack React Query Devtools** - Development tools for React Query

### Media & Display

- **Embla Carousel** - Lightweight carousel library
- **Swiper** - Modern touch slider
- **React Grid Gallery** - Responsive image gallery
- **React Slideshow Image** - Image slideshow component
- **React Vertical Timeline** - Timeline visualization component

### Utilities

- **UUID** - Generate unique identifiers
- **bcryptjs** - Password hashing
- **date-fns** - Date utility library
- **React Day Picker** - Date picker component
- **History** - Session history management
- **Intro.js** - Step-by-step feature introductions

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error

- Ensure MongoDB is running: `mongod` or check Docker container
- Verify `MONGODB_URI` in `.env.local` is correct
- Check network connectivity to MongoDB instance

#### Authentication Issues

- Verify JWT secrets are set in environment variables
- Check token expiration settings
- Ensure refresh token is being stored correctly

#### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

#### Image Loading Issues

- Verify `NEXT_PUBLIC_PIC_URL` is set correctly
- Check Next.js image configuration in `next.config.mjs`
- Ensure remote image domains are allowed

### Development Tips

- Use React Query Devtools for debugging API calls
- Check Redux DevTools for state management
- Monitor network requests in browser DevTools
- Review server logs for API errors

---

## 📝 Code Style

- **TypeScript**: Strict mode enabled, prefer type safety
- **Components**: Use functional components with hooks
- **Styling**: Tailwind CSS utility classes preferred
- **State Management**: Redux for global state, React Query for server state
- **API Calls**: Use the provided API client (`lib/api-client.ts`)
- **Error Handling**: Use try-catch blocks and proper error responses

---

## 🔒 Security Considerations

- Never commit `.env.local` or sensitive credentials
- Use strong JWT secrets in production
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Use HTTPS in production
- Regularly update dependencies for security patches

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Write meaningful commit messages
- Add tests for new features (if applicable)
- Update documentation for API changes
- Ensure TypeScript types are properly defined

---

## 📄 License

This project is proprietary and confidential.

---

## 📞 Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.

---

<div align="center">

Built with ❤️ using Next.js and MongoDB

**[TripXplo](https://tripxplo.com)** - Your Gateway to Amazing Holidays

</div>
