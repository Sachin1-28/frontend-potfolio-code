import React, { useEffect, useCallback, useMemo, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram, ChevronUp, Heart, Lock } from "lucide-react";
import { fetchAbout } from "../../store/slices/aboutSlice";

// Memoized Social Link Component
const SocialLink = memo(({ platform, url, Icon, colors, index }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${colors} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500`}></div>
    <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/20">
      <div className="flex items-center justify-between">
        <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
        <span className="text-xs text-gray-500 group-hover:text-gray-300 capitalize transition-colors duration-300">
          {platform}
        </span>
      </div>
    </div>
  </a>
));

SocialLink.displayName = 'SocialLink';

// Memoized Navigation Link Component
const NavLink = memo(({ section, index, onClick }) => (
  <li
    className="transform transition-all duration-300 hover:translate-x-2"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <button
      type="button"
      onClick={() => onClick(section.id)}
      className="text-gray-400 cursor-pointer hover:text-purple-400 transition-all duration-300 text-sm sm:text-base flex items-center gap-2 group"
    >
      <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all duration-300"></span>
      {section.label}
    </button>
  </li>
));

NavLink.displayName = 'NavLink';

// Redirecting Modal Component
const RedirectingModal = memo(({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl p-8 shadow-2xl border border-purple-500/30 max-w-md w-full mx-4 animate-scaleIn">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Lock Icon with Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl animate-ping"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full">
              <Lock size={32} className="text-white animate-pulse" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-300%">
              Redirecting to Admin
            </h3>
            <p className="text-gray-400 text-sm">
              Please wait while we securely redirect you...
            </p>
          </div>

          {/* Loading Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-loadingBar"></div>
          </div>

          {/* Spinner Dots */}
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

RedirectingModal.displayName = 'RedirectingModal';

const Footer = () => {
  const dispatch = useDispatch();
  const { about, loading } = useSelector((state) => state.about);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!about) {
      dispatch(fetchAbout());
    }
  }, [dispatch, about]);

  // Memoized sections array
  const sections = useMemo(() => [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" }
  ], []);

  // Memoized social icons object
  const socialIcons = useMemo(() => ({
    linkedin: Linkedin,
    github: Github,
    twitter: Twitter,
    instagram: Instagram
  }), []);

  // Memoized colors object
  const socialColors = useMemo(() => ({
    linkedin: 'from-blue-500 to-blue-600',
    github: 'from-gray-600 to-gray-700',
    twitter: 'from-sky-400 to-sky-500',
    instagram: 'from-pink-500 via-purple-500 to-orange-500'
  }), []);

  // Optimized scroll function with useCallback
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle admin redirect with animation
  const handleAdminClick = useCallback((e) => {
    e.preventDefault();
    setIsRedirecting(true);
    
    // Show animation for 1.5 seconds before redirecting
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 1500);
  }, []);

  if (loading) {
    return (
      <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-300" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/30" />
            <div className="absolute inset-0 rounded-full border-t-2 border-purple-400 animate-spin" />
          </div>
          <p className="text-sm tracking-widest font-semibold uppercase bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            Loading
          </p>
        </div>
      </footer>
    );
  }

  return (
    <>
      <RedirectingModal isVisible={isRedirecting} />
      
      <footer className="relative bg-gradient-to-r from-slate-950 via-slate-950/50 to-slate-950 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

            {/* Brand Section */}
            <div className="space-y-4 sm:space-y-6 group">
              <div className="transform transition-all duration-500 group-hover:scale-105">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-300% mb-2 sm:mb-3">
                  Sachin M
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Building exceptional digital experiences with passion and precision. Let's create something amazing together.
                </p>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform origin-left transition-all duration-500 group-hover:w-32"></div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 relative pl-4">
                <span className="absolute left-0 inline-block w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                <span className="absolute left-0 inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {sections.map((section, index) => (
                  <NavLink
                    key={section.id}
                    section={section}
                    index={index}
                    onClick={scrollToSection}
                  />
                ))}
                <li className="transform transition-all duration-300 hover:translate-x-2 pt-2 border-t border-purple-500/30">
                  <Link
                    to="/admin/login"
                    onClick={handleAdminClick}
                    className="text-gray-400 hover:text-pink-400 transition-all duration-300 text-sm sm:text-base flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-pink-500 group-hover:w-4 transition-all duration-300"></span>
                    <span className="relative">
                      Admin
                      <span className="absolute -top-1 -right-3 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 relative pl-4">
                <span className="absolute left-0 inline-block w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                <span className="absolute left-0 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                Get in Touch
              </h4>
              <ul className="space-y-4">
                {about?.contactEmail && (
                  <li className="group">
                    <a
                      href={`mailto:${about.contactEmail}`}
                      className="flex items-start gap-3 text-gray-400 hover:text-purple-400 transition-all duration-300"
                    >
                      <div className="mt-1 p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                        <Mail size={16} className="text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm break-all">{about.contactEmail}</p>
                      </div>
                    </a>
                  </li>
                )}

                {about?.contactPhone && (
                  <li className="group">
                    <a
                      href={`tel:${about.contactPhone}`}
                      className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-all duration-300"
                    >
                      <div className="mt-1 p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                        <Phone size={16} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm">{about.contactPhone}</p>
                      </div>
                    </a>
                  </li>
                )}

                {about?.address && (
                  <li className="group">
                    <div className="flex items-start gap-3 text-gray-400">
                      <div className="mt-1 p-2 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-all duration-300 flex-shrink-0">
                        <MapPin size={16} className="text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p className="text-sm">{about.address}</p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 relative pl-4">
                <span className="absolute left-0 inline-block w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
                <span className="absolute left-0 inline-block w-2 h-2 bg-pink-500 rounded-full"></span>
                Connect With Me
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {about?.socialLinks && Object.entries(about.socialLinks).map(([platform, url], index) => {
                  const Icon = socialIcons[platform];
                  const colors = socialColors[platform];

                  return Icon ? (
                    <SocialLink
                      key={platform}
                      platform={platform}
                      url={url}
                      Icon={Icon}
                      colors={colors}
                      index={index}
                    />
                  ) : null;
                })}
              </div>

              {/* Newsletter or CTA */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-2">Let's collaborate!</p>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="w-full py-2 px-4 cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                >
                  Start a Project
                </button>
              </div>
            </div>
          </div>

          {/* Divider with Animation */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-slate-900 px-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Sachin. Crafted with</p>
            <Heart size={16} className="text-red-500 animate-pulse" fill="currentColor" />
            <p>and passion</p>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-4 cursor-pointer right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 group z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp size={18} className="text-white group-hover:animate-bounce sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        </button>

        <style jsx='true'>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.9);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes loadingBar {
            0% { 
              transform: translateX(-100%);
            }
            100% { 
              transform: translateX(100%);
            }
          }
          
          .animate-gradient {
            animation: gradient 3s ease infinite;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
          
          .animate-loadingBar {
            animation: loadingBar 1.5s ease-in-out infinite;
          }
          
          .bg-300\% {
            background-size: 300% 300%;
          }
          
          .delay-150 {
            animation-delay: 150ms;
          }
          
          .delay-300 {
            animation-delay: 300ms;
          }
          
          .delay-1000 {
            animation-delay: 1000ms;
          }
        `}</style>
      </footer>
    </>
  );
};

export default memo(Footer);