import { useMemo, useState } from "react";
import { Plus, Target as TargetIcon, Trash2, TrendingUp, Calendar, CheckCircle2, Minus } from "lucide-react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, Spinner } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Textarea } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Tag } from "../components/ui/Tag";
import { GOAL_TYPES } from "../utils/constants";
import { formatDate } from "../utils/helpers";

function ProgressRing({ pct, size = 100, color = "#6366f1" }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-slate-100 dark:text-[#1f2233]" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function GoalCard({ goal, onUpdate, onDelete, onProgress }) {
  const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
  const done = pct >= 100;
  const colorByType = { daily: "#6366f1", weekly: "#8b5cf6", monthly: "#ec4899" };
  const color = colorByType[goal.type] || "#6366f1";

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Tag color={goal.type === "daily" ? "indigo" : goal.type === "weekly" ? "violet" : "rose"}>
              <Calendar className="h-2.5 w-2.5" />
              {goal.type}
            </Tag>
            {done && (
              <Tag color="emerald">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Achieved
              </Tag>
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{goal.title}</h3>
          {goal.description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{goal.description}</p>}
          <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {goal.progress} <span className="text-slate-400">/ {goal.target} {goal.unit || "units"}</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#1f2233]">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, #ec4899)` }} />
          </div>
          <p className="mt-1.5 text-xs font-semibold" style={{ color }}>{pct}% complete</p>
        </div>
        <div className="relative flex flex-col items-center gap-1">
          <ProgressRing pct={pct} size={70} color={color} />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">{pct}%</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-[#252839]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onProgress(goal, Math.max(0, goal.progress - 1))}
            className="rounded-md border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-100 dark:border-[#252839] dark:bg-[#131520] dark:hover:bg-[#1f2233]"
          >
            <Minus className="h-3 w-3" />
          </button>
          <input
            type="number"
            value={goal.progress}
            onChange={(e) => onProgress(goal, Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-center text-xs font-semibold dark:border-[#252839] dark:bg-[#131520]"
          />
          <button
            onClick={() => onProgress(goal, goal.progress + 1)}
            className="rounded-md border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-100 dark:border-[#252839] dark:bg-[#131520] dark:hover:bg-[#1f2233]"
          >
            <Plus className="h-3 w-3" />
          </button>
          <span className="ml-2 text-xs text-slate-400">/ {goal.target}</span>
        </div>
        <button onClick={() => onDelete(goal.id)} className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal, bootstrapped } = useData();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");

  const grouped = useMemo(() => {
    const g = { daily: [], weekly: [], monthly: [] };
    goals.forEach((gl) => g[gl.type]?.push(gl));
    return g;
  }, [goals]);

  const openNew = (type = "daily") => setEditing({ title: "", description: "", type, target: 1, progress: 0, unit: "hours" });
  const openEdit = (g) => setEditing({ ...g });
  const save = async () => {
    if (!editing.title.trim()) return toast.error("Title is required");
    if (editing.target <= 0) return toast.error("Target must be positive");
    try {
      if (editing.id) {
        await updateGoal(editing.id, editing);
        toast.success("Goal updated");
      } else {
        await addGoal(editing);
        toast.success("Goal created");
      }
      setEditing(null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const updateProgress = async (g, val) => {
    await updateGoal(g.id, { progress: val });
  };

  const remove = async (id) => {
    if (!confirm("Delete this goal?")) return;
    await deleteGoal(id);
    toast.success("Goal deleted");
  };

  if (!bootstrapped) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.progress >= g.target).length,
    avgProgress: goals.length ? Math.round(goals.reduce((s, g) => s + Math.min(100, (g.progress / g.target) * 100), 0) / goals.length) : 0,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[{ v: "all", l: "All" }, { v: "daily", l: "Daily" }, { v: "weekly", l: "Weekly" }, { v: "monthly", l: "Monthly" }].map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filter === f.v ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2233] dark:text-slate-300 dark:hover:bg-[#252839]"}`}
            >
              {f.l}
            </button>
          ))}
        </div>
        <Button onClick={() => openNew()} leftIcon={<Plus className="h-4 w-4" />}>New Goal</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
              <TargetIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Goals</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Achieved</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-500 dark:bg-violet-500/10">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Avg Progress</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals by type */}
      {goals.length === 0 ? (
        <EmptyState
          icon={TargetIcon}
          title="No goals yet"
          description="Set your first goal to start tracking progress"
          action={<Button onClick={() => openNew()} leftIcon={<Plus className="h-4 w-4" />}>Create Goal</Button>}
        />
      ) : (
        <>
          {(["daily", "weekly", "monthly"]).map((type) => {
            const list = grouped[type] || [];
            if (filter !== "all" && filter !== type) return null;
            if (list.length === 0 && filter === "all") return null;
            return (
              <div key={type}>
                <h3 className="mb-3 text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">{type} Goals</h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {list.map((g) => (
                    <GoalCard key={g.id} goal={g} onUpdate={openEdit} onDelete={remove} onProgress={updateProgress} />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Goal" : "New Goal"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>{editing?.id ? "Update" : "Create"}</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-3">
            <Input
              label="Goal title"
              placeholder="e.g. Study 6 hours daily"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              autoFocus
            />
            <Textarea
              label="Description (optional)"
              placeholder="Why does this goal matter?"
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Type"
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                options={GOAL_TYPES}
              />
              <Input
                label="Unit"
                placeholder="hours, problems, pages..."
                value={editing.unit || ""}
                onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target"
                type="number"
                min="1"
                value={editing.target}
                onChange={(e) => setEditing({ ...editing, target: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Current progress"
                type="number"
                min="0"
                value={editing.progress}
                onChange={(e) => setEditing({ ...editing, progress: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
