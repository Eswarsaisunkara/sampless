import { useState } from "react";
import { User, Moon, Sun, Bell, Lock, LogOut, Save, Mail, BookOpen, Trash2, Download, KeyRound, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { EXAMS } from "../utils/constants";
import { initials } from "../utils/helpers";

function Section({ title, description, icon: Icon, children }) {
  return (
    <Card>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}

function ChangePasswordSection() {
  const { changePassword } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.currentPassword) return toast.error("Enter your current password");
    if (form.newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (form.newPassword !== form.confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Input
        label="Current password"
        type={show ? "text" : "password"}
        leftIcon={<Lock className="h-4 w-4" />}
        value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        className="sm:col-span-2"
        placeholder="Enter current password"
      />
      <Input
        label="New password"
        type={show ? "text" : "password"}
        leftIcon={<KeyRound className="h-4 w-4" />}
        rightIcon={<button type="button" onClick={() => setShow(!show)} className="pointer-events-auto">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        placeholder="At least 6 characters"
      />
      <Input
        label="Confirm new password"
        type={show ? "text" : "password"}
        leftIcon={<KeyRound className="h-4 w-4" />}
        value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        placeholder="Re-enter new password"
      />
      <div className="sm:col-span-2">
        <Button type="submit" loading={loading} leftIcon={<Save className="h-4 w-4" />}>Update password</Button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { profile, updateProfile: updateDataProfile, notes, tasks, pomodoros, goals, plans } = useData();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    exam: user?.exam || "GATE",
    goal: profile.goal || "",
    studyHours: profile.studyHours || 6,
  });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      await updateDataProfile({ goal: form.goal, studyHours: form.studyHours });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    const data = { notes, tasks, pomodoros, goals, plans, profile, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studyos-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  const clearAllData = () => {
    if (!confirm("This will delete ALL your data (notes, tasks, goals, plans, history). Continue?")) return;
    if (!confirm("Are you absolutely sure? This cannot be undone.")) return;
    ["notes", "tasks", "pomodoros", "goals", "plans", "sessions"].forEach((k) => {
      localStorage.removeItem(`studyos:${k}:${user.id}`);
    });
    toast.success("All data cleared. Refreshing...");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Customize your StudyOS experience</p>
      </div>

      {/* Profile */}
      <Section title="Profile" description="Manage your personal information" icon={User}>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 text-lg font-bold text-white">
            {initials(form.name || user?.name)}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{form.name || "Student"}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={saveProfile} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Full name"
            leftIcon={<User className="h-4 w-4" />}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled
            title="Name cannot be changed in demo"
          />
          <Input
            label="Email"
            leftIcon={<Mail className="h-4 w-4" />}
            value={form.email}
            disabled
          />
          <Select
            label="Exam preparing for"
            options={EXAMS.map((e) => ({ value: e, label: e }))}
            value={form.exam}
            onChange={(e) => setForm({ ...form, exam: e.target.value })}
          />
          <Input
            label="Daily study goal (hours)"
            type="number"
            min="1"
            max="16"
            value={form.studyHours}
            onChange={(e) => setForm({ ...form, studyHours: parseInt(e.target.value) || 1 })}
          />
          <Input
            label="Dream goal / target"
            placeholder="e.g. Crack GATE 2026 with AIR < 100"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            className="sm:col-span-2"
            leftIcon={<BookOpen className="h-4 w-4" />}
          />
          <div className="sm:col-span-2">
            <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
              Save changes
            </Button>
          </div>
        </form>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" description="Choose how StudyOS looks" icon={Sun}>
        <div>
          <p className="label">Theme</p>
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            <button
              onClick={() => setTheme("light")}
              className={`group flex items-center gap-3 rounded-xl border-2 p-3 transition ${
                theme === "light" ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10" : "border-slate-200 hover:border-slate-300 dark:border-[#252839] dark:hover:border-[#313749]"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <Sun className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Light</p>
                <p className="text-xs text-slate-500">Bright & clean</p>
              </div>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`group flex items-center gap-3 rounded-xl border-2 p-3 transition ${
                theme === "dark" ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10" : "border-slate-200 hover:border-slate-300 dark:border-[#252839] dark:hover:border-[#313749]"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 shadow-sm">
                <Moon className="h-5 w-5 text-indigo-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark</p>
                <p className="text-xs text-slate-500">Easy on eyes</p>
              </div>
            </button>
          </div>
        </div>
      </Section>

      {/* Notifications (visual only) */}
      <Section title="Notifications" description="Configure how you want to be reminded" icon={Bell}>
        <div className="space-y-2">
          {[
            { label: "Daily study reminders", desc: "Get notified to start your study session", enabled: true },
            { label: "Task deadlines", desc: "Reminders for upcoming due dates", enabled: true },
            { label: "Weekly progress reports", desc: "Sunday summary of your week", enabled: false },
            { label: "Goal achievement", desc: "Celebrate when you hit milestones", enabled: true },
          ].map((n, i) => (
            <ToggleRow key={i} {...n} onChange={() => toast.info("Saved (demo)")} />
          ))}
        </div>
      </Section>

      {/* Data management */}
      <Section title="Data & Privacy" description="Export or clear your data" icon={Lock}>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData} leftIcon={<Download className="h-4 w-4" />}>
            Export all data
          </Button>
          <Button variant="danger" onClick={clearAllData} leftIcon={<Trash2 className="h-4 w-4" />}>
            Clear all data
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Your data is stored locally in your browser. Export creates a JSON backup.
        </p>
      </Section>

      {/* Change Password */}
      <Section title="Change Password" description="Update your account password" icon={KeyRound}>
        <ChangePasswordSection />
      </Section>

      {/* Account */}
      <Section title="Account" description="Manage your account" icon={LogOut}>
        <Button variant="danger" onClick={() => { logout(); toast.info("Signed out"); }} leftIcon={<LogOut className="h-4 w-4" />}>
          Sign out
        </Button>
      </Section>

      <p className="text-center text-xs text-slate-400">StudyOS v1.0 · Made with ❤️ for students</p>
    </div>
  );
}

function ToggleRow({ label, desc, enabled: initial, onChange }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#1a1c2a]/50">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <button
        onClick={() => { setOn(!on); onChange?.(!on); }}
        className={`relative h-6 w-11 rounded-full transition ${on ? "bg-indigo-500" : "bg-slate-300 dark:bg-[#1f2233]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
