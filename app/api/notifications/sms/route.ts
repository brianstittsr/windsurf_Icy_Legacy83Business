import { NextRequest, NextResponse } from "next/server";
import { sendSmsNotification } from "@/lib/sms-service";

interface SmsRequestBody {
  to: string | string[];
  body: string;
}

/** POST /api/notifications/sms - send an SMS notification */
export async function POST(request: NextRequest) {
  try {
    const body: SmsRequestBody = await request.json();

    if (!body.to || !body.body) {
      return NextResponse.json(
        { error: "to and body are required" },
        { status: 400 }
      );
    }

    const result = await sendSmsNotification({
      to: body.to,
      body: body.body,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[notifications/sms] error:", error);
    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
