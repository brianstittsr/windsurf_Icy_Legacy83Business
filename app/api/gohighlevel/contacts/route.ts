/**
 * GoHighLevel Contacts API (synced/local copy)
 *
 * GET: List synced GHL contacts from Firestore
 */

import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, GHLContactDoc } from "@/lib/schema";

function serializeContact(contact: GHLContactDoc): Record<string, unknown> {
  return {
    ...contact,
    lastSyncedAt: (contact.lastSyncedAt as unknown as { toDate?: () => Date })?.toDate?.()?.toISOString() || contact.lastSyncedAt,
    createdAt: (contact.createdAt as unknown as { toDate?: () => Date })?.toDate?.()?.toISOString() || contact.createdAt,
    updatedAt: (contact.updatedAt as unknown as { toDate?: () => Date })?.toDate?.()?.toISOString() || contact.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ success: true, contacts: [] });
    }

    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get("integrationId");

    const contactsCollection = collection(db, COLLECTIONS.GHL_CONTACTS);
    const contactsQuery = integrationId
      ? query(contactsCollection, where("integrationId", "==", integrationId))
      : contactsCollection;

    const snapshot = await getDocs(contactsQuery);
    const contacts = snapshot.docs.map((doc) => {
      const data = doc.data() as GHLContactDoc;
      return serializeContact({ ...data, id: doc.id });
    });

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching GHL contacts:", error);
    return NextResponse.json({ success: true, contacts: [] });
  }
}
