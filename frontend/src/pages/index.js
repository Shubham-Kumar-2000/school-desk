import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useContext, useEffect, useState } from "react";
import isAuth from "@/context/isAuth";
import LoginContext from "@/context/LoginContext";
import { FormalLoader } from "@/components/helper/FormalLoader";
import { useRouter } from "next/router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/announcements");
  }, []);
  return (
    <>
      <FormalLoader />
    </>
  );
};

export default isAuth(Home);
