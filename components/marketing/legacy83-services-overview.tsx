"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, Users, Settings, ArrowRightLeft, CheckCircle } from "lucide-react";

const services = [
  {
    title: "Strategic Planning",
    tagline: "Clarity. Focus. Forward momentum.",
    description:
      "Vision-aligned roadmaps that connect daily decisions to long-term legacy goals. We help you see the big picture and execute with precision.",
    icon: Target,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services/strategic-planning",
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
    description:
      "Transform your leadership skills to empower teams and inspire change. Build the confidence to make bold decisions that drive results.",
    icon: Users,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services/leadership-coaching",
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
    description:
      "Streamline systems, reclaim time, and improve margins. We help you build processes that scale without sacrificing quality.",
    icon: Settings,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services/operational-excellence",
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
    description:
      "Plan for succession and build a business that endures. Whether you're selling, transitioning to family, or stepping back—we prepare you for what's next.",
    icon: ArrowRightLeft,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    href: "/services/legacy-transition",
    features: [
      "Succession Planning",
      "Business Valuation",
      "Exit Strategy",
      "Knowledge Transfer",
    ],
  },
];

export function Legacy83ServicesOverview() {
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
                <ul className="grid grid-cols-2 gap-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${service.color}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="group/btn p-0 h-auto text-amber-600 hover:text-amber-700" asChild>
                  <Link href={service.href}>
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Not sure where to start? Take our free assessment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900" asChild>
              <Link href="/quiz-intro">
                Take the Legacy Growth IQ™ Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/schedule-a-call">
                Schedule a Strategy Call
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
