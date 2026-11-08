import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  StickyNote,
  ListTodo,
  Timer,
  Target,
  CalendarDays,
  BarChart3,
  Sparkles,
  Sun,
  Moon,
  Star,
  Users,
  Trophy,
  Zap,
  Brain,
  BookOpen,
  Play,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-lg shadow-indigo-200 dark:shadow-none">
        <GraduationCap className="h-5 w-5 text-white" />
      </div>
      <span className="text-lg font-bold text-slate-900 dark:text-white">StudyOS</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, color, title, description }) {
  return (
    <div className="group rounded-2xl border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-[#252839] dark:bg-[#131520]">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

export default function Landing() {
  const { theme, toggle } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: LayoutDashIcon, color: "bg-gradient-to-br from-indigo-500 to-violet-600", title: "Smart Dashboard", description: "Get a bird's eye view of your study hours, streak, tasks, and weekly progress at a glance." },
    { icon: StickyNote, color: "bg-gradient-to-br from-rose-500 to-pink-600", title: "Rich Notes", description: "Capture study material with a rich text editor, organize with tags, and find anything in seconds." },
    { icon: ListTodo, color: "bg-gradient-to-br from-amber-500 to-orange-600", title: "Kanban Tasks", description: "Drag-and-drop task board with priority levels, due dates, and categories to keep you on track." },
    { icon: Timer, color: "bg-gradient-to-br from-emerald-500 to-teal-600", title: "Pomodoro Timer", description: "Stay laser-focused with 25/5 sessions, custom timers, and track your focus statistics over time." },
    { icon: Target, color: "bg-gradient-to-br from-cyan-500 to-blue-600", title: "Goal Tracking", description: "Set daily, weekly, and monthly goals. Watch your progress climb as you put in the work." },
    { icon: BarChart3, color: "bg-gradient-to-br from-fuchsia-500 to-purple-600", title: "Deep Analytics", description: "Understand your productivity with study hours graphs, task completion trends, and monthly reports." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
      {/* Top Nav */}
      <nav className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-[#252839] dark:bg-[#0a0b14]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1f2233]">
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/app/dashboard")}
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:shadow-md"
              >
                Open App
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#1f2233]">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-pink-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/60 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Built for GATE · SSC · UPSC · JEE · Placements
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              The smart <span className="gradient-text">study OS</span> for
              <br className="hidden sm:block" /> ambitious students
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Notes, tasks, Pomodoro, goals, planner and analytics — all in one beautiful workspace designed to help you
              crack your dream exam.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={isAuthenticated ? "/app/dashboard" : "/register"}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-300 dark:shadow-none"
              >
                Start studying for free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-[#252839] dark:bg-[#131520] dark:text-slate-200 dark:hover:bg-[#1f2233]"
              >
                <Play className="h-4 w-4" />
                See it in action
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>10,000+ students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>4.9 average rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-emerald-500" />
                <span>Topper approved</span>
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-20 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#252839] dark:bg-[#131520]">
              <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-[#252839] dark:bg-[#0f1120]">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-slate-400">studyos.app/dashboard</span>
              </div>
              <div className="grid gap-px bg-slate-100 sm:grid-cols-3 dark:bg-[#252839]">
                <div className="bg-white p-5 dark:bg-[#131520]">
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    <p className="text-xs font-semibold text-slate-500">TODAY</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">5.2 hrs</p>
                  <p className="text-xs text-emerald-500">+18% vs yesterday</p>
                </div>
                <div className="bg-white p-5 dark:bg-[#131520]">
                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-violet-500" />
                    <p className="text-xs font-semibold text-slate-500">STREAK</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">14 days</p>
                  <p className="text-xs text-slate-400">Keep it going!</p>
                </div>
                <div className="bg-white p-5 dark:bg-[#131520]">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-pink-500" />
                    <p className="text-xs font-semibold text-slate-500">TASKS</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">8 / 12</p>
                  <p className="text-xs text-slate-400">4 remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200/60 bg-white py-20 dark:border-[#252839] dark:bg-[#0d0e17]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to <span className="gradient-text">crack the exam</span>
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Powerful tools wrapped in a delightful interface — so you can focus on what matters: learning.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 p-10 text-center text-white sm:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to study smarter?</h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">
                Join thousands of students who use StudyOS every day to stay consistent and crush their goals.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-xl hover:bg-slate-50"
                >
                  Create your free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Free forever
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Works offline
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-10 dark:border-[#252839]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <Logo />
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 StudyOS · Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
}

// Inline icon component to avoid duplicate import
function LayoutDashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
