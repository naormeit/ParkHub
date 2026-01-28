import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-6 text-center text-slate-50 shadow-xl shadow-slate-900/70">
        <h1 className="text-xl font-semibold tracking-tight">
          Payment cancelled
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Your parking reservation was not completed. You can safely close this
          page or try booking again.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
        >
          Return to search
        </Link>
      </div>
    </div>
  );
}
