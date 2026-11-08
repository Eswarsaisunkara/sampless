import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Moon, Sun, Award, Check, Trash2, CheckCheck, Sparkles, Brain, Target } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { getGreeting, formatRelative } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const titleMap = {
  "/app/dashboard": { title: "Dashboard", subtitle: "Your daily overview" },
  "/app/notes": { title: "Notes", subtitle: "Capture ideas & study material" },
  "/app/tasks": { title: "Tasks", subtitle: "Organize and prioritize work" },
  "/app/pomodoro": { title: "Pomodoro Timer", subtitle: "Stay focused, beat distraction" },
  "/app/quiz": { title: "Quiz", subtitle: "Test yourself & earn points" },
  "/app/goals": { title: "Goals", subtitle: "Track your progress" },
  "/app/planner": { title: "Study Planner", subtitle: "Plan your study schedule" },
  "/app/analytics": { title: "Analytics", subtitle: "Insights into your study habits" },
  "/app/settings": { title: "Settings", subtitle: "Customize your experience" },
};

const notifIcon = {
  points: <Award className="h-4 w-4 text-amber-500" />,
  quiz: <Brain className="h-4 w-4 text-indigo-500" />,
  reminder: <Target className="h-4 w-4 text-rose-500" />,
  info: <Sparkles className="h-4 w-4 text-violet-500" />,
};

export function Topbar({ onMenuClick }) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const { points, notifications, markNotifRead, markAllNotifRead, clearNotifs } = useData();
  const { pathname } = useLocation();
  const meta = titleMap[pathname] || { title: "StudyOS", subtitle: "" };
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white/80 px-4 backdrop-blur-xl dark:border-[#252839] dark:bg-[#0a0b14]/80 sm:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1f2233] lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
          {getGreeting()}, <span className="gradient-text">{user?.name?.split(" ")[0] || "Student"}</span>
        </h2>
        <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Points pill */}
        <div className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 dark:border-amber-500/20 dark:bg-amber-500/10 sm:flex">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{points?.total ?? 0} XP</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1f2233]">
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-[#252839] dark:bg-[#131520] scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-[#252839]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  {unread > 0 && <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">{unread} new</span>}
                </div>
                {notifications.length > 0 && (
                  <button onClick={markAllNotifRead} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm text-slate-400">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotifRead(n.id)}
                      className={`flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-[#1f2233] dark:hover:bg-[#1a1c2a] ${!n.read ? "bg-indigo-50/40 dark:bg-indigo-500/5" : ""}`}
                    >
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#1f2233]">
                        {notifIcon[n.type] || notifIcon.info}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{formatRelative(n.at)}</p>
                      </div>
                      {!n.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />}
                    </button>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <button onClick={clearNotifs} className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-rose-500 dark:border-[#252839] dark:hover:bg-[#1a1c2a]">
                  <Trash2 className="h-3.5 w-3.5" /> Clear all
                </button>
              )}
            </div>
          )}
        </div>

        <button onClick={toggle} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1f2233]">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
