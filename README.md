# ShopZone --- MERN Stack E-Commerce Platform

A full-stack e-commerce web application built with the MERN stack. It
includes customer authentication, product and category browsing, cart
and checkout workflows, order placement and tracking, and an admin
dashboard.

> **Portfolio project:** Configure your own environment variables and
> verify the API routes against your backend before deployment.

## Features

### Customer

-   Registration and login
-   Email verification and OTP/password recovery flows, where configured
-   Product and category browsing
-   Product details, search, and filtering
-   Shopping cart and checkout with shipping information
-   Cash on Delivery and an online-payment option in the checkout UI
-   Order creation and generated tracking number
-   Personal order history and tracking by tracking number
-   Responsive interface and toast feedback

### Admin

-   Dashboard overview and statistics UI
-   Product management: create, edit, search/filter, and delete
-   Category management: create, edit, and delete
-   User listing/management view
-   Order listing and status-management UI when matching backend routes
    are configured
-   Light/dark theme support
-   Product/category image uploads through Cloudinary when configured

### Backend

-   REST APIs with Node.js and Express
-   MongoDB persistence using Mongoose
-   JWT-based authentication middleware
-   Admin-only route protection when role middleware is configured
-   Email service integrations where configured

## Tech stack

**Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit,
Axios, React Router, Lucide React, Sonner

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT

**Integrations:** Cloudinary for image uploads and SMTP/email service
where configured.

## Project structure

Your exact folder layout may differ slightly:

``` text
E-Commerce/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── midllware/
│   ├── utills/
│   ├── .env
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── redux/
    │   └── ...
    ├── .env
    └── package.json
```

## Getting started

### 1. Clone the repository

``` bash
git clone https://github.com/MShakir7852/E-Commerce.git
cd E-Commerce
```

### 2. Install backend dependencies

``` bash
cd Backend
npm install
```

Create `Backend/.env` with the values your backend expects. Example
placeholders:

``` env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret

# Only if used by your implementation:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_app_password
```

Check your configuration code for exact variable names; your MongoDB
variable may be `MONGO_URI` rather than `MONGODB_URI`.

Start the backend using the script defined in `Backend/package.json`,
for example:

``` bash
npm run dev
```

The current local setup has used port `3000`.

### 3. Install frontend dependencies

Open another terminal:

``` bash
cd Frontend
npm install
npm run dev
```

Vite commonly serves the frontend at `http://localhost:5173`.

If your app uses a frontend API-base variable, configure it in
`Frontend/.env`, for example:

``` env
VITE_API_BASE_URL=http://localhost:3000
```

Use the variable name actually referenced in your code. If URLs are
hard-coded, ensure they match the backend address.

## Main API routes

These are the project routes discussed during development. Availability
depends on how the routers are mounted and which controller/middleware
functions are implemented.

  -------------------------------------------------------------------------------------
  Method                  Endpoint                              Purpose
  ----------------------- ------------------------------------- -----------------------
  POST                    `/api/orders/create`                  Create an order

  GET                     `/api/orders`                         Get the authenticated
                                                                customer's orders

  GET                     `/api/orders/all`                     Get all orders for an
                                                                authenticated admin

  GET                     `/api/orders/track/:trackingNumber`   Find an order by
                                                                tracking number for the
                                                                authenticated customer

  GET                     `/api/orders/:id`                     Get one order belonging
                                                                to the authenticated
                                                                customer

  GET                     `/api/products/all`                   Fetch products

  GET                     `/api/categories/all`                 Fetch categories
  -------------------------------------------------------------------------------------

Authentication endpoints for registration, login, verification, logout,
and password recovery are also part of the backend; check your route
files for exact paths.

**Route order:** Define `/all` and `/track/:trackingNumber` before
`/:id` in `orderRoutes.js`. Protect the all-orders route with
authentication and admin-role authorization. Ensure your `isAdmin`
middleware exists and its import/export matches your code.

## Order workflow

1.  The customer adds products to the cart.
2.  The customer enters shipping information and selects a payment
    method.
3.  The frontend submits the order with the user's authentication token.
4.  The backend saves the order and generates a tracking number such as
    `SZT-XXXXXXXX`.
5.  The customer can view personal orders or track an order.
6.  The admin can view all orders when the admin-protected route is
    configured.

The checkout UI includes an online-payment choice, but that alone does
**not** confirm that a payment gateway is integrated. Connect and test a
payment provider before accepting real online payments.

## Screenshots and demo

Add screenshots before publishing, for example: -
`docs/screenshots/homepage.png` -
`docs/screenshots/product-details.png` -
`docs/screenshots/cart-checkout.png` -
`docs/screenshots/admin-dashboard.png` -
`docs/screenshots/admin-orders.png`

Add your deployed demo URL here when available: `<your-live-demo-url>`.

## Deployment and security notes

-   Never upload `.env` files, API keys, JWT secrets, SMTP passwords, or
    database credentials to GitHub.
-   Add `.env` to `.gitignore` and commit an `.env.example` with
    placeholders only.
-   Configure CORS for the deployed frontend domain.
-   Configure Cloudinary and SMTP only if those integrations are used.
-   Validate product prices, stock, order totals, and shipping data on
    the server; do not trust totals sent by the client.
-   Protect admin-only endpoints with role-based authorization.
-   Test order status updates and online payments before describing them
    as production-ready.
-   Use HTTPS and secure token/cookie practices in production.

## Future improvements

-   Integrate and verify a payment gateway
-   Add pagination and server-side order filters
-   Add real-time admin notifications using WebSockets or Server-Sent
    Events
-   Add automated tests for authentication, products, checkout, and
    orders
-   Deploy the application and add a public demo

## Author

**Muhammad Shakir**

-   Portfolio: https://portfolio-muhammad-shakir.vercel.app/
-   GitHub: https://github.com/MShakir7852
-   LinkedIn: https://www.linkedin.com/in/muhammad-shakir-2a8242264/

## License

Choose a license before publishing publicly. If you want others to reuse
your code, consider adding an MIT `LICENSE` file after confirming it
suits your project.
