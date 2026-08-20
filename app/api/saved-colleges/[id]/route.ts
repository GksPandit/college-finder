import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

function getUserId(request: NextRequest): number | null {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as unknown as {
      userId: number;
    };

    return decoded.userId;
  } catch {
    return null;
  }
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
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

    const { id } = await context.params;
    const savedCollegeId = Number(id);

    if (!savedCollegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Saved college ID is required",
        },
        { status: 400 }
      );
    }

    const savedCollege =
      await prisma.savedCollege.findUnique({
        where: {
          id: savedCollegeId,
        },
      });

    if (!savedCollege) {
      return NextResponse.json(
        {
          success: false,
          message: "Saved college not found",
        },
        { status: 404 }
      );
    }

    // Make sure user can delete only their own saved college
    if (savedCollege.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    await prisma.savedCollege.delete({
      where: {
        id: savedCollegeId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "College removed from saved list",
    });
  } catch (error) {
    console.error(
      "Remove saved college error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove college",
      },
      { status: 500 }
    );
  }
}