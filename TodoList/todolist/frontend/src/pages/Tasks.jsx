import { useMemo, useState } from "react";
import { Plus, Calendar, Flag, Trash2, MoreVertical, ListTodo, Filter, GripVertical, X } from "lucide-react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, Spinner } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Tag } from "../components/ui/Tag";
import { PRIORITIES, CATEGORIES } from "../utils/constants";
import { formatRelative, priorityColor } from "../utils/helpers";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "from-slate-400 to-slate-500", accent: "bg-slate-400" },
  { id: "inprogress", label: "In Progress", color: "from-amber-400 to-orange-500", accent: "bg-amber-400" },
  { id: "done", label: "Done", color: "from-emerald-400 to-teal-500", accent: "bg-emerald-400" },
];

function TaskCard({ task, onEdit, onDelete, onDragStart }) {
  const pColor = priorityColor[task.priority] || priorityColor.medium;
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      title={`${task.title}${task.description ? " — " + task.description : ""}`}
      className="group cursor-grab rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md active:cursor-grabbing dark:border-[#252839] dark:bg-[#1a1c2a] dark:hover:border-indigo-500/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{task.title}</p>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button onClick={() => onEdit(task)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-[#1f2233]">
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className={`badge border ${pColor.bg} ${pColor.text} ${pColor.border}`}>
          <Flag className="h-2.5 w-2.5" />
          {task.priority}
        </span>
        {task.category && <Tag color="violet">{task.category}</Tag>}
        {task.due && (
          <Tag color="slate">
            <Calendar className="h-2.5 w-2.5" />
            {formatRelative(task.due)}
          </Tag>
        )}
      </div>
    </div>
  );
}

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, bootstrapped } = useData();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({ priority: "", category: "" });
  const [draggingId, setDraggingId] = useState(null);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filter.priority && t.priority !== filter.priority) return false;
      if (filter.category && t.category !== filter.category) return false;
      return true;
    });
  }, [tasks, filter]);

  const grouped = useMemo(() => {
    const g = { todo: [], inprogress: [], done: [] };
    filtered.forEach((t) => g[t.status]?.push(t));
    return g;
  }, [filtered]);

  const openNew = () =>
    setEditing({ title: "", description: "", priority: "medium", category: "Study", due: "", status: "todo" });
  const openNewIn = (status) =>
    setEditing({ title: "", description: "", priority: "medium", category: "Study", due: "", status });
  const openEdit = (t) => setEditing({ ...t, due: t.due ? t.due.split("T")[0] : "" });

  const save = async () => {
    if (!editing.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const payload = { ...editing };
      if (payload.due) payload.due = new Date(payload.due).toISOString();
      if (editing.id) {
        await updateTask(editing.id, payload);
        toast.success("Task updated");
      } else {
        await addTask(payload);
        toast.success("Task created");
      }
      setEditing(null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(id);
    toast.success("Task deleted");
    if (editing?.id === id) setEditing(null);
  };

  const onDragStart = (e, task) => {
    setDraggingId(task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = async (e, status) => {
    e.preventDefault();
    const task = tasks.find((t) => t.id === draggingId);
    if (task && task.status !== status) {
      await updateTask(task.id, { status });
      toast.success(`Moved to ${COLUMNS.find((c) => c.id === status)?.label}`);
    }
    setDraggingId(null);
  };

  if (!bootstrapped) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-[#252839] dark:bg-[#131520]">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
            >
              <option value="">All priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-[#252839] dark:bg-[#131520]">
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={openNew} leftIcon={<Plus className="h-4 w-4" />}>New Task</Button>
      </div>

      {/* Kanban */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Add your first task to start organizing your study plan."
          action={<Button onClick={openNew} leftIcon={<Plus className="h-4 w-4" />}>Create Task</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, col.id)}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#0f1120]"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.accent}`} />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{col.label}</h3>
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-[#1f2233] dark:text-slate-300">
                    {grouped[col.id]?.length || 0}
                  </span>
                </div>
                <button
                  onClick={() => openNewIn(col.id)}
                  title={`Add task to ${col.label}`}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-indigo-500 dark:hover:bg-[#1a1c2a]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {grouped[col.id]?.length === 0 ? (
                  <button
                    onClick={() => openNewIn(col.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs font-medium text-slate-400 transition hover:border-indigo-300 hover:text-indigo-500 dark:border-[#252839] dark:hover:border-indigo-500/40"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add a task
                  </button>
                ) : (
                  <>
                    {grouped[col.id].map((t) => (
                      <TaskCard key={t.id} task={t} onEdit={openEdit} onDelete={remove} onDragStart={onDragStart} />
                    ))}
                    <button
                      onClick={() => openNewIn(col.id)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 py-2 text-xs font-medium text-slate-400 transition hover:border-indigo-300 hover:text-indigo-500 dark:border-[#252839] dark:hover:border-indigo-500/40"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Task" : "New Task"}
        size="md"
        footer={
          editing && (
            <>
              {editing.id && (
                <Button variant="ghost" onClick={() => remove(editing.id)} leftIcon={<Trash2 className="h-4 w-4" />}>
                  Delete
                </Button>
              )}
              <div className="flex-1" />
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save}>{editing.id ? "Update" : "Create"}</Button>
            </>
          )
        }
      >
        {editing && (
          <div className="space-y-3">
            <Input
              label="Task title"
              placeholder="e.g. Complete chapter on Trees"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              autoFocus
            />
            <Textarea
              label="Description (optional)"
              placeholder="Add more context..."
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Priority"
                value={editing.priority}
                onChange={(e) => setEditing({ ...editing, priority: e.target.value })}
                options={PRIORITIES}
              />
              <Select
                label="Category"
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Due date"
                type="date"
                value={editing.due}
                onChange={(e) => setEditing({ ...editing, due: e.target.value })}
              />
              <Select
                label="Status"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                options={COLUMNS.map((c) => ({ value: c.id, label: c.label }))}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
