/**
 * Single Schedule API Routes
 * GET - Get schedule details
 * PUT - Update schedule
 * DELETE - Delete schedule
 */

import { NextRequest, NextResponse } from "next/server";
import { backupScheduler } from "@/lib/services/backup-scheduler";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schedule = await backupScheduler.getSchedule(params.id);

    if (!schedule) {
      return NextResponse.json(
        { success: false, error: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Handle enable/disable action
    if (body.action === "toggle") {
      await backupScheduler.setScheduleEnabled(params.id, body.enabled);
      return NextResponse.json({
        success: true,
        message: body.enabled ? "Schedule enabled" : "Schedule disabled",
      });
    }

    // Update schedule
    await backupScheduler.updateSchedule(params.id, body);

    return NextResponse.json({
      success: true,
      message: "Schedule updated",
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await backupScheduler.deleteSchedule(params.id);

    return NextResponse.json({
      success: true,
      message: "Schedule deleted",
    });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
