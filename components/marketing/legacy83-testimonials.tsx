"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    quote: "Legacy 83 helped me double profits, build a leadership team, and create a real exit plan. I finally sleep at night knowing my business has a future.",
    author: "Alex R.",
    title: "Local Bistro Owner",
    location: "Cincinnati, OH",
    result: "2x profit growth in 12 months",
    rating: 5,
  },
  {
    id: 2,
    quote: "Before working with Icy, I was the bottleneck in everything. Now I have systems and a team I can trust. I actually took a vacation for the first time in 5 years.",
    author: "Marcus T.",
    title: "Construction Company Owner",
    location: "Dayton, OH",
    result: "Reduced owner hours by 40%",
    rating: 5,
  },
  {
    id: 3,
    quote: "The succession planning process was eye-opening. I now have a clear path to transition the business to my daughter while protecting our family's legacy.",
    author: "Patricia W.",
    title: "Manufacturing Business Owner",
    location: "Columbus, OH",
    result: "Complete succession plan in 6 months",
    rating: 5,
  },
  {
    id: 4,
    quote: "Icy's coaching transformed how I lead. My team is more engaged, we communicate better, and our revenue has grown 35% since we started working together.",
    author: "Jennifer M.",
    title: "Marketing Agency Founder",
    location: "Cincinnati, OH",
    result: "35% revenue increase",
    rating: 5,
  },
  {
    id: 5,
    quote: "The G.R.O.W.S. framework gave me clarity I didn't know I was missing. For the first time, I can see exactly where my business is going and how to get there.",
    author: "David K.",
    title: "Professional Services Firm Owner",
    location: "Northern Kentucky",
    result: "Clear 5-year strategic roadmap",
    rating: 5,
  },
];

export function Legacy83Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 to-amber-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
            Client Success Stories
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real results from real business owners who chose to build their legacy.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <Quote className="h-12 w-12 text-amber-400" />
              </div>
              
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-center font-medium leading-relaxed mb-8">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Result Badge */}
              <div className="flex justify-center mb-6">
                <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 text-sm px-4 py-1">
                  Result: {currentTestimonial.result}
                </Badge>
              </div>

              {/* Author */}
              <div className="text-center">
                <div className="font-semibold text-lg">{currentTestimonial.author}</div>
                <div className="text-muted-foreground">
                  {currentTestimonial.title} • {currentTestimonial.location}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-amber-500 w-6"
                      : "bg-slate-300 hover:bg-slate-400"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Testimonial Grid (Additional) */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <span className="font-semibold text-amber-600">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
