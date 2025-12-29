import { HeroSlide } from "@/components/marketing/hero-carousel";

/**
 * Legacy 83 Business - Hero Carousel Slides
 * 
 * These slides are designed to market Icy Williams' Legacy 83 Business
 * coaching and consulting services to small business owners.
 */

export const legacy83HeroSlides: HeroSlide[] = [
  {
    id: "legacy-1",
    badge: "Introducing the Legacy Growth System™",
    headline: "Build a Business That",
    highlightedText: "Outlasts You",
    subheadline: "We help small business owners create sustainable growth, develop leadership teams, and plan for succession—with measurable results in 90 days.",
    benefits: ["90-Day Results", "Succession Planning", "Leadership Development"],
    primaryCta: { text: "Take the Legacy Growth IQ™ Quiz", href: "/quiz-intro" },
    secondaryCta: { text: "Schedule a Strategy Call", href: "/schedule-a-call" },
    isPublished: true,
    order: 1,
  },
  {
    id: "legacy-2",
    badge: "For Business Owners Ready to Scale",
    headline: "Stop Being the",
    highlightedText: "Bottleneck",
    subheadline: "If your business can't run without you, you don't have a business—you have a job. Let's change that together.",
    benefits: ["Systems & Processes", "Team Development", "Owner Freedom"],
    primaryCta: { text: "Get Your Free Assessment", href: "/quiz-intro" },
    secondaryCta: { text: "See Success Stories", href: "/success-stories" },
    isPublished: true,
    order: 2,
  },
  {
    id: "legacy-3",
    badge: "Legacy Transition Planning",
    headline: "What's Your",
    highlightedText: "Exit Strategy?",
    subheadline: "Whether you're selling, transitioning to family, or stepping back—we help you build a business that's ready for what's next.",
    benefits: ["Succession Planning", "Business Valuation", "Exit Readiness"],
    primaryCta: { text: "Plan Your Legacy", href: "/services" },
    secondaryCta: { text: "Learn More", href: "/about" },
    isPublished: true,
    order: 3,
  },
  {
    id: "legacy-4",
    badge: "Client Success Stories",
    headline: "Double Your Profits.",
    highlightedText: "Build Your Team.",
    subheadline: "Our clients have doubled profits, built leadership teams, and created real exit plans. You can too.",
    benefits: ["Proven Framework", "Real Results", "Personal Coaching"],
    primaryCta: { text: "Start Your Transformation", href: "/schedule-a-call" },
    secondaryCta: { text: "Read Case Studies", href: "/success-stories" },
    isPublished: true,
    order: 4,
  },
  {
    id: "legacy-5",
    badge: "The G.R.O.W.S. Framework",
    headline: "Grow with",
    highlightedText: "Purpose",
    subheadline: "Our proprietary 5-step framework helps you grow sustainably, strengthen leadership, and prepare for succession—all while building a legacy that lasts.",
    benefits: ["Strategic Planning", "Leadership Coaching", "Operational Excellence"],
    primaryCta: { text: "Discover G.R.O.W.S.", href: "/services" },
    secondaryCta: { text: "Take the Quiz", href: "/quiz-intro" },
    isPublished: true,
    order: 5,
  },
];

/**
 * Legacy 83 Trust Indicators
 * Display these in the hero section footer
 */
export const legacy83TrustIndicators = [
  { title: "20+ Years", subtitle: "Experience" },
  { title: "G.R.O.W.S.", subtitle: "Framework" },
  { title: "90-Day", subtitle: "Results" },
  { title: "Cincinnati", subtitle: "Based" },
  { title: "100+", subtitle: "Businesses Helped" },
];

/**
 * Legacy 83 Core Values
 * For use in about section and other marketing materials
 */
export const legacy83CoreValues = [
  {
    name: "Empathy",
    description: "We understand the unique challenges of entrepreneurship.",
  },
  {
    name: "Courage",
    description: "Bold decisions create breakthrough results.",
  },
  {
    name: "Accountability",
    description: "Growth happens when we own our outcomes.",
  },
  {
    name: "Growth",
    description: "Continuous improvement in all aspects of business and life.",
  },
];

/**
 * Legacy 83 Services
 * Core service offerings
 */
export const legacy83Services = [
  {
    id: "strategic-planning",
    title: "Strategic Planning",
    tagline: "Clarity. Focus. Forward momentum.",
    description: "Vision-aligned roadmaps that connect daily decisions to long-term legacy goals.",
    features: [
      "Business Vision Development",
      "Goal Setting & Tracking",
      "Strategic Roadmapping",
      "Performance Metrics",
    ],
  },
  {
    id: "leadership-coaching",
    title: "Leadership Coaching",
    tagline: "Lead with courage and conviction.",
    description: "Transform your leadership skills to empower teams and inspire change.",
    features: [
      "Executive Coaching",
      "Team Leadership",
      "Communication Skills",
      "Conflict Resolution",
    ],
  },
  {
    id: "operational-excellence",
    title: "Operational Excellence",
    tagline: "Work smarter. Grow faster.",
    description: "Streamline systems, reclaim time, and improve margins.",
    features: [
      "Process Optimization",
      "System Implementation",
      "Efficiency Analysis",
      "Cost Reduction",
    ],
  },
  {
    id: "legacy-transition",
    title: "Legacy Transition",
    tagline: "Pass it on with confidence.",
    description: "Plan for succession and build a business that endures.",
    features: [
      "Succession Planning",
      "Business Valuation",
      "Exit Strategy",
      "Knowledge Transfer",
    ],
  },
];

/**
 * Legacy 83 FAQ Items
 */
export const legacy83FAQs = [
  {
    question: "What is the Legacy Growth System?",
    answer: "The Legacy Growth System (G.R.O.W.S.) is a 5-step framework designed to help small business owners grow sustainably, strengthen leadership, and prepare for succession.",
  },
  {
    question: "Who does Legacy 83 Business work with?",
    answer: "We partner with small business owners, founders, and leadership teams who are ready to scale their businesses and create wealth that lasts for generations.",
  },
  {
    question: "How does leadership coaching help my business?",
    answer: "Leadership coaching develops self-awareness, accountability, and confidence in business leaders, helping teams perform at higher levels and sustain long-term growth.",
  },
  {
    question: "How long does it take to see results from working with Legacy 83 Business?",
    answer: "Every business is unique, but many of our clients begin to see measurable improvements in clarity, leadership effectiveness, and operational efficiency within the first 90 days of implementing the Legacy Growth System.",
  },
];

/**
 * Legacy 83 Company Info
 */
export const legacy83CompanyInfo = {
  name: "Legacy 83 Business",
  tagline: "Empowering business leaders to build wealth, inspire teams, and leave lasting legacies.",
  founder: "Icy Williams",
  address: {
    street: "4724 Vine Street",
    city: "Cincinnati",
    state: "OH",
    zip: "45217",
  },
  phone: "(513) 335-1978",
  altPhone: "(513) 980-1152",
  email: "info@legacy83business.com",
  website: "https://legacy83business.com",
  quizUrl: "https://quiz.legacy83business.com",
};
