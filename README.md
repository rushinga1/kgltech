# Kigali Tech Store

Kigali Tech Store is a Vue 3 single-page e-commerce app for browsing gadgets and electronics with a Rwanda-inspired visual theme, RWF pricing, wishlist and cart persistence, mock authentication, and a demo-friendly checkout flow.

## Project Overview

- Vue 3 with `<script setup>`, Vite, Vue Router 4, Pinia, Axios, Tailwind CSS, VueUse, and Stripe client loading
- Product catalog powered by [Fake Store API](https://fakestoreapi.com/)
- Rwanda-themed UI with prices converted from USD to RWF
- Persistent cart, wishlist, auth session, and mock order history via localStorage

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and update values if needed:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Create a production build:
   ```bash
   npm run build
   ```

## Environment Variables

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
VITE_STRIPE_SERVER_URL=http://localhost:4242
VITE_APP_NAME=Kigali Tech Store
```

If the Stripe key is not provided, checkout falls back to a demo payment completion flow so the app can still be tested end to end.

Important: Never put Stripe secret keys (`sk_...`) in frontend code or Vite env vars. Secret keys must live on a backend only.

## Deploy to Render

This repo includes a Render blueprint: `render.yaml`.

- Backend service (Node): deploys from `server/`
  - Set `STRIPE_SECRET_KEY` in Render (never commit it)
  - Optionally set `CORS_ORIGIN` to your frontend Render URL
- Frontend service (Static):
  - Set `VITE_STRIPE_PUBLIC_KEY`
  - Set `VITE_STRIPE_SERVER_URL` to the backend Render URL (example: `https://kts-stripe-server.onrender.com`)

## Live Demo

Live demo URL: `TODO`

## Screenshots

- Home page: `TODO`
- Product list: `TODO`
- Checkout flow: `TODO`

## Known Limitations

- Authentication is mocked and does not use a backend service.
- Stripe Elements is represented by a test-ready placeholder unless a publishable key is configured.
- The Fake Store API has a limited product catalog, so virtual scrolling does not normally activate.
- Category labels and product imagery depend on third-party API data.

## Future Improvements

- Add a real backend for customer accounts, inventory, and order management.
- Replace the checkout fallback flow with a fully mounted Stripe Elements integration and payment intent backend.
- Add automated component and end-to-end tests.
- Expand localization for Kigali and wider Rwanda delivery flows.
