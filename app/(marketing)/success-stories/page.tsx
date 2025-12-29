import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Quote,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Star,
  Building2,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Success Stories | Legacy 83 Business",
  description:
    "Real results from real business owners. See how Legacy 83 has helped entrepreneurs build lasting legacies through strategic coaching.",
};

const featuredStory = {
  name: "Alex Richardson",
  company: "Richardson's Bistro Group",
  industry: "Restaurant/Hospitality",
  location: "Cincinnati, OH",
  image: "/images/testimonial-alex.jpg",
  quote:
    "Legacy 83 helped me double profits, build a leadership team, and create a real exit plan. I finally sleep at night knowing my business has a future.",
  challenge:
    "Alex was working 70+ hours a week running three restaurant locations. Despite strong revenue, profits were thin, and he had no leadership team he could trust. At 58, he knew he needed to prepare for exit but had no idea where to start.",
  solution:
    "Through the G.R.O.W.S. framework, we helped Alex develop a clear strategic vision, build a leadership team, and implement systems that allowed him to step back from daily operations.",
  results: [
    { metric: "Revenue Growth", value: "127%", period: "in 18 months" },
    { metric: "Profit Margin", value: "2x", period: "improvement" },
    { metric: "Hours Worked", value: "40", period: "down from 70+" },
    { metric: "Exit Timeline", value: "3 years", period: "clear plan" },
  ],
};

const successStories = [
  {
    name: "Jennifer Walsh",
    company: "Walsh & Associates CPA",
    industry: "Accounting",
    location: "Columbus, OH",
    quote:
      "I went from being the only one who could do everything to having a team that runs the firm better than I ever did alone.",
    challenge: "Partner succession planning, talent retention",
    results: ["Built leadership team of 4", "Reduced owner hours by 50%", "Increased firm value 3x"],
    rating: 5,
  },
  {
    name: "Marcus Thompson",
    company: "Thompson Manufacturing",
    industry: "Manufacturing",
    location: "Dayton, OH",
    quote:
      "Icy helped me see that my business wasn't ready to sell—and showed me exactly what to fix. Two years later, I sold for 40% more than my original valuation.",
    challenge: "Exit strategy, business valuation",
    results: ["40% higher sale price", "Successful transition", "18-month timeline"],
    rating: 5,
  },
  {
    name: "Dr. Sarah Chen",
    company: "Chen Family Dental",
    industry: "Healthcare",
    location: "Cincinnati, OH",
    quote:
      "I was burning out trying to be a dentist and a business owner. Now I have systems that let me focus on what I love—caring for patients.",
    challenge: "Work-life balance, operational systems",
    results: ["Added 2 associate dentists", "30% revenue increase", "4-day work week"],
    rating: 5,
  },
  {
    name: "Robert Mitchell",
    company: "Mitchell Construction",
    industry: "Construction",
    location: "Northern Kentucky",
    quote:
      "The succession planning process was eye-opening. My son is now ready to take over, and I have peace of mind about the family legacy.",
    challenge: "Family succession, leadership development",
    results: ["Son promoted to President", "Smooth 2-year transition", "Family harmony preserved"],
    rating: 5,
  },
  {
    name: "Amanda Foster",
    company: "Foster Marketing Group",
    industry: "Marketing Agency",
    location: "Cincinnati, OH",
    quote:
      "We went from chaos to clarity. The G.R.O.W.S. framework gave us a roadmap that the whole team could follow.",
    challenge: "Scaling operations, team alignment",
    results: ["Team grew from 12 to 28", "Doubled annual revenue", "Improved client retention 40%"],
    rating: 5,
  },
  {
    name: "David Kowalski",
    company: "Midwest Home Furnishings",
    industry: "Retail",
    location: "Cincinnati, OH",
    quote:
      "After 40 years in business, I thought I knew everything. Icy showed me what I was missing and helped me prepare for the next chapter.",
    challenge: "Business modernization, succession",
    results: ["E-commerce launch", "Next-gen leadership ready", "Clear 5-year exit plan"],
    rating: 5,
  },
];

const stats = [
  { value: "250+", label: "Businesses Transformed" },
  { value: "$47M", label: "Revenue Generated" },
  { value: "92%", label: "Client Satisfaction" },
  { value: "4.9", label: "Average Rating" },
];

export default function SuccessStoriesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-amber-500/50 text-amber-400">
              Success Stories
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Real Results from{" "}
              <span className="text-amber-400">Real Business Owners</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it. See how Legacy 83 has helped entrepreneurs 
              across industries build businesses that thrive today and endure for generations.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-amber-500">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Story */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
              Featured Success Story
            </Badge>
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-8 md:p-12 flex flex-col justify-center">
                  <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-white">AR</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{featuredStory.name}</h3>
                  <p className="text-amber-700 mb-4">{featuredStory.company}</p>
                  <div className="flex items-center gap-4 text-sm text-amber-800">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {featuredStory.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {featuredStory.location}
                    </span>
                  </div>
                </div>
                <CardContent className="p-8 md:p-12">
                  <Quote className="h-10 w-10 text-amber-400 mb-4" />
                  <p className="text-xl italic text-muted-foreground mb-6">
                    "{featuredStory.quote}"
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">The Challenge:</h4>
                    <p className="text-sm text-muted-foreground">{featuredStory.challenge}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">The Solution:</h4>
                    <p className="text-sm text-muted-foreground">{featuredStory.solution}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {featuredStory.results.map((result) => (
                      <div key={result.metric} className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">{result.value}</div>
                        <div className="text-xs text-muted-foreground">{result.metric}</div>
                        <div className="text-xs text-muted-foreground">{result.period}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* More Success Stories */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              More Success Stories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Every business is unique, but the results speak for themselves.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {successStories.map((story) => (
              <Card key={story.name} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-amber-600">
                        {story.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <Quote className="h-6 w-6 text-amber-400 mb-2" />
                  <p className="text-sm italic text-muted-foreground mb-4">
                    "{story.quote}"
                  </p>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      <strong>Challenge:</strong> {story.challenge}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {story.results.map((result) => (
                        <Badge key={result} variant="secondary" className="text-xs">
                          {result}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Placeholder */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">Hear It From Them</h2>
            <p className="mt-2 text-muted-foreground">
              Watch video testimonials from our clients
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="aspect-video flex items-center justify-center bg-slate-100">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-2">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Video Coming Soon</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-6 text-amber-400" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Write Your Success Story?
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Join the hundreds of business owners who have transformed their companies 
            with Legacy 83. Your legacy starts today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="text-lg px-8 bg-amber-500 hover:bg-amber-600 text-slate-900"
              asChild
            >
              <Link href="/schedule-a-call">
                Schedule a Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white/30 hover:bg-white/10"
              asChild
            >
              <Link href="/quiz-intro">
                Take the Free Quiz
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
