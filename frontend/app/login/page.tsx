"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  // เก็บค่าจาก input
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // เก็บข้อความแจ้งเตือน
  const [message, setMessage] = useState("");

  // เก็บสถานะ loading ตอนกด login
  const [loading, setLoading] = useState(false);

  // อัปเดตค่าจาก input ลง state
  const handleChange = (e:any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ทำงานตอน submit form
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      // ถ้า login ไม่สำเร็จ
      if (!res.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ถ้า backend ส่ง token กลับมา ให้เก็บไว้
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      // จะเก็บ user ไว้ด้วยก็ได้
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // login สำเร็จแล้วเด้งไปหน้าที่ต้องการ
      router.push("/home");
    } catch (error) {
      setMessage("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold mb-10 text-gray-900">Numerical Method Web</h1>

      <div className="flex w-[800px] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">

        {/* Left - Sign In */}
        <div className="w-1/2 bg-white p-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-5 text-gray-900">Sign In</h2>

          {/* Social */}
          <div className="flex gap-4 mb-5">
            <a href="#"><div className="w-10 h-10 bg-blue-500 rounded-full"></div></a>
            <a href="#"><div className="w-10 h-10 bg-red-500 rounded-full"></div></a>
            <a href="#"><div className="w-10 h-10 bg-pink-500 rounded-full"></div></a>
          </div>

          <p className="text-gray-400 text-sm mb-4">or use your account</p>

          {/* form login */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center text-gray-900">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-3 outline-none"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-2 outline-none"
            />

            <Link href="/forgot-password" className="text-xs text-blue-500 mb-5 cursor-pointer">
              Forgot your password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          {message && (
            <p className="text-sm text-red-500 mt-4">{message}</p>
          )}
        </div>

        {/* Right - Welcome */}
        <div className="w-1/2 bg-gradient-to-b from-purple-600 to-indigo-900 text-white flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-3">Hello There!</h2>

          <p className="text-center text-sm mb-6">
            Begin Your Fortune Journey <br />
            by creating an account with us today
          </p>

          <Link href="/sign-up">
            <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-700 transition">
              SIGN UP
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}