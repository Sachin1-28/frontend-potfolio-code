import React, { useState, useEffect } from "react";
import { Menu, X, Code2, Sparkles } from "lucide-react";

const Navigation = ({ activeSection, scrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" }
  ];

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 py-3' 
          : 'bg-gradient-to-r from-slate-950 via-blue-950/50 to-slate-950 backdrop-blur-xl py-4'
      }`}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="animated-gradient"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="relative group cursor-pointer flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-teal-400 to-orange-500 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-slate-900 to-blue-900/50 p-2.5 rounded-xl border border-blue-400/30 group-hover:border-teal-400/60 transition-all duration-300 group-hover:scale-110">
                  <Code2 className="w-6 h-6 text-teal-400 group-hover:text-orange-400 transition-colors duration-300" strokeWidth={2.5} />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-orange-400 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="relative">
                <span className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-teal-300 to-orange-400 bg-clip-text text-transparent group-hover:from-teal-400 group-hover:via-blue-300 group-hover:to-orange-500 transition-all duration-500">
                  SACHIN
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1.5">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  className="relative group px-4 py-2 text-sm font-semibold transition-all duration-300"
                  style={{
                    animation: `fadeInDown 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-teal-400 to-orange-500 rounded-lg opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                  
                  {/* Main button background */}
                  <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                    activeSection === section.id 
                      ? "bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-teal-400/50" 
                      : "border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-500/10"
                  }`}></div>

                  {/* Text with gradient on active */}
                  <span className={`relative z-10 transition-all duration-300 ${
                    activeSection === section.id 
                      ? "text-transparent bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text font-bold" 
                      : "text-gray-300 group-hover:text-white"
                  }`}>
                    {section.label}
                  </span>

                  {/* Active indicator - animated underline */}
                  {activeSection === section.id && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce-dot"></div>
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="shine-effect"></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative group p-2.5 rounded-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-teal-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-blue-900/50 p-2 rounded-xl border border-blue-400/30 group-hover:border-teal-400/60 transition-all duration-300">
                <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
                  {mobileMenuOpen ? 
                    <X className="w-6 h-6 text-orange-400" strokeWidth={2.5} /> : 
                    <Menu className="w-6 h-6 text-teal-400 group-hover:text-blue-400 transition-colors duration-300" strokeWidth={2.5} />
                  }
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
             mobileMenuOpen ? "max-h-[600px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-slate-950/95 via-blue-950/90 to-slate-950/95 backdrop-blur-2xl border-t border-blue-500/20">
            {/* Mobile menu animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
              <div className="mobile-gradient"></div>
            </div>

            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className="relative w-full group"
                style={{
                  animation: mobileMenuOpen ? `slideInRight 0.4s ease-out ${index * 0.08}s both` : 'none'
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-teal-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
                
                {/* Main button */}
                <div className={`relative px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-between ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-blue-500/25 to-teal-500/25 border border-teal-400/50 shadow-lg shadow-blue-500/20"
                    : "bg-slate-900/40 border border-slate-700/50 group-hover:border-blue-400/40 group-hover:bg-blue-500/10"
                }`}>
                  <span className={`relative z-10 text-base font-bold transition-all duration-300 ${
                    activeSection === section.id
                      ? "text-transparent bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text"
                      : "text-gray-300 group-hover:text-white"
                  }`}>
                    {section.label}
                  </span>

                  {/* Active indicator */}
                  {activeSection === section.id ? (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-blue-400 transition-colors duration-300"></div>
                  )}
                </div>

                {/* Bottom shine effect */}
                {activeSection === section.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <style jsx='true'>{`
        /* Animated background particles */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent);
          border-radius: 50%;
          animation: float 20s infinite ease-in-out;
        }
        
        .particle-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
          animation-duration: 15s;
        }
        
        .particle-2 {
          top: 60%;
          left: 30%;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.8), transparent);
          animation-delay: 2s;
          animation-duration: 18s;
        }
        
        .particle-3 {
          top: 40%;
          left: 60%;
          width: 5px;
          height: 5px;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.6), transparent);
          animation-delay: 4s;
          animation-duration: 22s;
        }
        
        .particle-4 {
          top: 70%;
          left: 80%;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.7), transparent);
          animation-delay: 6s;
          animation-duration: 16s;
        }
        
        .particle-5 {
          top: 30%;
          right: 15%;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.6), transparent);
          animation-delay: 8s;
          animation-duration: 20s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate(100px, -50px) scale(1.5);
            opacity: 0.8;
          }
          90% {
            opacity: 1;
          }
        }
        
        /* Animated gradient background */
        .animated-gradient {
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.03),
            rgba(20, 184, 166, 0.03),
            rgba(249, 115, 22, 0.02),
            transparent
          );
          animation: slideGradient 10s infinite linear;
        }
        
        @keyframes slideGradient {
          to {
            transform: translateX(50%);
          }
        }
        
        /* Mobile menu gradient */
        .mobile-gradient {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(20, 184, 166, 0.1) 50%,
            transparent 100%
          );
          animation: rotateMobileGradient 15s infinite linear;
        }
        
        @keyframes rotateMobileGradient {
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Shine effect */
        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shine 3s infinite;
        }
        
        @keyframes shine {
          to {
            left: 200%;
          }
        }
        
        /* Bounce dot animation */
        @keyframes bounce-dot {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-8px) scale(1.2);
            opacity: 0.7;
          }
        }
        
        .animate-bounce-dot {
          animation: bounce-dot 1.5s ease-in-out infinite;
        }
        
        /* Pulse slow animation */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        /* Spin slow animation */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        /* Fade in down animation */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Slide in from right */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #14b8a6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #60a5fa, #2dd4bf);
        }
      `}</style>
    </>
  );
};

export default Navigation;