import { useMemo, useState } from "react";
import {
  Brain, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Trophy, Lock,
  Sparkles, RotateCcw, Award, Calendar, CalendarDays, ArrowRight, Target, Lightbulb,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, Spinner } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { Tag } from "../components/ui/Tag";
import { Modal } from "../components/ui/Modal";
import { QUIZ_TOPICS, getQuiz } from "../utils/quizData";
import { formatRelative } from "../utils/helpers";

export default function Quiz() {
  const { profile, updateProfile, submitQuiz, quizResults, points, bootstrapped } = useData();
  const toast = useToast();
  const lockedTopic = profile?.quizTopic || "";

  const [confirmTopic, setConfirmTopic] = useState(null);
  const [quizType, setQuizType] = useState(null); // 'daily' | 'weekly'
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stage, setStage] = useState("idle"); // idle | active | result
  const [resultData, setResultData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const lockTopic = async () => {
    await updateProfile({ quizTopic: confirmTopic });
    toast.success(`Track locked: ${confirmTopic}. Good luck! 🚀`);
    setConfirmTopic(null);
  };

  const startQuiz = (type) => {
    const qs = getQuiz(lockedTopic, type);
    if (!qs.length) return toast.error("No questions available");
    setQuestions(qs);
    setQuizType(type);
    setAnswers({});
    setCurrent(0);
    setStage("active");
  };

  const selectAnswer = (qid, idx) => setAnswers((a) => ({ ...a, [qid]: idx }));

  const finish = async () => {
    setSubmitting(true);
    let correct = 0;
    questions.forEach((q) => { if (answers[q.id] === q.answer) correct++; });
    const data = { topic: lockedTopic, type: quizType, total: questions.length, correct, score: Math.round((correct / questions.length) * 100) };
    try {
      const { earned } = await submitQuiz(data);
      setResultData({ ...data, earned });
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStage("idle");
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    setResultData(null);
  };

  const answeredCount = Object.keys(answers).length;
  const topicMeta = QUIZ_TOPICS.find((t) => t.id === lockedTopic);

  const stats = useMemo(() => {
    if (!quizResults.length) return { attempts: 0, avg: 0, best: 0 };
    const avg = Math.round(quizResults.reduce((s, r) => s + r.score, 0) / quizResults.length);
    const best = Math.max(...quizResults.map((r) => r.score));
    return { attempts: quizResults.length, avg, best };
  }, [quizResults]);

  if (!bootstrapped) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  // ============ TOPIC SELECTION ============
  if (!lockedTopic) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 p-6 text-white sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
              <Sparkles className="h-3.5 w-3.5" /> Choose your track
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Select ONE quiz track</h2>
            <p className="mt-1.5 max-w-lg text-sm text-white/90">
              You can pick only one track — choose wisely! This will be your dedicated quiz path with daily & weekly tests.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <Lock className="mr-1.5 inline h-4 w-4" />
          <strong>Important:</strong> Once selected, your track is locked. You can only attempt quizzes for your chosen subject.
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUIZ_TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setConfirmTopic(t.id)}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-xl dark:border-[#252839] dark:bg-[#131520]"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${t.color} text-2xl`}>
                {t.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.label}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Select track <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        <Modal
          open={!!confirmTopic}
          onClose={() => setConfirmTopic(null)}
          title="Confirm your track"
          description="This choice is permanent and cannot be changed later."
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirmTopic(null)}>Cancel</Button>
              <Button onClick={lockTopic} leftIcon={<Lock className="h-4 w-4" />}>Lock {confirmTopic}</Button>
            </>
          }
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are about to lock <strong>{confirmTopic}</strong> as your quiz track. You will only be able to take
            <strong> {confirmTopic}</strong> daily and weekly quizzes from now on.
          </p>
        </Modal>
      </div>
    );
  }

  // ============ ACTIVE QUIZ ============
  if (stage === "active") {
    const q = questions[current];
    const selected = answers[q.id];
    const progress = ((current + 1) / questions.length) * 100;

    return (
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Progress header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tag color="indigo">{lockedTopic}</Tag>
            <Tag color="violet">{quizType} quiz</Tag>
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {answeredCount}/{questions.length} answered
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#1f2233]">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <Card className="scale-in">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              {current + 1}
            </div>
            <h3 className="pt-1 text-base font-semibold text-slate-900 dark:text-white">{q.q}</h3>
          </div>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const isSel = selected === idx;
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(q.id, idx)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${
                    isSel
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 dark:border-[#252839] dark:bg-[#1a1c2a] dark:hover:border-indigo-500/40"
                  }`}
                >
                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isSel ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500 dark:bg-[#252839] dark:text-slate-400"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`text-sm ${isSel ? "font-semibold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Previous
          </Button>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition ${
                  i === current ? "w-5 bg-indigo-500" : answers[questions[i].id] !== undefined ? "bg-indigo-300 dark:bg-indigo-500/50" : "bg-slate-200 dark:bg-[#252839]"
                }`}
              />
            ))}
          </div>
          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Next
            </Button>
          ) : (
            <Button onClick={finish} loading={submitting} variant="success" rightIcon={<CheckCircle2 className="h-4 w-4" />}>
              Submit
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ============ RESULT ============
  if (stage === "result" && resultData) {
    const pct = resultData.score;
    const grade = pct >= 80 ? { label: "Excellent! 🌟", color: "text-emerald-500" } : pct >= 60 ? { label: "Good job! 👍", color: "text-indigo-500" } : pct >= 40 ? { label: "Keep practicing 💪", color: "text-amber-500" } : { label: "Don't give up! 🔁", color: "text-rose-500" };

    return (
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Score card */}
        <Card className="relative overflow-hidden text-center">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
          <div className="py-4">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <Trophy className="h-8 w-8" />
            </div>
            <p className={`text-lg font-bold ${grade.color}`}>{grade.label}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lockedTopic} · {resultData.type} quiz</p>
            <div className="mt-5 flex items-center justify-center gap-8">
              <div>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{resultData.correct}<span className="text-lg text-slate-400">/{resultData.total}</span></p>
                <p className="text-xs text-slate-400">Correct</p>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-[#252839]" />
              <div>
                <p className="text-4xl font-bold gradient-text">{pct}%</p>
                <p className="text-xs text-slate-400">Score</p>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-[#252839]" />
              <div>
                <p className="text-4xl font-bold text-amber-500">+{resultData.earned}</p>
                <p className="text-xs text-slate-400">Points</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="secondary" onClick={reset} leftIcon={<RotateCcw className="h-4 w-4" />}>Back to quizzes</Button>
              <Button onClick={() => startQuiz(resultData.type)} leftIcon={<Brain className="h-4 w-4" />}>Retry</Button>
            </div>
          </div>
        </Card>

        {/* Review answers */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Review & Explanations
          </h3>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.answer;
              return (
                <Card key={q.id}>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${isCorrect ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-500 dark:bg-rose-500/10"}`}>
                      {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{i + 1}. {q.q}</p>
                      <div className="mt-2 space-y-1.5">
                        {q.options.map((opt, idx) => {
                          const isAnswer = idx === q.answer;
                          const isUserWrong = idx === userAns && !isCorrect;
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                                isAnswer ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" :
                                isUserWrong ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" :
                                "text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <span className="font-bold">{String.fromCharCode(65 + idx)}.</span>
                              <span className="flex-1">{opt}</span>
                              {isAnswer && <CheckCircle2 className="h-4 w-4" />}
                              {isUserWrong && <XCircle className="h-4 w-4" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-indigo-50/60 p-2.5 dark:bg-indigo-500/5">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          <strong className="text-indigo-600 dark:text-indigo-400">Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============ IDLE / DASHBOARD ============
  return (
    <div className="space-y-5">
      {/* Track banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${topicMeta?.color || "from-indigo-500 to-violet-600"} p-6 text-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80">
              <Lock className="h-3 w-3" /> Your locked track
            </p>
            <h2 className="mt-1 text-3xl font-bold">{topicMeta?.label}</h2>
            <p className="text-sm text-white/90">{topicMeta?.desc}</p>
          </div>
          <div className="text-6xl">{topicMeta?.icon}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10"><Award className="h-5 w-5" /></div><div><p className="text-xs text-slate-400">Points</p><p className="text-xl font-bold text-slate-900 dark:text-white">{points.total}</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10"><Target className="h-5 w-5" /></div><div><p className="text-xs text-slate-400">Attempts</p><p className="text-xl font-bold text-slate-900 dark:text-white">{stats.attempts}</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10"><Trophy className="h-5 w-5" /></div><div><p className="text-xs text-slate-400">Best</p><p className="text-xl font-bold text-slate-900 dark:text-white">{stats.best}%</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500 dark:bg-violet-500/10"><Brain className="h-5 w-5" /></div><div><p className="text-xs text-slate-400">Avg Score</p><p className="text-xl font-bold text-slate-900 dark:text-white">{stats.avg}%</p></div></div></Card>
      </div>

      {/* Quiz cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="group transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <Tag color="indigo">20 questions</Tag>
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Daily Quiz</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fresh set of 20 questions to keep you sharp every day.</p>
          <Button onClick={() => startQuiz("daily")} className="mt-4 w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>Start Daily Quiz</Button>
        </Card>

        <Card className="group transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white">
              <CalendarDays className="h-6 w-6" />
            </div>
            <Tag color="rose">20 questions</Tag>
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Weekly Quiz</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tougher weekly challenge to test deeper understanding.</p>
          <Button onClick={() => startQuiz("weekly")} className="mt-4 w-full bg-gradient-to-r from-rose-500 to-pink-600" rightIcon={<ArrowRight className="h-4 w-4" />}>Start Weekly Quiz</Button>
        </Card>
      </div>

      {/* History */}
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Recent Attempts</h3>
        {quizResults.length === 0 ? (
          <EmptyState icon={Brain} title="No attempts yet" description="Take your first quiz to start earning points!" />
        ) : (
          <ul className="space-y-2">
            {quizResults.slice(0, 8).map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-[#252839] dark:bg-[#1a1c2a]/50">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${r.score >= 60 ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10" : "bg-amber-50 text-amber-500 dark:bg-amber-500/10"}`}>
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize text-slate-900 dark:text-white">{r.topic} · {r.type}</p>
                    <p className="text-xs text-slate-400">{formatRelative(r.at)} · {r.correct}/{r.total} correct</p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${r.score >= 60 ? "text-emerald-500" : "text-amber-500"}`}>{r.score}%</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
