import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const courses = [
    {
      collegeId: 1,
      name: "B.Tech Computer Science Engineering",
      duration: "4 Years",
      fees: 120000,
    },
    {
      collegeId: 1,
      name: "B.Tech Electronics & Communication",
      duration: "4 Years",
      fees: 120000,
    },
    {
      collegeId: 2,
      name: "B.Tech Computer Science Engineering",
      duration: "4 Years",
      fees: 110000,
    },
    {
      collegeId: 2,
      name: "B.Tech Electrical Engineering",
      duration: "4 Years",
      fees: 110000,
    },
    {
      collegeId: 3,
      name: "B.Tech Computer Science Engineering",
      duration: "4 Years",
      fees: 115000,
    },
    {
      collegeId: 3,
      name: "B.Tech Mechanical Engineering",
      duration: "4 Years",
      fees: 115000,
    },
    {
      collegeId: 4,
      name: "B.Tech Computer Science Engineering",
      duration: "4 Years",
      fees: 100000,
    },
    {
      collegeId: 4,
      name: "B.Tech Electrical Engineering",
      duration: "4 Years",
      fees: 100000,
    },
    {
      collegeId: 5,
      name: "B.Tech Computer Science Engineering",
      duration: "4 Years",
      fees: 105000,
    },
    {
      collegeId: 5,
      name: "B.Tech Electronics Engineering",
      duration: "4 Years",
      fees: 105000,
    },
    {
      collegeId: 6,
      name: "B.E. Computer Science",
      duration: "4 Years",
      fees: 520000,
    },
    {
      collegeId: 6,
      name: "B.E. Electronics & Instrumentation",
      duration: "4 Years",
      fees: 520000,
    },
  ];

  await prisma.course.deleteMany();

  await prisma.course.createMany({
    data: courses,
  });

  console.log("Courses added successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });