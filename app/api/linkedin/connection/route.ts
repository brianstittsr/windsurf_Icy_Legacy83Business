import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { COLLECTIONS } from "@/lib/schema";

/** GET /api/linkedin/connection - check current user's LinkedIn connection status */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const snapshot = await adminDb
      .collection(COLLECTIONS.LINKEDIN_CONNECTIONS)
      .where("userId", "==", userId)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ data: { connected: false } });
    }

    const connection = snapshot.docs[0].data();
    const expired =
      connection.expiresAt &&
      typeof connection.expiresAt.toMillis === "function" &&
      connection.expiresAt.toMillis() < Date.now();

    return NextResponse.json({
      data: {
        connected: !expired,
        profileName: connection.profileName || null,
        profileEmail: connection.profileEmail || null,
        profilePicture: connection.profilePicture || null,
      },
    });
  } catch (error) {
    console.error("[linkedin/connection] GET error:", error);
    return NextResponse.json(
      { error: "Failed to check LinkedIn connection" },
      { status: 500 }
    );
  }
}
