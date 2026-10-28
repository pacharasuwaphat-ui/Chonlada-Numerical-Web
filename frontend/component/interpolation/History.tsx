
"use client";

import type { InterpolationHistoryItem } from "@/component/interpolation/type";

type Props = {
  items: InterpolationHistoryItem[];
  selectedId: string;
  loading?: boolean;
  onSelectChange: (id: string) => void;
  onConfirm: (item: InterpolationHistoryItem) => void;
  onCancel: () => void;
};

export default function InterpolationHistory({
  items,
  selectedId,
  loading = false,
  onSelectChange,
  onConfirm,
  onCancel,
}: Props) {
  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Previous Problems
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select a previous problem to load its data.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading history...</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          No previous problems found.
        </p>
      ) : (
        <div className="max-h-[460px] space-y-3 overflow-y-auto">
          {items.map((item) => (
            <label
              key={item.id}
              className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                selectedId === item.id
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="interpolation-history"
                checked={selectedId === item.id}
                onChange={() => onSelectChange(item.id)}
                className="mt-1 accent-violet-600"
              />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{item.title}</p>

                {item.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                )}

                <p className="mt-2 text-sm text-slate-700">
                  X = {item.xValue} · Points = {item.points.length}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.points.map((point, index) => (
                    <span
                      key={`${item.id}-${index}`}
                      className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
                    >
                      ({point.x}, {point.fx})
                    </span>
                  ))}
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => selectedItem && onConfirm(selectedItem)}
          disabled={!selectedItem || loading}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-40"
        >
          Load Selected Problem
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
