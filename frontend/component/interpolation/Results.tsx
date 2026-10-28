
import type {
  InterpolationCoefficient,
  InterpolationPoint,
} from "@/component/interpolation/type";

type Props = {
  methodName: string;
  xValue: number;
  answer: number;
  points: InterpolationPoint[];
  coefficients?: InterpolationCoefficient[];
  formula?: string;
};

export default function InterpolationResults({
  methodName,
  xValue,
  answer,
  points,
  coefficients,
  formula,
}: Props) {
  const formatNumber = (value: number) =>
    Number.isFinite(value)
      ? String(Number(value.toPrecision(12)))
      : "Invalid";

  return (
    <div className="mt-6 space-y-6">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
          Calculation Result
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          {methodName}
        </h2>

        <div className="mt-5 rounded-xl bg-violet-50 p-5">
          <p className="text-sm font-medium text-violet-700">
            Estimated value at X = {formatNumber(xValue)}
          </p>

          <p className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
            P({formatNumber(xValue)}) = {formatNumber(answer)}
          </p>
        </div>

        {formula && (
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Formula
            </p>
            <p className="whitespace-nowrap font-mono text-sm text-slate-700">
              {formula}
            </p>
          </div>
        )}
      </section>

      {coefficients && coefficients.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-bold text-slate-900">
              Coefficients
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Coefficient</th>
                  <th className="px-6 py-4 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {coefficients.map((item) => (
                  <tr
                    key={item.label}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {item.label}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-900">
                      {formatNumber(item.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-bold text-slate-900">
            Input Data Points
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Data used in the interpolation calculation.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">i</th>
                <th className="px-6 py-4 font-semibold">x</th>
                <th className="px-6 py-4 font-semibold">f(x)</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
                <tr
                  key={`${point.x}-${index}`}
                  className="border-t border-slate-100"
                >
                  <td className="px-6 py-4 text-slate-500">{index}</td>
                  <td className="px-6 py-4">{formatNumber(point.x)}</td>
                  <td className="px-6 py-4">{formatNumber(point.fx)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
