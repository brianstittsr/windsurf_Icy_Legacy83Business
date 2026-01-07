"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { isSuperAdmin } from "@/lib/permissions";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { useUserProfile } from "@/contexts/user-profile-context";
import { useFeatureVisibility } from "@/contexts/feature-visibility-context";
import { RoleSwitcherCompact } from "@/components/portal/role-switcher";
import { FeatureKey, SectionKey } from "@/lib/feature-visibility";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Factory,
  LayoutDashboard,
  Target,
  FolderKanban,
  Users,
  Building,
  FileText,
  Calendar,
  CalendarDays,
  CheckSquare,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Handshake,
  DollarSign,
  User,
  ImageIcon,
  Shield,
  Rocket,
  Battery,
  UserCog,
  Building2,
  Search,
  Linkedin,
  FileSignature,
  Bot,
  Plug,
  Bug,
  Heart,
  Phone,
  CalendarClock,
  GraduationCap,
  Paintbrush,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [
  {
    title: "Command Center",
    href: "/portal/command-center",
    icon: LayoutDashboard,
    featureKey: "commandCenter",
  },
  {
    title: "Opportunities",
    href: "/portal/opportunities",
    icon: Target,
    badge: "5",
    featureKey: "opportunities",
  },
  {
    title: "Projects",
    href: "/portal/projects",
    icon: FolderKanban,
    badge: "3",
    featureKey: "projects",
  },
  {
    title: "Affiliates",
    href: "/portal/affiliates",
    icon: Users,
    featureKey: "affiliates",
  },
  {
    title: "Customers",
    href: "/portal/customers",
    icon: Building,
    featureKey: "customers",
  },
];

const workItems: { title: string; href: string; icon: React.ElementType; badge?: string; featureKey: FeatureKey }[] = [
  {
    title: "Apollo Search",
    href: "/portal/apollo-search",
    icon: Search,
    badge: "AI",
    featureKey: "apolloSearch",
  },
  {
    title: "Supplier Search",
    href: "/portal/supplier-search",
    icon: Factory,
    badge: "AI",
    featureKey: "supplierSearch",
  },
  {
    title: "Documents",
    href: "/portal/documents",
    icon: FileText,
    featureKey: "documents",
  },
  {
    title: "Calendar",
    href: "/portal/calendar",
    icon: Calendar,
    featureKey: "calendar",
  },
  {
    title: "Availability",
    href: "/portal/availability",
    icon: CalendarDays,
    featureKey: "availability",
  },
  {
    title: "Meetings",
    href: "/portal/meetings",
    icon: Users,
    featureKey: "meetings",
  },
  {
    title: "Rocks",
    href: "/portal/rocks",
    icon: CheckSquare,
    featureKey: "rocks",
  },
  {
    title: "Networking",
    href: "/portal/networking",
    icon: Handshake,
    featureKey: "networking",
  },
  {
    title: "Deals",
    href: "/portal/deals",
    icon: DollarSign,
    featureKey: "deals",
  },
  {
    title: "LinkedIn Content",
    href: "/portal/linkedin-content",
    icon: Linkedin,
    badge: "AI",
    featureKey: "linkedinContent",
  },
  {
    title: "EOS2 Dashboard",
    href: "/portal/eos2",
    icon: Target,
    badge: "EOS",
    featureKey: "eos2",
  },
  {
    title: "DocuSeal",
    href: "/portal/docuseal",
    icon: FileSignature,
    featureKey: "docuseal",
  },
  {
    title: "AI Workforce",
    href: "/portal/ai-workforce",
    icon: Bot,
    badge: "AI",
    featureKey: "aiWorkforce",
  },
  {
    title: "Proposal Creator",
    href: "/portal/proposals",
    icon: FileText,
    badge: "AI",
    featureKey: "proposals",
  },
  {
    title: "GoHighLevel",
    href: "/portal/gohighlevel",
    icon: Plug,
    badge: "CRM",
    featureKey: "gohighlevel",
  },
  {
    title: "Bug Tracker",
    href: "/portal/bug-tracker",
    icon: Bug,
    featureKey: "bugTracker",
  },
  {
    title: "SVP Tools",
    href: "/portal/svp-tools",
    icon: Sparkles,
    badge: "AI",
    featureKey: "svpTools",
  },
];

const adminItems: { title: string; href: string; icon: React.ElementType; featureKey: FeatureKey }[] = [
  {
    title: "Team Members",
    href: "/portal/admin/team-members",
    icon: UserCog,
    featureKey: "teamMembers",
  },
  {
    title: "Strategic Partners",
    href: "/portal/admin/strategic-partners",
    icon: Building2,
    featureKey: "strategicPartners",
  },
  {
    title: "Hero Management",
    href: "/portal/admin/hero",
    icon: ImageIcon,
    featureKey: "heroManagement",
  },
  {
    title: "Contact Popup",
    href: "/portal/admin/popup",
    icon: MessageSquare,
    featureKey: "contactPopup",
  },
  {
    title: "Events",
    href: "/portal/admin/events",
    icon: CalendarClock,
    featureKey: "events",
  },
  {
    title: "Growth IQ Quiz",
    href: "/portal/admin/quiz",
    icon: CheckSquare,
    featureKey: "growthIqQuiz",
  },
  {
    title: "Image Manager",
    href: "/portal/admin/images",
    icon: ImageIcon,
    featureKey: "imageManager",
  },
  {
    title: "Academy Admin",
    href: "/portal/admin/academy",
    icon: GraduationCap,
    featureKey: "academyAdmin",
  },
  {
    title: "Page Designer",
    href: "/portal/admin/page-designer",
    icon: Paintbrush,
    featureKey: "pageDesigner",
  },
];

const initiativeItems: { title: string; href: string; icon: React.ElementType; featureKey: FeatureKey }[] = [
  {
    title: "Initiatives",
    href: "/portal/admin/initiatives",
    icon: Rocket,
    featureKey: "initiatives",
  },
  {
    title: "TBMNC Suppliers",
    href: "/portal/admin/initiatives/tbmnc",
    icon: Battery,
    featureKey: "tbmncSuppliers",
  },
];

const aiItems: { title: string; href: string; icon: React.ElementType; featureKey: FeatureKey }[] = [
  {
    title: "Ask IntellEDGE",
    href: "/portal/ask",
    icon: Sparkles,
    featureKey: "askIntelledge",
  },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getDisplayName, getInitials, profile, linkedTeamMember } = useUserProfile();
  const { canSeeFeature, canSeeSection, isPreviewMode } = useFeatureVisibility();
  const [bookCallLeadsCount, setBookCallLeadsCount] = useState(0);
  const currentUserRole = linkedTeamMember?.role || "affiliate";
  const showSuperAdminLink = isSuperAdmin(currentUserRole);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      // Sign out from Firebase Auth
      if (auth) {
        await auth.signOut();
      }
      // Clear session storage
      sessionStorage.removeItem("svp_authenticated");
      sessionStorage.removeItem("svp_user_email");
      sessionStorage.removeItem("svp_firebase_uid");
      sessionStorage.removeItem("svp_user_name");
      sessionStorage.removeItem("svp_team_member_id");
      sessionStorage.removeItem("svp_user_role");
      // Clear local storage remember me
      localStorage.removeItem("svp_remembered_email");
      localStorage.removeItem("svp_remember_me");
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/");
    }
  };

  // Subscribe to BookCallLeads count (new leads only)
  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, COLLECTIONS.BOOK_CALL_LEADS),
      where("status", "==", "new")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookCallLeadsCount(snapshot.size);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Collapsible state for each section
  const [openSections, setOpenSections] = useState({
    navigation: true,
    work: true,
    intelligence: true,
    admin: false,
    initiatives: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/portal" className="flex items-center gap-2 px-2 py-4">
          <NextImage
            src="/legacy83Logo.webp"
            alt="Legacy 83 Business Inc"
            width={160}
            height={53}
            className="h-10 w-auto"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Preview Mode Indicator */}
        {isPreviewMode && (
          <div className="mx-2 mb-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-md">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              👁️ Preview Mode Active
            </p>
          </div>
        )}

        {/* Main Navigation */}
        {canSeeSection("navigation") && (
          <Collapsible open={openSections.navigation} onOpenChange={() => toggleSection("navigation")}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between pr-2">
                  <span>Navigation</span>
                  {openSections.navigation ? (
                    <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {mainNavItems.filter(item => canSeeFeature(item.featureKey)).map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Work Items */}
        {canSeeSection("work") && (
          <Collapsible open={openSections.work} onOpenChange={() => toggleSection("work")}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between pr-2">
                  <span>Work</span>
                  {openSections.work ? (
                    <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {workItems.filter(item => canSeeFeature(item.featureKey)).map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* AI */}
        {canSeeSection("intelligence") && (
          <Collapsible open={openSections.intelligence} onOpenChange={() => toggleSection("intelligence")}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between pr-2">
                  <span>Intelligence</span>
                  {openSections.intelligence ? (
                    <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {aiItems.filter(item => canSeeFeature(item.featureKey)).map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Admin */}
        {canSeeSection("admin") && (
          <Collapsible open={openSections.admin} onOpenChange={() => toggleSection("admin")}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between pr-2">
                  <span>Admin</span>
                  {openSections.admin ? (
                    <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {/* Book Call Leads - with dynamic count */}
                    {canSeeFeature("bookCallLeads") && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === "/portal/admin/book-call-leads"}
                          tooltip="Book Call Leads"
                        >
                          <Link href="/portal/admin/book-call-leads">
                            <Phone className="h-4 w-4" />
                            <span>Book Call Leads</span>
                          </Link>
                        </SidebarMenuButton>
                        {bookCallLeadsCount > 0 && (
                          <SidebarMenuBadge className="bg-red-500 text-white">
                            {bookCallLeadsCount}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    )}
                    {adminItems.filter(item => canSeeFeature(item.featureKey)).map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href || pathname.startsWith(item.href)}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {/* SuperAdmin Controls - Only visible to superadmins */}
                    {showSuperAdminLink && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === "/portal/admin/superadmin"}
                          tooltip="SuperAdmin Controls"
                        >
                          <Link href="/portal/admin/superadmin">
                            <Shield className="h-4 w-4" />
                            <span>SuperAdmin Controls</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Initiatives */}
        {canSeeSection("initiatives") && (
          <Collapsible open={openSections.initiatives} onOpenChange={() => toggleSection("initiatives")}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between pr-2">
                  <span>Initiatives</span>
                  {openSections.initiatives ? (
                    <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {initiativeItems.filter(item => canSeeFeature(item.featureKey)).map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {/* Role Switcher for SuperAdmin */}
        <RoleSwitcherCompact />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{getDisplayName()}</span>
                    <span className="text-xs text-sidebar-foreground/60 capitalize">{profile.role.replace("_", " ")}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/portal/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portal/settings?tab=notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portal/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
