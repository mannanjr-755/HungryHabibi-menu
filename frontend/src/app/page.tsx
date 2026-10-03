import Image from "next/image";
import Link from "next/link";

const crmBase =
  (process.env.NEXT_PUBLIC_CRM_URL || "http://localhost:3001").replace(/\/$/, "");

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="habibi-glow pointer-events-none absolute inset-0" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="HungryHabibi"
            width={52}
            height={52}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-[var(--gold)]/40 sm:h-14 sm:w-14"
            priority
          />
          <div>
            <p className="font-display text-xl tracking-wide text-[var(--gold-bright)] sm:text-2xl">
              HungryHabibi
            </p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-dim)]">
              Digital menu
            </p>
          </div>
        </div>
        <a
          href={`${crmBase}/login`}
          className="rounded-full border border-[var(--gold)]/40 px-4 py-2 text-sm text-[var(--gold-bright)] transition hover:bg-[var(--gold)]/10 sm:px-5"
        >
          Staff login
        </a>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
          Table ordering · Live kitchen
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl leading-[1.05] text-[var(--text)] sm:text-7xl">
          <span className="gold-text">HungryHabibi</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          Scan a table QR or NFC tag, browse the menu, and place your order. Staff see every order
          appear live on the kitchen dashboard.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/r/hungryhabibi/t/12"
            className="gold-gradient rounded-md px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[#0c0b09] shadow-[0_8px_24px_rgba(201,162,39,0.25)]"
          >
            Open menu
          </Link>
          <a
            href={`${crmBase}/login`}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-7 py-3.5 text-sm font-semibold text-[var(--text)]"
          >
            Open dashboard
          </a>
        </div>

        <dl className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-5">
          {[
            {
              title: "Table URL",
              body: "/r/hungryhabibi/t/12 — NFC and QR only store this link.",
            },
            {
              title: "Live orders",
              body: "NEW → ACCEPTED → PREPARING → READY → COMPLETED",
            },
            {
              title: "Shared database",
              body: "Menu and orders sync with your Neon PostgreSQL database.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
            >
              <dt className="font-display text-lg text-[var(--gold-bright)]">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{item.body}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
