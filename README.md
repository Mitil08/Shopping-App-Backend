# Shopping-App-Backend

ÉLANE Luxury Fashion REST API — Node.js & Express MVC backend with Supabase PostgreSQL resilience, JWT authentication, rate limiting, and full e-commerce endpoints.

## Live Deployments
- **REST API (Render):** [https://shopping-app-backend-bwbb.onrender.com/api](https://shopping-app-backend-bwbb.onrender.com/api)
- **Frontend Client (Vercel):** [https://shopping-app-frontend-rho.vercel.app](https://shopping-app-frontend-rho.vercel.app)

## Features
- **MVC Architecture**: Express routes, controllers, services, middleware, and validators.
- **Authentication**: Stateless JWT access and refresh tokens, bcrypt password hashing.
- **Security**: Helmet, CORS origin controls, Express rate limiting.
- **Database**: Supabase PostgreSQL with schema & seed migrations + automatic local fallback.
- **Catalog & Orders**: Products, categories, cart management, and order fulfillment.

## Setup & Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` (refer to `.env.example`).
3. Run in development:
   ```bash
   npm run dev
   ```
4. Run test suite:
   ```bash
   npm run test:e2e
   ```
