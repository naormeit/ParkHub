import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/5 bg-slate-950/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <span className="text-xl font-semibold text-slate-950">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                ParkHub Global
              </span>
              <span className="text-xs text-slate-400">Smart parking, anywhere</span>
            </div>
          </Link>
          <div className="hidden items-center gap-3 text-xs text-slate-300 md:flex">
            <Link
              href="/how-it-works"
              className="rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1 hover:border-emerald-400 hover:text-emerald-300"
            >
              How it works
            </Link>
            <Link
              href="/search"
              className="rounded-full bg-emerald-500 px-3 py-1 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Start searching
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need for stress-free parking
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            ParkHub Global combines live availability, smart booking rules, secure
            payments, and navigation so you can focus on your journey instead of
            circling for a spot.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold text-emerald-400">
              Global search and live availability
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Search for parking in any city or suburban area worldwide. See how
              many slots are available in real time, including busy hubs like
              airports, tech parks, and malls.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Worldwide coverage powered by global location search</li>
              <li>• Live counts of free vs total slots</li>
              <li>• Radius control from 2km to 10km</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold text-emerald-400">
              Smart advance booking
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Lock in your spot before you arrive. ParkHub requires your arrival
              time to be at least 30 minutes in the future, ensuring operators
              have time to prepare your space.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Enforced 30-minute minimum lead time</li>
              <li>• Flexible duration from 1 to 24 hours</li>
              <li>• Clear pricing broken down by hours and extras</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold text-emerald-400">
              Late arrival protection
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Running late? Add an optional late arrival protection fee so your
              spot is held even if you are delayed beyond your planned time.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Adds 40% of the base parking fee</li>
              <li>• Keeps your spot reserved during typical delays</li>
              <li>• Can be toggled on or off per booking</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold text-emerald-400">
              Secure Stripe payments and navigation
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Pay using Stripe with your preferred card or wallet. Once confirmed,
              open turn-by-turn navigation in your maps app directly from your
              booking.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• PCI-compliant payments via Stripe Checkout</li>
              <li>• No card details stored on ParkHub servers</li>
              <li>• One-tap directions using Google Maps</li>
            </ul>
          </div>
        </section>

        <section className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-emerald-400">
              Ready to try ParkHub Global?
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Start by searching for parking in your next destination and see live
              availability instantly.
            </p>
          </div>
          <Link
            href="/search"
            className="mt-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-900/40 transition hover:bg-emerald-400 sm:mt-0"
          >
            Find parking now
          </Link>
        </section>
      </main>
    </div>
  );
}

