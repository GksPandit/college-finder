import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const exam = String(body.exam || "").trim();
    const rank = Number(body.rank);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam is required",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rank) || rank <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Rank must be a positive integer",
        },
        { status: 400 }
      );
    }

    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam: {
          equals: exam,
          mode: "insensitive",
        },
        minRank: {
          lte: rank,
        },
        maxRank: {
          gte: rank,
        },
      },
      include: {
        college: true,
      },
    });

    const recommendations = cutoffs.map((cutoff) => {
      const distance = Math.abs(rank - cutoff.minRank);

      let category = "Safe";

      if (distance <= 500) {
        category = "Dream";
      } else if (distance <= 2000) {
        category = "Target";
      }

      return {
        category,
        college: cutoff.college,
        cutoff: {
          exam: cutoff.exam,
          minRank: cutoff.minRank,
          maxRank: cutoff.maxRank,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Predictor API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate predictions",
      },
      { status: 500 }
    );
  }
}