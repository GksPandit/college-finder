import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const minRating = searchParams.get("minRating") || "";

    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "6");

    const sort = searchParams.get("sort") || "rating";

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  location: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {},

        location
          ? {
              location: {
                contains: location,
                mode: "insensitive" as const,
              },
            }
          : {},

        minRating
          ? {
              rating: {
                gte: Number(minRating),
              },
            }
          : {},
      ],
    };

    let orderBy;

    switch (sort) {
      case "rating":
        orderBy = {
          rating: "desc" as const,
        };
        break;

      case "fees-low":
        orderBy = {
          fees: "asc" as const,
        };
        break;

      case "fees-high":
        orderBy = {
          fees: "desc" as const,
        };
        break;

      case "placement":
        orderBy = {
          placementAverage: "desc" as const,
        };
        break;

      default:
        orderBy = {
          rating: "desc" as const,
        };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),

      prisma.college.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("College API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch colleges",
      },
      {
        status: 500,
      }
    );
  }
}