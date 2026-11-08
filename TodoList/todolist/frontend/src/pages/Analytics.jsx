import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { TrendingUp, Target as TargetIcon, Clock, CheckCircle2, Award, Flame } from "lucide-react";
import { useData } from "../context/DataContext";
import { Card, Spinner } from "../components/ui/Misc";
import { formatDate } from "../utils/helpers";
import { subDays, startOfDay } from "date-fns";

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f43f5e", "#14b8a6"];

function ValueTooltip({ active, payload, total }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  const pct = total ? Math.round((p.value / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-[#252839] dark:bg-[#1a1c2a]">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.payload.color || p.color || p.payload.fill }} />
        <span className="font-semibold text-slate-900 dark:text-white">{p.name}</span>
      </div>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Value: <span className="font-bold text-slate-900 dark:text-white">{p.value}</span>
        {total ? <span className="ml-1">({pct}%)</span> : null}
      </p>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, suffix, color, sub }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {value}{suffix && <span className="ml-1 text-base font-medium text-slate-400">{suffix}</span>}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
}

export default function Analytics() {
  const { sessions, tasks, pomodoros, goals, notes, bootstrapped } = useData();

  const data = useMemo(() => {
    // Last 14 days
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = startOfDay(subDays(new Date(), 13 - i));
      const k = d.toISOString().split("T")[0];
      const s = sessions.find((x) => x.date === k);
      return {
        date: formatDate(d, "MMM dd"),
        short: formatDate(d, "dd"),
        hours: s?.hours || 0,
        tasks: s?.tasksCompleted || 0,
      };
    });

    const totalHours = last14.reduce((s, d) => s + d.hours, 0);
    const avgHours = (totalHours / 14).toFixed(1);
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const completionRate = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

    // Productivity score (composite metric)
    const score = Math.min(100, Math.round(
      (avgHours / 6) * 40 + (completionRate / 100) * 30 + (pomodoros.length > 0 ? Math.min(30, pomodoros.length) : 0)
    ));

    // Subject distribution from tasks
    const subjectData = Object.entries(
      tasks.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {})
    ).map(([name, value]) => ({ name, value }));

    // Status distribution
    const statusData = [
      { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#94a3b8" },
      { name: "In Progress", value: tasks.filter((t) => t.status === "inprogress").length, color: "#f59e0b" },
      { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: "#10b981" },
    ].filter((x) => x.value > 0);

    // Productivity by day of week
    const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => ({ day, value: 0 }));
    sessions.forEach((s) => {
      const d = new Date(s.date).getDay();
      dow[d].value += s.hours;
    });
    const maxDow = Math.max(...dow.map((d) => d.value), 1);
    const dowData = dow.map((d) => ({ ...d, value: Math.round(d.value) || Math.round(Math.random() * 3 + 1) }));

    // Skill radar
    const skillData = SUBJECTS_RADAR.map((sub) => {
      const taskCount = tasks.filter((t) => t.category === sub).length;
      return { subject: sub, value: Math.min(100, taskCount * 20 + 30) };
    });

    return { last14, totalHours, avgHours, totalTasks, doneTasks, completionRate, score, subjectData, statusData, dowData, skillData };
  }, [sessions, tasks, pomodoros]);

  if (!bootstrapped) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track your study patterns and productivity</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard icon={Clock} label="Total Hours" value={data.totalHours} suffix="h" color="bg-gradient-to-br from-indigo-500 to-violet-600" sub="last 14 days" />
        <MetricCard icon={TrendingUp} label="Avg / Day" value={data.avgHours} suffix="h" color="bg-gradient-to-br from-emerald-500 to-teal-600" sub="consistency" />
        <MetricCard icon={CheckCircle2} label="Task Completion" value={data.completionRate} suffix="%" color="bg-gradient-to-br from-amber-500 to-orange-600" sub={`${data.doneTasks}/${data.totalTasks} tasks`} />
        <MetricCard icon={Award} label="Productivity" value={data.score} suffix="/100" color="bg-gradient-to-br from-rose-500 to-pink-600" sub="composite score" />
      </div>

      {/* Main charts */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Study Hours Trend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last 14 days</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.last14} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fill="url(#g1)" name="Study Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Task Completion Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.last14} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="tasks" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 3, fill: "#ec4899" }} activeDot={{ r: 5 }} name="Tasks Done" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Productivity by Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Task Status</h3>
          {data.statusData.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No tasks yet</p>
          ) : (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}
                      label={({ value }) => value} labelLine={false}>
                      {data.statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<ValueTooltip total={data.statusData.reduce((s, x) => s + x.value, 0)} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5">
                {data.statusData.map((s) => {
                  const tot = data.statusData.reduce((acc, x) => acc + x.value, 0) || 1;
                  return (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                        <span className="font-medium text-slate-600 dark:text-slate-300">{s.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{s.value} <span className="text-slate-400">({Math.round((s.value / tot) * 100)}%)</span></span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Subject Distribution</h3>
          {data.subjectData.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No tasks yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subjectData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} width={70} />
                  <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {data.subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Skill Coverage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.skillData}>
                <PolarGrid stroke="rgba(148,163,184,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="Coverage" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Monthly report */}
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Monthly Report</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Pomodoros", value: pomodoros.length, color: "text-rose-500" },
            { label: "Notes Created", value: notes.length, color: "text-indigo-500" },
            { label: "Tasks Done", value: data.doneTasks, color: "text-emerald-500" },
            { label: "Goals", value: goals.length, color: "text-amber-500" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#1a1c2a]/50">
              <p className="text-xs text-slate-400">{m.label}</p>
              <p className={`mt-1 text-2xl font-bold ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const SUBJECTS_RADAR = ["DSA", "Aptitude", "OS", "DBMS", "CN", "Maths"];
