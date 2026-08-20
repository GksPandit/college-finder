import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

function getUserId(request: NextRequest): number | null {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
    };

    return decoded.userId;
  } catch {
    return null;
  }
}

// GET reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const collegeId = Number(
      searchParams.get("collegeId")
    );

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required",
        },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        collegeId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

// POST review
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const collegeId = Number(body.collegeId);
    const rating = Number(body.rating);
    const comment = String(body.comment || "").trim();

    if (!collegeId || !rating || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: "College, rating and comment are required",
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const college = await prisma.college.findUnique({
      where: {
        id: collegeId,
      },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found",
        },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userName: user.name,
        rating,
        comment,
        collegeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review added successfully",
        data: review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create review error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create review",
      },
      { status: 500 }
    );
  }
}