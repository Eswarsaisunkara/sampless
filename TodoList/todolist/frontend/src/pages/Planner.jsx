import { useMemo, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  BookOpen,
  X,
  Sparkles,
  Wand2,
} from "lucide-react";
import api from "../utils/apiClient";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, Spinner } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Tag } from "../components/ui/Tag";
import { SUBJECTS, subjectColors } from "../utils/constants";
import { formatDate } from "../utils/helpers";
import { addDays, startOfWeek, isSameDay, isSameMonth, format, parseISO, isToday } from "date-fns";

export default function Planner() {
  const { plans, addPlan, deletePlan, bootstrapped } = useData();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [aiOpen, setAiOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState({ subjects: ["DSA", "OS", "DBMS"], hoursPerDay: 4, days: 7 });
  const [aiBusy, setAiBusy] = useState(false);

  const toggleAiSubject = (s) => {
    setAiConfig((c) => ({
      ...c,
      subjects: c.subjects.includes(s) ? c.subjects.filter((x) => x !== s) : [...c.subjects, s],
    }));
  };

  // AI planner: distributes selected subjects across N days with topic suggestions
  const generateAiPlan = async () => {
    if (aiConfig.subjects.length === 0) return toast.error("Select at least one subject");
    setAiBusy(true);
    try {
      const res = await api.post("/ai-planner", {
        subjects: aiConfig.subjects,
        hoursPerDay: aiConfig.hoursPerDay,
        days: aiConfig.days,
      });
      // Backend returned plans — add them locally to re-render
      if (res.data.plans) {
        for (const p of res.data.plans) {
          await addPlan(p);
        }
      }
      toast.success(`AI generated a ${aiConfig.days}-day study plan! 🤖`);
    } catch (e) {
      // Fallback to local generation if backend unavailable
      const topicBank = {
        DSA: ["Arrays & Strings", "Linked Lists", "Trees & BST", "Graphs", "Dynamic Programming", "Sorting", "Hashing", "Greedy"],
        OS: ["Process Scheduling", "Deadlocks", "Memory Management", "Paging", "Synchronization", "File Systems"],
        DBMS: ["Normalization", "SQL Queries", "Transactions", "Indexing", "ER Model", "Joins"],
        CN: ["OSI Model", "TCP/IP", "Routing", "Subnetting", "Congestion Control", "DNS & HTTP"],
        Aptitude: ["Percentages", "Time & Work", "Probability", "Permutations", "Ratios", "Profit & Loss"],
        Reasoning: ["Series", "Coding-Decoding", "Blood Relations", "Syllogism", "Puzzles"],
        Maths: ["Calculus", "Linear Algebra", "Probability", "Set Theory"],
        English: ["Vocabulary", "Grammar", "Comprehension", "Idioms"],
        Physics: ["Mechanics", "Optics", "Thermodynamics", "Electromagnetism"],
        Chemistry: ["Organic", "Inorganic", "Physical Chemistry"],
        "Current Affairs": ["National News", "International", "Sports", "Awards"],
        "General Studies": ["History", "Polity", "Geography", "Economy"],
      };
      const counters = {};
      const hoursEach = (aiConfig.hoursPerDay / Math.min(aiConfig.subjects.length, 2)).toFixed(1);
      for (let d = 0; d < aiConfig.days; d++) {
        const date = format(addDays(new Date(), d), "yyyy-MM-dd");
        const todays = [aiConfig.subjects[d % aiConfig.subjects.length]];
        if (aiConfig.subjects.length > 1) todays.push(aiConfig.subjects[(d + 1) % aiConfig.subjects.length]);
        for (const subj of todays) {
          const bank = topicBank[subj] || ["General Revision"];
          counters[subj] = (counters[subj] || 0);
          const topic = bank[counters[subj] % bank.length];
          counters[subj]++;
          const idx = SUBJECTS.indexOf(subj);
          await addPlan({ subject: subj, topic, date, hours: parseFloat(hoursEach), color: subjectColors[(idx >= 0 ? idx : 0) % subjectColors.length] });
        }
      }
      toast.success(`AI generated a ${aiConfig.days}-day plan (offline mode) 🤖`);
    }
    setAiBusy(false);
    setAiOpen(false);
    toast.success(`AI generated a ${aiConfig.days}-day study plan! 🤖`);
  };

  const monthStart = useMemo(() => new Date(current.getFullYear(), current.getMonth(), 1), [current]);
  const monthEnd = useMemo(() => new Date(current.getFullYear(), current.getMonth() + 1, 0), [current]);
  const gridStart = useMemo(() => startOfWeek(monthStart, { weekStartsOn: 1 }), [monthStart]);
  const days = useMemo(() => {
    const d = [];
    let day = gridStart;
    while (d.length < 42) {
      d.push(day);
      day = addDays(day, 1);
    }
    return d;
  }, [gridStart]);

  const plansByDate = useMemo(() => {
    const g = {};
    plans.forEach((p) => {
      const k = p.date;
      if (!g[k]) g[k] = [];
      g[k].push(p);
    });
    return g;
  }, [plans]);

  const openNew = (date) =>
    setEditing({ subject: SUBJECTS[0], topic: "", date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"), hours: 1, color: subjectColors[0] });
  const openEdit = (p) => setEditing({ ...p });
  const save = async () => {
    if (!editing.topic.trim()) return toast.error("Topic is required");
    if (editing.hours <= 0) return toast.error("Hours must be positive");
    try {
      await addPlan({ ...editing, hours: parseFloat(editing.hours) });
      toast.success("Plan added");
      setEditing(null);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this plan?")) return;
    await deletePlan(id);
    toast.success("Plan deleted");
  };

  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  const today = () => { setCurrent(new Date()); setSelectedDate(new Date()); };

  const selectedPlans = plansByDate[format(selectedDate, "yyyy-MM-dd")] || [];
  const totalHoursThisWeek = useMemo(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return plans
      .filter((p) => {
        const d = parseISO(p.date);
        const diff = (d - weekStart) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff < 7;
      })
      .reduce((s, p) => s + (parseFloat(p.hours) || 0), 0);
  }, [plans, selectedDate]);

  if (!bootstrapped) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={today} variant="secondary" size="sm">Today</Button>
          <button onClick={prevMonth} className="rounded-lg border border-slate-200 bg-white p-1.5 hover:bg-slate-50 dark:border-[#252839] dark:bg-[#131520]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextMonth} className="rounded-lg border border-slate-200 bg-white p-1.5 hover:bg-slate-50 dark:border-[#252839] dark:bg-[#131520]">
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-2 text-lg font-semibold text-slate-900 dark:text-white">
            {format(current, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setAiOpen(true)} variant="secondary" leftIcon={<Wand2 className="h-4 w-4" />}>AI Plan</Button>
          <Button onClick={() => openNew(selectedDate)} leftIcon={<Plus className="h-4 w-4" />}>New Plan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
            {weekDays.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const k = format(day, "yyyy-MM-dd");
              const dayPlans = plansByDate[k] || [];
              const isCurrentMonth = isSameMonth(day, current);
              const isSelected = isSameDay(day, selectedDate);
              const todayClass = isToday(day);
              return (
                <button
                  key={k}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[78px] rounded-lg border p-1.5 text-left transition ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 dark:border-[#252839] dark:bg-[#131520] dark:hover:bg-[#1a1c2a]"
                  } ${!isCurrentMonth ? "opacity-40" : ""}`}
                >
                  <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    todayClass ? "bg-indigo-500 text-white" : "text-slate-700 dark:text-slate-200"
                  }`}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5">
                    {dayPlans.slice(0, 2).map((p) => (
                      <div key={p.id} className="truncate rounded px-1 py-0.5 text-[10px] font-semibold text-white" style={{ background: p.color || "#6366f1" }}>
                        {p.subject}
                      </div>
                    ))}
                    {dayPlans.length > 2 && (
                      <p className="text-[10px] font-semibold text-slate-400">+{dayPlans.length - 2} more</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Selected day */}
        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")}
                </p>
                <p className="text-xs text-slate-400">{format(selectedDate, "MMM dd, yyyy")}</p>
              </div>
            </div>
            {selectedPlans.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-[#252839]">
                No plans. Tap below to add one.
              </p>
            ) : (
              <ul className="space-y-2">
                {selectedPlans.map((p) => (
                  <li key={p.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#1a1c2a]/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ background: p.color || "#6366f1" }} />
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.subject}</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{p.topic}</p>
                        <Tag color="indigo" className="mt-1.5">
                          <Clock className="h-2.5 w-2.5" />
                          {p.hours}h
                        </Tag>
                      </div>
                      <button onClick={() => remove(p.id)} className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button onClick={() => openNew(selectedDate)} className="mt-3 w-full" variant="secondary" leftIcon={<Plus className="h-4 w-4" />}>
              Add plan
            </Button>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">This week's study load</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalHoursThisWeek}<span className="text-sm font-medium text-slate-400">h</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* All plans list */}
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">All Upcoming Plans</h3>
        {plans.length === 0 ? (
          <EmptyState icon={BookOpen} title="No plans yet" description="Add study plans to organize your week" />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[...plans]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#1a1c2a]/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: p.color || "#6366f1" }} />
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{p.subject}</p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{p.topic}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{formatDate(p.date)} · {p.hours}h</p>
                  </div>
                  <button onClick={() => remove(p.id)} className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="New Study Plan"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>Add Plan</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Subject"
                value={editing.subject}
                onChange={(e) => {
                  const idx = SUBJECTS.indexOf(e.target.value);
                  setEditing({ ...editing, subject: e.target.value, color: subjectColors[idx % subjectColors.length] });
                }}
                options={SUBJECTS.map((s) => ({ value: s, label: s }))}
              />
              <Input
                label="Hours"
                type="number"
                step="0.5"
                min="0.5"
                value={editing.hours}
                onChange={(e) => setEditing({ ...editing, hours: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <Input
              label="Topic"
              placeholder="e.g. Deadlocks & synchronization"
              value={editing.topic}
              onChange={(e) => setEditing({ ...editing, topic: e.target.value })}
            />
            <Input
              label="Date"
              type="date"
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
            />
            <div>
              <label className="label">Color</label>
              <div className="flex flex-wrap gap-2">
                {subjectColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setEditing({ ...editing, color: c })}
                    className={`h-8 w-8 rounded-lg border-2 transition ${editing.color === c ? "border-slate-900 dark:border-white" : "border-transparent"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* AI Planner Modal */}
      <Modal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="✨ AI Study Planner"
        description="Auto-generate a balanced, subject-wise study schedule"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAiOpen(false)}>Cancel</Button>
            <Button onClick={generateAiPlan} loading={aiBusy} leftIcon={<Wand2 className="h-4 w-4" />}>Generate plan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 text-xs text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Sparkles className="mr-1.5 inline h-4 w-4" />
            The AI distributes your chosen subjects across the next few days with topic suggestions and balanced hours.
          </div>
          <div>
            <label className="label">Select subjects to include</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => {
                const active = aiConfig.subjects.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleAiSubject(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${active ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2233] dark:text-slate-300 dark:hover:bg-[#252839]"}`}
                  >
                    {active ? "✓ " : ""}{s}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Hours per day"
              type="number"
              min="1"
              max="16"
              value={aiConfig.hoursPerDay}
              onChange={(e) => setAiConfig({ ...aiConfig, hoursPerDay: parseInt(e.target.value) || 1 })}
            />
            <Select
              label="Plan length"
              value={String(aiConfig.days)}
              onChange={(e) => setAiConfig({ ...aiConfig, days: parseInt(e.target.value) })}
              options={[
                { value: "3", label: "3 days" },
                { value: "7", label: "1 week" },
                { value: "14", label: "2 weeks" },
                { value: "30", label: "1 month" },
              ]}
            />
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-[#1a1c2a] dark:text-slate-400">
            Preview: <strong className="text-slate-700 dark:text-slate-200">{aiConfig.subjects.length}</strong> subjects across{" "}
            <strong className="text-slate-700 dark:text-slate-200">{aiConfig.days}</strong> days
            {aiConfig.subjects.length > 0 && <> · ~{(aiConfig.hoursPerDay / Math.min(aiConfig.subjects.length, 2)).toFixed(1)}h per subject block</>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
