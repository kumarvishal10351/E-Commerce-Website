# 🛍️ ShopVerse — Full-Stack E-Commerce Platform

A complete, production-ready e-commerce platform built with the MERN stack. Features include user authentication, product management, shopping cart, Stripe payments, admin dashboard with analytics, and more.

![ShopVerse](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800)

## ✨ Features

### 🧑 Customer
- Beautiful landing page with hero, featured products, categories
- Product listing with filters (price, category, rating, brand)
- Search with instant results
- Product detail with image gallery, reviews, related products
- Add to Cart / Wishlist
- Multi-step checkout with Stripe payment
- Order tracking with status updates
- User profile with address management
- Star rating & review system
- Coupon/discount code support
- Dark / Light mode toggle

### 🛠️ Admin Dashboard
- Overview stats (orders, revenue, users, products)
- Revenue & orders analytics charts (Recharts)
- Product management (CRUD with Cloudinary image upload)
- Order management with status updates
- User management (view, roles, block/unblock)
- Coupon management
- Category management

### 🔐 Authentication
- JWT-based auth with HTTP-only cookies
- Register / Login / Logout
- Password reset via email (Nodemailer)
- Protected routes for users and admins

### 🔒 Security
- bcrypt password hashing (12 salt rounds)
- express-rate-limit for API throttling
- Helmet.js for HTTP security headers
- mongo-sanitize to prevent NoSQL injection
- express-validator for input validation
- CORS configuration

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, Framer Motion |
| State | Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Payments | Stripe |
| Images | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Charts | Recharts |

## 📁 Project Structure

```
E-Commerce-Website/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── layout/      # Header, Footer, AdminLayout
│   │   │   └── ui/          # ProductCard, Rating, Skeleton
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── ...
│   │   ├── store/           # Redux store
│   │   │   ├── slices/      # Auth, Cart, Wishlist, UI slices
│   │   │   ├── api.js       # Axios API service
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
├── server/                  # Express backend
│   ├── config/              # DB, Cloudinary config
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, error, validation
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Email, tokens, helpers
│   ├── data/                # Seed data
│   ├── seeder.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- **Cloudinary** account ([free signup](https://cloudinary.com/))
- **Stripe** account ([free signup](https://stripe.com/))

### 1. Clone & Install

```bash
git clone <repo-url>
cd E-Commerce-Website

# Install all dependencies (root + server + client)
npm run install-all
```

### 2. Configure Environment

Copy `.env.example` to `.env` in the root directory and fill in your credentials:

```bash
cp .env.example .env
```

**Required variables:**
- `MONGO_URI` — Your MongoDB connection string
- `JWT_SECRET` — Any random secure string
- `CLOUDINARY_*` — From your Cloudinary dashboard
- `STRIPE_SECRET_KEY` — From Stripe dashboard (use test key)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `SMTP_*` — Gmail App Password or SendGrid credentials

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **Admin user**: `admin@shopverse.com` / `admin123`
- **Test user**: `john@example.com` / `password123`
- 20 sample products across 6 categories
- 3 sample coupons: `WELCOME10`, `SAVE20`, `MEGA50`

### 4. Run Development Server

```bash
npm run dev
```

This starts both frontend (port 5173) and backend (port 5000) concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Health: http://localhost:5000/api/health

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Private |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |
| PUT | `/api/auth/password` | Private |
| POST | `/api/auth/forgot-password` | Public |
| PUT | `/api/auth/reset-password/:token` | Public |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| GET | `/api/products/top` | Public |
| GET | `/api/products/featured` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Private |
| GET | `/api/orders/myorders` | Private |
| GET | `/api/orders/:id` | Private |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| GET | `/api/orders/admin/stats` | Admin |

### Reviews, Coupons, Users, Categories, Upload, Payment
See route files in `server/routes/` for complete API documentation.

## 🚢 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL` = your deployed API URL
5. Deploy!

### Backend (Render / Railway)
1. Create new Web Service on [Render](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env variables from `.env`
6. Deploy!

## 📝 License

MIT License — feel free to use for personal or commercial projects.

---

Built with ❤️ using the MERN Stack
