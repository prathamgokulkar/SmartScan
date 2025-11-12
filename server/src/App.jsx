// src/pages/LandingPage.jsx
import React from "react";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import FeaturesSection from "./components/Features/Features";
import Footer from "./components/Footer/Footer";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <About />
      <FeaturesSection />
      <Footer />
    </>
  );
};

export default LandingPage;
