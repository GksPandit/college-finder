import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ??"";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// Get logged-in user ID from JWT cookie
function getUserId(request: NextRequest): number | null {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as{
      userId: number;
    };

    return decoded.userId;
  } catch {
    return null;
  }
}

/* =====================================================
   GET
   Get all saved colleges of logged-in user
===================================================== */

export async function GET(request: NextRequest) {
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

    const savedColleges = await prisma.savedCollege.findMany({
      where: {
        userId,
      },
      include: {
        college: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: savedColleges,
    });
  } catch (error) {
    console.error("Get saved colleges error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch saved colleges",
      },
      { status: 500 }
    );
  }
}

/* =====================================================
   POST
   Save a college
===================================================== */

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

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required",
        },
        { status: 400 }
      );
    }

    // Check whether college exists
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

    // Check whether already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "College already saved",
        },
        { status: 409 }
      );
    }

    // Save college
    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "College saved successfully",
        data: savedCollege,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save college error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save college",
      },
      { status: 500 }
    );
  }
}

/* =====================================================
   DELETE
   Remove a saved college
===================================================== */

export async function DELETE(request: NextRequest) {
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

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required",
        },
        { status: 400 }
      );
    }

    // Check saved college
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "College is not saved",
        },
        { status: 404 }
      );
    }

    // Delete saved college
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "College removed from saved colleges",
    });
  } catch (error) {
    console.error("Remove saved college error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove college",
      },
      { status: 500 }
    );
  }
}