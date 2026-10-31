
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import {
  UserRound,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Zap,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const D = "font-[family-name:var(--font-display)]";

export default function MemberLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const xts_id = formData.get("xts_id");
    const email = formData.get("email");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xts_id, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (!data.redirect || typeof data.redirect !== "string") {
        throw new Error("Invalid redirect received from server");
      }

      router.push(data.redirect);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#DDE0F0] bg-white px-4 py-3.5 text-sm text-[#0F1226] outline-none transition placeholder:text-[#0F1226]/35 focus:border-[#3347F2] focus:ring-4 focus:ring-[#3347F2]/10 disabled:opacity-60";

  const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3347F2]";

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#F4F5FA] font-[family-name:var(--font-body)] text-[#0F1226]`}
    >
      {/* NAVBAR */}
      <header className="border-b border-[#DDE0F0] bg-[#F4F5FA]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className={`${D} flex items-center gap-3 text-lg font-extrabold tracking-tight ${focus}`}
          >
            <img src="/icon-192.png" alt="XTS Logo" className="h-10 w-10 rounded-full object-contain shadow-sm" />
            <span>
              Xavier<span className="text-[#3347F2]">Tech</span>Byte
            </span>
          </Link>

          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#0F1226]/65 transition hover:bg-[#DDE0F0] hover:text-[#0F1226] ${focus}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to XTS</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </nav>
      </header>

      {/* LOGIN CONTENT */}
      <section className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-5 py-14 sm:px-8 sm:py-20">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-[#3347F2]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#FFB627]/15 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          {/* LEFT: BRAND STORY */}
          <div className="hidden lg:block">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#3347F2]">
              <span className="h-2 w-2 rounded-full bg-[#3347F2]" />
              ST. XAVIER&apos;S COLLEGE, RANCHI
            </p>

            <h1
              className={`${D} mt-6 text-6xl font-extrabold leading-[0.98] tracking-tight`}
            >
              Your space.
              <span className="mt-2 block">Your community.</span>
              <span className="relative mt-2 inline-block">
                <span className="absolute inset-x-0 bottom-1 -z-0 h-[0.25em] bg-[#FFB627]" />
                <span className="relative">Your XTS.</span>
              </span>
            </h1>

            <p className="mt-7 max-w-md text-lg leading-8 text-[#0F1226]/65">
              Access your member profile, explore your achievements, and stay
              connected with the people building technology together.
            </p>

            <div className="mt-10 border-t border-[#DDE0F0]">
              {[
                {
                  icon: UserRound,
                  title: "Your member identity",
                  text: "Your XTS profile and membership details.",
                },
                {
                  icon: ShieldCheck,
                  title: "Your achievements",
                  text: "Access your available certificates and recognitions.",
                },
                {
                  icon: Zap,
                  title: "Your community",
                  text: "Stay connected with teams and opportunities.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 border-b border-[#DDE0F0] py-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#3347F2] shadow-sm ring-1 ring-[#DDE0F0]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold">{item.title}</h2>
                    <p className="mt-1 text-sm text-[#0F1226]/55">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: LOGIN FORM */}
          <div className="mx-auto w-full max-w-md">
            {/* Mobile heading */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3347F2] text-white shadow-xl shadow-[#3347F2]/20">
                <UserRound className="h-7 w-7" />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#3347F2]">
                Xavier Tech Byte Society
              </p>

              <h1
                className={`${D} mt-3 text-3xl font-extrabold tracking-tight`}
              >
                Welcome back.
              </h1>

              <p className="mt-2 text-sm text-[#0F1226]/60">
                Sign in to your XTS member space.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DDE0F0] bg-white p-6 shadow-xl shadow-[#0F1226]/5 sm:p-9">
              <div className="mb-8 hidden lg:block">
                <p className="text-sm font-semibold text-[#3347F2]">
                  MEMBER ACCESS
                </p>
                <h2
                  className={`${D} mt-3 text-4xl font-extrabold tracking-tight`}
                >
                  Welcome back.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#0F1226]/60">
                  Enter your registered details to access your member profile.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                  >
                    <p className="font-semibold">Unable to sign in</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#0F1226]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="xts_id"
                    className="mb-2 block text-sm font-semibold text-[#0F1226]"
                  >
                    XTS Member ID
                  </label>

                  <input
                    id="xts_id"
                    name="xts_id"
                    type="text"
                    autoComplete="username"
                    required
                    disabled={loading}
                    className={inputClass}
                    placeholder="e.g. XTS-1029"
                  />

                  <p className="mt-2 text-xs leading-5 text-[#0F1226]/50">
                    Use the member ID assigned to you by XTS.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-[#3347F2] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0F1226] disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      Sign in to XTS
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#F4F5FA] p-4">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#3347F2]" />
                <p className="text-xs leading-5 text-[#0F1226]/60">
                  Member access is intended for registered XTS members. Your
                  details must match the records maintained by the platform.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-[#0F1226]/60">
              Are you an administrator?{" "}
              <Link
                href="/admin-login"
                className={`font-bold text-[#3347F2] underline-offset-4 hover:underline ${focus}`}
              >
                Admin access <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-[#0F1226]/40">
              © {new Date().getFullYear()} Xavier Tech Byte Society
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
