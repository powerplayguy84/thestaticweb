import { NextRequest, NextResponse } from "next/server";
import {
  getArticlesRaw,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const articles = getArticlesRaw(category);
    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, category, index, slug, content, oldFilename } =
      await request.json();

    switch (action) {
      case "create":
        createArticle(category, index, slug, content);
        return NextResponse.json({ success: true });

      case "update":
        updateArticle(category, oldFilename, index, slug, content);
        return NextResponse.json({ success: true });

      case "delete":
        deleteArticle(category, oldFilename);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
