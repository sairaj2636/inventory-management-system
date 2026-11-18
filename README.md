# Inventory Management System

React (Vite) frontend + Express/MongoDB backend. Roles: USER, ADMIN, SUPER ADMIN.

## Run

Requirements: Node 20+, MongoDB running locally on `127.0.0.1:27017`.

```bash
# Backend  (http://localhost:5000)
cd Backend
npm install
cp .env.example .env      # already included as .env for local dev
npm run dev

# Frontend (http://localhost:5173)
cd Frontend
npm install
npm run dev
```

If `node_modules` came from another OS, delete it and run `npm install` again.

## Default login

A SUPER ADMIN is created on first start (see `Backend/.env`):

- Email: `superadmin@example.com`
- Password: `Admin@123`

New registrations are USERs. Log in as SUPER ADMIN > Users to promote someone to ADMIN.

## Typical flow

1. SUPER ADMIN: add a Category.
2. ADMIN / SUPER ADMIN: add a Product, then set its stock in Inventory.
3. USER: register, add an Address, add products to Cart, Checkout.

Note: role changes apply after the affected user logs in again.
