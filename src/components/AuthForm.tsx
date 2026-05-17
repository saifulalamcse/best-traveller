import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";

type Mode = "signin" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/home" });
  };

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background px-6 pb-10 pt-12">
      <Link
        to="/"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </Link>

      <div className="mt-10 space-y-2">
        <h1 className="font-display text-4xl leading-tight">
          {isSignup ? "Begin your journey." : "Welcome back."}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignup
            ? "Create an account to save itineraries and unlock member rates."
            : "Sign in to continue planning your next escape."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isSignup && (
          <Field icon={<UserIcon size={16} />} label="Full name" type="text" placeholder="Ada Lovelace" />
        )}
        <Field icon={<Mail size={16} />} label="Email" type="email" placeholder="you@wander.app" />
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 focus-within:border-primary">
            <Lock size={16} className="text-muted-foreground" />
            <input
              type={showPwd ? "text" : "password"}
              required
              placeholder="••••••••"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-muted-foreground">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {!isSignup && (
          <div className="flex justify-end">
            <button type="button" className="text-xs font-medium text-primary">
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-foreground text-base font-semibold text-background shadow-card transition-transform active:scale-[0.98]"
        >
          {isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton label="Google" />
        <SocialButton label="Apple" />
      </div>

      <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link to={isSignup ? "/signin" : "/signup"} className="font-semibold text-primary">
          {isSignup ? "Sign in" : "Create account"}
        </Link>
      </p>
    </div>
  );
}

function Field({ icon, label, type, placeholder }: { icon: React.ReactNode; label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 focus-within:border-primary">
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          required
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-12 items-center justify-center rounded-2xl border border-border bg-card text-sm font-medium text-foreground transition-colors active:bg-secondary"
    >
      {label}
    </button>
  );
}