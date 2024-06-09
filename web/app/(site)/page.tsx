"use client";

import { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import Feature from "@/components/landing/Features";
import About from "@/components/landing/About";
import FeaturesTab from "@/components/landing/FeaturesTab";
import FunFact from "@/components/landing/FunFact";
import Integration from "@/components/landing/Integration";
import CTA from "@/components/landing/CTA";
import Contact from "@/components/landing/Contact";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import auth from "@/utils/initAuth";
import { getRedirectResult } from "firebase/auth";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Feature />
      <About />
      <FeaturesTab />
      <FunFact />
      <Integration />
      <CTA />
      <Footer />
    </main>
  );
}
