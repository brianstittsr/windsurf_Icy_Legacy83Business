/**
 * GoHighLevel Add Contacts to Campaign API
 *
 * POST: Adds one or more synced GHL contacts to a marketing campaign
 * Body: { integrationId: string; campaignId: string; contactIds: string[] }
 * `contactIds` are Firestore doc ids from the GHL_CONTACTS collection.
 */

import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, GHLIntegrationDoc, GHLContactDoc } from "@/lib/schema";
import { GoHighLevelService } from "@/lib/gohighlevel-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { integrationId, campaignId, contactIds } = body as {
      integrationId?: string;
      campaignId?: string;
      contactIds?: string[];
    };

    if (!integrationId || !campaignId || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "integrationId, campaignId, and contactIds[] are required" },
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

    const results: Array<{ contactId: string; success: boolean; error?: string }> = [];

    for (const contactDocId of contactIds) {
      const contactRef = doc(db, COLLECTIONS.GHL_CONTACTS, contactDocId);
      const contactSnap = await getDoc(contactRef);

      if (!contactSnap.exists()) {
        results.push({ contactId: contactDocId, success: false, error: "Contact not found" });
        continue;
      }

      const contact = contactSnap.data() as GHLContactDoc;
      const response = await ghlService.addContactToCampaign(contact.ghlContactId, campaignId);

      if (response.success) {
        await updateDoc(contactRef, {
          campaignIds: arrayUnion(campaignId),
          updatedAt: Timestamp.now(),
        });
        results.push({ contactId: contactDocId, success: true });
      } else {
        results.push({ contactId: contactDocId, success: false, error: response.error });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: failureCount === 0,
      summary: { total: results.length, succeeded: successCount, failed: failureCount },
      results,
    });
  } catch (error) {
    console.error("Error adding contacts to GHL campaign:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
