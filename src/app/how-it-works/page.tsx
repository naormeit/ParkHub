import Link from "next/link";

export default function HowItWorksPage() {
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
              <span className="text-xs text-slate-400">
                Book, pay, and park with confidence
              </span>
            </div>
          </Link>
          <div className="hidden items-center gap-3 text-xs text-slate-300 md:flex">
            <Link
              href="/features"
              className="rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1 hover:border-emerald-400 hover:text-emerald-300"
            >
              Features
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
            How ParkHub Global works
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            From search to navigation, ParkHub Global guides you through every
            step of booking a secure parking spot. Here is the typical flow a
            driver follows.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Step 1
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              Search for your destination
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Start on the landing page and enter the city, area, or landmark
              where you want to park. You can search for locations anywhere in
              the world.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Works with cities and suburban areas globally</li>
              <li>• Adjust the search radius between 2km and 10km</li>
              <li>• Instantly see how many spots are nearby</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Step 2
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              Compare options and pick a spot
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              ParkHub shows a list of nearby parking hubs with live availability,
              pricing, and utilization so that you can choose the option that best
              fits your budget and timing.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Live free vs total slot counts</li>
              <li>• Clear labels such as “Good availability” or “Filling fast”</li>
              <li>• Hourly rate and currency per location</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Step 3
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              Set arrival time and duration
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Choose when you plan to arrive and how long you want to stay.
              ParkHub enforces that your arrival time is at least 30 minutes from
              now so operators can guarantee your spot.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Enforced 30-minute minimum lead time</li>
              <li>• Duration control from 1 to 24 hours</li>
              <li>• Real-time validation for invalid times</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Step 4
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              Add optional late arrival protection
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              If there is a chance you will be delayed, add late arrival
              protection so that your space is held even if traffic or weather
              slows you down.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Adds 40% of the original parking fee</li>
              <li>• Clearly separated in the price summary</li>
              <li>• Can be switched on or off before payment</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Step 5
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              Pay securely with Stripe
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Review the final price summary and proceed to secure payment via
              Stripe Checkout. Your card details are processed by Stripe and never
              stored on ParkHub servers.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Trusted global payment infrastructure</li>
              <li>• Card details handled only by Stripe</li>
              <li>• Instant confirmation after payment</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Step 6
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              Navigate to your parking spot
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              After booking, open turn-by-turn directions with a single click. The
              map view shows your exact spot so you can drive there without
              guesswork.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              <li>• Integrated map preview of your parking location</li>
              <li>• One-click navigation via Google Maps</li>
              <li>• All booking details kept in your confirmation</li>
            </ul>
          </div>
        </section>

        <section className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-emerald-400">
              Start your first booking
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Head to the search page, choose a city, and see ParkHub Global in
              action with live availability and pricing.
            </p>
          </div>
          <Link
            href="/search"
            className="mt-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-900/40 transition hover:bg-emerald-400 sm:mt-0"
          >
            Search for parking
          </Link>
        </section>
      </main>
    </div>
  );
}

