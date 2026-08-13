import React, { useEffect } from "react";
import "./Home.css";

import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import Features from "../../components/Features/Features";
import Statistics from "../../components/Statistics/Statistics";
import RoadmapPreview from "../../components/RoadmapPreview/RoadmapPreview";

const Home = () => {
  useEffect(() => {
    document.title = "SkillForge - Accelerate Your Developer Journey";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "SkillForge is the ultimate platform for developers to build skills, track progress, and achieve their career goals with curated roadmaps.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "SkillForge is the ultimate platform for developers to build skills, track progress, and achieve their career goals with curated roadmaps.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="home-page page-content">
      <Hero />
      <Statistics />
      <Features />
      <RoadmapPreview />
      <Footer />
    </div>
  );
};

export default Home;