import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Eye,
  Heart,
  Users,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Quote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Icy Williams | Legacy 83 Business",
  description:
    "Meet Icy Williams, founder of Legacy 83 Business. With 20+ years of experience, she helps business leaders build wealth, inspire teams, and leave lasting legacies.",
};

const values = [
  {
    icon: Heart,
    title: "Empathy",
    description:
      "We understand the unique challenges of entrepreneurship. Your struggles are valid, and we meet you where you are.",
  },
  {
    icon: Sparkles,
    title: "Courage",
    description:
      "Bold decisions create breakthrough results. We help you find the courage to make the changes your business needs.",
  },
  {
    icon: Target,
    title: "Accountability",
    description:
      "Growth happens when we own our outcomes. We hold ourselves—and you—to the highest standards.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description:
      "Continuous improvement in all aspects of business and life. We believe there's always room to grow.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-amber-500/50 text-amber-400">
              About Legacy 83 Business
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Legacy is Built on Purpose,{" "}
              <span className="text-amber-400">Not Luck</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              We believe every business owner has the potential to create something extraordinary—
              a legacy that outlasts them and impacts generations.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Icy Williams */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/IcyWilliams.jpg"
                  alt="Icy Williams - Founder & Lead Coach of Legacy 83 Business"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-xs">
                <Quote className="h-6 w-6 text-amber-400 mb-2" />
                <p className="text-sm text-muted-foreground italic">
                  "Your business should be a vehicle for your legacy, not a prison that holds you captive."
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Meet Icy Williams
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  For over two decades, Icy Williams has been helping business leaders unlock 
                  their potential and build lasting legacies. After witnessing countless talented 
                  entrepreneurs struggle—not from lack of vision, but from lack of strategic 
                  execution—Icy founded Legacy 83 to bridge that gap.
                </p>
                <p>
                  Legacy 83 partners with small business owners and solo entrepreneurs to create 
                  sustainable growth strategies that honor both profit and purpose. We believe 
                  that building a legacy isn't about working harder—it's about working smarter, 
                  leading better, and planning for what comes next.
                </p>
                <p>
                  Based in Cincinnati, Ohio, Icy works with business owners across the country 
                  who are ready to stop being the bottleneck in their own businesses and start 
                  building something that will outlast them.
                </p>
              </div>
              <Button className="mt-8 bg-amber-500 hover:bg-amber-600 text-slate-900" asChild>
                <Link href="/schedule-a-call">
                  Schedule a Call with Icy
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card className="border-2 border-amber-500/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  Empowering business leaders to build wealth, inspire teams, and leave 
                  lasting legacies. We help entrepreneurs create businesses that thrive 
                  today and endure for generations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-500/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  A world where every business owner has the clarity, confidence, and 
                  support to build a company that reflects their values, serves their 
                  community, and creates a legacy worth leaving behind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
                Our Story
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why "Legacy 83"?
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                The name "Legacy 83" represents a deeply personal commitment. 83 symbolizes 
                the year that shaped Icy's understanding of what it means to build something 
                that lasts—a reminder that legacy isn't about what you accumulate, but what 
                you leave behind.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-6">
                Too many business owners pour their hearts into building companies, only to 
                realize they've created a job they can't escape rather than a business that 
                serves them. They work 60+ hours a week, can't take vacations, and have no 
                idea how they'll ever step away.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-6">
                Legacy 83 was founded to change that story. We help business owners transform 
                their companies into assets that work for them—businesses with strong teams, 
                solid systems, and clear succession plans. Because your business should be a 
                vehicle for your legacy, not a prison that holds you captive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
              What We Stand For
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Core Values</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Legacy 83.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value) => (
              <Card key={value.title} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The G.R.O.W.S. Framework */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
              Our Approach
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              The Legacy Growth System™
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Our proprietary G.R.O.W.S. framework is designed to help small business owners 
              achieve sustainable growth, strengthen leadership, and prepare for succession.
            </p>
            
            <div className="grid grid-cols-5 gap-4 mb-12">
              {["G", "R", "O", "W", "S"].map((letter, index) => (
                <div key={letter} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-white">{letter}</span>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {["Goals", "Roadmap", "Operations", "Workforce", "Succession"][index]}
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900" asChild>
              <Link href="/services">
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Build Your Legacy?
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Take the first step toward building a business that outlasts you. 
            Schedule a free strategy call with Icy today.
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
                Take the Legacy Growth IQ™ Quiz
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
