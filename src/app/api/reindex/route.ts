import { NextResponse } from "next/server";

const REINDEX_URL = "https://bot.actonclimate.co/api/admin/reindex";

export async function POST() {
  try {
    const body = new URLSearchParams();
    body.append("api_key", "admin@123");

    const response = await fetch(REINDEX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data?.message || "Failed to update AI data",
          data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: data?.message || "AI data updated successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update AI data",
      },
      { status: 500 },
    );
  }
}
