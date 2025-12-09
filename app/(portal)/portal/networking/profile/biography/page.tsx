"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  MapPin,
  Briefcase,
  Heart,
  Lightbulb,
  CheckCircle,
  Info,
} from "lucide-react";

interface BiographyForm {
  // Business Information
  businessName: string;
  profession: string;
  location: string;
  yearsInBusiness: string;
  previousJobs: string;
  
  // Personal Information
  spouse: string;
  children: string;
  pets: string;
  hobbies: string;
  activitiesOfInterest: string;
  cityOfResidence: string;
  yearsInCity: string;
  
  // Miscellaneous
  burningDesire: string;
  uniqueFact: string;
}

const initialForm: BiographyForm = {
  businessName: "",
  profession: "",
  location: "",
  yearsInBusiness: "",
  previousJobs: "",
  spouse: "",
  children: "",
  pets: "",
  hobbies: "",
  activitiesOfInterest: "",
  cityOfResidence: "",
  yearsInCity: "",
  burningDesire: "",
  uniqueFact: "",
};

export default function BiographyPage() {
  const [form, setForm] = useState<BiographyForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateField = (field: keyof BiographyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Save to Firebase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const completedFields = Object.values(form).filter((v) => v.trim() !== "").length;
  const totalFields = Object.keys(form).length;
  const completionPercent = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portal/networking/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Member Biography</h1>
            <p className="text-muted-foreground">
              Help other affiliates get to know you and your business
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Saved!
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            {completionPercent}% Complete
          </Badge>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Biography"}
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Why This Matters</h3>
              <p className="text-sm text-blue-700">
                Your biography helps other affiliates understand your business and find common ground. 
                The more they know about you, the better they can refer ideal clients to you. 
                Update this every 3-6 months to keep it current.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Tell us about your business and professional background</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Your company or business name"
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                placeholder="e.g., Manufacturing Consultant, ISO Auditor"
                value={form.profession}
                onChange={(e) => updateField("profession", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Business Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsInBusiness">Years in Business</Label>
              <Input
                id="yearsInBusiness"
                type="number"
                placeholder="e.g., 15"
                value={form.yearsInBusiness}
                onChange={(e) => updateField("yearsInBusiness", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousJobs">Previous Types of Jobs</Label>
            <Textarea
              id="previousJobs"
              placeholder="List your previous roles and industries (helps partners understand your background and network)"
              value={form.previousJobs}
              onChange={(e) => updateField("previousJobs", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Example: "Plant Manager at Ford, Quality Engineer at Boeing, Operations Director at a tier-1 supplier"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Help partners connect with you on a personal level</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="spouse">Spouse / Significant Other</Label>
              <Input
                id="spouse"
                placeholder="Name (optional)"
                value={form.spouse}
                onChange={(e) => updateField("spouse", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                placeholder="e.g., 2 kids, ages 8 and 12"
                value={form.children}
                onChange={(e) => updateField("children", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pets">Pets</Label>
              <Input
                id="pets"
                placeholder="e.g., Golden Retriever named Max"
                value={form.pets}
                onChange={(e) => updateField("pets", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hobbies">Hobbies</Label>
            <Textarea
              id="hobbies"
              placeholder="What do you enjoy doing in your free time?"
              value={form.hobbies}
              onChange={(e) => updateField("hobbies", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activitiesOfInterest">Activities of Interest</Label>
            <Textarea
              id="activitiesOfInterest"
              placeholder="Sports, clubs, volunteer work, community involvement..."
              value={form.activitiesOfInterest}
              onChange={(e) => updateField("activitiesOfInterest", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cityOfResidence">City of Residence</Label>
              <Input
                id="cityOfResidence"
                placeholder="Where do you live?"
                value={form.cityOfResidence}
                onChange={(e) => updateField("cityOfResidence", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsInCity">How Long?</Label>
              <Input
                id="yearsInCity"
                placeholder="Years in this city"
                value={form.yearsInCity}
                onChange={(e) => updateField("yearsInCity", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Miscellaneous */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <CardTitle>Miscellaneous</CardTitle>
              <CardDescription>Share what drives you and something unique about yourself</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="burningDesire">My Burning Desire Is To...</Label>
            <Textarea
              id="burningDesire"
              placeholder="What's your biggest goal or dream? What motivates you every day?"
              value={form.burningDesire}
              onChange={(e) => updateField("burningDesire", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This helps partners understand what success looks like for you
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uniqueFact">Something No One Knows About Me</Label>
            <Textarea
              id="uniqueFact"
              placeholder="A fun fact, hidden talent, or interesting story about yourself"
              value={form.uniqueFact}
              onChange={(e) => updateField("uniqueFact", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Great conversation starter for one-to-one meetings!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Link href="/portal/networking/profile">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Biography"}
        </Button>
      </div>
    </div>
  );
}
