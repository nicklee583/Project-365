import { getDay } from "@/lib/content";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ day: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { day: dayParam } = await context.params;
  const day = Number(dayParam);
  const content = getDay(day);

  if (!content) {
    return NextResponse.json(
      { error: "Day not found", day: dayParam },
      { status: 404 }
    );
  }

  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
    }
  });
}
