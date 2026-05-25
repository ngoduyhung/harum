import React from "react";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function ProfileLayout() {
  return (
    <div className="bg-white ">
      <div className="relative bg-[url('/sach.jpg')] bg-cover bg-center pt-2.5 mt-[-10px]">
        <div className="absolute inset-0 bg-black/53"></div>

        <div className="relative z-5 mx-auto max-w-6xl ">
          <Header textColor="white" />
          <div className="h-hnavbar bg-transparent"></div>
        </div>
      </div>

      <div className="min-h-[calc(100svh-var(--spacing-hheader)-var(--spacing-hnavbar))]  ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
