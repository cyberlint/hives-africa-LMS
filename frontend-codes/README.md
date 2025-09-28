This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Checkout & Cart

The checkout flow has evolved into a cart-based multi-course experience:

- Primary cart page: `/checkout` (client-side cart with quantity editing, coupon, summary)
- Single course deep link: `/checkout/<courseId>?slug=<optional-slug>` (still supported; may prefill cart later)
- Coupon: Apply/remove at cart level (currently validated against the first course; discount applied as a flat absolute reduction — future enhancement: proportional allocation)
- Payment: MVP initializes Paystack using the first billable (non-free) course; roadmap includes batch/aggregated payments

Endpoints used:
- `POST /api/payments/coupons/validate/`
- `POST /api/payments/initialize/`
- `POST /api/payments/verify/` (planned in callback integration)
- `GET /api/courses/:slug/` or `/api/courses/:id/`

Environment:
- `NEXT_PUBLIC_API_URL` must point to the Django server root (e.g., `http://localhost:8000`).

Legacy (now redirected internally):
- `http://localhost:3000/checkout?courseId=<uuid>`
- `http://localhost:3000/checkout?slug=<course-slug>`

Current examples:
- `http://localhost:3000/checkout`
- `http://localhost:3000/checkout/12345`


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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
