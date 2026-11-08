import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form side */}
        <div className="flex flex-col p-6 sm:p-8 lg:p-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-lg shadow-indigo-200 dark:shadow-none">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">StudyOS</span>
            </Link>
          </div>

          <div className="m-auto w-full max-w-md py-10">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
            {children}
          </div>

          <p className="text-center text-xs text-slate-400">© 2026 StudyOS · All rights reserved.</p>
        </div>

        {/* Visual side */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                ✨ Trusted by 10,000+ students
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Your complete
                <br />
                study workspace.
              </h2>
              <p className="text-white/80">
                Notes, tasks, Pomodoro sessions, goals, and analytics — all in one place. Built to help you crack
                GATE, SSC, UPSC, JEE or land your dream placement.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold">Ananya · GATE 2025</p>
                  <div className="flex items-center gap-1 text-xs text-amber-200">
                    ★ ★ ★ ★ ★ <span className="ml-1 text-white/70">AIR 142</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/90">
                "StudyOS kept me consistent through 6 months of prep. The Pomodoro + goals combo is a game-changer."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
