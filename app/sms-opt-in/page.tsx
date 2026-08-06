import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, User } from "lucide-react";

export const metadata = {
  title: "SMS Opt-In | Legacy 83 Business",
  description: "Opt-in to receive SMS messages from Legacy 83 Business Inc.",
};

export default function SmsOptInPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">SMS Messaging Opt-In</CardTitle>
            <CardDescription className="text-lg">
              From Legacy 83 Business Inc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              By submitting this form, you consent to receive SMS text messages from{" "}
              <strong>Legacy 83 Business Inc</strong> at the phone number you provide. These messages may include appointment confirmations, reminders, responses to service inquiries, and marketing promotions about special offers, discounts, and service updates. Message frequency may vary. Message and data rates may apply. You must be at least 18 years old to opt in. Reply STOP to opt out at any time. Text HELP for assistance. View our{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
              and{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>

            <form className="space-y-4" action="/api/sms-opt-in" method="POST">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="h-4 w-4 inline mr-1" />
                  Full Name *
                </Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </Label>
                <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="sms-consent-transactional"
                    name="smsConsentTransactional"
                    value="on"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="sms-consent-transactional"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I consent to receive non-marketing text messages from Legacy 83 Business Inc. Message types include appointment confirmations, reminders, and responses to service inquiries. Message frequency may vary. Message and data rates may apply. I am at least 18 years of age. Reply STOP to opt out. Text HELP for assistance.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="sms-consent-marketing"
                    name="smsConsentMarketing"
                    value="on"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="sms-consent-marketing"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I consent to receive marketing text messages from Legacy 83 Business Inc. Message types include special offers, discounts, and service updates. Message frequency may vary. Message and data rates may apply. I am at least 18 years of age. Reply STOP to opt out. Text HELP for assistance.
                  </label>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Your consent is optional and not required to use our services. You may opt out at any time by replying STOP to messages from Legacy 83 Business Inc. For assistance, text HELP. View our{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
                and{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
              </p>

              <Button type="submit" className="w-full">
                Submit Opt-In
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            <strong>Legacy 83 Business Inc</strong> · EIN: 84-3055745
          </p>
          <p>4724 Vine Street, Cincinnati, OH 45217</p>
          <p>
            Phone: <a href="tel:+15133351978" className="text-primary hover:underline">(513) 335-1978</a>
            {" · "}
            Email: <a href="mailto:info@legacy83business.com" className="text-primary hover:underline">info@legacy83business.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
