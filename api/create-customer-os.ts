import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function POST() {
  try {
    const templateId = process.env.NOTION_CUSTOMER_TEMPLATE_ID;

    if (!templateId) {
      return NextResponse.json(
        { error: "Missing NOTION_CUSTOMER_TEMPLATE_ID" },
        { status: 500 }
      );
    }

    // Duplicate the Customer Edition page
    const duplicated = await notion.pages.create({
      parent: { type: "page_id", page_id: templateId },
      properties: {},
    });

    return NextResponse.json({
      success: true,
      newPageId: duplicated.id,
      url: duplicated.url,
    });
  } catch (error: any) {
    console.error("Error duplicating customer OS:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
