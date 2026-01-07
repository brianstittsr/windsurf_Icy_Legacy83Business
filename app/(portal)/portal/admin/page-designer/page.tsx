"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Wand2,
  Send,
  Loader2,
  Layout,
  Palette,
  Eye,
  History,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  RefreshCw,
  Lightbulb,
  Target,
  Zap,
  Shield,
  Accessibility,
  Paintbrush,
  Type,
  Image as ImageIcon,
  MessageSquare,
  LayoutTemplate,
  Star,
  TrendingUp,
  Clock,
  User,
  Bot,
  Copy,
  Check,
  Users,
  Megaphone,
  ShoppingCart,
  BookOpen,
  Heart,
  Briefcase,
  ArrowRight,
  Plus,
  Minus,
  GripVertical,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PUBLIC_PAGES,
  DEFAULT_TEMPLATES,
  type PublicPage,
  type PageSection,
  type LayoutTemplateDoc,
  type UXRecommendation,
  type SectionType,
} from "@/lib/firebase-page-designer";

// AI Chat Message Type
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  appliedChanges?: boolean;
  sectionTargeted?: string;
}

// Wizard Types
interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface WizardData {
  mode: "create" | "update";
  pageId: string | null;
  goal: string;
  audience: string[];
  style: {
    tone: string;
    colorScheme: string;
    layout: string;
  };
  sections: {
    id: string;
    type: SectionType;
    enabled: boolean;
    order: number;
    template?: string;
  }[];
  content: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaUrl: string;
  };
}

const WIZARD_STEPS: WizardStep[] = [
  { id: "mode", title: "Mode", description: "Create new or update existing", icon: Wand2 },
  { id: "goal", title: "Goal", description: "Define your page objective", icon: Target },
  { id: "audience", title: "Audience", description: "Who is this page for?", icon: Users },
  { id: "style", title: "Style", description: "Visual preferences", icon: Palette },
  { id: "sections", title: "Sections", description: "Choose page sections", icon: Layout },
  { id: "content", title: "Content", description: "Key messaging", icon: Type },
  { id: "review", title: "Review", description: "Review and generate", icon: CheckCircle },
];

const PAGE_GOALS = [
  { id: "lead-gen", label: "Generate Leads", description: "Capture contact information from visitors", icon: Megaphone },
  { id: "sales", label: "Drive Sales", description: "Convert visitors into customers", icon: ShoppingCart },
  { id: "educate", label: "Educate Visitors", description: "Inform and build trust with content", icon: BookOpen },
  { id: "brand", label: "Build Brand", description: "Establish credibility and awareness", icon: Heart },
  { id: "recruit", label: "Recruit Talent", description: "Attract potential team members", icon: Briefcase },
  { id: "engage", label: "Engage Community", description: "Foster connection and interaction", icon: Users },
];

const AUDIENCE_OPTIONS = [
  { id: "business-owners", label: "Business Owners", description: "Entrepreneurs and company leaders" },
  { id: "executives", label: "C-Suite Executives", description: "CEOs, CFOs, COOs" },
  { id: "managers", label: "Managers", description: "Team leads and department heads" },
  { id: "startups", label: "Startup Founders", description: "Early-stage entrepreneurs" },
  { id: "established", label: "Established Businesses", description: "Companies 5+ years old" },
  { id: "family-business", label: "Family Businesses", description: "Multi-generational companies" },
];

const STYLE_OPTIONS = {
  tone: [
    { id: "professional", label: "Professional", description: "Formal and authoritative" },
    { id: "friendly", label: "Friendly", description: "Warm and approachable" },
    { id: "bold", label: "Bold", description: "Confident and impactful" },
    { id: "inspiring", label: "Inspiring", description: "Motivational and uplifting" },
  ],
  colorScheme: [
    { id: "brand", label: "Brand Colors", description: "Amber & Slate (default)" },
    { id: "warm", label: "Warm Tones", description: "Oranges and reds" },
    { id: "cool", label: "Cool Tones", description: "Blues and greens" },
    { id: "neutral", label: "Neutral", description: "Grays and whites" },
  ],
  layout: [
    { id: "modern", label: "Modern", description: "Clean lines, lots of whitespace" },
    { id: "classic", label: "Classic", description: "Traditional, structured layout" },
    { id: "dynamic", label: "Dynamic", description: "Asymmetric, engaging design" },
    { id: "minimal", label: "Minimal", description: "Simple, focused content" },
  ],
};

const SECTION_OPTIONS: { id: SectionType; label: string; description: string; icon: React.ElementType }[] = [
  { id: "hero", label: "Hero Section", description: "Main headline and call-to-action", icon: Zap },
  { id: "features", label: "Features", description: "Key benefits or services", icon: Star },
  { id: "testimonials", label: "Testimonials", description: "Customer reviews and quotes", icon: MessageSquare },
  { id: "stats", label: "Statistics", description: "Impressive numbers and metrics", icon: TrendingUp },
  { id: "cta", label: "Call to Action", description: "Conversion-focused section", icon: Target },
  { id: "faq", label: "FAQ", description: "Common questions answered", icon: Info },
  { id: "team", label: "Team", description: "Team member profiles", icon: Users },
  { id: "pricing", label: "Pricing", description: "Plans and pricing tables", icon: ShoppingCart },
  { id: "contact", label: "Contact", description: "Contact form or information", icon: MessageSquare },
  { id: "gallery", label: "Gallery", description: "Image or video showcase", icon: ImageIcon },
];

// UX Review Result Type
interface UXReviewResult {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    maxScore: number;
    icon: React.ElementType;
    findings: string[];
  }[];
  recommendations: UXRecommendation[];
  brandConsistency: {
    colorConsistency: number;
    typographyConsistency: number;
    imageryConsistency: number;
    toneConsistency: number;
    issues: string[];
  };
  accessibilityIssues: {
    severity: "error" | "warning" | "info";
    element: string;
    issue: string;
    wcagCriteria: string;
    suggestedFix: string;
  }[];
}

export default function PageDesignerPage() {
  // State
  const [selectedPage, setSelectedPage] = useState<PublicPage | null>(null);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [uxReview, setUxReview] = useState<UXReviewResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateFilter, setTemplateFilter] = useState<SectionType | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [isWizardGenerating, setIsWizardGenerating] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    mode: "create",
    pageId: null,
    goal: "",
    audience: [],
    style: {
      tone: "professional",
      colorScheme: "brand",
      layout: "modern",
    },
    sections: SECTION_OPTIONS.slice(0, 5).map((s, i) => ({
      id: s.id,
      type: s.id,
      enabled: true,
      order: i,
    })),
    content: {
      headline: "",
      subheadline: "",
      ctaText: "Get Started",
      ctaUrl: "/contact",
    },
  });

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Initialize with welcome message when page is selected
  useEffect(() => {
    if (selectedPage && chatMessages.length === 0) {
      setChatMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `👋 Welcome to the AI Page Designer! I'm here to help you modify the **${selectedPage.name}** page.\n\nYou can ask me to:\n- Change content, headlines, or descriptions\n- Modify layouts and section arrangements\n- Update colors, fonts, or styling\n- Add or remove sections\n- Optimize for conversions\n\nWhat would you like to change?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedPage, chatMessages.length]);

  // Handle page selection
  const handlePageSelect = (pageId: string) => {
    const page = PUBLIC_PAGES.find(p => p.id === pageId);
    setSelectedPage(page || null);
    setSelectedSection(null);
    setChatMessages([]);
    setUxReview(null);
  };

  // Handle chat submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedPage || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsGenerating(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `loading_${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    try {
      // Simulate AI response (in production, this would call the AI API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate contextual response based on input
      const response = generateAIResponse(chatInput, selectedPage, selectedSection);

      // Remove loading message and add actual response
      setChatMessages(prev => [
        ...prev.filter(m => !m.isLoading),
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
          appliedChanges: response.appliedChanges,
          sectionTargeted: response.sectionTargeted,
        },
      ]);

      if (response.appliedChanges) {
        toast.success("Changes applied successfully!");
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setChatMessages(prev => prev.filter(m => !m.isLoading));
      toast.error("Failed to generate response");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI response (mock implementation)
  const generateAIResponse = (
    input: string,
    page: PublicPage,
    section: PageSection | null
  ): { content: string; appliedChanges?: boolean; sectionTargeted?: string } => {
    const lowerInput = input.toLowerCase();

    // Detect intent and generate appropriate response
    if (lowerInput.includes("headline") || lowerInput.includes("title") || lowerInput.includes("heading")) {
      return {
        content: `I've analyzed your request to modify the headline. Here's what I suggest:\n\n**Current:** "Build Your Legacy"\n**Proposed:** "${generateHeadlineSuggestion(input)}"\n\nThis change:\n- ✅ Maintains brand voice\n- ✅ Improves clarity\n- ✅ Adds emotional appeal\n\nWould you like me to apply this change, or would you prefer a different approach?`,
        sectionTargeted: section?.id || "hero",
      };
    }

    if (lowerInput.includes("color") || lowerInput.includes("theme") || lowerInput.includes("palette")) {
      return {
        content: `I can help you update the color scheme. Based on your brand guidelines:\n\n**Primary Colors:**\n- Amber (#F59E0B) - Energy, optimism\n- Slate (#1E293B) - Professionalism, trust\n\n**Suggestions:**\n1. Increase contrast for better accessibility\n2. Use amber as accent, not primary\n3. Add subtle gradients for depth\n\nWhich aspect would you like to adjust?`,
        sectionTargeted: "global",
      };
    }

    if (lowerInput.includes("layout") || lowerInput.includes("arrange") || lowerInput.includes("structure")) {
      return {
        content: `I've reviewed the ${page.name} page layout. Here are my recommendations:\n\n**Current Structure:**\n${page.sections.map((s, i) => `${i + 1}. ${s.name}`).join("\n")}\n\n**Suggested Improvements:**\n- Move testimonials higher for social proof\n- Add a stats section before CTA\n- Consider a sticky header for navigation\n\nWould you like me to implement any of these changes?`,
        sectionTargeted: "layout",
      };
    }

    if (lowerInput.includes("cta") || lowerInput.includes("button") || lowerInput.includes("call to action")) {
      return {
        content: `Great focus on CTAs! Here are optimized button suggestions:\n\n**Primary CTA:**\n- Current: "Get Started"\n- Suggested: "Start Your Legacy Journey →"\n\n**Secondary CTA:**\n- Current: "Learn More"\n- Suggested: "See How It Works"\n\n**Best Practices Applied:**\n- Action-oriented verbs\n- Benefit-focused language\n- Visual hierarchy with arrow\n\nShall I apply these changes?`,
        sectionTargeted: "cta",
        appliedChanges: false,
      };
    }

    if (lowerInput.includes("apply") || lowerInput.includes("yes") || lowerInput.includes("do it")) {
      return {
        content: `✅ **Changes Applied Successfully!**\n\nI've updated the ${section?.name || "selected section"} with your requested changes.\n\n**What was changed:**\n- Updated content as discussed\n- Maintained responsive design\n- Preserved SEO metadata\n\n**Next Steps:**\n1. Preview the changes\n2. Test on mobile devices\n3. Publish when ready\n\nWould you like to make any other modifications?`,
        appliedChanges: true,
        sectionTargeted: section?.id,
      };
    }

    // Default response
    return {
      content: `I understand you want to modify the ${page.name} page${section ? ` (${section.name} section)` : ""}.\n\nTo help you better, could you be more specific about:\n- **What** you want to change (text, images, layout, colors)\n- **How** you want it changed (specific wording, style preferences)\n- **Why** you're making this change (goal: conversions, clarity, branding)\n\nOr, you can select a template from the Templates tab for quick section updates!`,
    };
  };

  // Generate headline suggestion
  const generateHeadlineSuggestion = (input: string): string => {
    const suggestions = [
      "Transform Your Business Into a Lasting Legacy",
      "Build a Business That Thrives Beyond You",
      "Your Legacy Starts Here",
      "From Business Owner to Legacy Builder",
      "Create Impact That Lasts Generations",
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  // Wizard Functions
  const resetWizard = () => {
    setWizardStep(0);
    setWizardData({
      mode: "create",
      pageId: null,
      goal: "",
      audience: [],
      style: {
        tone: "professional",
        colorScheme: "brand",
        layout: "modern",
      },
      sections: SECTION_OPTIONS.slice(0, 5).map((s, i) => ({
        id: s.id,
        type: s.id,
        enabled: true,
        order: i,
      })),
      content: {
        headline: "",
        subheadline: "",
        ctaText: "Get Started",
        ctaUrl: "/contact",
      },
    });
  };

  const handleWizardNext = () => {
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleWizardGenerate = async () => {
    setIsWizardGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast.success("Page design generated successfully!");
      setShowWizard(false);
      
      // Set the selected page if updating
      if (wizardData.mode === "update" && wizardData.pageId) {
        const page = PUBLIC_PAGES.find(p => p.id === wizardData.pageId);
        if (page) {
          setSelectedPage(page);
          setChatMessages([
            {
              id: "wizard_complete",
              role: "assistant",
              content: `✅ **Wizard Complete!**\n\nI've generated a new design for the **${page.name}** page based on your preferences:\n\n**Goal:** ${PAGE_GOALS.find(g => g.id === wizardData.goal)?.label || wizardData.goal}\n**Audience:** ${wizardData.audience.map(a => AUDIENCE_OPTIONS.find(o => o.id === a)?.label).join(", ")}\n**Style:** ${wizardData.style.tone} tone, ${wizardData.style.layout} layout\n**Sections:** ${wizardData.sections.filter(s => s.enabled).length} sections configured\n\nThe design is ready for review. Would you like me to make any adjustments?`,
              timestamp: new Date(),
              appliedChanges: true,
            },
          ]);
        }
      }
      
      resetWizard();
    } catch (error) {
      console.error("Error generating design:", error);
      toast.error("Failed to generate design");
    } finally {
      setIsWizardGenerating(false);
    }
  };

  const toggleAudience = (audienceId: string) => {
    setWizardData(prev => ({
      ...prev,
      audience: prev.audience.includes(audienceId)
        ? prev.audience.filter(a => a !== audienceId)
        : [...prev.audience, audienceId],
    }));
  };

  const toggleSection = (sectionId: SectionType) => {
    setWizardData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const canProceedWizard = (): boolean => {
    switch (WIZARD_STEPS[wizardStep].id) {
      case "mode":
        return wizardData.mode === "create" || !!wizardData.pageId;
      case "goal":
        return !!wizardData.goal;
      case "audience":
        return wizardData.audience.length > 0;
      case "style":
        return !!wizardData.style.tone && !!wizardData.style.colorScheme && !!wizardData.style.layout;
      case "sections":
        return wizardData.sections.filter(s => s.enabled).length >= 2;
      case "content":
        return !!wizardData.content.headline;
      case "review":
        return true;
      default:
        return true;
    }
  };

  // Handle UX Review
  const handleUXReview = async () => {
    if (!selectedPage) return;

    setIsReviewing(true);
    setActiveTab("review");

    try {
      // Simulate AI review (in production, this would call the AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockReview: UXReviewResult = {
        overallScore: 78,
        categories: [
          {
            name: "Visual Hierarchy",
            score: 8,
            maxScore: 10,
            icon: Layout,
            findings: [
              "Strong headline hierarchy",
              "CTAs could be more prominent",
              "Good use of whitespace",
            ],
          },
          {
            name: "Content Clarity",
            score: 7,
            maxScore: 10,
            icon: Type,
            findings: [
              "Clear value proposition",
              "Some sections have too much text",
              "Consider bullet points for features",
            ],
          },
          {
            name: "Brand Consistency",
            score: 9,
            maxScore: 10,
            icon: Palette,
            findings: [
              "Consistent color usage",
              "Typography follows guidelines",
              "Imagery aligns with brand",
            ],
          },
          {
            name: "Conversion Optimization",
            score: 6,
            maxScore: 10,
            icon: Target,
            findings: [
              "CTA placement could be improved",
              "Add more social proof",
              "Consider exit-intent popup",
            ],
          },
          {
            name: "Mobile Experience",
            score: 8,
            maxScore: 10,
            icon: Zap,
            findings: [
              "Responsive design works well",
              "Touch targets are adequate",
              "Consider sticky mobile CTA",
            ],
          },
          {
            name: "Accessibility",
            score: 7,
            maxScore: 10,
            icon: Accessibility,
            findings: [
              "Good color contrast overall",
              "Some images missing alt text",
              "Form labels need improvement",
            ],
          },
        ],
        recommendations: [
          {
            id: "rec_1",
            priority: "high",
            category: "Conversion",
            title: "Add Social Proof Above the Fold",
            description: "Include customer logos or testimonial snippet in the hero section to build immediate trust.",
            suggestedFix: "Add a row of 4-5 client logos below the hero headline with '500+ businesses transformed' text.",
            estimatedImpact: "+15-20% conversion rate",
            isImplemented: false,
          },
          {
            id: "rec_2",
            priority: "high",
            category: "CTA",
            title: "Make Primary CTA More Prominent",
            description: "The main call-to-action button doesn't stand out enough from the page design.",
            suggestedFix: "Increase button size, add subtle animation on hover, and use contrasting color.",
            estimatedImpact: "+10-15% click-through rate",
            isImplemented: false,
          },
          {
            id: "rec_3",
            priority: "medium",
            category: "Content",
            title: "Simplify Feature Descriptions",
            description: "Feature section text is too long and may cause visitors to skip important information.",
            suggestedFix: "Reduce each feature description to 2 sentences max. Use icons to convey meaning quickly.",
            estimatedImpact: "+25% section engagement",
            isImplemented: false,
          },
          {
            id: "rec_4",
            priority: "medium",
            category: "Layout",
            title: "Add Sticky Navigation",
            description: "Users scrolling down lose access to navigation, increasing bounce rate.",
            suggestedFix: "Implement sticky header that appears after scrolling past hero section.",
            estimatedImpact: "-5% bounce rate",
            isImplemented: false,
          },
          {
            id: "rec_5",
            priority: "low",
            category: "Accessibility",
            title: "Add Alt Text to All Images",
            description: "Several images are missing descriptive alt text, affecting screen reader users.",
            suggestedFix: "Add descriptive alt text to hero image, team photos, and decorative elements.",
            estimatedImpact: "WCAG 2.1 AA compliance",
            isImplemented: false,
          },
        ],
        brandConsistency: {
          colorConsistency: 92,
          typographyConsistency: 88,
          imageryConsistency: 85,
          toneConsistency: 90,
          issues: [
            "One section uses off-brand blue (#3B82F6) instead of slate",
            "Footer font size inconsistent with body text",
          ],
        },
        accessibilityIssues: [
          {
            severity: "error",
            element: "Hero Image",
            issue: "Missing alt attribute",
            wcagCriteria: "1.1.1 Non-text Content",
            suggestedFix: "Add alt='Icy Williams coaching a business owner'",
          },
          {
            severity: "warning",
            element: "Contact Form",
            issue: "Labels not associated with inputs",
            wcagCriteria: "1.3.1 Info and Relationships",
            suggestedFix: "Add htmlFor attribute to labels matching input IDs",
          },
          {
            severity: "info",
            element: "Footer Links",
            issue: "Link text could be more descriptive",
            wcagCriteria: "2.4.4 Link Purpose",
            suggestedFix: "Change 'Click here' to 'View our privacy policy'",
          },
        ],
      };

      setUxReview(mockReview);
      toast.success("UX Review completed!");
    } catch (error) {
      console.error("Error generating UX review:", error);
      toast.error("Failed to generate UX review");
    } finally {
      setIsReviewing(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    toast.success(`Template "${templateName}" selected`);
  };

  // Handle implementing recommendation
  const handleImplementRecommendation = async (rec: UXRecommendation) => {
    toast.success(`Implementing: ${rec.title}`);
    // In production, this would apply the changes
    if (uxReview) {
      setUxReview({
        ...uxReview,
        recommendations: uxReview.recommendations.map(r =>
          r.id === rec.id ? { ...r, isImplemented: true } : r
        ),
      });
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter templates
  const filteredTemplates = DEFAULT_TEMPLATES.filter(
    t => templateFilter === "all" || t.sectionType === templateFilter
  );

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Render wizard step content
  const renderWizardStepContent = () => {
    const currentStep = WIZARD_STEPS[wizardStep];

    switch (currentStep.id) {
      case "mode":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">What would you like to do?</h3>
              <p className="text-muted-foreground">Choose whether to create a new page design or update an existing one</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md p-6",
                  wizardData.mode === "create" && "ring-2 ring-amber-500 bg-amber-500/5"
                )}
                onClick={() => setWizardData(prev => ({ ...prev, mode: "create", pageId: null }))}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-amber-500" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Create New Design</h4>
                  <p className="text-sm text-muted-foreground">Start fresh with a guided design process</p>
                </div>
              </Card>
              <Card
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md p-6",
                  wizardData.mode === "update" && "ring-2 ring-amber-500 bg-amber-500/5"
                )}
                onClick={() => setWizardData(prev => ({ ...prev, mode: "update" }))}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="h-8 w-8 text-blue-500" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Update Existing Page</h4>
                  <p className="text-sm text-muted-foreground">Redesign an existing public page</p>
                </div>
              </Card>
            </div>
            {wizardData.mode === "update" && (
              <div className="mt-6">
                <Label>Select Page to Update</Label>
                <Select
                  value={wizardData.pageId || ""}
                  onValueChange={(value) => setWizardData(prev => ({ ...prev, pageId: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a page..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLIC_PAGES.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name} ({page.path})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case "goal":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">What's the primary goal of this page?</h3>
              <p className="text-muted-foreground">This helps us optimize the design for your objective</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PAGE_GOALS.map((goal) => (
                <Card
                  key={goal.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md p-4",
                    wizardData.goal === goal.id && "ring-2 ring-amber-500 bg-amber-500/5"
                  )}
                  onClick={() => setWizardData(prev => ({ ...prev, goal: goal.id }))}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <goal.icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{goal.label}</h4>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "audience":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Who is your target audience?</h3>
              <p className="text-muted-foreground">Select all that apply - this shapes the messaging and tone</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {AUDIENCE_OPTIONS.map((audience) => (
                <Card
                  key={audience.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md p-4",
                    wizardData.audience.includes(audience.id) && "ring-2 ring-amber-500 bg-amber-500/5"
                  )}
                  onClick={() => toggleAudience(audience.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{audience.label}</h4>
                      <p className="text-sm text-muted-foreground">{audience.description}</p>
                    </div>
                    {wizardData.audience.includes(audience.id) && (
                      <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Selected: {wizardData.audience.length} audience{wizardData.audience.length !== 1 ? "s" : ""}
            </p>
          </div>
        );

      case "style":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Define your visual style</h3>
              <p className="text-muted-foreground">Choose the look and feel that matches your brand</p>
            </div>
            
            {/* Tone */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Tone & Voice</Label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {STYLE_OPTIONS.tone.map((option) => (
                  <Card
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md p-3 text-center",
                      wizardData.style.tone === option.id && "ring-2 ring-amber-500 bg-amber-500/5"
                    )}
                    onClick={() => setWizardData(prev => ({ ...prev, style: { ...prev.style, tone: option.id } }))}
                  >
                    <h4 className="font-medium">{option.label}</h4>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Color Scheme</Label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {STYLE_OPTIONS.colorScheme.map((option) => (
                  <Card
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md p-3 text-center",
                      wizardData.style.colorScheme === option.id && "ring-2 ring-amber-500 bg-amber-500/5"
                    )}
                    onClick={() => setWizardData(prev => ({ ...prev, style: { ...prev.style, colorScheme: option.id } }))}
                  >
                    <h4 className="font-medium">{option.label}</h4>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Layout Style */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Layout Style</Label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {STYLE_OPTIONS.layout.map((option) => (
                  <Card
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md p-3 text-center",
                      wizardData.style.layout === option.id && "ring-2 ring-amber-500 bg-amber-500/5"
                    )}
                    onClick={() => setWizardData(prev => ({ ...prev, style: { ...prev.style, layout: option.id } }))}
                  >
                    <h4 className="font-medium">{option.label}</h4>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "sections":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Choose your page sections</h3>
              <p className="text-muted-foreground">Select the sections you want to include (minimum 2)</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {SECTION_OPTIONS.map((section) => {
                const isEnabled = wizardData.sections.find(s => s.id === section.id)?.enabled ?? false;
                return (
                  <Card
                    key={section.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md p-4",
                      isEnabled && "ring-2 ring-amber-500 bg-amber-500/5"
                    )}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          isEnabled ? "bg-amber-500 text-white" : "bg-muted"
                        )}>
                          <section.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{section.label}</h4>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        isEnabled ? "border-amber-500 bg-amber-500" : "border-muted-foreground"
                      )}>
                        {isEnabled && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Selected: {wizardData.sections.filter(s => s.enabled).length} sections
            </p>
          </div>
        );

      case "content":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Define your key messaging</h3>
              <p className="text-muted-foreground">AI will expand on these to create compelling content</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="headline">Main Headline *</Label>
                <Input
                  id="headline"
                  value={wizardData.content.headline}
                  onChange={(e) => setWizardData(prev => ({ ...prev, content: { ...prev.content, headline: e.target.value } }))}
                  placeholder="e.g., Build a Business That Thrives Beyond You"
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">The primary message visitors will see</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subheadline">Subheadline</Label>
                <Textarea
                  id="subheadline"
                  value={wizardData.content.subheadline}
                  onChange={(e) => setWizardData(prev => ({ ...prev, content: { ...prev.content, subheadline: e.target.value } }))}
                  placeholder="e.g., Join 500+ business owners who have transformed their companies with the G.R.O.W.S. framework"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">Supporting text that expands on the headline</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ctaText">Primary CTA Text</Label>
                  <Input
                    id="ctaText"
                    value={wizardData.content.ctaText}
                    onChange={(e) => setWizardData(prev => ({ ...prev, content: { ...prev.content, ctaText: e.target.value } }))}
                    placeholder="e.g., Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">CTA Link</Label>
                  <Input
                    id="ctaUrl"
                    value={wizardData.content.ctaUrl}
                    onChange={(e) => setWizardData(prev => ({ ...prev, content: { ...prev.content, ctaUrl: e.target.value } }))}
                    placeholder="e.g., /contact"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Review Your Design</h3>
              <p className="text-muted-foreground">Confirm your choices before generating the page</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label className="text-muted-foreground text-sm">Mode</Label>
                      <p className="font-medium">{wizardData.mode === "create" ? "Create New Design" : "Update Existing Page"}</p>
                      {wizardData.pageId && (
                        <p className="text-sm text-muted-foreground">
                          Page: {PUBLIC_PAGES.find(p => p.id === wizardData.pageId)?.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Goal</Label>
                      <p className="font-medium">{PAGE_GOALS.find(g => g.id === wizardData.goal)?.label}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Target Audience</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {wizardData.audience.map(a => (
                          <Badge key={a} variant="secondary" className="text-xs">
                            {AUDIENCE_OPTIONS.find(o => o.id === a)?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Style</Label>
                      <p className="font-medium capitalize">
                        {wizardData.style.tone} • {wizardData.style.layout}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground text-sm">Sections ({wizardData.sections.filter(s => s.enabled).length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {wizardData.sections.filter(s => s.enabled).map(s => (
                        <Badge key={s.id} variant="outline">
                          {SECTION_OPTIONS.find(o => o.id === s.id)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground text-sm">Content</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-lg">{wizardData.content.headline || "(No headline)"}</p>
                      {wizardData.content.subheadline && (
                        <p className="text-muted-foreground mt-1">{wizardData.content.subheadline}</p>
                      )}
                      <div className="mt-3">
                        <Badge className="bg-amber-500">{wizardData.content.ctaText}</Badge>
                        <span className="text-xs text-muted-foreground ml-2">→ {wizardData.content.ctaUrl}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex-shrink-0 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-amber-500" />
                    Page Design Wizard
                  </CardTitle>
                  <CardDescription>Step {wizardStep + 1} of {WIZARD_STEPS.length}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowWizard(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-4 px-2">
                {WIZARD_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                        index < wizardStep
                          ? "bg-amber-500 text-white"
                          : index === wizardStep
                          ? "bg-amber-500 text-white ring-4 ring-amber-500/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index < wizardStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    {index < WIZARD_STEPS.length - 1 && (
                      <div
                        className={cn(
                          "w-12 h-1 mx-1",
                          index < wizardStep ? "bg-amber-500" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-6">
              {renderWizardStepContent()}
            </ScrollArea>
            <div className="flex-shrink-0 border-t p-4 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleWizardBack}
                disabled={wizardStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-2">
                {wizardStep === WIZARD_STEPS.length - 1 ? (
                  <Button
                    onClick={handleWizardGenerate}
                    disabled={isWizardGenerating}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    {isWizardGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Design
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleWizardNext}
                    disabled={!canProceedWizard()}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Page Designer</h1>
          <p className="text-muted-foreground">
            Use AI to modify content, layouts, and styling on public pages
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetWizard();
              setShowWizard(true);
            }}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Design Wizard
          </Button>
          {selectedPage && (
            <Button variant="outline" asChild>
              <a href={selectedPage.path} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                Preview Page
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Page Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Page to Edit</CardTitle>
          <CardDescription>
            Choose a public-facing page to modify with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Target Page</Label>
              <Select
                value={selectedPage?.id || ""}
                onValueChange={handlePageSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a page..." />
                </SelectTrigger>
                <SelectContent>
                  {PUBLIC_PAGES.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      <div className="flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        <span>{page.name}</span>
                        <span className="text-muted-foreground text-xs">
                          ({page.path})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPage && (
              <div className="space-y-2">
                <Label>Target Section (Optional)</Label>
                <Select
                  value={selectedSection?.id || "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedSection(null);
                    } else {
                      const section = selectedPage.sections.find(s => s.id === value);
                      setSelectedSection(section || null);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {selectedPage.sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {selectedPage && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{selectedPage.name}:</strong> {selectedPage.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPage.sections.map((section) => (
                  <Badge
                    key={section.id}
                    variant={selectedSection?.id === section.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedSection(
                      selectedSection?.id === section.id ? null : section
                    )}
                  >
                    {section.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      {selectedPage && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Panel - Chat & Templates */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <CardHeader className="pb-0">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      AI Chat
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="gap-2">
                      <LayoutTemplate className="h-4 w-4" />
                      Templates
                    </TabsTrigger>
                    <TabsTrigger value="review" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      UX Review
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                {/* Chat Tab */}
                <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                              </div>
                            ) : (
                              <>
                                <div className="text-sm whitespace-pre-wrap">
                                  {message.content.split("\n").map((line, i) => (
                                    <p key={i} className={i > 0 ? "mt-2" : ""}>
                                      {line.startsWith("**") && line.endsWith("**")
                                        ? <strong>{line.slice(2, -2)}</strong>
                                        : line.startsWith("- ")
                                        ? <span className="flex gap-2"><span>•</span><span>{line.slice(2)}</span></span>
                                        : line}
                                    </p>
                                  ))}
                                </div>
                                {message.appliedChanges && (
                                  <Badge className="mt-2 bg-green-500">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Changes Applied
                                  </Badge>
                                )}
                                {message.sectionTargeted && !message.appliedChanges && (
                                  <Badge variant="outline" className="mt-2">
                                    Target: {message.sectionTargeted}
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t">
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Describe what you want to change..."
                        disabled={isGenerating}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={isGenerating || !chatInput.trim()}>
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChatInput("Change the headline to be more compelling")}
                      >
                        Update headline
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChatInput("Improve the CTA buttons for better conversions")}
                      >
                        Improve CTAs
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChatInput("Suggest a better layout for this section")}
                      >
                        Optimize layout
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="flex-1 flex flex-col m-0 p-0">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Best Practice Templates</h3>
                      <Select
                        value={templateFilter}
                        onValueChange={(v) => setTemplateFilter(v as SectionType | "all")}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="features">Features</SelectItem>
                          <SelectItem value="testimonials">Testimonials</SelectItem>
                          <SelectItem value="cta">CTA</SelectItem>
                          <SelectItem value="pricing">Pricing</SelectItem>
                          <SelectItem value="faq">FAQ</SelectItem>
                          <SelectItem value="stats">Stats</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select a template to apply to {selectedSection?.name || "any section"}
                    </p>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="grid gap-4">
                      {filteredTemplates.map((template, index) => (
                        <Card
                          key={index}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedTemplate === template.name && "ring-2 ring-amber-500"
                          )}
                          onClick={() => handleTemplateSelect(template.name)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{template.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {template.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium">{template.popularity}%</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline">{template.sectionType}</Badge>
                              <Badge variant="secondary">{template.category}</Badge>
                              {template.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Collapsible>
                              <CollapsibleTrigger className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700">
                                <Lightbulb className="h-4 w-4" />
                                Best Practices
                                <ChevronDown className="h-3 w-3" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {template.bestPractices.map((practice, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                                      {practice}
                                    </li>
                                  ))}
                                </ul>
                              </CollapsibleContent>
                            </Collapsible>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>

                  {selectedTemplate && (
                    <div className="p-4 border-t">
                      <Button className="w-full" onClick={() => {
                        toast.success(`Applying "${selectedTemplate}" template...`);
                        // In production, this would apply the template
                      }}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Apply Template to {selectedSection?.name || "Section"}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* UX Review Tab */}
                <TabsContent value="review" className="flex-1 flex flex-col m-0 p-0">
                  {!uxReview ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                        <Sparkles className="h-10 w-10 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">AI UX Review</h3>
                      <p className="text-muted-foreground text-center mb-6 max-w-md">
                        Get expert AI analysis of your page's user experience, accessibility,
                        brand consistency, and conversion optimization.
                      </p>
                      <Button
                        size="lg"
                        onClick={handleUXReview}
                        disabled={isReviewing}
                      >
                        {isReviewing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Start UX Review
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-slate-500/10 rounded-lg">
                          <div className="text-5xl font-bold text-amber-500 mb-2">
                            {uxReview.overallScore}/100
                          </div>
                          <p className="text-muted-foreground">Overall UX Score</p>
                          <div className="flex justify-center gap-4 mt-4">
                            <Button variant="outline" size="sm" onClick={handleUXReview}>
                              <RefreshCw className="mr-2 h-3 w-3" />
                              Re-analyze
                            </Button>
                          </div>
                        </div>

                        {/* Category Scores */}
                        <div>
                          <h4 className="font-semibold mb-3">Category Breakdown</h4>
                          <div className="grid gap-3">
                            {uxReview.categories.map((category) => (
                              <Collapsible key={category.name}>
                                <CollapsibleTrigger className="w-full">
                                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80">
                                    <div className="flex items-center gap-3">
                                      <category.icon className="h-5 w-5 text-amber-500" />
                                      <span className="font-medium">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-amber-500 rounded-full"
                                          style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium w-12">
                                        {category.score}/{category.maxScore}
                                      </span>
                                      <ChevronDown className="h-4 w-4" />
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <ul className="mt-2 ml-8 space-y-1">
                                    {category.findings.map((finding, i) => (
                                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span>•</span>
                                        {finding}
                                      </li>
                                    ))}
                                  </ul>
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-semibold mb-3">Recommendations</h4>
                          <div className="space-y-3">
                            {uxReview.recommendations.map((rec) => (
                              <Card key={rec.id} className={cn(
                                rec.isImplemented && "opacity-60"
                              )}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className={getPriorityColor(rec.priority)}>
                                        {rec.priority}
                                      </Badge>
                                      <Badge variant="outline">{rec.category}</Badge>
                                    </div>
                                    {rec.isImplemented ? (
                                      <Badge className="bg-green-500">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Implemented
                                      </Badge>
                                    ) : (
                                      <Button
                                        size="sm"
                                        onClick={() => handleImplementRecommendation(rec)}
                                      >
                                        <Wand2 className="h-3 w-3 mr-1" />
                                        Implement
                                      </Button>
                                    )}
                                  </div>
                                  <h5 className="font-medium mb-1">{rec.title}</h5>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {rec.description}
                                  </p>
                                  <div className="p-2 bg-muted rounded text-sm mb-2">
                                    <strong>Suggested Fix:</strong> {rec.suggestedFix}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-green-600">{rec.estimatedImpact}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Accessibility Issues */}
                        <div>
                          <h4 className="font-semibold mb-3">Accessibility Issues</h4>
                          <div className="space-y-2">
                            {uxReview.accessibilityIssues.map((issue, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                {getSeverityIcon(issue.severity)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{issue.element}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {issue.wcagCriteria}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{issue.issue}</p>
                                  <p className="text-sm mt-1">
                                    <strong>Fix:</strong> {issue.suggestedFix}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(issue.suggestedFix, `acc_${i}`)}
                                >
                                  {copiedId === `acc_${i}` ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Brand Consistency */}
                        <div>
                          <h4 className="font-semibold mb-3">Brand Consistency</h4>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="p-3 bg-muted rounded-lg text-center">
                              <div className="text-2xl font-bold text-amber-500">
                                {uxReview.brandConsistency.colorConsistency}%
                              </div>
                              <p className="text-sm text-muted-foreground">Colors</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg text-center">
                              <div className="text-2xl font-bold text-amber-500">
                                {uxReview.brandConsistency.typographyConsistency}%
                              </div>
                              <p className="text-sm text-muted-foreground">Typography</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg text-center">
                              <div className="text-2xl font-bold text-amber-500">
                                {uxReview.brandConsistency.imageryConsistency}%
                              </div>
                              <p className="text-sm text-muted-foreground">Imagery</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg text-center">
                              <div className="text-2xl font-bold text-amber-500">
                                {uxReview.brandConsistency.toneConsistency}%
                              </div>
                              <p className="text-sm text-muted-foreground">Tone</p>
                            </div>
                          </div>
                          {uxReview.brandConsistency.issues.length > 0 && (
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                Brand Issues Found
                              </h5>
                              <ul className="text-sm space-y-1">
                                {uxReview.brandConsistency.issues.map((issue, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span>•</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Panel - Page Structure & History */}
          <div className="space-y-6">
            {/* Page Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page Structure</CardTitle>
                <CardDescription>
                  Sections on {selectedPage.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPage.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedSection?.id === section.id
                          ? "border-amber-500 bg-amber-500/10"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedSection(
                        selectedSection?.id === section.id ? null : section
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{section.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {section.type}
                          </p>
                        </div>
                      </div>
                      {section.isEditable && (
                        <Badge variant="outline" className="text-xs">
                          Editable
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setChatInput("Analyze this page and suggest improvements");
                    setActiveTab("chat");
                  }}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("templates")}
                >
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Browse Templates
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleUXReview}
                  disabled={isReviewing}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run UX Review
                </Button>
                <Separator className="my-3" />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Publish Changes
                </Button>
              </CardContent>
            </Card>

            {/* Design Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Design Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Keep headlines under 10 words for maximum impact
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Use action verbs in CTAs (Start, Get, Join)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Add social proof near conversion points
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Ensure 4.5:1 contrast ratio for accessibility
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedPage && (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
              <Wand2 className="h-10 w-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">AI Page Designer</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Select a page above to start designing with AI assistance. 
              Modify content, layouts, and styling using natural language prompts.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                Chat Interface
              </Badge>
              <Badge variant="outline" className="gap-1">
                <LayoutTemplate className="h-3 w-3" />
                Template Library
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                UX Review
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
