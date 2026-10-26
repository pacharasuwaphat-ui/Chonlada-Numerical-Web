
"use client";

export interface IterationRow {
  iteration: number;
  x: number;
  fx: number;
  error: number;
}

interface NumericalResultsProps {
  rows: IterationRow[];
}

export default function NumericalResults({
  rows,
}: NumericalResultsProps) {
  if (rows.length === 0) return null;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">
          Iteration Results
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {rows.length} iteration(s)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Iteration</th>
              <th className="px-4 py-3">x</th>
              <th className="px-4 py-3">f(x)</th>
              <th className="px-4 py-3">Error</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.iteration}
                className="text-slate-700 hover:bg-violet-50/50"
              >
                <td className="px-4 py-3">{row.iteration}</td>
                <td className="px-4 py-3">{row.x.toPrecision(8)}</td>
                <td className="px-4 py-3">{row.fx.toPrecision(8)}</td>
                <td className="px-4 py-3">{row.error.toExponential(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
