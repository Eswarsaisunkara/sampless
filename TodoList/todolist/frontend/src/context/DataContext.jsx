import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/apiClient";

const DataContext = createContext(null);

export const POINTS = {
  TASK_DONE: 10,
  POMODORO: 15,
  GOAL_COMPLETE: 30,
  QUIZ_CORRECT: 5,
  QUIZ_COMPLETE: 20,
  PLAN_ADDED: 5,
};

function useResource(endpoint) {
  const [items, setItems] = useState([]);

  const list = useCallback(async () => {
    try {
      const res = await api.get(endpoint);
      setItems(res.data);
      return res.data;
    } catch {
      return [];
    }
  }, [endpoint]);

  const add = useCallback(
    async (data) => {
      const res = await api.post(endpoint, data);
      setItems((prev) => [res.data, ...prev]);
      return res.data;
    },
    [endpoint]
  );

  const update = useCallback(
    async (id, data) => {
      const res = await api.put(`${endpoint}/${id}`, data);
      setItems((prev) => prev.map((x) => (x._id === id || x.id === id ? { ...x, ...res.data } : x)));
      return res.data;
    },
    [endpoint]
  );

  const remove = useCallback(
    async (id) => {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id && x.id !== id));
    },
    [endpoint]
  );

  return [items, list, add, update, remove, setItems];
}

export function DataProvider({ children }) {
  const { user } = useAuth();
  const isAuth = !!user;

  const [notes, loadNotes, addNote, updateNote, deleteNote, setNotes] = useResource("/notes");
  const [tasks, loadTasks, addTaskRaw, updateTaskRaw, deleteTask, setTasks] = useResource("/tasks");
  const [pomodoros, loadPomodoros, addPomodoroRaw, updatePomodoro, deletePomodoro, setPomodoros] = useResource("/pomodoros");
  const [goals, loadGoals, addGoalRaw, updateGoalRaw, deleteGoal, setGoals] = useResource("/goals");
  const [plans, loadPlans, addPlanRaw, updatePlan, deletePlan, setPlans] = useResource("/plans");
  const [sessions, loadSessions, addSessionRaw, updateSession, deleteSession, setSessions] = useResource("/sessions");

  const [profile, setProfile] = useState({});
  const [points, setPoints] = useState({ total: 0, history: [] });
  const [notifications, setNotifications] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [bootstrapped, setBootstrapped] = useState(false);

  // Bootstrap data
  useEffect(() => {
    if (!isAuth) {
      setNotes([]); setTasks([]); setPomodoros([]); setGoals([]); setPlans([]);
      setSessions([]); setProfile({}); setPoints({ total: 0, history: [] });
      setNotifications([]); setQuizResults([]); setBootstrapped(false);
      return;
    }
    (async () => {
      try {
        await Promise.all([loadNotes(), loadTasks(), loadPomodoros(), loadGoals(), loadPlans(), loadSessions()]);
        const [ptsRes, notifRes, quizRes, meRes] = await Promise.all([
          api.get("/points"),
          api.get("/notifications"),
          api.get("/quiz"),
          api.get("/auth/me"),
        ]);
        setPoints(ptsRes.data);
        setNotifications(notifRes.data);
        setQuizResults(quizRes.data);
        setProfile(meRes.data.user || {});
      } catch (e) {
        console.error("Bootstrap error:", e);
      }
      setBootstrapped(true);
    })();
  }, [isAuth, loadNotes, loadTasks, loadPomodoros, loadGoals, loadPlans, loadSessions]);

  // --- Points ---
  const awardPoints = useCallback(async (amount, reason) => {
    try {
      const res = await api.post("/points", { amount, reason });
      setPoints(res.data);
      return res.data;
    } catch { return null; }
  }, []);

  // --- Notifications ---
  const pushNotification = useCallback(async (data) => {
    // Notifications are created server-side, but we can reload them
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch {}
  }, []);
  const markNotifRead = useCallback(async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id || n.id === id ? res.data : n)));
    } catch {}
  }, []);
  const markAllNotifRead = useCallback(async () => {
    try {
      const res = await api.put("/notifications/read-all");
      setNotifications(res.data);
    } catch {}
  }, []);
  const clearNotifs = useCallback(async () => {
    try {
      await api.delete("/notifications/clear-all");
      setNotifications([]);
    } catch {}
  }, []);

  // --- Tasks (wrap to award points on done) ---
  const addTask = useCallback(async (data) => {
    const t = await addTaskRaw(data);
    return t;
  }, [addTaskRaw]);

  const updateTask = useCallback(async (id, data) => {
    const prev = tasks.find((x) => (x._id || x.id) === id);
    const t = await updateTaskRaw(id, data);
    if (data.status === "done" && prev && prev.status !== "done") {
      awardPoints(POINTS.TASK_DONE, `Completed task: ${t.title}`);
    }
    return t;
  }, [tasks, updateTaskRaw, awardPoints]);

  // --- Pomodoros ---
  const addPomodoro = useCallback(async (data) => {
    const p = await addPomodoroRaw(data);
    awardPoints(POINTS.POMODORO, "Completed a focus session");
    return p;
  }, [addPomodoroRaw, awardPoints]);

  const clearPomodoros = useCallback(async () => {
    // Delete all one by one (or server supports bulk)
    for (const p of pomodoros) await deletePomodoro(p._id || p.id);
    setPomodoros([]);
  }, [pomodoros, deletePomodoro, setPomodoros]);

  // --- Goals ---
  const addGoal = useCallback(async (data) => {
    return addGoalRaw(data);
  }, [addGoalRaw]);

  const updateGoal = useCallback(async (id, data) => {
    const prev = goals.find((x) => (x._id || x.id) === id);
    const g = await updateGoalRaw(id, data);
    if (prev && prev.progress < prev.target && g.progress >= g.target) {
      awardPoints(POINTS.GOAL_COMPLETE, `Achieved goal: ${g.title}`);
    }
    return g;
  }, [goals, updateGoalRaw, awardPoints]);

  // --- Plans ---
  const addPlan = useCallback(async (data) => {
    return addPlanRaw(data);
  }, [addPlanRaw]);

  // --- Sessions ---
  const addSession = useCallback(async (data) => {
    return addSessionRaw(data);
  }, [addSessionRaw]);

  // --- Profile ---
  const updateProfile = useCallback(async (data) => {
    // Profile updates go through auth/me for now
    setProfile((p) => ({ ...p, ...data }));
    return { ...profile, ...data };
  }, [profile]);

  // --- Quiz ---
  const submitQuiz = useCallback(async (data) => {
    const res = await api.post("/quiz", data);
    const { result, earned, pointsTotal } = res.data;
    setQuizResults((prev) => [result, ...prev]);
    setPoints((p) => ({ ...p, total: pointsTotal }));
    // Refresh notifications
    try {
      const nRes = await api.get("/notifications");
      setNotifications(nRes.data);
    } catch {}
    return { result, earned };
  }, []);

  return (
    <DataContext.Provider
      value={{
        bootstrapped,
        notes, tasks, pomodoros, goals, plans, sessions, profile,
        points, notifications, quizResults,
        addNote, updateNote, deleteNote,
        addTask, updateTask, deleteTask,
        addPomodoro, clearPomodoros,
        addGoal, updateGoal, deleteGoal,
        addPlan, deletePlan,
        addSession,
        updateProfile,
        awardPoints,
        pushNotification, markNotifRead, markAllNotifRead, clearNotifs,
        submitQuiz,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
