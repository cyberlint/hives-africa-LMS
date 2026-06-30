import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Finding payments with courseId set and missing itemId...');
  const payments = await prisma.payment.findMany({
    where: {
      courseId: { not: null },
      itemId: null,
    },
    select: { id: true, courseId: true },
  });

  console.log(`Found ${payments.length} payments to update`);
  let updated = 0;
  for (const p of payments) {
    await prisma.payment.update({
      where: { id: p.id },
      data: { itemType: 'Course', itemId: p.courseId },
    });
    updated += 1;
  }

  console.log(`Updated ${updated} payments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
