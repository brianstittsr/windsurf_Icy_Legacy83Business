/**
 * GoHighLevel Workflows (Automations) API
 *
 * GET: List workflow automations for a given integration (for populating workflow selectors)
 */

import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, GHLIntegrationDoc } from "@/lib/schema";
import { GoHighLevelService } from "@/lib/gohighlevel-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get("integrationId");

    if (!integrationId) {
      return NextResponse.json(
        { success: false, error: "integrationId is required" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    const integrationSnap = await getDoc(doc(db, COLLECTIONS.GHL_INTEGRATIONS, integrationId));
    if (!integrationSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Integration not found" },
        { status: 404 }
      );
    }

    const integration = integrationSnap.data() as GHLIntegrationDoc;
    const ghlService = new GoHighLevelService({
      apiToken: integration.apiToken,
      locationId: integration.locationId,
      agencyId: integration.agencyId,
    });

    const result = await ghlService.getWorkflows();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to fetch workflows" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, workflows: result.data?.workflows || [] });
  } catch (error) {
    console.error("Error fetching GHL workflows:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
