"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { CheckCircle2, Loader2 } from "lucide-react";

const LEVELS = [
  {
    value: "SDE-1",
    title: "SDE-1",
    subtitle: "0–2 years",
    desc: "Fundamentals, LLD patterns, basic system concepts",
    color: "border-emerald-300 bg-emerald-50",
    activeColor: "ring-emerald-400",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    value: "SDE-2",
    title: "SDE-2",
    subtitle: "2–5 years",
    desc: "Distributed systems, scalability, production architecture",
    color: "border-blue-300 bg-blue-50",
    activeColor: "ring-blue-400",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    value: "SDE-3",
    title: "SDE-3",
    subtitle: "5+ years",
    desc: "Deep dives, cross-org architecture, staff-level design",
    color: "border-purple-300 bg-purple-50",
    activeColor: "ring-purple-400",
    badge: "bg-purple-100 text-purple-700",
  },
];

const ALL_TOPICS = [
  "Caching", "Databases", "Messaging Queues", "Load Balancing",
  "Rate Limiting", "Authentication", "API Design", "Microservices",
  "Storage", "Search", "Monitoring", "CDN", "Concurrency",
  "Object-Oriented Design", "Design Patterns", "Distributed Systems",
  "Streaming", "System Architecture",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/signup");
  }, [router]);

  function toggleTopic(t: string) {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  async function handleFinish() {
    if (!selectedLevel) return;
    setLoading(true);
    setError("");
    try {
      await authApi.onboarding(selectedLevel, selectedTopics);
      router.push("/feed");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= s ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
            }`}>
              {s}
            </div>
            {s < 2 && <div className={`h-0.5 w-16 rounded ${step > s ? "bg-indigo-600" : "bg-slate-200"}`} />}
          </div>
        ))}
        <span className="ml-2 text-sm text-slate-400">Step {step} of 2</span>
      </div>

      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">What&apos;s your current level?</h1>
          <p className="text-slate-500 text-sm mb-8">We&apos;ll calibrate your feed to match your experience.</p>

          <div className="space-y-3">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                onClick={() => setSelectedLevel(l.value)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                  selectedLevel === l.value
                    ? `${l.color} ring-2 ${l.activeColor} ring-offset-2`
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${l.badge}`}>{l.title}</span>
                    <span className="text-xs text-slate-400">{l.subtitle}</span>
                  </div>
                  <p className="text-sm text-slate-600">{l.desc}</p>
                </div>
                {selectedLevel === l.value && <CheckCircle2 size={20} className="text-indigo-600 flex-shrink-0" />}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedLevel}
            onClick={() => setStep(2)}
            className="mt-6 w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Pick your interests</h1>
          <p className="text-slate-500 text-sm mb-6">Select topics you want to see more of. Pick as many as you like.</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {ALL_TOPICS.map((t) => {
              const active = selectedTopics.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 bg-white"
                  }`}
                >
                  {active && <CheckCircle2 size={12} className="inline mr-1 mb-0.5" />}
                  {t}
                </button>
              );
            })}
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium">
              ← Back
            </button>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Setting up…" : "Take me to my feed →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
