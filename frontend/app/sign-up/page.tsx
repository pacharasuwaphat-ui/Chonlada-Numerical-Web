"use client"; 

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  // state สำหรับเก็บค่าของ input ทุกช่องใน form
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // state สำหรับเก็บข้อความแจ้งเตือน เช่น success หรือ error
  const [message, setMessage] = useState("");

  // ฟังก์ชันนี้ทำหน้าที่อัปเดตค่าที่ user พิมพ์ลงใน input
  const handleChange = (e:any) => {

    // ดึง name และ value จาก input ที่ user กำลังพิมพ์
    const { name, value } = e.target;
    // อัปเดต state formData
    setFormData((prev) => ({
      ...prev,            // คงค่าฟิลด์อื่นไว้
      [name]: value,      // เปลี่ยนเฉพาะ field ที่กำลังพิมพ์
    }));
  };

  // ฟังก์ชันนี้ทำงานตอน user กดปุ่ม SIGN UP
  const handleSubmit = async (e:any) => {
    // ป้องกันไม่ให้ form refresh หน้าเว็บ
    e.preventDefault();
    

    // เช็คว่า password และ confirm password ตรงกันไหม
    if (formData.password !== formData.confirmPassword) {
      setMessage("Password does not match");
      return;
    }

    try {
      // ยิง request ไป backend NestJS
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // ส่งข้อมูลไป backend
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      
      // แปลง response จาก backend เป็น json
      const data = await res.json();
      
      // ถ้า backend ส่ง error กลับมา
      if (!res.ok) {
        setMessage(data.message || "Register failed");
        return;
      }
      
      // console.log(formData.password)
      // return
      // ถ้าสมัครสำเร็จ
      setMessage("Register successful!");

      // reset form หลังสมัครสำเร็จ
      setFormData({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      router.push("/login"); // กลับไปหน้า login หลังสมัครสำเร็จ

    } catch (error) {
      // กรณี server ปิด หรือเชื่อมต่อไม่ได้
      setMessage("Website is currently unavailable. Please try again later.");
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">

      <h1 className="text-4xl font-bold mb-10 text-gray-900">Numerical Method Web</h1>

      <div className="flex w-[800px] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">

        {/* Left panel */}
        <div className="w-1/2 bg-gradient-to-b from-purple-600 to-indigo-900 text-white flex flex-col items-center justify-center p-10">

          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>

          <p className="text-center text-sm mb-6">
            Continue Your Fortune Journey
          </p>

          {/* ปุ่มกลับไปหน้า login */}
          <Link href="/login">
            <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-700 transition">
              SIGN IN
            </button>
          </Link>

        </div>

        {/* Right panel - form signup */}
        <div className="w-1/2 bg-white p-10 flex flex-col items-center">

          <h2 className="text-3xl font-bold mb-5 text-gray-900">Sign Up</h2>

          {/* form เมื่อ submit จะเรียก handleSubmit */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center text-gray-900">

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange} 
              // เมื่อพิมพ์ จะเรียก handleChange
              className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-3 outline-none"
            />

            {/* Username */}
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-3 outline-none"
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-2 outline-none"
            />

            {/* Confirm Password */}
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2 mb-2 outline-none"
            />

            {/* ปุ่ม submit */}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              SIGN UP
            </button>

          </form>

          {/* แสดงข้อความ error หรือ success */}
          {message && (
            <p className="text-sm text-red-500 mt-3">{message}</p>
          )}

        </div>

      </div>
    </div>
  );
}