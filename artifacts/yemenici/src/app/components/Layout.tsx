import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useScrollAnimations } from "../hooks/useScrollAnimations";

export default function Layout({ children }: { children: ReactNode }) {
  useScrollAnimations();
  return (
    <div className="min-h-screen bg-[#fafbfb]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
