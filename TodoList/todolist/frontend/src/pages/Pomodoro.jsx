import { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Volume2, VolumeX, Settings as SettingsIcon, Trash2, Timer as TimerIcon } from "lucide-react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, Spinner } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Tag } from "../components/ui/Tag";
import { Modal } from "../components/ui/Modal";
import { TIMER_PRESETS, SUBJECTS } from "../utils/constants";
import { formatRelative, formatDate } from "../utils/helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function PomoTooltip({ active, payload, total }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  const pct = total ? Math.round((p.value / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-[#252839] dark:bg-[#1a1c2a]">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.payload.fill }} />
        <span className="font-semibold text-slate-900 dark:text-white">{p.name}</span>
      </div>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Sessions: <span className="font-bold text-slate-900 dark:text-white">{p.value}</span> ({pct}%)
      </p>
    </div>
  );
}

const MODES = {
  work: { label: "Focus", color: "from-rose-500 to-pink-600", ring: "#f43f5e", icon: Brain },
  break: { label: "Break", color: "from-emerald-500 to-teal-600", ring: "#10b981", icon: Coffee },
};

function pad(n) {
  return n.toString().padStart(2, "0");
}

export default function Pomodoro() {
  const { pomodoros, addPomodoro, clearPomodoros, bootstrapped } = useData();
  const toast = useToast();
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [subject, setSubject] = useState("DSA");
  const [mode, setMode] = useState("work");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const totalRef = useRef(25 * 60);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    totalRef.current = (mode === "work" ? workMin : breakMin) * 60;
  }, [workMin, breakMin, mode]);

  useEffect(() => {
    setSeconds((mode === "work" ? workMin : breakMin) * 60);
  }, [workMin, breakMin, mode]);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      // Switch mode
      playBeep();
      if (mode === "work") {
        addPomodoro({ duration: workMin, subject, type: "work" });
        toast.success("Focus session complete! Take a break 🎉");
      } else {
        toast.info("Break's over! Back to focus 💪");
      }
      const next = mode === "work" ? "break" : "work";
      setMode(next);
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds, mode, workMin, subject, addPomodoro, toast]);

  const playBeep = () => {
    if (!sound) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  };

  const reset = () => {
    setRunning(false);
    setSeconds((mode === "work" ? workMin : breakMin) * 60);
  };

  const skip = () => {
    setRunning(false);
    setMode((m) => (m === "work" ? "break" : "work"));
  };

  const applyPreset = (p) => {
    setWorkMin(p.work);
    setBreakMin(p.break);
    setMode("work");
    setRunning(false);
    toast.success(`Loaded ${p.label} preset`);
  };

  const saveCustom = () => {
    if (customWork < 1 || customBreak < 1) {
      toast.error("Minutes must be at least 1");
      return;
    }
    setWorkMin(customWork);
    setBreakMin(customBreak);
    setShowSettings(false);
    toast.success("Custom timer saved");
  };

  // Stats
  const stats = useMemo(() => {
    const total = pomodoros.length;
    const today = pomodoros.filter((p) => p.completedAt.split("T")[0] === new Date().toISOString().split("T")[0]).length;
    const totalMins = pomodoros.reduce((s, p) => s + (p.duration || 0), 0);
    const bySubject = pomodoros.reduce((acc, p) => {
      acc[p.subject] = (acc[p.subject] || 0) + 1;
      return acc;
    }, {});
    return { total, today, totalMins, bySubject };
  }, [pomodoros]);

  const subjectData = Object.entries(stats.bySubject).map(([name, value]) => ({ name, value }));
  const subjectColors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = ((totalRef.current - seconds) / totalRef.current) * 100;
  const Mode = MODES[mode];
  const ModeIcon = Mode.icon;

  if (!bootstrapped) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-5">
      {/* Timer */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${Mode.color}`} />
        <div className="flex flex-col items-center py-6 sm:py-8">
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => { setMode("work"); setRunning(false); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${mode === "work" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-[#1f2233] dark:text-slate-300"}`}
            >
              Focus
            </button>
            <button
              onClick={() => { setMode("break"); setRunning(false); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${mode === "break" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-[#1f2233] dark:text-slate-300"}`}
            >
              Break
            </button>
          </div>

          <div className="relative my-2">
            <svg viewBox="0 0 200 200" className="h-56 w-56 -rotate-90 sm:h-64 sm:w-64">
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" className="text-slate-100 dark:text-[#1f2233]" strokeWidth="6" />
              <circle
                cx="100" cy="100" r="92"
                fill="none"
                stroke={Mode.ring}
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 92}`}
                strokeDashoffset={`${(2 * Math.PI * 92) * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.95s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ModeIcon className={`mb-1 h-5 w-5 text-slate-400`} />
              <p className="text-5xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-6xl">
                {pad(minutes)}:{pad(secs)}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{Mode.label}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Button onClick={reset} variant="secondary" size="lg" className="!p-3">
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setRunning((r) => !r)}
              size="lg"
              className={`!px-7 bg-gradient-to-r ${Mode.color}`}
              leftIcon={running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            >
              {running ? "Pause" : "Start"}
            </Button>
            <Button onClick={skip} variant="secondary" size="lg" className="!p-3">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button onClick={() => setSound((s) => !s)} variant="ghost" size="lg" className="!p-3">
              {sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button onClick={() => setShowSettings(true)} variant="ghost" size="lg" className="!p-3">
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>

          {mode === "work" && (
            <div className="mt-5 flex w-full max-w-xs items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Subject:</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold dark:border-[#252839] dark:bg-[#131520]"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Quick presets */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIMER_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-300 hover:shadow-sm dark:border-[#252839] dark:bg-[#1a1c2a] dark:hover:border-indigo-500/40"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.label}</p>
              <p className="text-xs text-slate-400">{p.work} / {p.break} min</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Focus</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.today}</p>
          <p className="text-xs text-slate-400">sessions completed</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Focus Time</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {Math.floor(stats.totalMins / 60)}<span className="text-base font-medium text-slate-400">h </span>
            {stats.totalMins % 60}<span className="text-base font-medium text-slate-400">m</span>
          </p>
          <p className="text-xs text-slate-400">across {stats.total} sessions</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Subject</p>
          {Object.keys(stats.bySubject).length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">No data yet</p>
          ) : (
            <>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {Object.entries(stats.bySubject).sort((a, b) => b[1] - a[1])[0][0]}
              </p>
              <p className="text-xs text-slate-400">{Object.entries(stats.bySubject).sort((a, b) => b[1] - a[1])[0][1]} sessions</p>
            </>
          )}
        </Card>
      </div>

      {/* Subject breakdown + History */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {subjectData.length > 0 && (
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Subject Breakdown</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subjectData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}
                    label={({ value }) => value} labelLine={false}>
                    {subjectData.map((_, i) => (
                      <Cell key={i} fill={subjectColors[i % subjectColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PomoTooltip total={subjectData.reduce((s, x) => s + x.value, 0)} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {subjectData.map((s, i) => {
                const tot = subjectData.reduce((acc, x) => acc + x.value, 0) || 1;
                return (
                  <div key={s.name} className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-xs dark:bg-[#1a1c2a]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: subjectColors[i % subjectColors.length] }} />
                    <span className="font-medium text-slate-600 dark:text-slate-300">{s.name}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{s.value}</span>
                    <span className="text-slate-400">({Math.round((s.value / tot) * 100)}%)</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <Card className={subjectData.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Session History</h3>
            {pomodoros.length > 0 && (
              <button onClick={() => { if (confirm("Clear all history?")) { clearPomodoros(); toast.success("History cleared"); } }} className="text-xs font-semibold text-rose-500 hover:text-rose-600">
                Clear all
              </button>
            )}
          </div>
          {pomodoros.length === 0 ? (
            <EmptyState icon={TimerIcon} title="No sessions yet" description="Complete a focus session to start tracking" />
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {pomodoros.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#1a1c2a]/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-500/10">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.subject || "Focus"} session</p>
                      <p className="text-xs text-slate-400">{formatRelative(p.completedAt)} · {formatDate(p.completedAt, "p")}</p>
                    </div>
                  </div>
                  <Tag color="indigo">{p.duration} min</Tag>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Settings modal */}
      <Modal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        title="Custom Timer"
        description="Set your own focus and break durations"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowSettings(false)}>Cancel</Button>
            <Button onClick={saveCustom}>Save</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Focus duration (minutes)"
            type="number"
            min="1"
            max="180"
            value={customWork}
            onChange={(e) => setCustomWork(parseInt(e.target.value) || 0)}
          />
          <Input
            label="Break duration (minutes)"
            type="number"
            min="1"
            max="60"
            value={customBreak}
            onChange={(e) => setCustomBreak(parseInt(e.target.value) || 0)}
          />
        </div>
      </Modal>
    </div>
  );
}
