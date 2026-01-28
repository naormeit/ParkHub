'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <header className="absolute top-0 z-50 w-full border-b border-white/5 bg-transparent p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <span className="text-2xl font-bold text-slate-950">P</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              ParkHub Global
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-slate-300 md:flex">
            <Link href="/features" className="transition hover:text-emerald-400">
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="transition hover:text-emerald-400"
            >
              How it works
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="mt-12 z-10 max-w-3xl space-y-8 text-center">
          <h1 className="pb-2 text-5xl font-bold tracking-tight text-white md:text-7xl">
            Parking made simple, anywhere.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 md:text-xl">
            Find secure parking spots in cities worldwide. Book in advance,
            navigate easily, and pay securely with Stripe.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 mx-auto flex w-full max-w-xl flex-col gap-4 md:flex-row"
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Where do you want to park? (e.g. London, New York)"
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg text-white outline-none backdrop-blur-md transition placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              Search
            </button>
          </form>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-slate-900/50 py-12 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 text-center md:grid-cols-3 md:text-left">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10">
            <h3 className="mb-2 text-lg font-semibold text-emerald-400">
              Global Coverage
            </h3>
            <p className="text-sm text-slate-400">
              Real-time availability in major cities and suburbs worldwide.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10">
            <h3 className="mb-2 text-lg font-semibold text-emerald-400">
              Smart Booking
            </h3>
            <p className="text-sm text-slate-400">
              Reserve 30 minutes ahead and add late arrival protection.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10">
            <h3 className="mb-2 text-lg font-semibold text-emerald-400">
              Secure Payments
            </h3>
            <p className="text-sm text-slate-400">
              Seamless payments powered by Stripe with no hidden fees.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
