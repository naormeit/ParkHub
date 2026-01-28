import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="h-6 w-40 rounded bg-slate-800" />
            <div className="mt-6 h-10 w-full rounded bg-slate-900" />
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
