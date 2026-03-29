import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding email rules...");

  await prisma.emailRule.upsert({
    where: {
      // unique constraint workaround (we'll rely on combination manually)
      id: "submission-approved-rule",
    },
    update: {},
    create: {
      id: "submission-approved-rule",
      eventType: "Submission_Approved",
      templateKey: "submission_approved",
      delay: 0,
      isActive: true,
    },
  });

  console.log("✅ Email rules seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });