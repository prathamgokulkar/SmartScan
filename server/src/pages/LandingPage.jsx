import React from "react";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Features from "../components/Features/Features";
import Architecture from "../components/Architecture/Architecture";
import Footer from "../components/Footer/Footer";
import { Navbar1 } from "../components/Navbar/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar1 />
      <Hero />
      <About />
      <Features />
      <Architecture />
      <Footer />
    </>
  );
};

export default LandingPage;
