/**
 * Legacy Growth IQ Assessment Quiz Data
 * 10 questions to assess business sustainability and legacy readiness
 */

export interface QuizQuestion {
  id: number;
  question: string;
  category: 'independence' | 'vision' | 'leadership' | 'operations' | 'succession' | 'legacy';
}

export interface QuizAnswer {
  value: number;
  label: string;
}

export const quizAnswers: QuizAnswer[] = [
  { value: 1, label: "1 - Not at all true" },
  { value: 2, label: "2 - Slightly true" },
  { value: 3, label: "3 - Somewhat true" },
  { value: 4, label: "4 - Mostly true" },
  { value: 5, label: "5 - Absolutely true" },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "If something happened to me tomorrow, my business could still run without major disruption.",
    category: "independence",
  },
  {
    id: 2,
    question: "I have a clear, written vision for what I want my business and life to look like in 5-10 years.",
    category: "vision",
  },
  {
    id: 3,
    question: "My leadership team (or key employees) can make critical decisions without my constant involvement.",
    category: "leadership",
  },
  {
    id: 4,
    question: "I have documented systems and processes that someone else could follow to run the business.",
    category: "operations",
  },
  {
    id: 5,
    question: "I know what my business is worth today and what I want it to be worth when I exit.",
    category: "succession",
  },
  {
    id: 6,
    question: "There is a plan in place for succession, sale, or transition—even if it's years away.",
    category: "succession",
  },
  {
    id: 7,
    question: "I've taken steps to ensure the business continues creating impact and income even after I step away.",
    category: "legacy",
  },
  {
    id: 8,
    question: "I spend more time leading and thinking strategically than doing day-to-day tasks.",
    category: "leadership",
  },
  {
    id: 9,
    question: "My business is aligned with my personal wealth, health, and freedom goals.",
    category: "vision",
  },
  {
    id: 10,
    question: "If my family or team were suddenly left to manage the business, they'd know what to do.",
    category: "legacy",
  },
];

export interface ScoreRange {
  min: number;
  max: number;
  level: string;
  title: string;
  summary: string;
  description: string;
  recommendations: string[];
  urgency: 'critical' | 'high' | 'moderate' | 'low';
  ctaText: string;
}

export const scoreRanges: ScoreRange[] = [
  {
    min: 10,
    max: 20,
    level: "Critical",
    title: "Your Business is at Risk",
    summary: "Your business is heavily dependent on you and lacks the foundation for long-term sustainability.",
    description: "Based on your responses, your business would face significant challenges if you were unable to lead it. You're likely working IN the business rather than ON it, and there's little infrastructure in place for continuity. This is common among entrepreneurs who have built successful businesses through sheer effort—but it's also a ticking time bomb for your legacy.",
    recommendations: [
      "Immediately document your most critical processes and client relationships",
      "Identify and begin developing at least one key person who could step up",
      "Create a basic emergency operations plan",
      "Schedule a strategy session to assess your biggest vulnerabilities",
      "Consider what would happen to your family if something happened to you tomorrow"
    ],
    urgency: "critical",
    ctaText: "Get Emergency Planning Help"
  },
  {
    min: 21,
    max: 30,
    level: "Vulnerable",
    title: "Foundation Gaps Exist",
    summary: "You've started building some structure, but significant gaps remain in your business's ability to thrive without you.",
    description: "Your business has some elements of sustainability, but you're still the linchpin. You may have a vision but lack the systems, team, or succession plan to make it reality. Many business owners stay stuck at this level for years—working hard but never quite achieving the freedom they deserve.",
    recommendations: [
      "Develop a clear 3-year vision and share it with your team",
      "Create standard operating procedures for your top 10 recurring tasks",
      "Build a leadership team or identify high-potential employees to develop",
      "Get a professional business valuation to understand your starting point",
      "Implement weekly strategic planning time (work ON the business)"
    ],
    urgency: "high",
    ctaText: "Start Building Your Foundation"
  },
  {
    min: 31,
    max: 40,
    level: "Developing",
    title: "Making Progress",
    summary: "You're on the right track with some solid foundations, but there's room to strengthen your legacy infrastructure.",
    description: "You've done meaningful work to build a more sustainable business. You likely have some systems, a capable team, and at least a rough idea of your exit strategy. However, there are still areas where you're the bottleneck or where your plans need more development. The good news: you're closer to legacy-ready than most business owners.",
    recommendations: [
      "Refine your succession plan with specific timelines and candidates",
      "Strengthen your leadership team's decision-making authority",
      "Document and optimize your remaining owner-dependent processes",
      "Align your business strategy with your personal wealth and freedom goals",
      "Consider what 'legacy' truly means to you beyond financial value"
    ],
    urgency: "moderate",
    ctaText: "Accelerate Your Progress"
  },
  {
    min: 41,
    max: 50,
    level: "Legacy-Ready",
    title: "Built to Last",
    summary: "Congratulations! Your business has strong foundations for sustainability and legacy. Now it's about optimization and execution.",
    description: "You've built something remarkable—a business that can thrive beyond your daily involvement. You have vision, systems, leadership, and succession planning in place. Your focus now should be on fine-tuning, maximizing value, and ensuring your legacy unfolds exactly as you envision. You're in the top tier of business owners when it comes to legacy readiness.",
    recommendations: [
      "Optimize your business for maximum value before any transition",
      "Mentor your successor(s) and gradually transfer more responsibility",
      "Document your leadership philosophy and company culture for posterity",
      "Consider your broader legacy—community impact, industry influence, family wealth",
      "Enjoy the freedom you've earned while staying engaged strategically"
    ],
    urgency: "low",
    ctaText: "Maximize Your Legacy"
  },
];

export interface CategoryScore {
  category: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  insight: string;
}

export const categoryLabels: Record<string, string> = {
  independence: "Business Independence",
  vision: "Strategic Vision",
  leadership: "Leadership & Team",
  operations: "Systems & Operations",
  succession: "Succession Planning",
  legacy: "Legacy Readiness",
};

export const categoryInsights: Record<string, Record<string, string>> = {
  independence: {
    low: "Your business is heavily dependent on your daily involvement. This is your most critical area to address.",
    medium: "You've made some progress toward independence, but you're still essential to daily operations.",
    high: "Your business can function well without your constant presence. This is a strong foundation.",
  },
  vision: {
    low: "You lack a clear, documented vision for your business and personal future. This makes strategic decisions difficult.",
    medium: "You have some vision, but it may not be fully developed or aligned with your personal goals.",
    high: "You have a clear vision that guides your decisions and aligns with your personal aspirations.",
  },
  leadership: {
    low: "Your team lacks the capability or authority to lead without you. This is a significant bottleneck.",
    medium: "Your team has some leadership capacity, but still relies heavily on your direction.",
    high: "You've built a capable leadership team that can make decisions and drive results independently.",
  },
  operations: {
    low: "Your business lacks documented systems and processes. Knowledge lives in your head, not in the business.",
    medium: "You have some documentation, but many processes are still informal or owner-dependent.",
    high: "Your operations are well-documented and could be followed by others to run the business.",
  },
  succession: {
    low: "You have no succession plan in place. Your exit options are limited and unclear.",
    medium: "You've thought about succession but lack a concrete plan with timelines and candidates.",
    high: "You have a clear succession strategy with identified successors and a realistic timeline.",
  },
  legacy: {
    low: "Your business would struggle to continue creating impact without you. Your legacy is at risk.",
    medium: "You've taken some steps toward legacy, but more work is needed to ensure continuity.",
    high: "You've built a business designed to outlast you and continue creating value for stakeholders.",
  },
};

export function calculateResults(answers: Record<number, number>) {
  // Calculate total score
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  
  // Find the appropriate score range
  const scoreRange = scoreRanges.find(
    (range) => totalScore >= range.min && totalScore <= range.max
  ) || scoreRanges[0];

  // Calculate category scores
  const categoryScores: CategoryScore[] = [];
  const categories = ['independence', 'vision', 'leadership', 'operations', 'succession', 'legacy'];
  
  categories.forEach((category) => {
    const categoryQuestions = quizQuestions.filter((q) => q.category === category);
    const categoryScore = categoryQuestions.reduce(
      (sum, q) => sum + (answers[q.id] || 0),
      0
    );
    const maxScore = categoryQuestions.length * 5;
    const percentage = Math.round((categoryScore / maxScore) * 100);
    
    let insightLevel: 'low' | 'medium' | 'high';
    if (percentage < 40) insightLevel = 'low';
    else if (percentage < 70) insightLevel = 'medium';
    else insightLevel = 'high';

    categoryScores.push({
      category,
      label: categoryLabels[category],
      score: categoryScore,
      maxScore,
      percentage,
      insight: categoryInsights[category][insightLevel],
    });
  });

  // Sort by percentage (lowest first) to highlight areas needing attention
  const priorityAreas = [...categoryScores].sort((a, b) => a.percentage - b.percentage);

  return {
    totalScore,
    maxScore: 50,
    percentage: Math.round((totalScore / 50) * 100),
    scoreRange,
    categoryScores,
    priorityAreas,
    topStrength: priorityAreas[priorityAreas.length - 1],
    topWeakness: priorityAreas[0],
  };
}

export type QuizResults = ReturnType<typeof calculateResults>;
