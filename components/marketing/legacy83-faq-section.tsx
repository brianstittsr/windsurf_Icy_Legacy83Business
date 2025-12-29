"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the Legacy Growth System?",
    answer: "The Legacy Growth System (G.R.O.W.S.) is our proprietary 5-step framework designed to help small business owners grow sustainably, strengthen leadership, and prepare for succession. It combines strategic planning, leadership coaching, operational excellence, and legacy transition planning into a cohesive approach tailored to your unique business.",
  },
  {
    question: "Who does Legacy 83 Business work with?",
    answer: "We partner with small business owners, founders, and leadership teams who are ready to scale their businesses and create wealth that lasts for generations. Our ideal clients typically have 5-50 employees, $500K-$10M in revenue, and are committed to building something that outlasts them.",
  },
  {
    question: "How does leadership coaching help my business?",
    answer: "Leadership coaching develops self-awareness, accountability, and confidence in business leaders. It helps you stop being the bottleneck, build a team you can trust, communicate more effectively, and make bold decisions that drive results. Our clients often see improved team performance, reduced owner hours, and increased profitability.",
  },
  {
    question: "How long does it take to see results?",
    answer: "Every business is unique, but many of our clients begin to see measurable improvements in clarity, leadership effectiveness, and operational efficiency within the first 90 days of implementing the Legacy Growth System. We focus on quick wins while building toward long-term transformation.",
  },
  {
    question: "What is the Legacy Growth IQ™ Quiz?",
    answer: "The Legacy Growth IQ™ Quiz is a free 2-minute assessment that helps you identify what's holding your business back and provides personalized insights on how to grow with purpose. It covers key areas like strategic clarity, leadership effectiveness, operational efficiency, and succession readiness.",
  },
  {
    question: "How is Legacy 83 different from other business coaches?",
    answer: "Unlike most business coaches who focus only on growth, we take a legacy-first approach. We help you build a business that thrives today AND endures for generations. You work directly with Icy Williams (not junior coaches), get a customized approach (not cookie-cutter programs), and see measurable results in 90 days.",
  },
  {
    question: "What does succession planning involve?",
    answer: "Our Legacy Transition service includes succession planning, business valuation, exit strategy development, and knowledge transfer. Whether you're planning to sell, transition to family, or step back from day-to-day operations, we help you build a business that's ready for what's next.",
  },
  {
    question: "How much does it cost to work with Legacy 83?",
    answer: "We offer various engagement options to fit different needs and budgets. The best way to understand pricing is to take our free Legacy Growth IQ™ Quiz and schedule a complimentary strategy call. We'll discuss your specific situation and recommend the right approach for you.",
  },
];

export function Legacy83FAQSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
            Common Questions
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get answers to the most common questions about working with Legacy 83 Business.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium hover:text-amber-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
              Contact us
            </a>{" "}
            or{" "}
            <a href="/schedule-a-call" className="text-amber-600 hover:text-amber-700 font-medium">
              schedule a free call
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
