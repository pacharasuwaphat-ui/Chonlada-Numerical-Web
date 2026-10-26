
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Graphical", href: "/root/graphical" },
  { label: "Bisection", href: "/root/bisection" },
  { label: "False Position", href: "/root/false-position" },
  { label: "One-Point", href: "/root/one-point" },
  { label: "Newton-Raphson", href: "/root/newton-raphson" },
  { label: "Secant", href: "/root/secant" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
        <Link
          href="/"
          className="mr-4 shrink-0 text-lg font-bold tracking-tight text-violet-300"
        >
          Numerical Method
        </Link>

        <div className="flex flex-1 items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-violet-600 font-semibold text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
