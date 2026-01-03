"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/user-profile-context";
import { isSuperAdmin } from "@/lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  LayoutDashboard,
  Target,
  FolderKanban,
  Users,
  Building,
  Calendar,
  CalendarDays,
  CheckSquare,
  FileText,
  Sparkles,
  Settings,
  Activity,
  Handshake,
  Phone,
  Wrench,
  Mic,
  Image,
  Camera,
  Youtube,
  Volume2,
  Globe,
  FileSearch,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";

const SETTINGS_DOC_ID = "platform-settings";

// Sidebar items configuration
const sidebarItems = [
  { key: "commandCenter", label: "Command Center", icon: LayoutDashboard, section: "navigation" },
  { key: "opportunities", label: "Opportunities", icon: Target, section: "navigation" },
  { key: "projects", label: "Projects", icon: FolderKanban, section: "navigation" },
  { key: "affiliates", label: "Affiliates", icon: Users, section: "navigation" },
  { key: "organizations", label: "Organizations", icon: Building, section: "navigation" },
  { key: "calendar", label: "Calendar", icon: Calendar, section: "work" },
  { key: "meetings", label: "Meetings", icon: CalendarDays, section: "work" },
  { key: "rocks", label: "Rocks", icon: CheckSquare, section: "work" },
  { key: "proposals", label: "Proposals", icon: FileText, section: "work" },
  { key: "goHighLevel", label: "GoHighLevel", icon: Sparkles, section: "work" },
  { key: "askIntellEdge", label: "Ask IntellEDGE", icon: Sparkles, section: "intelligence" },
  { key: "teamMembers", label: "Team Members", icon: Users, section: "admin" },
  { key: "strategicPartners", label: "Strategic Partners", icon: Handshake, section: "admin" },
  { key: "bookCallLeads", label: "Book Call Leads", icon: Phone, section: "admin" },
  { key: "settings", label: "Settings", icon: Settings, section: "admin" },
  { key: "activityLog", label: "Activity Log", icon: Activity, section: "admin" },
];

// L83 Tools configuration
const l83Tools = [
  { key: "transcription", label: "Audio Transcription", icon: Mic, description: "Convert audio/video to text" },
  { key: "imageGen", label: "Image Generation", icon: Image, description: "Create images from text" },
  { key: "headshot", label: "AI Headshot Generator", icon: Camera, description: "Create professional headshots" },
  { key: "youtube", label: "YouTube Transcriber", icon: Youtube, description: "Extract YouTube transcripts" },
  { key: "tts", label: "Text-to-Speech", icon: Volume2, description: "Transform text to audio" },
  { key: "crawler", label: "Web Crawler", icon: Globe, description: "Crawl and extract web data" },
  { key: "pdfOcr", label: "PDF Handwriting OCR", icon: FileSearch, description: "Convert handwritten PDFs" },
];

export default function SuperAdminPage() {
  const router = useRouter();
  const { linkedTeamMember } = useUserProfile();
  const currentUserRole = linkedTeamMember?.role || "affiliate";
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Sidebar visibility state
  const [sidebarVisibility, setSidebarVisibility] = useState<Record<string, boolean>>({
    navigation: true,
    work: true,
    intelligence: true,
    admin: true,
    initiatives: true,
    commandCenter: true,
    opportunities: true,
    projects: true,
    affiliates: true,
    organizations: true,
    calendar: true,
    meetings: true,
    rocks: true,
    proposals: true,
    goHighLevel: true,
    askIntellEdge: true,
    teamMembers: true,
    strategicPartners: true,
    bookCallLeads: true,
    settings: true,
    activityLog: true,
  });
  
  // L83 Tools visibility state
  const [l83ToolsVisibility, setL83ToolsVisibility] = useState<Record<string, boolean>>({
    transcription: true,
    imageGen: true,
    headshot: true,
    youtube: true,
    tts: true,
    crawler: true,
    pdfOcr: true,
  });

  // Check if user is superadmin
  useEffect(() => {
    if (!isSuperAdmin(currentUserRole)) {
      toast.error("Access denied. SuperAdmin privileges required.");
      router.push("/portal");
    }
  }, [currentUserRole, router]);

  // Load settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      
      try {
        const docRef = doc(db, COLLECTIONS.PLATFORM_SETTINGS, SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.sidebarVisibility) {
            setSidebarVisibility(prev => ({ ...prev, ...data.sidebarVisibility }));
          }
          if (data.l83ToolsVisibility) {
            setL83ToolsVisibility(prev => ({ ...prev, ...data.l83ToolsVisibility }));
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Error loading settings");
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings to Firebase
  const saveSettings = async () => {
    if (!db) {
      toast.error("Firebase not initialized");
      return;
    }
    
    setSaving(true);
    try {
      const docRef = doc(db, COLLECTIONS.PLATFORM_SETTINGS, SETTINGS_DOC_ID);
      await setDoc(docRef, {
        sidebarVisibility,
        l83ToolsVisibility,
        updatedAt: Timestamp.now(),
        updatedBy: linkedTeamMember?.id || "unknown",
      }, { merge: true });
      
      setHasChanges(false);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Toggle sidebar item visibility
  const toggleSidebarItem = (key: string) => {
    setSidebarVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  // Toggle L83 tool visibility
  const toggleL83Tool = (key: string) => {
    setL83ToolsVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  // Toggle all items in a section
  const toggleSection = (section: string, enabled: boolean) => {
    const sectionItems = sidebarItems.filter(item => item.section === section);
    const updates: Record<string, boolean> = { [section]: enabled };
    sectionItems.forEach(item => {
      updates[item.key] = enabled;
    });
    setSidebarVisibility(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  // Toggle all L83 tools
  const toggleAllL83Tools = (enabled: boolean) => {
    const updates: Record<string, boolean> = {};
    l83Tools.forEach(tool => {
      updates[tool.key] = enabled;
    });
    setL83ToolsVisibility(updates);
    setHasChanges(true);
  };

  if (!isSuperAdmin(currentUserRole)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need SuperAdmin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">SuperAdmin Controls</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Configure platform visibility and access controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              Unsaved Changes
            </Badge>
          )}
          <Button onClick={saveSettings} disabled={saving || !hasChanges}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sidebar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sidebar">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Sidebar Visibility
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Wrench className="h-4 w-4 mr-2" />
            L83 Tools
          </TabsTrigger>
        </TabsList>

        {/* Sidebar Visibility Tab */}
        <TabsContent value="sidebar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Navigation Visibility</CardTitle>
              <CardDescription>
                Control which navigation items are visible to all users in the portal sidebar.
                Disabled items will be hidden from the sidebar for everyone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Navigation Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Navigation</h3>
                    <Badge variant="outline">
                      {sidebarItems.filter(i => i.section === "navigation" && sidebarVisibility[i.key]).length}/
                      {sidebarItems.filter(i => i.section === "navigation").length} visible
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleSection("navigation", true)}>
                      Enable All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleSection("navigation", false)}>
                      Disable All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sidebarItems.filter(item => item.section === "navigation").map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor={item.key}>{item.label}</Label>
                      </div>
                      <Switch
                        id={item.key}
                        checked={sidebarVisibility[item.key]}
                        onCheckedChange={() => toggleSidebarItem(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Work Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Work</h3>
                    <Badge variant="outline">
                      {sidebarItems.filter(i => i.section === "work" && sidebarVisibility[i.key]).length}/
                      {sidebarItems.filter(i => i.section === "work").length} visible
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleSection("work", true)}>
                      Enable All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleSection("work", false)}>
                      Disable All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sidebarItems.filter(item => item.section === "work").map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor={item.key}>{item.label}</Label>
                      </div>
                      <Switch
                        id={item.key}
                        checked={sidebarVisibility[item.key]}
                        onCheckedChange={() => toggleSidebarItem(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Admin Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Admin</h3>
                    <Badge variant="outline">
                      {sidebarItems.filter(i => i.section === "admin" && sidebarVisibility[i.key]).length}/
                      {sidebarItems.filter(i => i.section === "admin").length} visible
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleSection("admin", true)}>
                      Enable All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleSection("admin", false)}>
                      Disable All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sidebarItems.filter(item => item.section === "admin").map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor={item.key}>{item.label}</Label>
                      </div>
                      <Switch
                        id={item.key}
                        checked={sidebarVisibility[item.key]}
                        onCheckedChange={() => toggleSidebarItem(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* L83 Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>L83 Tools Visibility</CardTitle>
              <CardDescription>
                Control which L83 Tools are available to users. Disabled tools will be hidden
                from the tools section in user profiles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">
                  {Object.values(l83ToolsVisibility).filter(Boolean).length}/{l83Tools.length} tools enabled
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleAllL83Tools(true)}>
                    Enable All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleAllL83Tools(false)}>
                    Disable All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {l83Tools.map(tool => (
                  <div key={tool.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor={tool.key} className="font-medium">{tool.label}</Label>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                    <Switch
                      id={tool.key}
                      checked={l83ToolsVisibility[tool.key]}
                      onCheckedChange={() => toggleL83Tool(tool.key)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
