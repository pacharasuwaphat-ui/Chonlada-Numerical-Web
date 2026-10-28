"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const categories = [
  {
    number: "01",
    title: "Root of Equation",
    subtitle: "Numerical Root Finding",
    description:
      "Find approximate roots of nonlinear equations using numerical methods with step-by-step iteration results.",
    methods: [
      "Graphical",
      "Bisection",
      "False Position",
      "One-Point Iteration",
      "Newton-Raphson",
      "Secant",
    ],
    href: "/root/graphical",
    icon: "ƒ(x)",
  },
  {
    number: "02",
    title: "Interpolation",
    subtitle: "Data Approximation",
    description:
      "Estimate function values from known data points using interpolation techniques.",
    methods: [
      "Newton Divided Difference",
      "Lagrange",
      "Linear Spline",
    ],
    href: "/interpolation/newton-divided",
    icon: "P(x)",
  },
];

type User = {
  username?: string;
  name?: string;
  email?: string;
};

export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
  
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // อ่านข้อมูลผู้ใช้หลัง Component ทำงานบน Browser
    useEffect(() => {
      const loadUser = () => {
        try {
          const savedUser = localStorage.getItem("user");
          setUser(savedUser ? JSON.parse(savedUser) : null);
        } catch {
          setUser(null);
        }
      };
  
      loadUser();
  
      // อัปเดตเมื่อมีการเปลี่ยน localStorage จาก Tab อื่น
      window.addEventListener("storage", loadUser);
  
      return () => {
        window.removeEventListener("storage", loadUser);
      };
    }, []);
  
    // ปิด Dropdown เมื่อคลิกนอกเมนู
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setDropdownOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const username =
      user?.username || user?.name || user?.email || "User";
  
    const initial = username.charAt(0).toUpperCase();
  
    const handleLogout = async () => {
      if (loggingOut) return;
  
      setLoggingOut(true);
  
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
  
        if (!res.ok) {
          throw new Error("Logout failed");
        }
  
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
  
        setUser(null);
        setDropdownOpen(false);
  
        router.replace("/login");
        router.refresh();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setLoggingOut(false);
      }
    };
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      {/* Homepage Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-[#10172a] text-white shadow-lg">
        <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-4 px-5 sm:px-8">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-violet-300 sm:text-xl"
          >
            Numerical Method
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative ml-auto shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-800"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-bold text-white">
                {initial}
              </span>

              <span className="max-w-32 truncate text-sm font-medium">
                {username}
              </span>

              <svg
                className={`h-4 w-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 7.22a.75.75 0 011.06 0L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 8.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 py-2 shadow-xl">
                <div className="border-b border-slate-700 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {username}
                  </p>

                  {user?.email && (
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5m5 5H3"
                    />
                  </svg>

                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        {/* Hero */}
        <section className="mb-12 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-violet-600">
            Numerical Methods / Learning Platform
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Numerical Methods
            <span className="mt-2 block text-violet-600">
              By Chonlada Buapim 6704062617296
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Explore numerical techniques for solving equations and
            approximating function values. Choose a category to start
            your calculation.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/root/graphical"
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              Start Calculating
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>

            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Explore Methods
            </a>
          </div>
        </section>

        {/* Category cards */}
        <section id="categories">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Choose Your Category
            </h2>
            <p className="mt-2 text-slate-500">
              Select a numerical method to begin.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {categories.map((category) => (
              <article
                key={category.number}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700">
                    {category.icon}
                  </div>

                  <span className="text-sm font-bold tracking-widest text-slate-300">
                    {category.number}
                  </span>
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                  {category.subtitle}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {category.title}
                </h3>

                <p className="mt-4 min-h-[72px] leading-7 text-slate-500">
                  {category.description}
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    Available methods
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {category.methods.map((method) => (
                      <span
                        key={method}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <Link
                    href={category.href}
                    className="flex w-full items-center justify-between rounded-xl bg-violet-600 px-5 py-3.5 font-semibold text-white transition hover:bg-violet-700"
                  >
                    Open {category.title}
                    <span
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 py-6 text-center text-sm text-slate-400">
          Numerical Method · Root Finding &amp; Interpolation
        </footer>
      </main>
    </div>
  );
}
