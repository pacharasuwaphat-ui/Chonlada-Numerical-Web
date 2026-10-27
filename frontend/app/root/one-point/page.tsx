
"use client";

import { useState } from "react";
import { evaluate , derivative  } from "mathjs";
import axios from "axios";

import Navbar from "@/component/root/Navbar";
import EquationHistory, {
  type OldProblem,
} from "@/component/root/EquationHistory";
import NumericalResults, {
  type IterationRow,
} from "@/component/root/NumericalResults";

interface FormData {
  equation: string;
  x0: string;
  error: string;
}

interface Point {
  x: number;
  fx: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_NUMERICAL_API_URL ?? "http://localhost:4000";

function calculateFx(equation: string, x: number): number {
  try {
    const result = evaluate(equation, { x });
    return typeof result === "number" && Number.isFinite(result)
      ? result
      : Number.NaN;
  } catch {
    return Number.NaN;
  }
}


  function findOnePointIteration(
    equation: string,
    x0: number,
    tolerance: number
    ): {
    rows: IterationRow[];
    points: Point[];
    root: number;
    } {
    if (tolerance <= 0) {
        throw new Error("Error tolerance must be greater than zero.");
    }

    const rows: IterationRow[] = [];
    const points: Point[] = [];
    const maxIterations = 100;

    let currentX = x0;

    for (let iteration = 1; iteration <= maxIterations; iteration++) {
        // x(i+1) = g(xi)
        const nextX = calculateFx(equation, currentX);

        if (!Number.isFinite(nextX)) {
        throw new Error(
            `Cannot evaluate g(x) at x = ${currentX}.`
        );
        }

        // Relative error; handle nextX = 0 separately
        const error =
        nextX !== 0
            ? Math.abs((nextX - currentX) / nextX)
            : Math.abs(nextX - currentX);

        rows.push({
        iteration,
        x: nextX,
        fx: nextX,
        error,
        });

        points.push({
        x: currentX,
        fx: nextX,
        });

        if (error <= tolerance) {
        points.push({
            x: nextX,
            fx: calculateFx(equation, nextX),
        });

        points.sort((a, b) => a.x - b.x);

        return {
            rows,
            points,
            root: nextX,
        };
        }

        currentX = nextX;
    }

      throw new Error(
          "Method did not converge within 100 iterations. Try a different initial guess or rearrange g(x)."
      );
    }


export default function OnePointPage() {
  const [form, setForm] = useState<FormData>({
    equation: "",
    x0: "",
    error: "0.001",
  });

  const [history, setHistory] = useState<OldProblem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [message, setMessage] = useState("");
  const [root, setRoot] = useState<number | null>(null);
  const [rows, setRows] = useState<IterationRow[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  function updateField(field: keyof FormData, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function fetchDatabase() {
    setLoadingHistory(true);
    setMessage("");

    try {
      const userString = localStorage.getItem("user");
        if (!userString) return;

        const user = JSON.parse(userString);
        const userId = user.id;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/root/${userId}/one-point`
        );
        // console.log(res)
        // return
        if (!res.ok) {
          setMessage("Failed to fetch history");
          return;
        }
        const data = await res.json();
        // console.log(data)

        if (!Array.isArray(data)) {
          console.log("err")
          throw new Error("Unexpected history response.");
        }
        
        setHistory(data);
        // console.log(history)
    } catch {
      setMessage(
        "Could not load previous problems. Please check the API server."
      );
    } finally {
      setLoadingHistory(false);
    }
  }

  async function getOldProblem() {
    setShowHistory(true);
    await fetchDatabase();
  }

  function selectOldProblem(problem: OldProblem) {
    setForm({
        equation: problem.equation,
        x0: problem.x0 == null ? "" : String(problem.x0),
        error: problem.err == null ? "0.001" : String(problem.err),
    });

    setShowHistory(false);
    setMessage("");
    setRoot(null);
    setRows([]);
    setPoints([]);
    }

  async function pushDatabase() {
    const userString = localStorage.getItem("user")
    const user = userString ? JSON.parse(userString) : null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/root/one`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid : user?.id,
          equation: form.equation,
          x0: Number(form.x0),
          err: Number(form.error),
          method: "one-point",
        }),
      });
    // console.log(res)
  }

  async function handleCalculate() {
    setMessage("");
    setRoot(null);
    setRows([]);
    setPoints([]);

    const equation = form.equation.trim();
    const x0 = Number(form.x0);
    const tolerance = Number(form.error);

    if (
      !equation ||
      form.x0.trim() === "" ||
      form.error.trim() === ""
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (
      !Number.isFinite(x0) ||
      !Number.isFinite(tolerance)
    ) {
      setMessage("Please enter valid numeric parameters.");
      return;
    }

    setCalculating(true);

    try {
      const result = findOnePointIteration(equation, x0, tolerance);
      setRoot(result.root);
      setRows(result.rows);
      setPoints(result.points);

      try {
        await pushDatabase();
      } catch {
        setMessage(
          "Calculation completed, but saving the problem to the database failed."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "An unexpected calculation error occurred."
      );
    } finally {
      setCalculating(false);
    }
  }

  async function deleteOldProblem(problem: OldProblem) {
    const confirmed = window.confirm(
      `ต้องการลบโจทย์ "${problem.equation}" ใช่หรือไม่?`
    );

    if (!confirmed) return;

    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setMessage("กรุณาเข้าสู่ระบบก่อน");
        return;
      }

      
      const user = JSON.parse(userString);
      // console.log(problem)
      // console.log(user.id)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/root/${problem._id}/${user.id}`,
        {
          method: "DELETE",
        }
      );
      // const data = await res.json();
      // console.log(data)
      if (!res.ok) {
        throw new Error("ลบโจทย์ไม่สำเร็จ");
      }

      fetchDatabase()

      setMessage("ลบโจทย์สำเร็จ");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดขณะลบโจทย์"
      );
    }
  }

  const minX = points.length
    ? Math.min(...points.map((point) => point.x))
    : 0;

  const maxX = points.length
    ? Math.max(...points.map((point) => point.x))
    : 1;

  const minY = points.length
    ? Math.min(0, ...points.map((point) => point.fx))
    : 0;

  const maxY = points.length
    ? Math.max(1, ...points.map((point) => point.fx))
    : 1;

  const graphPoints = points
    .map((point) => {
      const x = 30 + ((point.x - minX) / (maxX - minX || 1)) * 540;
      const y = 170 - ((point.fx - minY) / (maxY - minY || 1)) * 140;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            Numerical Methods / Root Finding
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One-Point Iterations Method
          </h1>

          <p className="mt-2 text-slate-500">
            Find a root of an equation and inspect its iteration results.
          </p>
        </header>

        {showHistory ? (
          <EquationHistory
            problems={history}
            loading={loadingHistory}
            onSelect={selectOldProblem}
            onDelete={deleteOldProblem}
            onCancel={() => setShowHistory(false)}
          />
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Equation & Parameters</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your function and the search interval.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label
                  htmlFor="equation"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Function f(x)
                </label>
                <input
                  id="equation"
                  value={form.equation}
                  onChange={(event) =>
                    updateField("equation", event.target.value)
                  }
                  placeholder="e.g. x^3 - 13*x - 13"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(
                    [
                    ["x0", "Initial guess (x0)"],
                    ["error", "Error tolerance"],
                    ] as const
                ).map(([field, label]) => (
                    <div key={field}>
                    <label
                        htmlFor={field}
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        {label}
                    </label>

                    <input
                        id={field}
                        type="number"
                        step="any"
                        value={form[field]}
                        onChange={(event) =>
                        updateField(field, event.target.value)
                        }
                        placeholder={label}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    </div>
                ))}
                </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={calculating}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {calculating ? "Calculating..." : "Calculate"}
                </button>

                <button
                  type="button"
                  onClick={getOldProblem}
                  disabled={loadingHistory}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50"
                >
                  {loadingHistory ? "Loading..." : "Get Old Problems"}
                </button>
              </div>

              {message && (
                <p
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                >
                  {message}
                </p>
              )}
            </div>
          </section>
        )}

        {root !== null && (
          <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-700">
              Approximate root
            </p>
            <p className="mt-1 text-3xl font-bold text-emerald-900">
              {root.toPrecision(10)}
            </p>
          </section>
        )}

        {points.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="mb-4 text-xl font-bold">Graph Preview</h2>
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 600 200"
                role="img"
                aria-label="Graph of evaluated equation points"
                className="h-auto w-full min-w-[320px]"
              >
                <line
                  x1="30"
                  y1="170"
                  x2="570"
                  y2="170"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <line
                  x1="30"
                  y1="20"
                  x2="30"
                  y2="170"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <line
                  x1="30"
                  y1={170 - ((0 - minY) / (maxY - minY || 1)) * 140}
                  x2="570"
                  y2={170 - ((0 - minY) / (maxY - minY || 1)) * 140}
                  stroke="#cbd5e1"
                  strokeDasharray="5 5"
                />
                {points.length > 1 && (
                  <polyline
                    points={graphPoints}
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Preview uses evaluated points from the search process.
            </p>
          </section>
        )}

        <NumericalResults rows={rows} />
      </div>
    </main>
  );
}
