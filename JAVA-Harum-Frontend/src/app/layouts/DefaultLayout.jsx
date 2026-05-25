// DefaultLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NavbarSkeleton from "../components/NavBarSkeleton";
import FullScreenError from "../components/FullScreenError"; // <-- Import component lỗi
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../bkUrl";

const getTopics = async () => {
  const res = await axios.get(`${API_URL}/topics`);
  return res.data;
};

export default function DefaultLayout() {
  const {
    data: topics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: getTopics,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <FullScreenError />;
  }

  return (
    <div className="bg-white">
      <Header textColor="text2" />
      {isLoading ? <NavbarSkeleton /> : <Navbar topics={topics} />}

      <div className="min-h-[calc(100svh-var(--spacing-hheader)-var(--spacing-hnavbar))]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
