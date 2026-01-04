"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, Users, Settings, ArrowRightLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const services = [
  {
    title: "Strategic Planning",
    tagline: "Clarity. Focus. Forward momentum.",
    growsLetter: "G",
    growsWord: "Goals",
    description:
      "Vision-aligned roadmaps that connect daily decisions to long-term legacy goals. We help you see the big picture and execute with precision.",
    expandedContent:
      "In the G.R.O.W.S. framework, Goals form the foundation. We work with you to define your 10-year vision, 3-year picture, and 1-year plan. Through quarterly rocks and weekly priorities, we ensure every action moves you toward your legacy.",
    icon: Target,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services#strategic-planning",
    features: [
      "Business Vision Development",
      "Goal Setting & Tracking",
      "Strategic Roadmapping",
      "Performance Metrics",
    ],
  },
  {
    title: "Leadership Coaching",
    tagline: "Lead with courage and conviction.",
    growsLetter: "W",
    growsWord: "Workforce",
    description:
      "Transform your leadership skills to empower teams and inspire change. Build the confidence to make bold decisions that drive results.",
    expandedContent:
      "The Workforce pillar focuses on developing leaders at every level. We help you build a leadership team you can trust, create accountability structures, and develop the next generation of leaders who will carry your legacy forward.",
    icon: Users,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services#leadership-coaching",
    features: [
      "Executive Coaching",
      "Team Leadership",
      "Communication Skills",
      "Conflict Resolution",
    ],
  },
  {
    title: "Operational Excellence",
    tagline: "Work smarter. Grow faster.",
    growsLetter: "O",
    growsWord: "Operations",
    description:
      "Streamline systems, reclaim time, and improve margins. We help you build processes that scale without sacrificing quality.",
    expandedContent:
      "Operations is where strategy meets execution. We implement systems that run without you—documented processes, clear accountability, and metrics that matter. The goal: a business that works FOR you, not one that depends ON you.",
    icon: Settings,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services#operational-excellence",
    features: [
      "Process Optimization",
      "System Implementation",
      "Efficiency Analysis",
      "Cost Reduction",
    ],
  },
  {
    title: "Legacy Transition",
    tagline: "Pass it on with confidence.",
    growsLetter: "S",
    growsWord: "Succession",
    description:
      "Plan for succession and build a business that endures. Whether you're selling, transitioning to family, or stepping back—we prepare you for what's next.",
    expandedContent:
      "Succession is the ultimate test of a legacy business. We help you understand your business's true value, develop exit strategies, and ensure a smooth transition—whether to family, employees, or a buyer. Your legacy deserves a proper ending.",
    icon: ArrowRightLeft,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services#legacy-transition",
    features: [
      "Succession Planning",
      "Business Valuation",
      "Exit Strategy",
      "Knowledge Transfer",
    ],
  },
];

export function Legacy83ServicesOverview() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (title: string) => {
    setExpandedCard(expandedCard === title ? null : title);
  };

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
            The G.R.O.W.S. Framework
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How We Help You Build a Legacy
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We don't offer cookie-cutter programs. Instead, we co-create strategies tailored to your 
            unique vision, challenges, and goals—with measurable results in 90 days.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="relative overflow-hidden group hover:shadow-lg transition-shadow border-0 shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base font-medium text-amber-600">
                  {service.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                
                {/* G.R.O.W.S. Badge */}
                <div className="flex items-center gap-2 py-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{service.growsLetter}</span>
                  </div>
                  <span className="text-sm font-medium text-amber-700">G.R.O.W.S. Framework: {service.growsWord}</span>
                </div>

                <ul className="grid grid-cols-2 gap-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${service.color}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Expanded Content */}
                {expandedCard === service.title && (
                  <div className="pt-4 border-t border-amber-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm text-muted-foreground mb-4">{service.expandedContent}</p>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900" asChild>
                      <Link href="/schedule-a-call">
                        Get Started with {service.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}

                <Button 
                  variant="ghost" 
                  className="group/btn p-0 h-auto text-amber-600 hover:text-amber-700"
                  onClick={() => toggleCard(service.title)}
                >
                  {expandedCard === service.title ? (
                    <>
                      Show less
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Learn more
                      <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-y-0.5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sign Up CTA */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Your Legacy?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join hundreds of business owners who have transformed their companies with the G.R.O.W.S. framework. 
            Take the first step today—it's free and takes just 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg bg-amber-500 hover:bg-amber-600 text-slate-900" asChild>
              <Link href="/quiz-intro">
                Take the Free Legacy Growth IQ™ Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-amber-400 text-amber-400 hover:bg-amber-400/20 hover:text-amber-300" asChild>
              <Link href="/schedule-a-call">
                Schedule a Free Strategy Call
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            No commitment required. Discover what's holding your business back.
          </p>
        </div>
      </div>
    </section>
  );
}
