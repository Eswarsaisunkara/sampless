import { useMemo, useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Tag as TagIcon,
  Trash2,
  Edit3,
  Save,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Code,
  StickyNote,
  Pin,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, Spinner } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { Tag } from "../components/ui/Tag";
import { Modal } from "../components/ui/Modal";
import { formatRelative, stripHtml, truncate } from "../utils/helpers";

function RichTextEditor({ value, onChange, placeholder = "Start writing your note..." }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const tools = [
    { icon: Bold, cmd: "bold", label: "Bold" },
    { icon: Italic, cmd: "italic", label: "Italic" },
    { icon: Underline, cmd: "underline", label: "Underline" },
    { icon: Heading2, cmd: "formatBlock", val: "h2", label: "Heading" },
    { icon: Quote, cmd: "formatBlock", val: "blockquote", label: "Quote" },
    { icon: List, cmd: "insertUnorderedList", label: "Bullet list" },
    { icon: ListOrdered, cmd: "insertOrderedList", label: "Numbered list" },
    { icon: Code, cmd: "formatBlock", val: "pre", label: "Code" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#252839]">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-[#252839] dark:bg-[#0f1120]">
        {tools.map((t) => (
          <button
            type="button"
            key={t.label}
            title={t.label}
            onClick={() => exec(t.cmd, t.val)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-[#1f2233] dark:hover:text-white"
          >
            <t.icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        className="prose-editor min-h-[280px] max-h-[55vh] overflow-y-auto bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none dark:bg-[#131520] dark:text-slate-100"
        style={{ minHeight: 280 }}
      />
      <style>{`
        .prose-editor:empty::before { content: attr(data-placeholder); color: #94a3b8; }
        .prose-editor h2 { font-size: 1.2rem; font-weight: 700; margin: 0.5rem 0; }
        .prose-editor b, .prose-editor strong { font-weight: 700; }
        .prose-editor i, .prose-editor em { font-style: italic; }
        .prose-editor u { text-decoration: underline; }
        .prose-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-editor blockquote { border-left: 3px solid #6366f1; padding-left: 0.75rem; color: #64748b; font-style: italic; margin: 0.5rem 0; }
        .prose-editor pre { background: #0f172a; color: #e2e8f0; padding: 0.75rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; overflow-x: auto; }
      `}</style>
    </div>
  );
}

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote, bootstrapped } = useData();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [editing, setEditing] = useState(null); // null | { title, content, tags:[] }
  const [viewing, setViewing] = useState(null);

  const allTags = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => set.add(t)));
    return [...set];
  }, [notes]);

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const matchQ = !query || (n.title + " " + stripHtml(n.content)).toLowerCase().includes(query.toLowerCase());
      const matchT = !activeTag || (n.tags || []).includes(activeTag);
      return matchQ && matchT;
    });
  }, [notes, query, activeTag]);

  const openNew = () => setEditing({ title: "", content: "", tags: [] });
  const openEdit = (n) => setEditing({ ...n, tags: [...(n.tags || [])] });

  const save = async () => {
    if (!editing.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      if (editing.id) {
        await updateNote(editing.id, { title: editing.title, content: editing.content, tags: editing.tags });
        toast.success("Note updated");
      } else {
        await addNote({ title: editing.title, content: editing.content, tags: editing.tags });
        toast.success("Note created");
      }
      setEditing(null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this note?")) return;
    await deleteNote(id);
    toast.success("Note deleted");
    if (viewing?.id === id) setViewing(null);
  };

  const togglePin = async (n) => {
    await updateNote(n.id, { pinned: !n.pinned });
  };

  if (!bootstrapped) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes..."
            className="input-base pl-9"
          />
        </div>
        <Button onClick={openNew} leftIcon={<Plus className="h-4 w-4" />}>New Note</Button>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${!activeTag ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2233] dark:text-slate-300 dark:hover:bg-[#252839]"}`}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${activeTag === t ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2233] dark:text-slate-300 dark:hover:bg-[#252839]"}`}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Create your first note to capture study material, ideas, and insights."
          action={<Button onClick={openNew} leftIcon={<Plus className="h-4 w-4" />}>Create Note</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((n) => (
            <Card key={n.id} className="group cursor-pointer transition hover:shadow-md" >
              <div onClick={() => setViewing(n)}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">{n.title}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(n); }}
                    className="opacity-0 transition group-hover:opacity-100"
                  >
                    <Pin className={`h-3.5 w-3.5 ${n.pinned ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                  </button>
                </div>
                <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {truncate(stripHtml(n.content), 220)}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(n.tags || []).slice(0, 3).map((t) => (
                    <Tag key={t} color="indigo">#{t}</Tag>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-[#252839]">
                <span className="text-xs text-slate-400">{formatRelative(n.updatedAt)}</span>
                <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => openEdit(n)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-[#1f2233]">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(n.id)} className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Note" : "New Note"}
        description="Capture your study material with formatting and tags"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} leftIcon={<Save className="h-4 w-4" />}>
              {editing?.id ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-3">
            <Input
              label="Title"
              placeholder="e.g. Time Complexity Notes"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <div>
              <label className="label">Content</label>
              <RichTextEditor value={editing.content} onChange={(c) => setEditing({ ...editing, content: c })} />
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <Input
                placeholder="DSA, Important, GATE"
                value={editing.tags.join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
              {editing.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {editing.tags.map((t) => (
                    <Tag key={t} color="indigo">#{t}</Tag>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.title}
        size="lg"
        footer={
          viewing && (
            <>
              <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
              <Button onClick={() => { openEdit(viewing); setViewing(null); }} leftIcon={<Edit3 className="h-4 w-4" />}>Edit</Button>
            </>
          )
        }
      >
        {viewing && (
          <div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(viewing.tags || []).map((t) => (
                <Tag key={t} color="indigo">#{t}</Tag>
              ))}
            </div>
            <div
              className="prose-editor rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 dark:border-[#252839] dark:bg-[#0f1120] dark:text-slate-100"
              dangerouslySetInnerHTML={{ __html: viewing.content }}
            />
            <p className="mt-3 text-xs text-slate-400">Last updated {formatRelative(viewing.updatedAt)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
