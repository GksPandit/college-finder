import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding cutoff data...");

  const colleges = await prisma.college.findMany();

  const collegeMap = new Map(
    colleges.map((college) => [college.name, college.id])
  );

  const cutoffData = [
    {
      college: "IIT Delhi",
      exam: "JEE Main",
      minRank: 1,
      maxRank: 5000,
    },
    {
      college: "IIT Bombay",
      exam: "JEE Main",
      minRank: 1,
      maxRank: 3000,
    },
    {
      college: "IIT Kanpur",
      exam: "JEE Main",
      minRank: 1,
      maxRank: 7000,
    },
    {
      college: "IIT Madras",
      exam: "JEE Main",
      minRank: 1,
      maxRank: 6000,
    },
    {
      college: "IIT Kharagpur",
      exam: "JEE Main",
      minRank: 1,
      maxRank: 9000,
    },
    {
      college: "BITS Pilani",
      exam: "JEE Main",
      minRank: 1,
      maxRank: 12000,
    },
  ];

  for (const item of cutoffData) {
    const collegeId = collegeMap.get(item.college);

    if (!collegeId) {
      console.log(`College not found: ${item.college}`);
      continue;
    }

    await prisma.cutoff.create({
      data: {
        exam: item.exam,
        minRank: item.minRank,
        maxRank: item.maxRank,
        collegeId,
      },
    });
  }

  console.log("Cutoff data seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });