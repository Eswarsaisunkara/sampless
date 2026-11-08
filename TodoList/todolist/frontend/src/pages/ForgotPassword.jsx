import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle2, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ForgotPassword() {
  const { forgotPassword, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = email, 2 = code+new password, 3 = done
  const [email, setEmail] = useState("");
  const [sentCode, setSentCode] = useState(""); // demo only — reveals code
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    const err = {};
    if (!email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) err.email = "Enter a valid email";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSentCode(res.code); // demo: show the code
      toast.success("Reset code sent to your email");
      setStep(2);
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setLoading(false);
    }
  };

  const doReset = async (e) => {
    e.preventDefault();
    const err = {};
    if (!code) err.code = "Enter the 6-digit code";
    if (!newPassword) err.newPassword = "Enter a new password";
    else if (newPassword.length < 6) err.newPassword = "At least 6 characters";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword });
      toast.success("Password changed successfully!");
      setStep(3);
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 3 ? "All done! ✅" : "Reset your password"}
      subtitle={step === 1 ? "Enter your email to receive a reset code" : step === 2 ? "Enter the code and your new password" : "Your password has been updated"}
    >
      {step === 1 && (
        <form onSubmit={sendCode} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg" leftIcon={<Send className="h-4 w-4" />}>
            Send reset code
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={doReset} className="space-y-4">
          {sentCode && (
            <div className="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 p-3 text-center text-xs text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <strong>Demo mode:</strong> Your reset code is <span className="font-mono font-bold tracking-widest">{sentCode}</span>
              <br />(In production this is emailed via Nodemailer)
            </div>
          )}
          <Input
            label="Reset code"
            placeholder="6-digit code"
            leftIcon={<KeyRound className="h-4 w-4" />}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={errors.code}
            maxLength={6}
          />
          <Input
            label="New password"
            type={show ? "text" : "password"}
            placeholder="At least 6 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShow(!show)} className="pointer-events-auto">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
            Change password
          </Button>
          <button type="button" onClick={() => setStep(1)} className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400">
            <ArrowLeft className="h-4 w-4" /> Use a different email
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your password has been changed successfully. You can now sign in with your new password.
          </p>
          <Button onClick={() => navigate("/login")} className="mt-6" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to sign in
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
