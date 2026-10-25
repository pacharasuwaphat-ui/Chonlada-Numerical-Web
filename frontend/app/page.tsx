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
      <h1 className="text-4xl font-bold mb-10 text-gray-900">WelCome</h1>
    </div>
  );
}