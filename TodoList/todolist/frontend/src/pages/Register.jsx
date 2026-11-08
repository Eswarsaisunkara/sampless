import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { EXAMS } from "../utils/constants";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", exam: "GATE" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form);
      toast.success("Account created! Welcome to StudyOS.");
      navigate("/app/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your productive study journey in seconds">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Alex Sharma"
          leftIcon={<User className="h-4 w-4" />}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Password"
          type={show ? "text" : "password"}
          placeholder="At least 6 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShow(!show)} className="pointer-events-auto">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        <Select
          label="Preparing for"
          value={form.exam}
          onChange={(e) => setForm({ ...form, exam: e.target.value })}
          options={EXAMS.map((e) => ({ value: e, label: e }))}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg" leftIcon={<UserPlus className="h-4 w-4" />}>
          Create account
        </Button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
