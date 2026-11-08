import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  Flame,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Target as TargetIcon,
  Timer as TimerIcon,
  StickyNote,
  ListTodo,
  Play,
  Brain,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Card, EmptyState, Skeleton } from "../components/ui/Misc";
import { Tag } from "../components/ui/Tag";
import { Button } from "../components/ui/Button";
import { formatRelative, getWeekDates, getGreeting } from "../utils/helpers";

function StatCard({ icon: Icon, label, value, trend, color, suffix }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
            {suffix && <span className="ml-1 text-base font-medium text-slate-400">{suffix}</span>}
          </p>
          {trend && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, pomodoros, goals, notes, sessions, bootstrapped } = useData();

  const today = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    const todaySession = sessions.find((s) => s.date === today);
    const studyHours = todaySession?.hours || 0;
    const tasksDone = tasks.filter((t) => t.status === "done").length;
    const tasksTotal = tasks.length;

    // Streak: count consecutive days with sessions going back
    const sessionDates = new Set(sessions.map((s) => s.date));
    let streak = 0;
    const d = new Date();
    while (sessionDates.has(d.toISOString().split("T")[0])) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    if (streak === 0 && sessionDates.size > 0) {
      // Check yesterday
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      if (sessionDates.has(yest.toISOString().split("T")[0])) {
        streak = 1;
      }
    }

    // Weekly progress (last 7 days of sessions)
    const week = getWeekDates().map((d) => {
      const dateStr = d.toISOString().split("T")[0];
      const s = sessions.find((x) => x.date === dateStr);
      return {
        day: d.toLocaleDateString("en", { weekday: "short" }),
        hours: s?.hours || 0,
        tasks: s?.tasksCompleted || 0,
      };
    });

    return { studyHours, tasksDone, tasksTotal, streak, week };
  }, [sessions, tasks, today]);

  const todayTasks = useMemo(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    return tasks
      .filter((t) => !t.due || t.due.split("T")[0] === todayDate || t.status !== "done")
      .slice(0, 5);
  }, [tasks]);

  const upcomingGoals = goals.slice(0, 3);
  const recentNotes = notes.slice(0, 3);

  if (!bootstrapped) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 p-6 text-white sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              {getGreeting()}
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
            <p className="mt-1.5 max-w-lg text-sm text-white/90 sm:text-base">
              You've studied <b>{stats.studyHours} hours</b> today. {stats.streak > 0 ? `Keep your ${stats.streak}-day streak alive!` : "Start a session to build momentum."}
            </p>
          </div>
          <Link
            to="/app/pomodoro"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-lg hover:bg-slate-50"
          >
            <Play className="h-4 w-4" />
            Start focus
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label="Today's Study" value={stats.studyHours} suffix="hrs" trend="+12% vs yesterday" color="bg-gradient-to-br from-indigo-500 to-violet-600" />
        <StatCard icon={CheckCircle2} label="Tasks Done" value={`${stats.tasksDone}/${stats.tasksTotal || 0}`} trend={`${Math.round((stats.tasksDone / (stats.tasksTotal || 1)) * 100)}% completion`} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard icon={Flame} label="Current Streak" value={stats.streak} suffix="days" trend={stats.streak > 0 ? "🔥 On fire!" : "Start today"} color="bg-gradient-to-br from-orange-500 to-rose-600" />
        <StatCard icon={TrendingUp} label="Productivity" value="86" suffix="/100" trend="Top 5% this week" color="bg-gradient-to-br from-cyan-500 to-blue-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Weekly Progress */}
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Weekly Progress</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Study hours this week</p>
            </div>
            <Tag color="indigo">
              <TrendingUp className="h-3 w-3" />
              {stats.week.reduce((s, d) => s + d.hours, 0)}h total
            </Tag>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.week} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }}
                  cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "3 3" }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tasks by Category */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Tasks by Category</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distribution</p>
            </div>
          </div>
          {tasks.length === 0 ? (
            <EmptyState icon={ListTodo} title="No tasks yet" description="Add tasks to see them here" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(tasks.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {})).map(([cat, count]) => ({ cat, count }))} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="cat" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Tasks & Goals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Today's Tasks</h3>
            <Link to="/app/tasks" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <EmptyState icon={ListTodo} title="All caught up!" description="No pending tasks" />
          ) : (
            <ul className="space-y-2">
              {todayTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#1a1c2a]/50"
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      t.priority === "high" ? "bg-rose-500" : t.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${t.status === "done" ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}>
                      {t.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.category} · {t.due ? formatRelative(t.due) : "No due date"}
                    </p>
                  </div>
                  <span className={`badge ${
                    t.status === "done" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" :
                    t.status === "inprogress" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" :
                    "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300"
                  }`}>
                    {t.status === "done" ? "Done" : t.status === "inprogress" ? "In Progress" : "To Do"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Active Goals</h3>
            <Link to="/app/goals" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {upcomingGoals.length === 0 ? (
            <EmptyState icon={TargetIcon} title="No goals yet" description="Set your first goal" />
          ) : (
            <div className="space-y-3">
              {upcomingGoals.map((g) => {
                const pct = Math.min(100, Math.round((g.progress / g.target) * 100));
                return (
                  <div key={g.id} className="rounded-xl border border-slate-100 p-3 dark:border-[#252839]">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{g.title}</p>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#1f2233]">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {g.progress} / {g.target} · {g.type}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Quick actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Start Focus", icon: TimerIcon, to: "/app/pomodoro", color: "from-emerald-500 to-teal-600" },
            { label: "New Note", icon: StickyNote, to: "/app/notes", color: "from-rose-500 to-pink-600" },
            { label: "Add Task", icon: ListTodo, to: "/app/tasks", color: "from-amber-500 to-orange-600" },
            { label: "Take Quiz", icon: Brain, to: "/app/quiz", color: "from-indigo-500 to-violet-600" },
          ].map((q) => (
            <Link
              key={q.label}
              to={q.to}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition hover:border-transparent hover:shadow-md dark:border-[#252839] dark:bg-[#1a1c2a] dark:hover:border-transparent"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${q.color} text-white`}>
                <q.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{q.label}</p>
                <p className="text-xs text-slate-400">Tap to open</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
