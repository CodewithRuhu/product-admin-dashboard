"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // pehle localStorage check hone do
    if (user) {
      router.push("/products");
    } else {
      router.push("/login");
    }
  }, [user, loading, router]);

  return <Loader />;
}