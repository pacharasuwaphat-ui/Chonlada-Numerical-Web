
"use client";

import { useMemo, useState } from "react";

export interface OldProblem {
  _id: string;
  userId: string;
  equation: string;
  xl?: number | string;
  xr?: number | string;
  x0?: number | string;
  err: number | string;
  [key: string]: unknown;
}

interface EquationHistoryProps {
  problems: OldProblem[];
  loading: boolean;
  onSelect: (problem: OldProblem) => void;
  onDelete: (problem: OldProblem) => void;
  onCancel: () => void;
}

export default function EquationHistory({
  problems,
  loading,
  onSelect,
  onDelete,
  onCancel,
}: EquationHistoryProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredProblems = useMemo(
    () =>
      problems.filter((problem) =>
        problem.equation.toLowerCase().includes(search.toLowerCase())
      ),
    [problems, search]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Previous Problems
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select an equation to restore its parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setSelectedId(null);
        }}
        placeholder="Search equations..."
        className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />

      {loading ? (
        <p className="py-10 text-center text-slate-500">
          Loading previous problems...
        </p>
      ) : filteredProblems.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          No previous problems found.
        </p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {filteredProblems.map((problem) => {
            const originalIndex = problems.indexOf(problem);
            const selected = selectedId === problem._id;
            return (
              <div
                key={problem._id}
                className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                  selected
                    ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                    : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="old-problem"
                  checked={selected}
                  onChange={() => setSelectedId(problem._id)}
                  className="mt-1 accent-violet-600"
                />

                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold text-slate-900">
                    f(x) = {problem.equation}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    {(problem.xl != null ) && (<span className="rounded-md bg-slate-100 px-2 py-1">
                      xL: {problem.xl}
                    </span>)}
                    {(problem.xr != null ) && (<span className="rounded-md bg-slate-100 px-2 py-1">
                      xR: {problem.xr}
                    </span>)}
                    {(problem.x0 != null ) && (<span className="rounded-md bg-slate-100 px-2 py-1">
                      x0: {problem.x0}
                    </span>)}
                    <span className="rounded-md bg-slate-100 px-2 py-1">
                      Error: {problem.err}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onDelete(problem)}
                  className="shrink-0 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            );

          })}
        </div>
      )}

      <button
        type="button"
        disabled={loading || selectedId === null}
        onClick={() => {
          const problem = problems.find((p) => p._id === selectedId);
          if (problem) onSelect(problem);
        }}
        className="mt-5 w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Select Problem
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">
        {filteredProblems.length} problem(s) found
      </p>
    </section>
  );
}
