/**
 * API Route to set up Icy Williams as Admin
 * POST /api/setup-icy-admin
 * 
 * Creates User document and links to Firebase Auth account
 */

import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

const ICY_EMAIL = "info@legacy83business.com";

export async function POST() {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const now = Timestamp.now();

    // 1. Find or get the Firebase Auth user by email
    let authUser;
    try {
      authUser = await auth.getUserByEmail(ICY_EMAIL);
      console.log("Found existing Auth user:", authUser.uid);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // Create new Auth user if doesn't exist
        authUser = await auth.createUser({
          email: ICY_EMAIL,
          displayName: "Icy Williams",
          emailVerified: true,
        });
        console.log("Created new Auth user:", authUser.uid);
      } else {
        throw error;
      }
    }

    const ICY_UID = authUser.uid;

    // 2. Create/update user document with Admin role
    const userRef = db.collection("users").doc(ICY_UID);
    await userRef.set({
      id: ICY_UID,
      email: ICY_EMAIL,
      firstName: "Icy",
      lastName: "Williams",
      displayName: "Icy Williams",
      role: "admin",
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastActive: now,
    }, { merge: true });

    // 3. Find existing team member by email and link, or create new one
    const teamMembersRef = db.collection("teamMembers");
    const snapshot = await teamMembersRef.where("emailPrimary", "==", ICY_EMAIL).get();

    let teamMemberId = null;

    if (!snapshot.empty) {
      // Update existing team member
      const teamMemberDoc = snapshot.docs[0];
      teamMemberId = teamMemberDoc.id;
      
      await teamMemberDoc.ref.update({
        authUid: ICY_UID,
        role: "admin",
        updatedAt: now,
      });
      console.log("Updated existing team member:", teamMemberId);
    } else {
      // Create new team member
      const newTeamMemberRef = await teamMembersRef.add({
        authUid: ICY_UID,
        emailPrimary: ICY_EMAIL,
        firstName: "Icy",
        lastName: "Williams",
        role: "admin",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
      teamMemberId = newTeamMemberRef.id;
      console.log("Created new team member:", teamMemberId);
    }

    return NextResponse.json({
      success: true,
      message: "Icy Williams Admin setup complete",
      data: {
        email: ICY_EMAIL,
        uid: ICY_UID,
        teamMemberId,
        role: "admin",
      },
    });

  } catch (error) {
    console.error("Error setting up Icy Williams Admin:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to set up Icy Williams as Admin",
    endpoint: "/api/setup-icy-admin",
  });
}
