"use client";

import Link from "next/link";
import { useState } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { ArrowRight, ArrowUpRight, Calendar, Menu, X } from "lucide-react";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

const D = "font-[family-name:var(--font-display)]";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Events", href: "#events" },
  { label: "Teams", href: "#teams" },
];

const fallbackProducts = [
  {
    _id: "default-1",
    title: "BuildMate",
    description: "A platform that brings builders, ideas and collaborators together across disciplines.",
    link: "#contact",
  },
];

const fallbackEvents = [
  {
    _id: "default-e1",
    date: new Date().toISOString(),
    title: "BUILDX: IoT Edition",
    description: "A hands-on workshop on IoT fundamentals and connected hardware devices, concluding with working prototype solutions.",
  },
  {
    _id: "default-e2",
    date: new Date(Date.now() + 86400000 * 14).toISOString(),
    title: "SWAGAT 2026",
    description: "The welcome session for new students: discovering what XTS is, our projects, and how to get involved.",
  },
  {
    _id: "default-e3",
    date: new Date(Date.now() + 86400000 * 45).toISOString(),
    title: "XTS Tech Fest",
    description: "Hackathons, live product showcases, and technical competitions for student creators.",
  },
];

const steps = [
  ["Learn", "Explore technologies and strengthen fundamentals."],
  ["Build", "Turn what you learn into projects, prototypes and products."],
  ["Collaborate", "Work across teams, share knowledge, solve problems together."],
  ["Launch", "Show your work, collect feedback, ship something real."],
];

const teams = [
  ["Technology", "Engineering and development"],
  ["Design & Creative", "UI/UX and visual identity"],
  ["Events & Operations", "Planning and execution"],
  ["Community", "People and partnerships"],
];

const stats = [
  ["100+", "members"],
  ["7+", "products and projects"],
  ["15+", "events and workshops"],
  ["4", "active teams"],
];

function Byte() {
  const [bits, setBits] = useState([0, 1, 0, 1, 1, 0, 0, 0]);
  const code = parseInt(bits.join(""), 2);
  const char = code >= 33 && code <= 126 ? String.fromCharCode(code) : "·";

  return (
    <div className="rounded-2xl bg-[#0F1226] p-6 text-[#F4F5FA] sm:p-8">
      <p className="text-sm text-[#DDE0F0]/70">
        Every byte is eight switches. Flip them.
      </p>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div className="grid flex-1 grid-cols-8 gap-1.5 sm:gap-2">
          {bits.map((b, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={b === 1}
              aria-label={`Bit ${7 - i}, currently ${b}`}
              onClick={() =>
                setBits((prev) => prev.map((v, j) => (j === i ? 1 - v : v)))
              }
              className={`${D} aspect-[3/4] rounded-lg text-2xl font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB627] sm:text-3xl ${
                b
                  ? "bg-[#FFB627] text-[#0F1226]"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <div className="w-20 shrink-0 text-right" aria-live="polite">
          <div className={`${D} text-6xl font-extrabold leading-none text-[#FFB627]`}>
            {char}
          </div>
          <div className="mt-2 text-xs text-[#DDE0F0]/60">decimal {code}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-[#DDE0F0]/60">
        <span>X is 01011000. Can you spell T, then S?</span>
        <button
          type="button"
          onClick={() => setBits([0, 1, 0, 1, 1, 0, 0, 0])}
          className="underline underline-offset-4 hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

interface LandingClientProps {
  initialEvents?: any[];
  initialProjects?: any[];
}

export default function LandingClient({ initialEvents = [], initialProjects = [] }: LandingClientProps) {
  const [open, setOpen] = useState(false);
  const link =
    "text-sm font-medium text-[#0F1226]/70 transition-colors hover:text-[#3347F2]";
  const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3347F2]";
  const wrap = "mx-auto max-w-6xl px-5 sm:px-8";
  const label = "text-sm font-semibold text-[#3347F2]";
  const h2 = `${D} mt-3 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl`;

  const displayProjects = initialProjects.length > 0 ? initialProjects : fallbackProducts;
  const displayEvents = initialEvents.length > 0 ? initialEvents : fallbackEvents;

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#F4F5FA] font-[family-name:var(--font-body)] text-[#0F1226] selection:bg-[#FFB627] selection:text-[#0F1226]`}
    >
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-[#DDE0F0] bg-[#F4F5FA]/90 backdrop-blur">
        <nav className={`${wrap} flex items-center justify-between py-4`}>
          <Link href="/" className={`${D} flex items-center gap-2.5 text-xl font-extrabold tracking-tight ${focus}`}>
            <img src="/icon-192.png" alt="XTS Logo" className="h-8 w-8 rounded-full object-contain shadow-sm" />
            <span>
              Xavier<span className="text-[#3347F2]">Tech</span>Byte
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`${link} ${focus}`}>
                {l.label}
              </a>
            ))}
            <a href="#upcoming" className={`${link} ${focus}`}>
              Opportunities
            </a>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/login" className={`rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#DDE0F0] ${focus}`}>
              Member login
            </Link>
            <Link
              href="/admin-login"
              className={`rounded-full bg-[#0F1226] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3347F2] ${focus}`}
            >
              Admin access
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`rounded-full border border-[#0F1226]/15 p-2.5 sm:hidden ${focus}`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-[#DDE0F0] px-5 py-4 sm:hidden">
            <div className="flex flex-col">
              {[...navLinks, { label: "Opportunities", href: "#upcoming" }].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#DDE0F0] py-3 text-base font-medium"
                >
                  {l.label}
                </a>
              ))}
              <Link href="/login" className="mt-4 rounded-full bg-[#3347F2] px-4 py-3 text-center font-semibold text-white">
                Member login
              </Link>
              <Link href="/admin-login" className="mt-2 rounded-full border border-[#0F1226]/20 px-4 py-3 text-center font-semibold">
                Admin access
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className={`${wrap} grid gap-12 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center`}>
        <div>
          <p className="text-sm font-medium text-[#0F1226]/60">
            Student-led tech community · St. Xavier&apos;s College, Ranchi
          </p>
          <h1 className={`${D} mt-5 text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl`}>
            Ideas into innovation. Students into{" "}
            <span className="relative whitespace-nowrap">
              <span className="absolute inset-x-0 bottom-1 -z-0 h-[0.28em] bg-[#FFB627]" aria-hidden />
              <span className="relative">builders.</span>
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#0F1226]/75">
            Xavier Tech Byte Society is where students collaborate, build
            products, try new technology and turn ambitious ideas into working
            things.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#3347F2] px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#0F1226] ${focus}`}
            >
              See what we build <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/login"
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#0F1226]/20 px-7 py-4 text-sm font-semibold transition-colors hover:bg-[#DDE0F0] ${focus}`}
            >
              Enter XTS platform <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* XTS Members Photo Slot */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#0F1226]/10 bg-[#0F1226] shadow-xl">
            <img
              src="xts-members.jpg"
              alt="XTS Members"
              className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0E23]/95 via-[#0B0E23]/50 to-transparent p-4 sm:p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#FFB627]">
                St. Xavier&apos;s College, Ranchi
              </p>
              <p className="text-sm sm:text-base font-extrabold text-white">
                Xavier Tech Byte Society Members
              </p>
            </div>
          </div>

          <Byte />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#DDE0F0]">
        <dl className={`${wrap} grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4`}>
          {stats.map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="flex items-baseline gap-2">
                <span className={`${D} text-4xl font-extrabold`}>{v}</span>
                <span className="text-sm text-[#0F1226]/65">{l}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* PRODUCTS / PROJECTS */}
      <section id="products" className={`${wrap} scroll-mt-20 py-24`}>
        <p className={label}>What we build</p>
        <h2 className={h2}>We don&apos;t just learn technology. We build with it.</h2>
        <p className="mt-5 max-w-xl leading-7 text-[#0F1226]/70">
          We look for real problems, design solutions, experiment, and ship
          products that create value.
        </p>

        <ul className="mt-12 border-t border-[#0F1226]">
          {displayProjects.map((p: any) => {
            const hasExternalLink = p.link && (p.link.startsWith("http://") || p.link.startsWith("https://"));
            const targetHref = p.link || "#contact";

            return (
              <li key={p._id || p.title} className="border-b border-[#DDE0F0]">
                <div className="group grid items-start gap-4 py-8 md:grid-cols-[1.1fr_1.4fr_auto_auto] md:gap-8">
                  <div>
                    <h3 className={`${D} text-2xl font-bold transition-colors group-hover:text-[#3347F2]`}>
                      {p.title || p.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#0F1226]/55">
                      {p.kind || "XTS Project Portfolio"}
                    </p>
                  </div>
                  <p className="max-w-md whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/75">
                    {p.description || p.text}
                  </p>
                  <span className="w-fit rounded-full bg-[#FFB627]/30 px-3.5 py-1 text-xs font-semibold text-[#0F1226]">
                    {p.status || "Active Project"}
                  </span>
                  <div>
                    {hasExternalLink ? (
                      <a
                        href={targetHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-full border border-[#0F1226]/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3347F2] transition hover:bg-[#3347F2] hover:text-white ${focus}`}
                      >
                        Visit <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <a
                        href={targetHref}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-[#0F1226]/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F1226] transition hover:bg-[#0F1226] hover:text-white ${focus}`}
                      >
                        Explore <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-col justify-between gap-5 rounded-2xl bg-[#3347F2] p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h3 className={`${D} text-3xl font-extrabold`}>Have an idea?</h3>
            <p className="mt-2 max-w-md text-white/80">
              Bring it to the community. Find collaborators and start building.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#3347F2] hover:bg-[#FFB627] hover:text-[#0F1226]"
          >
            Build with XTS <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-20 bg-[#0F1226] py-24 text-[#F4F5FA]">
        <div className={`${wrap} grid gap-14 lg:grid-cols-2`}>
          <div>
            <p className="text-sm font-semibold text-[#FFB627]">Who we are</p>
            <h2 className={`${D} mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl`}>
              A community built around curiosity and creation.
            </h2>
            <p className="mt-6 max-w-lg leading-8 text-[#DDE0F0]/80">
              XTS is a student-led technology community at St. Xavier&apos;s
              College, Ranchi. Students learn new technologies, work across
              disciplines, develop projects and organize events.
            </p>
            <p className="mt-4 max-w-lg leading-8 text-[#DDE0F0]/80">
              We want students to do more than study technology: to apply it
              and use it on problems that matter.
            </p>
            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="border-t border-white/20 pt-4">
                <dt className={`${D} text-lg font-bold`}>Mission</dt>
                <dd className="mt-2 text-sm leading-6 text-[#DDE0F0]/75">
                  Help students learn, collaborate, innovate and build
                  practical technology.
                </dd>
              </div>
              <div className="border-t border-white/20 pt-4">
                <dt className={`${D} text-lg font-bold`}>Vision</dt>
                <dd className="mt-2 text-sm leading-6 text-[#DDE0F0]/75">
                  A community where ideas become projects and projects become
                  products.
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#FFB627]">How we work</p>
            <ol className="mt-4 border-t border-white/20">
              {steps.map(([t, d], i) => (
                <li key={t} className="flex gap-5 border-b border-white/10 py-6">
                  <span className={`${D} w-8 text-2xl font-bold text-[#FFB627]`}>{i + 1}</span>
                  <div>
                    <h3 className={`${D} text-xl font-bold`}>{t}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#DDE0F0]/75">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* MENTORS + PRESIDENT */}
      <section id="mentors" className={`${wrap} scroll-mt-20 py-24`}>
        <p className={label}>In their words</p>
        <h2 className={h2}>Guidance from mentors, direction from leadership.</h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {[
            {
              q: "Technology education becomes more meaningful when students apply their knowledge, work together, and develop solutions beyond the classroom.",
              who: "Faculty Mentor, XTS",
            },
            {
              q: "A student community creates opportunities for leadership, creativity, collaboration, and learning through practical experience.",
              who: "Faculty Advisor, XTS",
            },
          ].map((m) => (
            <figure key={m.who} className="border-t-4 border-[#3347F2] pt-6">
              <blockquote className={`${D} text-2xl font-semibold leading-snug`}>
                &ldquo;{m.q}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm text-[#0F1226]/60">{m.who}</figcaption>
            </figure>
          ))}
        </div>

        <figure id="president" className="mt-16 rounded-2xl bg-[#FFB627] p-8 sm:p-12">
          <p className="text-sm font-semibold">From the President</p>
          <blockquote className={`${D} mt-4 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl`}>
            &ldquo;XTS is about moving beyond learning alone and building
            together. We want ideas encouraged, teams empowered, and students
            making products and experiences that matter.&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm font-medium">
            President, Xavier Tech Byte Society
          </figcaption>
        </figure>
      </section>

      {/* EVENTS */}
      <section id="events" className="scroll-mt-20 border-t border-[#DDE0F0] py-24">
        <div className={wrap}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className={label}>Life at XTS</p>
              <h2 className={h2}>Workshops, showcases and competitions.</h2>
            </div>
            <a href="#upcoming" className={`inline-flex items-center gap-2 text-sm font-semibold text-[#3347F2] ${focus}`}>
              See upcoming events <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <ul className="mt-12 border-t border-[#0F1226]">
            {displayEvents.map((e: any) => {
              const eventDate = e.date ? new Date(e.date) : null;
              const isValidDate = eventDate && !isNaN(eventDate.getTime());
              const isUpcoming = isValidDate ? eventDate.getTime() >= new Date().setHours(0, 0, 0, 0) : true;
              const dateString = isValidDate
                ? eventDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : e.date || "TBA";

              return (
                <li
                  key={e._id || e.title}
                  className="grid items-start gap-4 border-b border-[#DDE0F0] py-8 md:grid-cols-[12rem_1fr_1.3fr] md:gap-8"
                >
                  <div className="flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3347F2]">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {dateString}
                    </span>
                    <span
                      className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isUpcoming
                          ? "bg-[#EAF7F0] text-[#16845B]"
                          : "bg-[#F1F3F9] text-[#777D98]"
                      }`}
                    >
                      {isUpcoming ? "Upcoming" : "Concluded"}
                    </span>
                  </div>

                  <div>
                    <h3 className={`${D} text-2xl font-bold text-[#0F1226]`}>{e.title}</h3>
                  </div>

                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/75">
                    {e.description || e.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* TEAMS */}
      <section id="teams" className="scroll-mt-20 bg-[#DDE0F0]/60 py-24">
        <div className={wrap}>
          <p className={label}>The people</p>
          <h2 className={h2}>Different strengths, one community.</h2>

          <div className="mt-12 grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {teams.map(([n, r]) => (
              <a
                key={n}
                href="#contact"
                className={`group flex items-center justify-between border-t border-[#0F1226]/30 py-6 ${focus}`}
              >
                <div>
                  <h3 className={`${D} text-2xl font-bold group-hover:text-[#3347F2]`}>{n}</h3>
                  <p className="mt-1 text-sm text-[#0F1226]/60">{r}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            ))}
          </div>

          <Link
            href="/login"
            className={`mt-8 inline-flex items-center gap-2 rounded-full border border-[#0F1226]/25 px-6 py-3 text-sm font-semibold hover:bg-white ${focus}`}
          >
            Open member directory <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* UPCOMING */}
      <section id="upcoming" className={`${wrap} scroll-mt-20 grid gap-12 py-24 lg:grid-cols-2`}>
        <div>
          <p className={label}>What&apos;s next</p>
          <h2 className={h2}>Your next opportunity starts here.</h2>
          <p className="mt-5 max-w-lg leading-8 text-[#0F1226]/70">
            Join upcoming workshops, build with other students, show your
            skills and help write the next chapter of XTS.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#3347F2] px-7 py-4 text-sm font-semibold text-white hover:bg-[#0F1226] ${focus}`}
            >
              Find opportunities <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#contact"
              className={`inline-flex items-center justify-center rounded-full border border-[#0F1226]/20 px-7 py-4 text-sm font-semibold hover:bg-[#DDE0F0] ${focus}`}
            >
              Get in touch
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F1226]/60">On the XTS platform</p>
          <ul className="mt-4 border-t border-[#0F1226]">
            {["Event announcements", "Workshop registrations", "Community activities", "Project collaboration"].map((i) => (
              <li key={i} className={`${D} border-b border-[#DDE0F0] py-4 text-xl font-semibold`}>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* JOIN */}
      <section id="contact" className="scroll-mt-20 px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#0F1226] px-6 py-16 text-[#F4F5FA] sm:px-14 sm:py-24">
          <h2 className={`${D} max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl`}>
            Don&apos;t just watch technology evolve. Help build it.
          </h2>
          <p className="mt-6 max-w-lg leading-8 text-[#DDE0F0]/75">
            Meet the community, find opportunities, and help shape what XTS
            becomes next.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFB627] px-7 py-4 text-sm font-semibold text-[#0F1226] hover:bg-white"
            >
              Enter XTS platform <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:xts@example.com"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-4 text-sm font-semibold hover:bg-white/10"
            >
              Email XTS
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#DDE0F0]">
        <div className={`${wrap} grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]`}>
          <div>
            <p className={`${D} text-xl font-extrabold`}>
              Xavier<span className="text-[#3347F2]">Tech</span>Byte
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#0F1226]/65">
              A student-led technology community for learning, collaboration and building real products.
            </p>
            <p className="mt-3 text-sm text-[#0F1226]/65">St. Xavier&apos;s College, Ranchi</p>
          </div>
          <FooterCol title="Explore">
            <a href="#about">About XTS</a>
            <a href="#products">Products</a>
            <a href="#events">Events</a>
            <a href="#teams">Teams</a>
          </FooterCol>
          <FooterCol title="Platform">
            <Link href="/login">Member login</Link>
            <Link href="/admin-login">Admin access</Link>
            <a href="#upcoming">Opportunities</a>
            <a href="#contact">Contact</a>
          </FooterCol>
          <FooterCol title="Connect">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:xts@example.com">Email</a>
          </FooterCol>
        </div>
        <div className="border-t border-[#DDE0F0]">
          <div className={`${wrap} flex flex-col gap-2 py-6 text-xs text-[#0F1226]/55 md:flex-row md:justify-between`}>
            <p>© {new Date().getFullYear()} Xavier Tech Byte Society. All rights reserved.</p>
            <p>Built with purpose. Driven by innovation.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className={`${D} font-bold`}>{title}</h3>
      <div className="mt-4 flex flex-col gap-3 text-sm text-[#0F1226]/65 [&_a]:transition-colors [&_a:hover]:text-[#3347F2]">
        {children}
      </div>
    </div>
  );
}
