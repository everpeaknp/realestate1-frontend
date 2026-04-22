This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Setup

First, set up your environment variables:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your backend API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

For detailed environment configuration, see [ENV_SETUP.md](./ENV_SETUP.md).

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run Development Server

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

This project uses environment variables for configuration. See [ENV_SETUP.md](./ENV_SETUP.md) for complete documentation.

**Required Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and API configuration
│   │   ├── api.ts       # Centralized API endpoints
│   │   └── utils.ts     # Helper functions
│   └── styles/          # Global styles
├── public/              # Static assets
├── .env.example         # Environment variables template
├── .env.local          # Local environment (not committed)
└── ENV_SETUP.md        # Environment setup guide
```

## API Integration

All API calls use the centralized configuration in `src/lib/api.ts`:

```typescript
import { API_ENDPOINTS, apiRequest } from '@/lib/api';

// Example: Chatbot API call
const response = await apiRequest(API_ENDPOINTS.chatbot.chat, {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' }),
});
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
