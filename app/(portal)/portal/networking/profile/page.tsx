"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Target,
  Users,
  Briefcase,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  FileText,
} from "lucide-react";

// Profile sections with completion status
const profileSections = [
  {
    id: "biography",
    title: "Member Biography",
    description: "Your business and personal information to help others know you better",
    icon: User,
    href: "/portal/networking/profile/biography",
    fields: ["Business Name", "Profession", "Location", "Personal Info"],
    isComplete: false,
    lastUpdated: null,
  },
  {
    id: "gains",
    title: "GAINS Profile",
    description: "Goals, Accomplishments, Interests, Networks, and Skills",
    icon: Target,
    href: "/portal/networking/profile/gains",
    fields: ["Goals", "Accomplishments", "Interests", "Networks", "Skills"],
    isComplete: false,
    lastUpdated: null,
  },
  {
    id: "contact-sphere",
    title: "Contact Sphere",
    description: "Your network of complementary businesses and referral partners",
    icon: Users,
    href: "/portal/networking/profile/contact-sphere",
    fields: ["Sphere Name", "Top 10 Members", "Top 3 Professions Needed"],
    isComplete: false,
    lastUpdated: null,
  },
  {
    id: "customers",
    title: "Previous 10 Customers",
    description: "Help partners understand who your ideal clients are",
    icon: Briefcase,
    href: "/portal/networking/profile/customers",
    fields: ["Customer List", "Services Provided", "Ideal Client Flags"],
    isComplete: false,
    lastUpdated: null,
  },
];

export default function NetworkingProfilePage() {
  const completedSections = profileSections.filter((s) => s.isComplete).length;
  const totalSections = profileSections.length;
  const completionPercent = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Networking Profile</h1>
          <p className="text-muted-foreground">
            Complete your profile to help other affiliates find referrals for you
          </p>
        </div>
        <Link href="/portal/networking">
          <Button variant="outline">
            Back to Networking
          </Button>
        </Link>
      </div>

      {/* Profile Completion Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile Completion</h2>
                <p className="text-sm text-muted-foreground">
                  {completedSections} of {totalSections} sections complete
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary">{completionPercent}%</span>
            </div>
          </div>
          <Progress value={completionPercent} className="h-3" />
          {completionPercent < 100 && (
            <p className="text-sm text-muted-foreground mt-3">
              <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
              Complete your profile to get better AI-matched one-to-one suggestions!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Why Complete Your Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Complete Your Profile?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Better Matches</h3>
                <p className="text-sm text-muted-foreground">
                  AI uses your profile to suggest the best one-to-one partners
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">More Referrals</h3>
                <p className="text-sm text-muted-foreground">
                  Partners can find ideal referrals for you when they know your business
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Meaningful Conversations</h3>
                <p className="text-sm text-muted-foreground">
                  Come to one-to-ones prepared with talking points
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {profileSections.map((section) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.isComplete ? 'bg-green-100' : 'bg-muted'}`}>
                    <section.icon className={`h-5 w-5 ${section.isComplete ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
                {section.isComplete ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Incomplete
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {section.fields.map((field) => (
                  <Badge key={field} variant="secondary" className="text-xs">
                    {field}
                  </Badge>
                ))}
              </div>
              {section.lastUpdated && (
                <p className="text-xs text-muted-foreground mb-3">
                  Last updated: {section.lastUpdated}
                </p>
              )}
              <Link href={section.href}>
                <Button className="w-full" variant={section.isComplete ? "outline" : "default"}>
                  {section.isComplete ? "Edit" : "Complete"} {section.title}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Tips for Effective One-to-Ones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Update your worksheets every 3-6 months</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Share your worksheets with partners before meetings</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Bring testimonials and brochures to share</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm">Commit to one short-term and one long-term referral</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
