import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const templateId = process.env.NOTION_CUSTOMER_TEMPLATE_ID;

    if (!templateId) {
      return res.status(500).json({
        error: "Missing NOTION_CUSTOMER_TEMPLATE_ID",
      });
    }

    const duplicated = await notion.pages.create({
      parent: { type: "page_id", page_id: templateId },
      properties: {},
    });

    // ⭐ FIX: Cast only the url access to any
    const pageUrl = (duplicated as any).url ?? null;

    return res.status(200).json({
      success: true,
      newPageId: duplicated.id,
      url: pageUrl,
    });
  } catch (error: any) {
    console.error("Error duplicating customer OS:", error);
    return res.status(500).json({
      error: error.message || "Unknown error",
    });
  }
}
