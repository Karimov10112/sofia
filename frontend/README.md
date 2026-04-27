# 🛍️ Sofia Shop — Full Stack E-commerce

> Beauty products & Smartphones online store  
> **Frontend:** React + Vite + Tailwind  
> **Backend:** Node.js + Express + MongoDB + Google OAuth

---

## 📁 Project Structure

```
sofia-shop/
├── src/                         # Frontend (React)
│   └── app/
│       ├── pages/
│       │   ├── AuthPage.tsx     # ✅ Login & Register (NEW)
│       │   ├── HomePage.tsx
│       │   ├── CategoryPage.tsx
│       │   ├── CartPage.tsx
│       │   └── ...
│       ├── components/
│       │   ├── UserMenu.tsx     # ✅ User avatar dropdown (NEW)
│       │   └── Navbar.tsx
│       ├── context/
│       │   └── StoreContext.tsx # ✅ Updated with auth state
│       └── routes.tsx           # ✅ Updated with /login /register
│
└── backend/                     # Backend (Node.js)
    ├── server.js
    ├── config/passport.js       # Google OAuth
    ├── middleware/auth.js        # JWT middleware
    ├── models/User.js            # User schema
    ├── routes/auth.js            # Auth API
    ├── routes/products.js        # Products API
    ├── routes/orders.js          # Orders API
    └── .env.example
```

---

## 🚀 Setup Guide

### 1️⃣ Frontend
```bash
npm install
npm run dev     # http://localhost:5173
```

### 2️⃣ Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm run dev     # http://localhost:5000
```

### 3️⃣ Google OAuth Setup
1. Go to https://console.developers.google.com
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID + Secret into `.env`

### 4️⃣ MongoDB
- **Local:** Install MongoDB Community and run `mongod`
- **Cloud:** Create free cluster at mongodb.com/atlas, paste URI into `.env`

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register with email |
| POST | `/api/auth/login` | ❌ | Login with email |
| GET | `/api/auth/google` | ❌ | Start Google OAuth |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| PUT | `/api/auth/change-password` | ✅ | Change password |
| GET | `/api/products` | ❌ | List products |
| GET | `/api/products/:id` | ❌ | Single product |
| POST | `/api/orders` | ✅ | Create order |
| GET | `/api/orders` | ✅ | My orders |

---

## 🧩 Add UserMenu to Navbar

In `src/app/components/Navbar.tsx`, replace the Profile button:

```tsx
import { UserMenu } from './UserMenu';

// Find this:
<button className="hidden md:flex p-2 ...">
  <User className="w-5 h-5" />
</button>

// Replace with:
<UserMenu />
```
