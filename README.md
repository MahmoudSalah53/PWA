# TSTCommerce - E-Commerce Platform

A modern, full-featured e-commerce website built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog**: Browse through a wide range of products with category filtering
- 🛒 **Shopping Cart**: Add items to cart, update quantities, and manage your cart with persistent storage
- 💰 **Product Details**: Detailed product pages with images and descriptions
- 🔐 **User Authentication**: Sign in and sign up functionality with secure password hashing
- 📦 **Order Management**: Orders are saved to database and associated with users
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Next.js App Router for optimal performance
- 🔒 **Type Safety**: Full TypeScript support throughout the application
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client and set up the database:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample products

## Project Structure

```
tstcommerce/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── products/     # Product API endpoints
│   │   └── orders/       # Order API endpoints
│   ├── auth/             # Authentication pages
│   │   ├── signin/      # Sign in page
│   │   └── signup/      # Sign up page
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout pages
│   ├── products/         # Product listing and detail pages
│   ├── store/            # State management stores
│   ├── layout.tsx        # Root layout with Header/Footer
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Site footer
│   └── ProductCard.tsx  # Product card component
├── lib/                  # Utilities
│   └── prisma.ts        # Prisma client
├── prisma/               # Database
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Database seeder
│   └── dev.db           # SQLite database
├── types/                # TypeScript type definitions
│   └── product.ts       # Product, Cart, Order types
└── public/              # Static assets
```

## Key Technologies

- **Next.js 16**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Icons**: Icon library
- **Prisma**: ORM for database management
- **SQLite**: Database (can be easily switched to PostgreSQL)
- **Bcryptjs**: Password hashing library

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with products

## Features in Detail

### Shopping Cart

- Add/remove items
- Update quantities
- Persistent cart storage (localStorage)
- Cart badge counter in header
- Real-time price calculation

### Product Pages

- Product listing with category filters
- Individual product detail pages
- Product images and descriptions
- Stock status indication
- Products fetched from SQLite database via API

### Database & API

- SQLite database for local development
- RESTful API routes for products and orders
- Orders are persisted to database
- Easy to switch to PostgreSQL or MySQL

### User Experience

- Responsive navigation with mobile menu
- Loading states and transitions
- Clean, modern design
- Accessible UI components

## Authentication Features

- **Sign Up**: Create a new account with email and password
- **Sign In**: Login with existing credentials
- **Secure Passwords**: Bcrypt hashing for password security
- **User Sessions**: Persistent login with Zustand
- **Order Association**: Orders are linked to user accounts
- **Responsive Forms**: Beautiful sign in/sign up pages

## Future Enhancements

- Order history page for logged-in users
- Search functionality
- Payment integration
- Admin dashboard
- Product reviews
- Wishlist feature
- Newsletter subscription
- Password reset functionality

## License

This project is created as a template/demo and is free to use.
