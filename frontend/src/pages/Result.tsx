import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

 

function scoreTheme(score: number) {
  if (score >= 8) {
    return {
      ring: "#10b981", // emerald-500
      text: "text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bar: "from-emerald-500 to-emerald-400",
      solid: "bg-emerald-500",
    };
  }
  if (score >= 5) {
    return {
      ring: "#f59e0b", // amber-500
      text: "text-amber-600",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "from-amber-500 to-amber-400",
      solid: "bg-amber-500",
    };
  }
  return {
    ring: "#f43f5e", // rose-500
    text: "text-rose-600",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "from-rose-500 to-rose-400",
    solid: "bg-rose-500",
  };
}

 
function scoreCategory(score: number, max = 10) {
  const pct = (score / max) * 100;
  if (pct >= 80) return { label: "Excellent", className: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (pct >= 50) return { label: "Good", className: "text-amber-700 bg-amber-50 border-amber-200" };
  return { label: "Needs Improvement", className: "text-rose-700 bg-rose-50 border-rose-200" };
}

 
function recommendation(score: number, max = 10) {
  const pct = (score / max) * 100;
  if (pct >= 80) {
    return {
      label: "Strongly Recommended",
      className: "bg-emerald-600 text-white",
      icon: "check",
    };
  }
  if (pct >= 50) {
    return {
      label: "Recommended with Reservations",
      className: "bg-amber-500 text-white",
      icon: "flag",
    };
  }
  return {
    label: "Not Recommended",
    className: "bg-rose-600 text-white",
    icon: "x",
  };
}

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  const theme = scoreTheme(score);
  return (
    <div
      className="h-2 w-full rounded-full bg-slate-100 overflow-hidden"
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-[width] duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

 
function ScoreGauge({ score, max = 10 }: { score: number; max?: number }) {
  const theme = scoreTheme(score);
  const pct = Math.max(0, Math.min(1, score / max));
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" className="stroke-slate-100" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={theme.ring}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold tabular-nums ${theme.text}`}>{score}</span>
        <span className="text-[11px] font-medium text-slate-400">out of {max}</span>
      </div>
    </div>
  );
}

 

function Icon({ name }: { name: "check" | "flag" | "x" | "print" | "download" | "users" | "chart" | "badge" }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "check":
      return <svg {...common}><path d="M20 6L9 17l-5-5" /></svg>;
    case "flag":
      return <svg {...common}><path d="M4 22V4h14l-3 4 3 4H4" /></svg>;
    case "x":
      return <svg {...common}><path d="M18 6L6 18M6 6l12 12" /></svg>;
    case "print":
      return (
        <svg {...common}>
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <path d="M6 14h12v8H6z" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="M7 10l5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
      );
    case "badge":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="M9 14.5L7 22l5-3 5 3-2-7.5" />
        </svg>
      );
  }
}

 

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: "chart" | "users" | "badge";
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon name={icon} />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}

 

function ResultSkeleton() {
  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="mx-auto max-w-5xl animate-pulse space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-4 h-5 w-28 rounded-full bg-slate-100" />
          <div className="mb-6 h-9 w-72 rounded-lg bg-slate-100" />
          <div className="flex flex-wrap gap-3">
            <div className="h-4 w-40 rounded bg-slate-100" />
            <div className="h-4 w-32 rounded bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl border border-slate-200 bg-white shadow-sm" />
          ))}
        </div>
        <div className="h-40 rounded-3xl border border-slate-200 bg-white shadow-sm" />
        {[1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl border border-slate-200 bg-white shadow-sm" />
        ))}
      </div>
    </div>
  );
}

 

function Result() {
  const { sessionId } = useParams();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/api/interview/result/${sessionId}`)
      .then((res) => setResult(res.data))
      .catch(console.error);
  }, [sessionId]);

  const Backdrop = (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white print:hidden">
      <div className="absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-indigo-100/60 blur-[110px]" />
      <div className="absolute top-1/4 -right-32 h-[22rem] w-[22rem] rounded-full bg-violet-100/50 blur-[110px]" />
    </div>
  );

  if (!result) {
    return (
      <>
        {Backdrop}
        <ResultSkeleton />
      </>
    );
  }

  const avgScore = Number(result.average_score) || 0;
  const hasQuestions = Array.isArray(result.results) && result.results.length > 0;
  const category = scoreCategory(avgScore);
  const rec = recommendation(avgScore);

  const strongAnswers = hasQuestions
    ? result.results.filter((r: any) => (Number(r.score) || 0) >= 8).length
    : 0;

  const handlePrint = () => {
    window.print();
  };

  
 const handleDownloadPdf = async () => {
  const report = document.getElementById("report-content");

  if (!report) return;

  try {
    const imgData = await toPng(report, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const img = new Image();

    img.src = imgData;

    img.onload = () => {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save(
        `Interview_Report_${result.candidate_name.replace(/\s+/g, "_")}.pdf`
      );
    };
  } catch (error) {
    console.error(error);
    alert("Failed to generate PDF.");
  }
};

  return (
    <div className="min-h-screen p-4 sm:p-10 print:p-0">
      {Backdrop}

      <div
  id="report-content"
  className="mx-auto max-w-5xl"
>
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Icon name="print" />
            Print Report
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(99,102,241,0.3)] transition hover:shadow-[0_8px_22px_rgba(99,102,241,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Icon name="download" />
            Download PDF
          </button>
        </div>

        {/* Header card */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-8px_rgba(15,23,42,0.10)] sm:p-10 print:shadow-none print:border-slate-300">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-100/50 blur-[90px] print:hidden" />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {result.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${rec.className}`}>
                  <Icon name={rec.icon as any} />
                  {rec.label}
                </span>
              </div>

              <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Interview completed
              </h1>

              <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base">
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-slate-500">Candidate</dt>
                  <dd className="font-semibold text-slate-900">{result.candidate_name}</dd>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-slate-500">Role</dt>
                  <dd className="font-semibold text-slate-900">{result.role}</dd>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-slate-500">Questions answered</dt>
                  <dd className="font-semibold text-slate-900">{result.questions_answered}</dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-center sm:justify-end">
              <ScoreGauge score={avgScore} />
            </div>
          </div>
        </div>

        {/* Performance summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 print:grid-cols-3 print:gap-3">
          <StatCard
            icon="chart"
            label="Average Score"
            value={`${avgScore}/10`}
            sub={category.label}
            accent="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            icon="users"
            label="Questions Answered"
            value={String(result.questions_answered ?? (hasQuestions ? result.results.length : 0))}
            sub={hasQuestions ? `${strongAnswers} strong answer${strongAnswers === 1 ? "" : "s"}` : undefined}
            accent="bg-violet-50 text-violet-600"
          />
          <StatCard
            icon="badge"
            label="Score Category"
            value={category.label}
            sub="Based on average score"
            accent="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* AI overall evaluation */}
        <section className="mb-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-8px_rgba(15,23,42,0.08)] sm:p-8 print:shadow-none print:border-slate-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.9 5.8L20 9.5l-6.1 1.7L12 17l-1.9-5.8L4 9.5l6.1-1.7L12 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">AI overall evaluation</h2>
          </div>

          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">
            {result.overall_evaluation}
          </p>
        </section>

        {/* Per-question breakdown */}
        {hasQuestions ? (
          <div className="mb-10 space-y-5">
            {result.results.map((item: any, index: number) => {
              const theme = scoreTheme(Number(item.score) || 0);
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_-6px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_32px_-8px_rgba(15,23,42,0.14)] sm:p-7 print:shadow-none print:border-slate-300 print:break-inside-avoid"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                      Question {index + 1}
                    </h3>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-sm font-semibold ${theme.badge}`}>
                      {item.score}/10
                    </span>
                  </div>

                  <p className="mb-5 leading-relaxed text-slate-700">{item.question}</p>

                  <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Your answer
                    </p>
                    <p className="leading-relaxed text-slate-700">{item.answer}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Feedback
                    </p>
                    <p className="leading-relaxed text-slate-600">{item.feedback}</p>
                  </div>

                  <div className="mt-4">
                    <ScoreBar score={Number(item.score) || 0} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
           
          <div className="mb-10 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6M9 16h6M9 8h6M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
              </svg>
            </div>
            <p className="font-medium text-slate-600">No question breakdown available</p>
            <p className="mt-1 text-sm text-slate-400">
              This session doesn't have any recorded question results yet.
            </p>
          </div>
        )}

        {/* Primary action */}
        <div className="flex justify-center sm:justify-start print:hidden">
          <Link to="/" className="inline-block">
            <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-all hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98]">
              <span className="relative z-10">Start new interview</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Result;