// Simulated backend storage with localStorage
// Mimics REST API with delay for realistic UX
const DELAY = 180;
const wait = (ms = DELAY) => new Promise((r) => setTimeout(r, ms));

const KEYS = {
  USERS: "studyos:users",
  SESSION: "studyos:session",
  NOTES: (uid) => `studyos:notes:${uid}`,
  TASKS: (uid) => `studyos:tasks:${uid}`,
  POMODOROS: (uid) => `studyos:pomodoros:${uid}`,
  GOALS: (uid) => `studyos:goals:${uid}`,
  PLANS: (uid) => `studyos:plans:${uid}`,
  SESSIONS: (uid) => `studyos:sessions:${uid}`,
  PROFILE: (uid) => `studyos:profile:${uid}`,
  QUIZRESULTS: (uid) => `studyos:quizresults:${uid}`,
  POINTS: (uid) => `studyos:points:${uid}`,
  NOTIFICATIONS: (uid) => `studyos:notifications:${uid}`,
};

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// ============ AUTH API ============
export const authAPI = {
  async register({ name, email, password, exam }) {
    await wait();
    if (!name || !email || !password) throw new Error("All fields are required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const users = read(KEYS.USERS, []);
    if (users.find((u) => u.email === email)) throw new Error("Email already registered");
    const newUser = { id: uid(), name, email, password, exam: exam || "GATE", createdAt: new Date().toISOString() };
    users.push(newUser);
    write(KEYS.USERS, users);
    const token = "jwt." + btoa(newUser.id + ":" + Date.now());
    const session = { token, user: { id: newUser.id, name: newUser.name, email: newUser.email, exam: newUser.exam } };
    write(KEYS.SESSION, session);
    this._seed(newUser.id, exam);
    return session;
  },
  async login({ email, password }) {
    await wait();
    const users = read(KEYS.USERS, []);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password");
    const token = "jwt." + btoa(user.id + ":" + Date.now());
    const session = { token, user: { id: user.id, name: user.name, email: user.email, exam: user.exam } };
    write(KEYS.SESSION, session);
    return session;
  },
  async forgotPassword({ email }) {
    await wait();
    const users = read(KEYS.USERS, []);
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("No account found with that email");
    // Simulate emailing a 6-digit reset code (in real backend nodemailer sends this)
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.resetCode = code;
    user.resetExpires = Date.now() + 15 * 60 * 1000;
    write(KEYS.USERS, users);
    return { message: `A reset code has been sent to ${email}.`, code, email };
  },
  async resetPassword({ email, code, newPassword }) {
    await wait();
    if (!newPassword || newPassword.length < 6) throw new Error("Password must be at least 6 characters");
    const users = read(KEYS.USERS, []);
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("No account found with that email");
    if (!user.resetCode || user.resetCode !== code) throw new Error("Invalid reset code");
    if (Date.now() > (user.resetExpires || 0)) throw new Error("Reset code expired. Please request a new one.");
    user.password = newPassword;
    delete user.resetCode;
    delete user.resetExpires;
    write(KEYS.USERS, users);
    return { message: "Password changed successfully. You can now log in." };
  },
  async changePassword({ userId, currentPassword, newPassword }) {
    await wait();
    if (!newPassword || newPassword.length < 6) throw new Error("New password must be at least 6 characters");
    const users = read(KEYS.USERS, []);
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    if (user.password !== currentPassword) throw new Error("Current password is incorrect");
    user.password = newPassword;
    write(KEYS.USERS, users);
    return { message: "Password updated successfully" };
  },
  logout() {
    localStorage.removeItem(KEYS.SESSION);
  },
  getSession() {
    return read(KEYS.SESSION, null);
  },
  // Seed sample data for new user
  _seed(userId, exam) {
    const today = new Date();
    const sampleTasks = [
      { id: uid(), title: "Complete DSA Chapter 3 - Arrays", status: "todo", priority: "high", category: "DSA", due: addDays(today, 1).toISOString(), createdAt: today.toISOString() },
      { id: uid(), title: "Practice aptitude questions", status: "inprogress", priority: "medium", category: "Aptitude", due: addDays(today, 2).toISOString(), createdAt: today.toISOString() },
      { id: uid(), title: "Revise OS scheduling algorithms", status: "done", priority: "high", category: "OS", due: addDays(today, -1).toISOString(), createdAt: today.toISOString() },
      { id: uid(), title: "Mock test - DBMS", status: "todo", priority: "low", category: "DBMS", due: addDays(today, 3).toISOString(), createdAt: today.toISOString() },
    ];
    write(KEYS.TASKS(userId), sampleTasks);

    const sampleNotes = [
      { id: uid(), title: "Time Complexity Cheat Sheet", content: "<h2>Big O Notation</h2><ul><li><b>O(1)</b> — Constant time</li><li><b>O(log n)</b> — Binary search</li><li><b>O(n)</b> — Linear search</li><li><b>O(n log n)</b> — Merge sort</li><li><b>O(n²)</b> — Bubble sort</li></ul>", tags: ["DSA", "Important"], createdAt: today.toISOString(), updatedAt: today.toISOString() },
      { id: uid(), title: "OS - Process vs Thread", content: "<p>A <b>process</b> is an independent execution unit with its own memory space.</p><p>A <b>thread</b> is a lightweight sub-process sharing memory with the parent process.</p>", tags: ["OS", "Theory"], createdAt: today.toISOString(), updatedAt: today.toISOString() },
    ];
    write(KEYS.NOTES(userId), sampleNotes);

    const sampleGoals = [
      { id: uid(), title: "Study 6 hours daily", type: "daily", target: 6, progress: 4, createdAt: today.toISOString() },
      { id: uid(), title: "Complete DSA module", type: "weekly", target: 100, progress: 65, createdAt: today.toISOString() },
      { id: uid(), title: "Cover 500 aptitude problems", type: "monthly", target: 500, progress: 220, createdAt: today.toISOString() },
    ];
    write(KEYS.GOALS(userId), sampleGoals);

    const samplePomodoros = [];
    for (let i = 0; i < 7; i++) {
      samplePomodoros.push({
        id: uid(),
        duration: 25,
        completedAt: addDays(today, -i).toISOString(),
        subject: ["DSA", "Aptitude", "OS", "DBMS"][i % 4],
      });
    }
    write(KEYS.POMODOROS(userId), samplePomodoros);

    const sampleSessions = [];
    for (let i = 0; i < 14; i++) {
      sampleSessions.push({
        id: uid(),
        date: addDays(today, -i).toISOString().split("T")[0],
        hours: Math.floor(Math.random() * 5) + 1,
        tasksCompleted: Math.floor(Math.random() * 6),
      });
    }
    write(KEYS.SESSIONS(userId), sampleSessions);

    const samplePlans = [
      { id: uid(), subject: "DSA", topic: "Trees & Graphs", date: addDays(today, 1).toISOString().split("T")[0], hours: 3, color: "#6366f1" },
      { id: uid(), subject: "OS", topic: "Deadlocks", date: addDays(today, 2).toISOString().split("T")[0], hours: 2, color: "#ec4899" },
      { id: uid(), subject: "DBMS", topic: "Normalization", date: addDays(today, 3).toISOString().split("T")[0], hours: 2.5, color: "#10b981" },
    ];
    write(KEYS.PLANS(userId), samplePlans);

    write(KEYS.PROFILE(userId), { name: "", exam, goal: "", studyHours: 6, theme: "light", quizTopic: "" });

    // Seed points
    write(KEYS.POINTS(userId), {
      total: 120,
      history: [
        { id: uid(), amount: 50, reason: "Welcome bonus", at: today.toISOString() },
        { id: uid(), amount: 70, reason: "Completed onboarding tasks", at: today.toISOString() },
      ],
    });

    // Seed notifications
    write(KEYS.NOTIFICATIONS(userId), [
      { id: uid(), title: "Welcome to StudyOS! 🎉", body: "Pick your quiz track and start earning points today.", type: "info", read: false, at: today.toISOString() },
      { id: uid(), title: "Daily quiz is ready 📝", body: "20 fresh questions await you in the Quiz section.", type: "quiz", read: false, at: today.toISOString() },
      { id: uid(), title: "Keep your streak alive 🔥", body: "Study a little every day to build momentum.", type: "reminder", read: true, at: addDays(today, -1).toISOString() },
    ]);
  },
};

// ============ NOTES API ============
export const notesAPI = {
  list: async (userId) => {
    await wait(100);
    return read(KEYS.NOTES(userId), []);
  },
  create: async (userId, data) => {
    await wait();
    const items = read(KEYS.NOTES(userId), []);
    const note = { id: uid(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    items.unshift(note);
    write(KEYS.NOTES(userId), items);
    return note;
  },
  update: async (userId, id, data) => {
    await wait();
    const items = read(KEYS.NOTES(userId), []);
    const idx = items.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    write(KEYS.NOTES(userId), items);
    return items[idx];
  },
  remove: async (userId, id) => {
    await wait();
    const items = read(KEYS.NOTES(userId), []).filter((n) => n.id !== id);
    write(KEYS.NOTES(userId), items);
    return { success: true };
  },
};

// ============ TASKS API ============
export const tasksAPI = {
  list: async (userId) => {
    await wait(100);
    return read(KEYS.TASKS(userId), []);
  },
  create: async (userId, data) => {
    await wait();
    const items = read(KEYS.TASKS(userId), []);
    const task = { id: uid(), status: "todo", createdAt: new Date().toISOString(), ...data };
    items.unshift(task);
    write(KEYS.TASKS(userId), items);
    return task;
  },
  update: async (userId, id, data) => {
    await wait();
    const items = read(KEYS.TASKS(userId), []);
    const idx = items.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    items[idx] = { ...items[idx], ...data };
    write(KEYS.TASKS(userId), items);
    return items[idx];
  },
  remove: async (userId, id) => {
    await wait();
    const items = read(KEYS.TASKS(userId), []).filter((t) => t.id !== id);
    write(KEYS.TASKS(userId), items);
    return { success: true };
  },
};

// ============ POMODOROS ============
export const pomodoroAPI = {
  list: async (userId) => {
    await wait(100);
    return read(KEYS.POMODOROS(userId), []);
  },
  add: async (userId, data) => {
    await wait(80);
    const items = read(KEYS.POMODOROS(userId), []);
    const session = { id: uid(), ...data, completedAt: new Date().toISOString() };
    items.unshift(session);
    write(KEYS.POMODOROS(userId), items);
    return session;
  },
  clear: async (userId) => {
    await wait();
    write(KEYS.POMODOROS(userId), []);
    return { success: true };
  },
};

// ============ GOALS ============
export const goalsAPI = {
  list: async (userId) => {
    await wait(100);
    return read(KEYS.GOALS(userId), []);
  },
  create: async (userId, data) => {
    await wait();
    const items = read(KEYS.GOALS(userId), []);
    const goal = { id: uid(), progress: 0, createdAt: new Date().toISOString(), ...data };
    items.unshift(goal);
    write(KEYS.GOALS(userId), items);
    return goal;
  },
  update: async (userId, id, data) => {
    await wait();
    const items = read(KEYS.GOALS(userId), []);
    const idx = items.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error("Goal not found");
    items[idx] = { ...items[idx], ...data };
    write(KEYS.GOALS(userId), items);
    return items[idx];
  },
  remove: async (userId, id) => {
    await wait();
    const items = read(KEYS.GOALS(userId), []).filter((g) => g.id !== id);
    write(KEYS.GOALS(userId), items);
    return { success: true };
  },
};

// ============ PLANS ============
export const plansAPI = {
  list: async (userId) => {
    await wait(100);
    return read(KEYS.PLANS(userId), []);
  },
  create: async (userId, data) => {
    await wait();
    const items = read(KEYS.PLANS(userId), []);
    const plan = { id: uid(), color: "#6366f1", ...data };
    items.unshift(plan);
    write(KEYS.PLANS(userId), items);
    return plan;
  },
  remove: async (userId, id) => {
    await wait();
    const items = read(KEYS.PLANS(userId), []).filter((p) => p.id !== id);
    write(KEYS.PLANS(userId), items);
    return { success: true };
  },
};

// ============ SESSIONS / ANALYTICS ============
export const sessionsAPI = {
  list: async (userId) => {
    await wait(100);
    return read(KEYS.SESSIONS(userId), []);
  },
  add: async (userId, data) => {
    await wait();
    const items = read(KEYS.SESSIONS(userId), []);
    const session = { id: uid(), ...data };
    items.unshift(session);
    write(KEYS.SESSIONS(userId), items);
    return session;
  },
};

// ============ PROFILE ============
export const profileAPI = {
  get: async (userId) => {
    await wait(100);
    return read(KEYS.PROFILE(userId), {});
  },
  update: async (userId, data) => {
    await wait();
    const current = read(KEYS.PROFILE(userId), {});
    const updated = { ...current, ...data };
    write(KEYS.PROFILE(userId), updated);
    return updated;
  },
};

// ============ POINTS / GAMIFICATION ============
export const pointsAPI = {
  get: async (userId) => {
    await wait(80);
    return read(KEYS.POINTS(userId), { total: 0, history: [] });
  },
  add: async (userId, amount, reason) => {
    await wait(60);
    const current = read(KEYS.POINTS(userId), { total: 0, history: [] });
    current.total += amount;
    current.history.unshift({ id: uid(), amount, reason, at: new Date().toISOString() });
    current.history = current.history.slice(0, 50);
    write(KEYS.POINTS(userId), current);
    return current;
  },
};

// ============ NOTIFICATIONS ============
export const notificationsAPI = {
  list: async (userId) => {
    await wait(80);
    return read(KEYS.NOTIFICATIONS(userId), []);
  },
  add: async (userId, data) => {
    await wait(60);
    const items = read(KEYS.NOTIFICATIONS(userId), []);
    const notif = { id: uid(), read: false, at: new Date().toISOString(), ...data };
    items.unshift(notif);
    write(KEYS.NOTIFICATIONS(userId), items.slice(0, 50));
    return notif;
  },
  markRead: async (userId, id) => {
    await wait(40);
    const items = read(KEYS.NOTIFICATIONS(userId), []).map((n) => (n.id === id ? { ...n, read: true } : n));
    write(KEYS.NOTIFICATIONS(userId), items);
    return items;
  },
  markAllRead: async (userId) => {
    await wait(40);
    const items = read(KEYS.NOTIFICATIONS(userId), []).map((n) => ({ ...n, read: true }));
    write(KEYS.NOTIFICATIONS(userId), items);
    return items;
  },
  clear: async (userId) => {
    await wait(40);
    write(KEYS.NOTIFICATIONS(userId), []);
    return [];
  },
};

// ============ QUIZ ============
export const quizAPI = {
  results: async (userId) => {
    await wait(100);
    return read(KEYS.QUIZRESULTS(userId), []);
  },
  saveResult: async (userId, data) => {
    await wait(120);
    const items = read(KEYS.QUIZRESULTS(userId), []);
    const result = { id: uid(), at: new Date().toISOString(), ...data };
    items.unshift(result);
    write(KEYS.QUIZRESULTS(userId), items.slice(0, 100));
    return result;
  },
};

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
