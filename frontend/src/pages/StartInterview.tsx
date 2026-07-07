import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function StartInterview() {
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const canSubmit = candidateName.trim().length > 0 && role.trim().length > 0 && !isLoading;

  const startInterview = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/interview/start", {
        candidate_name: candidateName,
        role: role,
      });

      console.log(response.data);

      navigate("/interview", {
        state: response.data,
      });
    } catch (err: any) {
  console.error(err);

  if (err.response?.status === 429) {
    setError(
      "AI Service Unavailable. The AI service has reached its request limit. Please wait a minute and try again."
    );
  } else {
    setError(
      "AI Service Unavailable. The AI service has reached its request limit. Please wait a minute and try again."
    );
  }
}finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") startInterview();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Static AI line network background, one subtle moving accent */}
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lineFade1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fully static circuit paths */}
          <g stroke="#DDE3EC" strokeWidth="1.25" fill="none">
            <path d="M-100 120 L300 120 L380 200 L700 200 L760 120 L1100 120 L1180 260 L1540 260" />
            <path d="M-100 420 L260 420 L340 340 L640 340 L700 420 L1000 420 L1080 500 L1540 500" />
            <path d="M-100 680 L360 680 L440 760 L780 760 L840 680 L1160 680 L1220 600 L1540 600" />
            <path d="M180 -50 L180 150 L420 150 L420 400" />
            <path d="M1020 -50 L1020 180 L1220 180 L1220 460" />
            <path d="M560 950 L560 700 L820 700 L820 480" />
          </g>

          {/* Static nodes at intersections */}
          {[
            [380, 200],
            [700, 200],
            [640, 340],
            [1080, 500],
            [440, 760],
            [1220, 260],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#B9C4D3" />
          ))}

          {/* Single moving accent line, subtle and slow */}
          <path
            d="M-100 420 L260 420 L340 340 L640 340 L700 420 L1000 420 L1080 500 L1540 500"
            stroke="url(#lineFade1)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="90 900"
            className="animate-[dash1_14s_linear_infinite] motion-reduce:animate-none"
          />
        </svg>

        {/* Soft radial wash so lines fade near the card */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_30%,white_75%)]" />
      </div>

      <style>{`
        @keyframes dash1 {
          from { stroke-dashoffset: 1020; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Status pill */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              <span className="font-mono text-[11px] font-medium tracking-wider text-slate-600">
                SYSTEM READY
              </span>
            </div>
          </div>

          {/* Main card — solid white, strong border, clear shadow */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10.5h8M8 14h5.5M21 12c0 4.418-4.03 8-9 8-1.5 0-2.914-.32-4.156-.885L3 20l1.145-3.435C3.42 15.31 3 13.71 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                AI Interview Agent
              </h1>
              <p className="mt-1.5 text-sm text-slate-600">
                Set up your session to begin the interview
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] font-semibold tracking-wider text-slate-600">
                  CANDIDATE NAME
                </label>
                <input
                  className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  placeholder="e.g. Priya Sharma"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[11px] font-semibold tracking-wider text-slate-600">
                  ROLE
                </label>
                <input
                  className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  placeholder="e.g. Backend Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-rose-800">{error}</p>
                </div>
              )}

              <button
                onClick={startInterview}
                disabled={!canSubmit}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Starting session…
                    </>
                  ) : (
                    <>
                      Start Interview
                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-[11px] font-medium tracking-wide text-slate-500">
            YOUR RESPONSES ARE EVALUATED BY AI IN REAL TIME
          </p>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;