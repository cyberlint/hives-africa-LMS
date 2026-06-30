After adding `itemType` and `itemId` to the `Payment` model in `prisma/schema.prisma`, run a Prisma migration and regenerate the client.

1. Create and apply a migration (development):

```bash
npx prisma migrate dev --name add-payment-itemtype-itemid
```

2. Regenerate Prisma Client (if not done by migrate):

```bash
npx prisma generate
```

3. If you need to backfill existing payments, run a script that sets `itemType`/`itemId` from `courseId` or other known references. Example (pseudo):

- For course payments: set `itemType = 'Course'` and `itemId = courseId` where courseId is present.

4. Deploy migrations to production using your usual CI/CD flow (do not run `migrate dev` in production). Use `prisma migrate deploy` with a proper `DATABASE_URL`.

Make sure to back up your production database before applying migrations.