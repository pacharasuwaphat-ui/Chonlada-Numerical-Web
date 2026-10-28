
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Graphical", href: "/root/graphical" },
  { label: "Bisection", href: "/root/bisection" },
  { label: "False Position", href: "/root/false-position" },
  { label: "One-Point", href: "/root/one-point" },
  { label: "Newton-Raphson", href: "/root/newton-raphson" },
  { label: "Secant", href: "/root/secant" },
];

type User = {
  username?: string;
  name?: string;
  email?: string;
};

export default function Navbar() {
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
  );
}
