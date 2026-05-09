"use client";

import Link from "next/link";
import {
  Rss, TrendingUp, Layers, Cpu, BookMarked,
  ArrowRight, CheckCircle2, Clock, Zap, Users, Globe,
} from "lucide-react";

const ENGINEERING_SOURCES = [
  "Netflix Tech Blog", "Uber Engineering", "Meta Engineering",
  "ByteByteGo", "Martin Fowler", "Discord Engineering",
  "High Scalability", "InfoQ", "dev.to",
];

const AI_SOURCES = [
  "HuggingFace", "OpenAI", "Anthropic",
  "Google DeepMind", "The Batch", "Import AI",
  "Papers With Code", "Towards Data Science", "Sebastian Raschka",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us your level",
    desc: "Pick SDE-1, SDE-2, or SDE-3. Select topics you care about — caching, LLMs, distributed systems, design patterns.",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    step: "02",
    title: "We fetch and classify",
    desc: "Every hour, our engine pulls from 20+ top sources. GPT-4o-mini reads each article and tags its level, type, and topics.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    step: "03",
    title: "Your feed, your pace",
    desc: "Browse recent articles or switch to Trending to see what engineers are actually reading. Save anything worth revisiting.",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
];

const LEVEL_DETAILS = [
  {
    level: "SDE-1",
    years: "0 – 2 years",
    color: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    topics: ["Load Balancer basics", "REST API design", "SQL vs NoSQL", "Caching 101", "Design Patterns"],
    desc: "Foundations first. Build intuition for how systems work before worrying about scale.",
  },
  {
    level: "SDE-2",
    years: "2 – 5 years",
    color: "border-blue-200 bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    topics: ["Distributed caching", "Message queues", "Rate limiting", "DB sharding", "Microservices"],
    desc: "Scalability, tradeoffs, and real production concerns. What you need to ace FAANG interviews.",
  },
  {
    level: "SDE-3",
    years: "5+ years",
    color: "border-purple-200 bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    topics: ["Multi-region architecture", "Consensus protocols", "Platform migrations", "ML infrastructure", "Data mesh"],
    desc: "Staff-level thinking. Cross-org decisions, deep tradeoffs, and leadership-tier design.",
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600 opacity-20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-0 w-[300px] h-[300px] bg-amber-500 opacity-10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-28 text-center">
          {/* Logo mark */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
            <Rss size={15} className="text-indigo-300" />
            <span className="text-indigo-200">Live feed · Updated every hour</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Stay ahead in<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              system design
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            A personalized engineering feed — LLD, HLD, and AI updates — curated for your career level. 20 sources. Zero noise.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-900/40"
            >
              Get started — it&apos;s free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-colors backdrop-blur-sm"
            >
              Browse feed
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-16 flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {[
              { icon: <Globe size={18} />, label: "20+ sources", sub: "Engineering + AI" },
              { icon: <Clock size={18} />, label: "Hourly updates", sub: "Auto-polled via RSS" },
              { icon: <Zap size={18} />, label: "AI-classified", sub: "GPT-4o-mini tagging" },
              { icon: <Users size={18} />, label: "3 career levels", sub: "SDE-1, 2, and 3" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center gap-1.5 text-indigo-300">{s.icon}</div>
                <p className="text-white font-bold text-sm">{s.label}</p>
                <p className="text-slate-400 text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl font-extrabold text-slate-900">From source to your feed in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className={`rounded-2xl border p-7 ${s.color}`}>
                <p className="text-3xl font-black opacity-30 mb-4">{s.step}</p>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEVEL BREAKDOWN ──────────────────────────────── */}
      <section className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Calibrated content</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Right content for your level</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm">
              Every article is tagged by an AI classifier. No more reading content that&apos;s too basic or too advanced.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LEVEL_DETAILS.map((l) => (
              <div key={l.level} className={`rounded-2xl border-2 p-6 ${l.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${l.badge}`}>{l.level}</span>
                  <span className="text-xs text-slate-400 font-medium">{l.years}</span>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{l.desc}</p>
                <div className="space-y-1.5">
                  {l.topics.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={13} className="text-slate-400 flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DUAL FEED ─────────────────────────────────────── */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Two feeds, one place</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Engineering + AI, side by side</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engineering */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Layers size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Engineering Feed</h3>
                  <p className="text-xs text-slate-500">System design · LLD · HLD</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {ENGINEERING_SOURCES.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 text-xs font-medium rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded border border-orange-200">LLD</span>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded border border-sky-200">HLD</span>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded border border-rose-200">Both</span>
              </div>
            </div>

            {/* AI Updates */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Cpu size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">AI Updates Feed</h3>
                  <p className="text-xs text-slate-500">LLMs · Agents · Research · Products</p>
                </div>
                <span className="ml-auto px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-bold rounded-full">NEW</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {AI_SOURCES.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-white border border-amber-200 text-amber-700 text-xs font-medium rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["LLMs", "RAG", "Agents", "Fine-tuning", "Alignment"].map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded border border-amber-200">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────── */}
      <section className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Features</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Everything you need to stay sharp</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icon: <Zap size={20} className="text-indigo-500" />, title: "AI-generated summaries", desc: "Every article gets a 2-3 sentence TL;DR so you can decide if it's worth reading in full." },
              { icon: <TrendingUp size={20} className="text-orange-500" />, title: "Trending this week", desc: "Ranked by saves (3×) + views within the last 7 days. See what peers actually find valuable." },
              { icon: <BookMarked size={20} className="text-emerald-500" />, title: "Save for later", desc: "Bookmark any article and find it instantly in your Saved section — no more lost tabs." },
              { icon: <Layers size={20} className="text-blue-500" />, title: "LLD vs HLD filter", desc: "Want only low-level design? Only architecture? Filter instantly, no wasted scroll time." },
              { icon: <Clock size={20} className="text-violet-500" />, title: "Hourly fresh content", desc: "Celery Beat polls all 20 sources every hour. You wake up to new content, always." },
              { icon: <Cpu size={20} className="text-amber-500" />, title: "15 AI topic tags", desc: "From RAG to Alignment to Inference Serving — AI articles are tagged with precision." },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="mb-3 p-2 bg-slate-50 rounded-lg w-fit">{f.icon}</div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── vs. alternatives ─────────────────────────────── */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Why SDE Hub</p>
            <h2 className="text-3xl font-extrabold text-slate-900">What others are missing</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 text-slate-500 font-semibold">Platform</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-semibold">Level filter</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-semibold">AI updates</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-semibold">Live feed</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-semibold">Free</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "SDE Hub", level: true, ai: true, live: true, free: true, highlight: true },
                  { name: "ByteByteGo", level: false, ai: false, live: false, free: false },
                  { name: "Medium / Substack", level: false, ai: false, live: true, free: false },
                  { name: "Blind / Leetcode", level: false, ai: false, live: true, free: true },
                  { name: "LinkedIn", level: false, ai: false, live: true, free: true },
                ].map((row) => (
                  <tr key={row.name} className={row.highlight ? "bg-indigo-50" : ""}>
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      {row.highlight ? (
                        <span className="flex items-center gap-2">
                          <Rss size={14} className="text-indigo-600" />
                          {row.name}
                        </span>
                      ) : row.name}
                    </td>
                    {[row.level, row.ai, row.live, row.free].map((v, i) => (
                      <td key={i} className="text-center px-4 py-3">
                        {v ? (
                          <span className="text-emerald-500 font-bold">✓</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 py-20 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            <Rss size={13} />
            SDE Hub
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Start learning smarter today
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Free forever. No credit card. Just pick your level and read.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Create free account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/feed"
              className="px-8 py-3.5 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Browse without signing up →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
