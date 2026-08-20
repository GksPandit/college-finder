import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const collegeId = Number(searchParams.get("collegeId"));

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required",
        },
        { status: 400 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        collegeId,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}