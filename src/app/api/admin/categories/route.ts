import { NextRequest, NextResponse } from "next/server";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  renameCategory,
} from "@/lib/admin";

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, categoryName, oldName, newName } = await request.json();

    switch (action) {
      case "create":
        createCategory(categoryName);
        return NextResponse.json({ success: true });

      case "delete":
        deleteCategory(categoryName);
        return NextResponse.json({ success: true });

      case "rename":
        renameCategory(oldName, newName);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
