import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const collegeId = Number(id);

    if (Number.isNaN(collegeId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid college ID",
        },
        { status: 400 }
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

    return NextResponse.json({
      success: true,
      data: college,
    });
  } catch (error) {
    console.error("GET /api/colleges/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch college",
      },
      { status: 500 }
    );
  }
}