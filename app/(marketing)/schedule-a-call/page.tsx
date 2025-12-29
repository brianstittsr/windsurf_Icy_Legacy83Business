"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Target,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Clarity on Your Challenges",
    description: "We'll identify what's really holding your business back.",
  },
  {
    icon: Users,
    title: "Personalized Recommendations",
    description: "Get specific advice tailored to your unique situation.",
  },
  {
    icon: MessageCircle,
    title: "No Pressure, No Pitch",
    description: "This is a genuine conversation, not a sales call.",
  },
];

const expectations = [
  "Discuss your current business challenges and goals",
  "Review your Legacy Growth IQ™ results (if you've taken the quiz)",
  "Explore potential strategies for growth and succession",
  "Determine if Legacy 83 is the right fit for you",
  "Answer any questions you have about our approach",
];

export default function ScheduleCallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-amber-500/50 text-amber-400">
              Free Strategy Call
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Let's Talk About Your{" "}
              <span className="text-amber-400">Legacy</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Schedule a complimentary 30-minute strategy call with Icy Williams to discuss 
              your business goals and explore how Legacy 83 can help.
            </p>

            <div className="flex items-center justify-center gap-6 text-gray-400 mb-10">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>30 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Video or Phone</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-amber-400" />
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Embed Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                {/* Placeholder for calendar embed */}
                <div className="bg-slate-100 p-12 text-center min-h-[500px] flex flex-col items-center justify-center">
                  <Calendar className="h-16 w-16 text-amber-500 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Book Your Strategy Call</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Select a time that works for you. Icy will personally reach out 
                    to confirm your appointment.
                  </p>
                  
                  {/* Temporary booking options until calendar is integrated */}
                  <div className="space-y-4 w-full max-w-sm">
                    <Button 
                      size="lg" 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
                      asChild
                    >
                      <a href="https://calendly.com/legacy83business" target="_blank" rel="noopener noreferrer">
                        <Calendar className="mr-2 h-5 w-5" />
                        Book via Calendly
                      </a>
                    </Button>
                    
                    <div className="text-center text-muted-foreground">or</div>
                    
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a href="tel:+15133351978">
                        <Phone className="mr-2 h-5 w-5" />
                        Call (513) 335-1978
                      </a>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a href="mailto:info@legacy83business.com?subject=Strategy Call Request">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Email to Schedule
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What to Expect on Your Call
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">During our conversation, we'll:</h3>
                <ul className="space-y-3">
                  {expectations.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 md:p-12">
              <blockquote className="text-xl md:text-2xl font-medium mb-6">
                "My strategy call with Icy was eye-opening. In just 30 minutes, she helped me 
                see blind spots I'd been missing for years. No pressure, just genuine insight."
              </blockquote>
              <div className="font-semibold">Marcus T.</div>
              <div className="text-muted-foreground text-sm">Construction Company Owner, Dayton OH</div>
            </div>
          </div>
        </div>
      </section>

      {/* Haven't Taken Quiz CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Haven't Taken the Quiz Yet?
            </h2>
            <p className="text-gray-400 mb-8">
              Get more out of your strategy call by taking our free Legacy Growth IQ™ Quiz first. 
              It only takes 2 minutes and will give us valuable insights to discuss.
            </p>
            <Button 
              size="lg" 
              className="bg-amber-500 hover:bg-amber-600 text-slate-900"
              asChild
            >
              <Link href="/quiz-intro">
                Take the Quiz First
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">Other Ways to Reach Us</h2>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+15133351978" className="text-amber-600 hover:underline">
                    (513) 335-1978
                  </a>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:info@legacy83business.com" className="text-amber-600 hover:underline text-sm">
                    info@legacy83business.com
                  </a>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground text-sm">
                    Cincinnati, OH
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
