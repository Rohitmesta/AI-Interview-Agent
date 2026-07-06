import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const AILinesBackground = () => (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#E2E8F0" strokeWidth="1.25" fill="none">
          <path d="M-100 120 L300 120 L380 200 L700 200 L760 120 L1100 120 L1180 260 L1540 260" />
          <path d="M-100 420 L260 420 L340 340 L640 340 L700 420 L1000 420 L1080 500 L1540 500" />
          <path d="M-100 680 L360 680 L440 760 L780 760 L840 680 L1160 680 L1220 600 L1540 600" />
          <path d="M180 -50 L180 150 L420 150 L420 400" />
          <path d="M1020 -50 L1020 180 L1220 180 L1220 460" />
          <path d="M560 950 L560 700 L820 700 L820 480" />
        </g>
        {[
          [380, 200],
          [700, 200],
          [640, 340],
          [1080, 500],
          [440, 760],
          [1220, 260],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3"
            fill="#B9C4D3"
            className="motion-reduce:animate-none"
            style={{ animation: `nodeBreathe 5s ease-in-out ${i * 0.6}s infinite` }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_35%,white_80%)]" />
      <style>{`
        @keyframes nodeBreathe {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );

  if (!data) {
    return (
      <div className="relative min-h-screen bg-white">
        <AILinesBackground />
        <div className="relative flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-xl p-10 text-center shadow-xl shadow-slate-300/30">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.5m0 3.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">No interview found</h1>
            <p className="mt-2 text-sm text-slate-500">
              This session couldn't be loaded. Start a new interview to continue.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = data.questions[currentQuestion];

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setAnswerError("Please enter an answer before submitting.");
      return;
    }

    setAnswerError(null);
    setSubmitError(null);
    setLoading(true);

    try {
      const response = await api.post("/api/interview/answer", {
        question_id: question.id,
        answer: answer,
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to submit answer. Please try again.");
    }

    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < data.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
      setResult(null);
    } else {
      navigate(`/result/${data.session_id}`);
    }
  };

  const progress = ((currentQuestion + 1) / data.questions.length) * 100;

  const scoreValue = typeof result?.score === "number" ? result.score : Number(result?.score) || 0;
  const scoreTone =
    scoreValue >= 7
      ? { ring: "#10B981", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" }
      : scoreValue >= 4
      ? { ring: "#F59E0B", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" }
      : { ring: "#F43F5E", text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" };
  const scoreCircumference = 2 * Math.PI * 42;
  const scoreOffset = scoreCircumference - (Math.min(scoreValue, 10) / 10) * scoreCircumference;

  return (
    <div className="relative min-h-screen bg-white">
      <AILinesBackground />

      <div className="relative flex min-h-screen justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-xl shadow-xl shadow-slate-300/30 p-6 sm:p-10">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Interview</h1>
                <p className="mt-1 font-mono text-xs tracking-wide text-slate-500">
                  SESSION {data.session_id}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                </span>
                <span className="font-mono text-[11px] font-medium tracking-wider text-slate-600">
                  IN PROGRESS
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Question {currentQuestion + 1} of {data.questions.length}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-700">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <span className="mb-2 inline-block font-mono text-[11px] font-semibold tracking-wider text-blue-600">
                QUESTION {currentQuestion + 1}
              </span>
              <h2 className="mb-5 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
                {question.question}
              </h2>

              <textarea
                rows={8}
                className="w-full rounded-xl border-2 border-slate-200 bg-white/90 p-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Write your answer..."
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (answerError) setAnswerError(null);
                }}
                disabled={result !== null}
              />

              {answerError && (
                <p className="mt-2 text-sm font-medium text-rose-600">{answerError}</p>
              )}
            </div>

            {submitError && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <p className="text-sm font-medium text-rose-800">{submitError}</p>
              </div>
            )}

            {/* Submit */}
            {!result ? (
              <button
                onClick={submitAnswer}
                disabled={loading}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Evaluating...
                  </>
                ) : (
                  <>
                    Submit Answer
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            ) : (
              <>
                {/* Result / score visualization */}
                <div className={`mt-2 rounded-2xl border ${scoreTone.border} ${scoreTone.bg} p-6 sm:p-8`}>
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    {/* Circular score ring */}
                    <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center">
                      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={scoreTone.ring}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={scoreCircumference}
                          strokeDashoffset={scoreOffset}
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="font-mono text-2xl font-bold text-slate-900">
                          {scoreValue}
                        </span>
                        <span className="font-mono text-[10px] tracking-wider text-slate-500">
                          / 10
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <span className={`inline-block rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-wider ${scoreTone.text} ${scoreTone.bg} border ${scoreTone.border}`}>
                        {scoreValue >= 7 ? "STRONG ANSWER" : scoreValue >= 4 ? "NEEDS IMPROVEMENT" : "WEAK ANSWER"}
                      </span>
                      <h3 className="mt-3 font-semibold text-slate-900">Feedback</h3>
                      <p className="mt-1.5 leading-relaxed text-slate-700">{result.feedback}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={nextQuestion}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {currentQuestion === data.questions.length - 1 ? "Finish Interview" : "Next Question"}
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;