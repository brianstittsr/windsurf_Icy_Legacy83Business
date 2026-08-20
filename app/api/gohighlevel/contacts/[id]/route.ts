/**
 * GoHighLevel Contact Detail API
 *
 * GET: Fetch a single synced GHL contact by its Firestore doc id
 */

import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, GHLContactDoc } from "@/lib/schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function serializeContact(contact: GHLContactDoc): Record<string, unknown> {
  return {
    ...contact,
    lastSyncedAt: (contact.lastSyncedAt as unknown as { toDate?: () => Date })?.toDate?.()?.toISOString() || contact.lastSyncedAt,
    createdAt: (contact.createdAt as unknown as { toDate?: () => Date })?.toDate?.()?.toISOString() || contact.createdAt,
    updatedAt: (contact.updatedAt as unknown as { toDate?: () => Date })?.toDate?.()?.toISOString() || contact.updatedAt,
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    const docRef = doc(db, COLLECTIONS.GHL_CONTACTS, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    const contact = { ...(docSnap.data() as GHLContactDoc), id: docSnap.id };

    return NextResponse.json({ success: true, contact: serializeContact(contact) });
  } catch (error) {
    console.error("Error fetching GHL contact:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
