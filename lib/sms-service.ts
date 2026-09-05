import { adminDb } from "@/lib/firebase-admin";
import { COLLECTIONS } from "@/lib/schema";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Send an SMS notification to one or more phone numbers.
 * Currently supports Twilio (set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER).
 * Falls back to logging if no provider is configured.
 */
interface SmsOptions {
  to: string | string[];
  body: string;
  fromNumber?: string;
}

export async function sendSmsNotification({ to, body, fromNumber }: SmsOptions): Promise<{ sent: number; failed: number }> {
  const recipients = Array.isArray(to) ? to : [to];
  const from = fromNumber || process.env.TWILIO_PHONE_NUMBER;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  let sent = 0;
  let failed = 0;

  for (const number of recipients) {
    try {
      if (!accountSid || !authToken || !from) {
        console.warn("SMS not configured. Would send:", { to: number, from, body });
        failed++;
        continue;
      }

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: number,
            From: from,
            Body: body,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SMS send failed to ${number}:`, response.status, errorText);
        failed++;
      } else {
        sent++;
      }

      // Log the attempt in Firestore for audit
      if (adminDb) {
        await adminDb.collection(COLLECTIONS.SMS_OPT_INS).add({
          phoneNumber: number,
          message: body,
          direction: "outbound",
          status: response.ok ? "sent" : "failed",
          provider: "twilio",
          error: response.ok ? null : await response.text(),
          createdAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error(`Error sending SMS to ${number}:`, error);
      failed++;
    }
  }

  return { sent, failed };
}
