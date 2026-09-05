import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { COLLECTIONS } from "@/lib/schema";
import { Timestamp } from "firebase-admin/firestore";

interface ScheduleBody {
  id?: string;
  title: string;
  content: string;
  hashtags?: string;
  images: string[];
  referenceLinks: unknown[];
  glossary: unknown[];
  scheduledFor: string;
  createdById: string;
  createdByName: string;
}

/** POST /api/linkedin/schedule - save article as scheduled */
export async function POST(request: NextRequest) {
  try {
    const body: ScheduleBody = await request.json();

    if (!body.title || !body.content || !body.scheduledFor || !body.createdById || !body.createdByName) {
      return NextResponse.json(
        { error: "title, content, scheduledFor, createdById and createdByName are required" },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const scheduledDate = new Date(body.scheduledFor);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "Invalid scheduledFor date" }, { status: 400 });
    }

    const now = Timestamp.now();
    const payload = {
      title: body.title,
      content: body.content,
      hashtags: body.hashtags || "",
      images: body.images || [],
      referenceLinks: body.referenceLinks || [],
      glossary: body.glossary || [],
      status: "scheduled",
      scheduledFor: Timestamp.fromDate(scheduledDate),
      createdById: body.createdById,
      createdByName: body.createdByName,
      updatedAt: now,
    };

    let docRef;
    if (body.id) {
      docRef = adminDb.collection(COLLECTIONS.LINKEDIN_ARTICLES).doc(body.id);
      await docRef.update(payload);
    } else {
      docRef = adminDb.collection(COLLECTIONS.LINKEDIN_ARTICLES).doc();
      await docRef.set({
        ...payload,
        publishedAt: null,
        linkedinPostId: null,
        linkedinError: null,
        createdAt: now,
      });
    }

    const saved = await docRef.get();
    return NextResponse.json({ data: { id: docRef.id, ...saved.data() } });
  } catch (error) {
    console.error("[linkedin/schedule] POST error:", error);
    return NextResponse.json(
      { error: "Failed to schedule LinkedIn article" },
      { status: 500 }
    );
  }
}
