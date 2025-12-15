import React, { useState, useEffect } from "react";
import HeroSection from "../../components/portfolio/HeroSection";
import AboutSection from "../../components/portfolio/AboutSection";
import SkillsSection from "../../components/portfolio/SkillsSection";
import ProjectsSection from "../../components/portfolio/ProjectsSection";
import ExperienceSection from "../../components/portfolio/ExperienceSection";
import CertificationsSection from "../../components/portfolio/CertificationsSection";
import ContactSection from "../../components/portfolio/ContactSection";
import Navigation from "../../components/portfolio/Navigation";
import Footer from "../../components/portfolio/Footer";
import BotCharacter from "../../components/portfolio/BotCharacter";
import { ToastContainer } from "react-toastify";

const Portfolio = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = ["home", "about", "skills", "projects", "experience", "certifications", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white overflow-x-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!text-xs"
      />
      <BotCharacter />
      <Navigation activeSection={activeSection} scrollToSection={scrollToSection} />

      <main>
        <section id="home">
          <HeroSection scrollToSection={scrollToSection} />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="skills">
          <SkillsSection />
        </section>

        <section id="projects">
          <ProjectsSection />
        </section>

        <section id="experience">
          <ExperienceSection />
        </section>

        <section id="certifications">
          <CertificationsSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;