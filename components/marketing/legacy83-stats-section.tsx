"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    value: 20,
    suffix: "+",
    label: "Years Experience",
    description: "Helping business leaders succeed",
  },
  {
    value: 100,
    suffix: "+",
    label: "Businesses Transformed",
    description: "Across multiple industries",
  },
  {
    value: 90,
    suffix: "",
    label: "Day Results",
    description: "Measurable improvements guaranteed",
  },
  {
    value: 2,
    suffix: "x",
    label: "Average Profit Growth",
    description: "For clients in first year",
  },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-amber-500">
      {displayValue}{suffix}
    </span>
  );
}

export function Legacy83StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-400">
            Proven Results
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The Legacy 83 Difference
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            We don't just coach—we partner with you to create measurable, lasting change.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="mt-2 text-lg font-semibold">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
