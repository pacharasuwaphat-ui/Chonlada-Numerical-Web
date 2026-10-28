
export type InterpolationMethod =
  | "newton-divided"
  | "lagrange"
  | "spline";

export type InterpolationPoint = {
  x: number;
  fx: number;
};

export type InterpolationHistoryItem = {
  _id: string;
  id: string;
  title: string;
  description?: string;
  xValue: number;
  points: InterpolationPoint[];
  // เก็บข้อมูลเฉพาะของแต่ละวิธีได้ โดยไม่บังคับให้ทุกวิธีใช้ schema เดียวกัน
  payload?: unknown;
};

export type InterpolationCoefficient = {
  label: string;
  value: number;
};
