This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Backend Setup (Strapi)

This project is designed to work with a [Strapi](https://strapi.io/) backend.

### Environment Variables

To run this project, you will need to create a `.env.local` file in the root of your project and add the following environment variables:

```
# The base URL of your Strapi installation
STRAPI_API_URL=http://your-strapi-server-ip:1337

# The API token for accessing the Strapi API
# (Create this in Strapi: Settings -> API Tokens)
STRAPI_API_TOKEN=your-strapi-api-token
```

You will also need to set these variables in your deployment environment (e.g., Vercel).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

### Old WooCommerce Backend (Deprecated)

The project was previously configured to use a WordPress + WooCommerce backend. This is no longer the case. The following variables are deprecated and no longer used:

-   `WOO_BASE_URL`
-   `WOO_CONSUMER_KEY`
-   `WOO_CONSUMER_SECRET`
