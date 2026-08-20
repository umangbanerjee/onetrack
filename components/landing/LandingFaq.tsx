"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Why should I use OneTrack instead of Notion or Google Sheets?",
    answer:
      "Spreadsheets and Notion databases require tedious manual cell editing, slow modal loading, and complex formula setups for charts. OneTrack is purpose-built for job hunts: it allows you to log any application in under 5 seconds with a keyboard shortcut [N], automatically calculates conversion velocity charts, provides a 7-day habit streak tracker, and works as a fast 1-tap mobile PWA.",
  },
  {
    question: "Can I install OneTrack on my iPhone, Android, or desktop?",
    answer:
      "Yes! OneTrack is a Progressive Web App (PWA). You can install it on iOS Safari (via 'Add to Home Screen'), Android Chrome (via the 1-click install prompt), and macOS/Windows Chrome or Edge for a full standalone, app-like experience with offline caching.",
  },
  {
    question: "Can I customize the interview stages and job sourcing channels?",
    answer:
      "Absolutely. OneTrack comes with 8 standard stages (Applied, Online Assessment, Interview Scheduled, Offer, Rejected, etc.) and recruitment channels (LinkedIn, Referral, Wellfound, Campus, etc.), and you can customize them to match your personal workflow.",
  },
  {
    question: "How does the Daily Streak and Habit Matrix work?",
    answer:
      "Job searches require daily momentum. OneTrack tracks every day you submit applications and renders a 7-day habit dot matrix (Mon–Sun) alongside weekly target pacing (e.g. 10 applications/week). This gamified feedback loop keeps you consistent during hiring sprints.",
  },
  {
    question: "Is my application data private and secure?",
    answer:
      "Yes. Your application data is tied exclusively to your authenticated user account with strict Row-Level Security (RLS) isolation. Only you can view, edit, or manage your pipeline.",
  },
  {
    question: "Is OneTrack completely free to use?",
    answer:
      "Yes, OneTrack is 100% free with unlimited applications, real-time analytics, habit tracking, and PWA installation included.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 font-mono">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-sm transition-colors ${
              isOpen ? "border-foreground/40 bg-secondary/30" : "border-border bg-card hover:border-border/80"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-foreground focus:outline-hidden"
            >
              <span>{faq.question}</span>
              <div className="h-6 w-6 rounded-sm bg-secondary flex items-center justify-center shrink-0 border border-border">
                {isOpen ? (
                  <Minus className="h-3.5 w-3.5 text-foreground" />
                ) : (
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3 animate-in fade-in duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
