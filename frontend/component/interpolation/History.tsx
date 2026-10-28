
"use client";

import { useState } from "react";
import type { InterpolationHistoryItem } from "@/component/interpolation/type";

type Props = {
  items: InterpolationHistoryItem[];
  selectedId: string;
  loading?: boolean;
  onSelectChange: (id: string) => void;
  onDelete: (problem: InterpolationHistoryItem) => void;
  onConfirm: (item: InterpolationHistoryItem) => void;
  onCancel: () => void;
};

export default function InterpolationHistory({
  items,
  selectedId,
  loading = false,
  onSelectChange,
  onDelete,
  onConfirm,
  onCancel,
}: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  // const handleDelete = (item: InterpolationHistoryItem) => {
  //   const confirmed = window.confirm(
  //     `ต้องการลบโจทย์ "${item.title}" ใช่หรือไม่?\nการลบนี้ไม่สามารถย้อนกลับได้`
  //   );

  //   if (!confirmed) return;

  //   setDeletingId(item.id);

  //   try {
  //     onDelete(item);
  //   } finally {
  //     setDeletingId(null);
  //   }
  // };

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
        <p className="py-10 text-center text-slate-500">
          Loading history...
        </p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          No previous problems found.
        </p>
      ) : (
        <div className="max-h-[460px] space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex gap-3 rounded-xl border p-4 transition ${
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
                aria-label={`Select ${item.title}`}
                className="mt-1 accent-violet-600"
              />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">
                  {item.title}
                </p>

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

              <div className="flex shrink-0 flex-col justify-center">
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  disabled={loading || deletingId === item.id}
                  className="shrink-0 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                  aria-label={`Delete ${item.title}`}
                >
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => selectedItem && onConfirm(selectedItem)}
          disabled={!selectedItem || loading}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
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
