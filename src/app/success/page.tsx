import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900/80 p-6 text-center text-slate-50 shadow-xl shadow-emerald-900/70">
        <h1 className="text-xl font-semibold tracking-tight">
          Your parking is confirmed
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          A confirmation email from Stripe has been sent with all the details of
          your reservation and navigation links to the parking location.
        </p>
        <p className="mt-4 text-xs text-slate-400">
          If you expect to arrive late, you can apply additional late fees
          directly from the email receipt.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Book another parking
        </Link>
      </div>
    </div>
  );
}
