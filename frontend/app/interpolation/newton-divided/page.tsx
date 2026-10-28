
"use client";

import { useCallback, useEffect, useState } from "react";

import InterpolationNavbar from "@/component/interpolation/Navbar";
import InterpolationHistory from "@/component/interpolation/History";
import InterpolationResults from "@/component/interpolation/Results";

import type {
  InterpolationHistoryItem,
  InterpolationPoint,
} from "@/component/interpolation/type";

type InputPoint = {
  x: string;
  fx: string;
};

type Coefficient = {
  label: string;
  value: number;
};

type ApiOldProblem = {
  id?: string | number;
  _id?: string;
  x: number | string;
  n: number;
  point?: {
    xi: number | string;
    fx: number | string;
  }[];
  points?: {
    xi: number | string;
    fx: number | string;
  }[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MIN_POINTS = 2;
const MAX_POINTS = 20;

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100";

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function NewtonDividedPage() {
  const [numPoints, setNumPoints] = useState(3);
  const [xValue, setXValue] = useState("0");

  const [points, setPoints] = useState<InputPoint[]>([
    { x: "", fx: "" },
    { x: "", fx: "" },
    { x: "", fx: "" },
  ]);

  const [answer, setAnswer] = useState<number | null>(null);
  const [numericPoints, setNumericPoints] = useState<
    InterpolationPoint[]
  >([]);
  const [coefficients, setCoefficients] = useState<Coefficient[]>([]);

  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<
    InterpolationHistoryItem[]
  >([]);
  const [selectedId, setSelectedId] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const resetResult = () => {
    setAnswer(null);
    setNumericPoints([]);
    setCoefficients([]);
    setMessage("");
  };

  // Load previous Newton Divided Difference problems
  const fetchHistory = useCallback(async () => {
    if (!API_URL) {
      setError("ไม่พบ NEXT_PUBLIC_API_URL ในไฟล์ .env.local");
      return;
    }

    setLoadingHistory(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/newtondivided`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("โหลดประวัติไม่สำเร็จ");
      }

      const data: ApiOldProblem[] = await response.json();

      const normalized: InterpolationHistoryItem[] = data.map(
        (item, index) => {
          const rawPoints = item.point ?? item.points ?? [];

          return {
            id: String(item.id ?? item._id ?? index),
            title: `Newton Divided Difference #${index + 1}`,
            description: `จำนวนจุด ${item.n}`,
            xValue: Number(item.x),
            points: rawPoints.map((point) => ({
              x: Number(point.xi),
              fx: Number(point.fx),
            })),
            payload: item,
          };
        }
      );

      setHistoryItems(normalized);
    } catch {
      setError("ไม่สามารถโหลดโจทย์เก่าได้ กรุณาตรวจสอบ NestJS API");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (showHistory) {
      void fetchHistory();
    }
  }, [showHistory, fetchHistory]);

  // Increase or decrease the number of data points
  const updateNumPoints = (delta: number) => {
    const nextCount = Math.max(
      MIN_POINTS,
      Math.min(MAX_POINTS, numPoints + delta)
    );

    setNumPoints(nextCount);

    setPoints((previous) => {
      const updated = [...previous];

      while (updated.length < nextCount) {
        updated.push({ x: "", fx: "" });
      }

      return updated.slice(0, nextCount);
    });

    resetResult();
    setError("");
  };

  // Update an individual x or f(x) value
  const handlePointChange = (
    index: number,
    field: keyof InputPoint,
    value: string
  ) => {
    setPoints((previous) =>
      previous.map((point, i) =>
        i === index ? { ...point, [field]: value } : point
      )
    );

    resetResult();
    setError("");
  };

  // Calculate Newton Divided Difference
  const handleCalculate = async () => {
    setError("");
    setMessage("");
    resetResult();

    if (xValue.trim() === "" || !Number.isFinite(Number(xValue))) {
      setError("กรุณากรอกค่า X ที่ต้องการประมาณให้ถูกต้อง");
      return;
    }

    const targetX = Number(xValue);
    const inputPoints = points.slice(0, numPoints);

    if (
      inputPoints.some(
        (point) => point.x.trim() === "" || point.fx.trim() === ""
      )
    ) {
      setError("กรุณากรอกค่า x และ f(x) ให้ครบทุกจุด");
      return;
    }

    const dataPoints: InterpolationPoint[] = inputPoints.map(
      (point) => ({
        x: Number(point.x),
        fx: Number(point.fx),
      })
    );

    if (
      dataPoints.some(
        (point) =>
          !Number.isFinite(point.x) ||
          !Number.isFinite(point.fx)
      )
    ) {
      setError("กรุณากรอกข้อมูลเป็นตัวเลขที่ถูกต้อง");
      return;
    }

    const uniqueX = new Set(dataPoints.map((point) => point.x));

    if (uniqueX.size !== dataPoints.length) {
      setError("ค่า x ของแต่ละจุดต้องไม่ซ้ำกัน");
      return;
    }

    try {
      const n = dataPoints.length;

      // table[i][order] stores the divided difference.
      const table: number[][] = Array.from(
        { length: n },
        () => Array<number>(n).fill(0)
      );

      // First column contains the original f(x) values.
      for (let i = 0; i < n; i++) {
        table[i][0] = dataPoints[i].fx;
      }

      // Calculate divided differences of increasing order.
      for (let order = 1; order < n; order++) {
        for (let i = 0; i < n - order; i++) {
          const denominator =
            dataPoints[i + order].x - dataPoints[i].x;

          table[i][order] =
            (table[i + 1][order - 1] - table[i][order - 1]) /
            denominator;
        }
      }

      // Newton coefficients are the values in the first row.
      const calculatedCoefficients: Coefficient[] = Array.from(
        { length: n },
        (_, i) => ({
          label: `C${i}`,
          value: table[0][i],
        })
      );

      // Evaluate the Newton polynomial at targetX.
      let result = 0;
      let product = 1;

      for (let i = 0; i < n; i++) {
        result += calculatedCoefficients[i].value * product;
        product *= targetX - dataPoints[i].x;
      }

      if (
        !Number.isFinite(result) ||
        calculatedCoefficients.some(
          (item) => !Number.isFinite(item.value)
        )
      ) {
        throw new Error("คำนวณไม่ได้ โปรดตรวจสอบค่าที่กรอก");
      }

      setAnswer(result);
      setNumericPoints(dataPoints);
      setCoefficients(calculatedCoefficients);

      // Save to the existing NestJS endpoint.
      if (!API_URL) {
        setMessage("คำนวณสำเร็จ แต่ไม่ได้บันทึก: ไม่พบ API URL");
        return;
      }

      setSaving(true);

      try {
        const response = await fetch(`${API_URL}/inter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            x: targetX,
            method: "newton",
            n,
            points: dataPoints.map((point) => ({
              xi: point.x,
              fx: point.fx,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Save failed");
        }

        setMessage("คำนวณและบันทึกข้อมูลสำเร็จ");
      } catch {
        setMessage("คำนวณสำเร็จ แต่บันทึกข้อมูลไม่สำเร็จ");
      } finally {
        setSaving(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดระหว่างการคำนวณ"
      );
    }
  };

  // Restore a previously saved problem.
  const handleSelectOld = (item: InterpolationHistoryItem) => {
    const raw = item.payload as ApiOldProblem | undefined;

    const restoredPoints: InputPoint[] = item.points.map((point) => ({
      x: String(point.x),
      fx: String(point.fx),
    }));

    const restoredCount = Math.max(
      MIN_POINTS,
      Math.min(
        MAX_POINTS,
        raw?.n ?? restoredPoints.length
      )
    );

    while (restoredPoints.length < restoredCount) {
      restoredPoints.push({ x: "", fx: "" });
    }

    setNumPoints(restoredCount);
    setXValue(String(item.xValue));
    setPoints(restoredPoints.slice(0, restoredCount));

    setShowHistory(false);
    setSelectedId("");

    resetResult();
    setError("");
    setMessage("โหลดโจทย์เก่าสำเร็จ");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <InterpolationNavbar />

      {/* One shared container aligns the header, cards and results. */}
      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            Numerical Methods / Interpolation
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Newton Divided Difference
          </h1>

          <p className="mt-2 text-slate-500">
            Estimate a function value from a set of data points.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 w-full rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 w-full rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {message}
          </div>
        )}

        {showHistory ? (
          <div className="w-full">
            <InterpolationHistory
              items={historyItems}
              selectedId={selectedId}
              loading={loadingHistory}
              onSelectChange={setSelectedId}
              onConfirm={handleSelectOld}
              onCancel={() => setShowHistory(false)}
            />
          </div>
        ) : (
          <>
            {/* Input settings card */}
            <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Input Settings
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Configure the number of points and target X.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowHistory(true);
                    setError("");
                    setMessage("");
                  }}
                  className={secondaryButtonClass}
                >
                  Get Old Problems
                </button>
              </div>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Number of points
                  </label>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => updateNumPoints(-1)}
                      disabled={numPoints <= MIN_POINTS}
                      aria-label="Decrease number of points"
                      className="h-11 w-12 shrink-0 rounded-xl border border-slate-200 bg-white text-xl transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="min-w-6 text-center text-lg font-bold">
                      {numPoints}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateNumPoints(1)}
                      disabled={numPoints >= MAX_POINTS}
                      aria-label="Increase number of points"
                      className="h-11 w-12 shrink-0 rounded-xl border border-slate-200 bg-white text-xl transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="target-x"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    X value
                  </label>

                  <input
                    id="target-x"
                    type="number"
                    step="any"
                    value={xValue}
                    onChange={(event) => {
                      setXValue(event.target.value);
                      resetResult();
                    }}
                    placeholder="Enter target X"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Data points card shares the same width as Input Settings. */}
            <section className="mt-6 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Data Points
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter each x and f(x) pair. All x values must be unique.
                </p>
              </div>

              {/* Keep the column widths identical to each data row. */}
              <div className="mb-3 hidden grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-3 text-sm font-medium text-slate-500 sm:grid">
                <span>Point</span>
                <span>x</span>
                <span>f(x)</span>
              </div>

              <div className="space-y-3">
                {points.slice(0, numPoints).map((point, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4"
                  >
                    <span className="text-sm font-bold text-violet-600">
                      x{index}
                    </span>

                    <input
                      aria-label={`x${index}`}
                      type="number"
                      step="any"
                      placeholder={`Enter x${index}`}
                      value={point.x}
                      onChange={(event) =>
                        handlePointChange(index, "x", event.target.value)
                      }
                      className={inputClass}
                    />

                    <input
                      aria-label={`f(x${index})`}
                      type="number"
                      step="any"
                      placeholder={`Enter f(x${index})`}
                      value={point.fx}
                      onChange={(event) =>
                        handlePointChange(index, "fx", event.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-56"
                >
                  {saving ? "Saving..." : "Calculate"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPoints(
                      Array.from({ length: numPoints }, () => ({
                        x: "",
                        fx: "",
                      }))
                    );
                    setXValue("");
                    resetResult();
                    setError("");
                  }}
                  className={secondaryButtonClass}
                >
                  Clear Inputs
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Supports {MIN_POINTS}–{MAX_POINTS} points. Each x value must
                be unique.
              </p>
            </section>
          </>
        )}

        {/* Results remain inside the same shared page container. */}
        {answer !== null && !showHistory && (
          <div className="mt-6 w-full">
            <InterpolationResults
              methodName="Newton Divided Difference"
              xValue={Number(xValue)}
              answer={answer}
              points={numericPoints}
              coefficients={coefficients}
              formula="P(x) = C0 + C1(x − x0) + C2(x − x0)(x − x1) + ..."
            />
          </div>
        )}
      </main>
    </div>
  );
}
