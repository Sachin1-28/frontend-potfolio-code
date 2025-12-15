import React, { useEffect, useRef, useMemo, lazy, Suspense, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAbout } from "../../store/slices/aboutSlice";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Lazy load heavy dependencies
const Github = lazy(() => import("lucide-react").then(module => ({ default: module.Github })));
const Linkedin = lazy(() => import("lucide-react").then(module => ({ default: module.Linkedin })));
const Twitter = lazy(() => import("lucide-react").then(module => ({ default: module.Twitter })));
const Download = lazy(() => import("lucide-react").then(module => ({ default: module.Download })));
const Eye = lazy(() => import("lucide-react").then(module => ({ default: module.Eye })));
const ChevronDown = lazy(() => import("lucide-react").then(module => ({ default: module.ChevronDown })));
const Sparkles = lazy(() => import("lucide-react").then(module => ({ default: module.Sparkles })));
const Zap = lazy(() => import("lucide-react").then(module => ({ default: module.Zap })));

// Fallback components for lazy loading
const IconFallback = () => <div className="w-5 h-5 bg-gray-400/20 animate-pulse rounded" />;

// Optimized color theme
const COLORS = {
  primary: {
    light: '#3b82f6',
    main: '#2563eb',
    dark: '#1d4ed8',
  },
  secondary: {
    light: '#0ea5e9',
    main: '#0284c7',
    dark: '#0369a1',
  },
  accent: {
    light: '#10b981',
    main: '#059669',
    dark: '#047857',
  },
  background: {
    dark: '#0f172a',
    darker: '#020617',
  }
};

// Tech Stack Data
const TECH_STACK = [
  {
    name: "MongoDB",
    icon: "M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296 4.488-3.3 4.291-11.375zm-5.336 11.635c0-1.021-.184-2.028-.542-2.975-.366-.968-.898-1.854-1.578-2.635a8.495 8.495 0 00-2.355-1.95c-.868-.496-1.814-.862-2.808-1.088.033.175.067.35.103.525.362 1.754.854 3.476 1.472 5.157.644 1.751 1.415 3.452 2.31 5.092.028.052.057.104.086.155.14-.495.257-.996.346-1.503.097-.553.147-1.114.147-1.678z",
    color: "#47A248",
    orbitSpeed: 20,
    orbitDirection: 1,
    size: 34,
    glow: true
  },
  {
    name: "Express",
    icon: "M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z",
    color: "#000000",
    orbitSpeed: 25,
    orbitDirection: -1,
    size: 36,
    glow: true
  },
  {
    name: "React",
    icon: "M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.20 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .20-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.20 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.20 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9z",
    color: "#61DAFB",
    orbitSpeed: 30,
    orbitDirection: 1,
    size: 34,
    glow: true
  },
  {
    name: "Node.js",
    icon: "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.90,19.099,13.993z", color: "#339933",
    orbitSpeed: 35,
    orbitDirection: -1,
    size: 34,
    glow: true
  },
  {
    name: "JavaScript",
    icon: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z",
    color: "#F7DF1E",
    orbitSpeed: 22,
    orbitDirection: 1,
    size: 32,
    glow: true
  },
  {
    name: "TypeScript",
    icon: "M0 0h24v24H0V0zm19.092 12.288c.199.456.315 1.082.315 1.875 0 1.755-.855 3.015-2.344 3.699-1.17.54-2.621.81-3.881.765-1.404-.045-2.52-.315-3.375-.765-.27-.165-.54-.375-.72-.585.045.36.09.675.135.99.045.27.09.54.135.765.045.225.09.495.135.765l.315.765c.09.225.18.495.27.72h-.495c-.54 0-1.125-.045-1.665-.18-.18-.045-.36-.09-.495-.135l-.405-.09.18-.855c.045-.225.09-.495.135-.72l.135-.495.27-.855c.585-1.755 1.395-3.375 2.43-4.905.045-.09.135-.18.18-.27.585-.81 1.26-1.575 2.07-2.205 1.035-.81 2.295-1.35 3.645-1.395 1.035-.045 1.8.225 2.43.72.225.18.405.405.54.675.09.18.18.405.225.63.045.18.09.405.09.585 0 .18-.045.36-.09.54l-.135.27c-.045.135-.135.27-.225.405-.09.135-.225.27-.36.405l-.27.27c-.18.18-.36.315-.54.45l-.405.315c-.27.18-.495.36-.72.495-.225.135-.405.27-.63.36-.225.09-.405.18-.63.225-.225.045-.405.09-.63.09-.36 0-.675-.045-.945-.135-.27-.09-.495-.225-.675-.405-.18-.18-.315-.405-.405-.675-.09-.27-.135-.585-.135-.945 0-.36.045-.675.135-.945.09-.27.225-.495.405-.675.18-.18.405-.315.675-.405.27-.09.585-.135.945-.135.36 0 .72.045 1.035.135.315.09.63.225.9.405.27.18.54.405.765.675.225.27.45.585.63.945zM9.18 9.045c-1.755 0-2.88 1.215-2.88 3.195 0 2.07 1.215 3.195 2.88 3.195 1.665 0 2.88-1.125 2.88-3.195 0-1.98-1.215-3.195-2.88-3.195z",
    color: "#3178C6",
    orbitSpeed: 28,
    orbitDirection: -1,
    size: 32,
    glow: true
  }
];

// Enhanced Tech Stack Icons Component with GSAP
const TechStackIcons = ({ containerRef, prefersReducedMotion }) => {
  const iconsRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    // Clear any existing animations
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const container = containerRef.current;
    const icons = iconsRef.current.filter(Boolean);

    // Calculate orbits based on screen size
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const baseRadius = isMobile ? 100 : isTablet ? 140 : 180;
    const innerRadius = isMobile ? 60 : isTablet ? 80 : 100;

    // Create master timeline
    const tl = gsap.timeline({ repeat: -1 });

    // Create multiple orbital rings
    [0, 1, 2].forEach((ringIndex) => {
      const ringIcons = TECH_STACK.slice(ringIndex * 2, ringIndex * 2 + 2);
      const radius = baseRadius + (ringIndex * 40);
      const speedMultiplier = 1 + (ringIndex * 0.3);

      ringIcons.forEach((tech, idx) => {
        const icon = icons[idx + (ringIndex * 2)];
        if (!icon) return;

        const angle = (idx / ringIcons.length) * 360 + (ringIndex * 60);
        const orbitDuration = tech.orbitSpeed * speedMultiplier;

        // Set initial position
        gsap.set(icon, {
          x: Math.cos(angle * (Math.PI / 180)) * radius,
          y: Math.sin(angle * (Math.PI / 180)) * radius,
          rotation: angle * tech.orbitDirection,
        });

        // Add to timeline
        tl.to(icon, {
          duration: orbitDuration,
          x: `+=${Math.cos((angle + 360) * (Math.PI / 180)) * radius}`,
          y: `+=${Math.sin((angle + 360) * (Math.PI / 180)) * radius}`,
          rotation: (angle + 360 * tech.orbitDirection) * tech.orbitDirection,
          ease: "none",
        }, 0);
      });
    });

    // Add pulsing glow effects
    icons.forEach((icon, idx) => {
      if (!icon) return;

      const tech = TECH_STACK[idx];
      if (tech.glow) {
        gsap.to(icon.querySelector('.tech-icon-glow'), {
          duration: 2,
          scale: 1.2,
          opacity: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: idx * 0.2
        });
      }

      // Add floating animation
      gsap.to(icon, {
        duration: 3 + Math.random() * 2,
        y: "+=10",
        rotation: "+=5",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: idx * 0.1
      });
    });

    animationRef.current = tl;

    // Handle hover interactions
    icons.forEach((icon, idx) => {
      const tech = TECH_STACK[idx];

      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          duration: 0.3,
          scale: 1.2,
          zIndex: 100,
          boxShadow: `0 0 30px ${tech.color}80`,
          ease: "power2.out"
        });

        gsap.to(icon.querySelector('.tech-icon-label'), {
          duration: 0.3,
          opacity: 1,
          y: -5,
          ease: "power2.out"
        });
      });

      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          duration: 0.3,
          scale: 1,
          zIndex: 1,
          boxShadow: `0 10px 20px ${tech.color}40`,
          ease: "power2.out"
        });

        gsap.to(icon.querySelector('.tech-icon-label'), {
          duration: 0.3,
          opacity: 0,
          y: 0,
          ease: "power2.out"
        });
      });
    });

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }

      icons.forEach(icon => {
        if (icon) {
          gsap.killTweensOf(icon);
          gsap.killTweensOf(icon.querySelector('.tech-icon-glow'));
          gsap.killTweensOf(icon.querySelector('.tech-icon-label'));
        }
      });
    };
  }, [prefersReducedMotion, containerRef]);

  // Handle responsive radius
  const getRadius = () => {
    if (typeof window === 'undefined') return 140;
    if (window.innerWidth < 640) return 90;
    if (window.innerWidth < 768) return 110;
    if (window.innerWidth < 1024) return 140;
    return 180;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Connect lines between icons */}
     <svg
  viewBox="0 0 100 100"
  className="absolute inset-0 w-full h-full"
  preserveAspectRatio="xMidYMid meet"
>

        <defs>
          <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {TECH_STACK.map((_, i) => {
          const nextIndex = (i + 1) % TECH_STACK.length;
          return (
            <motion.path
              key={`orbit-${i}`}
             d={`M ${50 + Math.cos((i / TECH_STACK.length) * 3 * Math.PI) * 40}
       ${50 + Math.sin((i / TECH_STACK.length) * 3 * Math.PI) * 40}
       Q 50 50
       ${50 + Math.cos((nextIndex / TECH_STACK.length) * 3 * Math.PI) * 40}
       ${50 + Math.sin((nextIndex / TECH_STACK.length) * 3 * Math.PI) * 40}`}
              fill="none"
              stroke="url(#orbit-gradient)"
              strokeWidth="1"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="opacity-30"
            />
          );
        })}
      </svg>

      {/* Tech Icons */}
      {TECH_STACK.map((tech, index) => (
        <div
          key={tech.name}
          ref={el => iconsRef.current[index] = el}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tech-icon-wrapper group/icon pointer-events-auto"
          style={{
            '--tech-color': tech.color,
            '--tech-size': `${tech.size}px`
          }}
        >
          {/* Glow effect */}
          {tech.glow && (
            <div className="absolute inset-0 tech-icon-glow rounded-xl"
              style={{
                background: `radial-gradient(circle at center, ${tech.color}40 0%, transparent 70%)`,
                filter: 'blur(10px)'
              }}
            />
          )}

          {/* Icon container */}
          <div className="relative tech-icon-container rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 group-hover/icon:shadow-2xl"
            style={{
              width: 'calc(var(--tech-size) * 1.5)',
              height: 'calc(var(--tech-size) * 1.5)',
              boxShadow: `0 10px 30px ${tech.color}40`
            }}
          >
            <div className="w-full h-full flex items-center justify-center p-2">
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full"
                fill={tech.color}
              >
                <path d={tech.icon} />
              </svg>
            </div>

            {/* Icon label */}
            <div className="tech-icon-label absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300">
              <span className="text-xs font-semibold text-white bg-slate-900/90 px-2 py-1 rounded whitespace-nowrap backdrop-blur-sm">
                {tech.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const HeroSection = ({ scrollToSection }) => {
  const dispatch = useDispatch();
  const { about, loading } = useSelector((state) => state.about);
  const imageContainerRef = useRef(null);
  const techContainerRef = useRef(null);
  const titleRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [typingText, setTypingText] = useState("");
  const roleText = about?.role || "MERN Stack Developer";

  // Memoize expensive computations
  useEffect(() => {
    if (prefersReducedMotion || !roleText) {
      setTypingText(roleText);
      return;
    }

    let currentText = "";
    let i = 0;
    const typingSpeed = 50; // ms per character
    const pauseDuration = 2000; // ms to pause at the end

    const typeWriter = () => {
      if (i < roleText.length) {
        currentText += roleText.charAt(i);
        setTypingText(currentText);
        i++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        // Pause and restart
        setTimeout(() => {
          currentText = "";
          i = 0;
          typeWriter();
        }, pauseDuration);
      }
    };

    typeWriter();

    return () => {
      currentText = "";
      i = 0;
    };
  }, [roleText, prefersReducedMotion]);

  // Memoize expensive computations
  const downloadableResume = useMemo(() => {
    if (!about?.resumePdf) return '';
    return about.resumePdf.replace("/upload/", "/upload/fl_attachment/");
  }, [about?.resumePdf]);

  // Handle 3D tilt effect with GSAP
  const handleMouseMove = useCallback((e) => {
    if (prefersReducedMotion || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;

    setMousePosition({ x, y });

    // Smooth animation with GSAP
    gsap.to(imageContainerRef.current, {
      duration: 0.5,
      rotateY: x * 15,
      rotateX: y * 15,
      ease: "power2.out",
      overwrite: "auto"
    });

    // Parallax effect for tech icons
    if (techContainerRef.current) {
      gsap.to(techContainerRef.current, {
        duration: 0.5,
        x: x * 20,
        y: y * 20,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (prefersReducedMotion) return;

    gsap.to(imageContainerRef.current, {
      duration: 0.8,
      rotateY: 0,
      rotateX: 0,
      ease: "elastic.out(1, 0.3)"
    });

    if (techContainerRef.current) {
      gsap.to(techContainerRef.current, {
        duration: 0.8,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)"
      });
    }

    setMousePosition({ x: 0, y: 0 });
  }, [prefersReducedMotion]);

  // Handle scroll progress for parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated gradient for title
  useEffect(() => {
    if (!titleRef.current || prefersReducedMotion) return;

    const gradientAnimation = gsap.to(titleRef.current, {
      duration: 10,
      backgroundPosition: '200% 0',
      repeat: -1,
      ease: "none"
    });

    return () => gradientAnimation.kill();
  }, [prefersReducedMotion]);

  useEffect(() => {
    dispatch(fetchAbout());

    // Cleanup GSAP animations on unmount
    return () => {
      if (imageContainerRef.current) {
        gsap.killTweensOf(imageContainerRef.current);
      }
      if (techContainerRef.current) {
        gsap.killTweensOf(techContainerRef.current);
      }
    };
  }, [dispatch]);

  if (loading || !about) {
    return (
      <section
        className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/80 to-slate-900"
        style={{ marginTop: '72px' }}
      >
        <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  const { name, role, quote, profileImage, resumePdf, socialLinks } = about;

  // Responsive text sizes
  const titleSizes = {
    base: "text-4xl",
    sm: "text-5xl",
    md: "text-5xl",
    lg: "text-5xl",
    xl: "text-5xl"
  };

  const subtitleSizes = {
    base: "text-xl",
    sm: "text-2xl",
    md: "text-3xl"
  };

  const quoteSizes = {
    base: "text-sm",
    sm: "text-base",
    md: "text-lg"
  };

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/80 to-slate-900 text-white overflow-hidden"
      id="hero"
      style={{
        marginTop: '72px',
        minHeight: 'calc(100vh - 72px)',
        scrollMarginTop: '72px'
      }}
    >
      {/* Background Effects with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-slate-900 to-purple-950/90" />

        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, ${COLORS.primary.light}20 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${COLORS.accent.light}20 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, ${COLORS.secondary.light}15 0%, transparent 50%)
            `,
            transform: `translateY(${scrollProgress * -50}px)`
          }}
        />

        {/* Particle effect with GSAP */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(prefersReducedMotion ? 0 : 30)].map((_, i) => {
            const size = Math.random() * 4 + 1;
            return (
              <div
                key={i}
                ref={el => {
                  if (el && !prefersReducedMotion) {
                    gsap.to(el, {
                      duration: Math.random() * 10 + 10,
                      x: `+=${Math.random() * 100 - 50}`,
                      y: `+=${Math.random() * 100 - 50}`,
                      rotation: Math.random() * 360,
                      repeat: -1,
                      yoyo: true,
                      ease: "sine.inOut",
                      delay: i * 0.1
                    });
                  }
                }}
                className="absolute rounded-full bg-gradient-to-r from-blue-400/30 to-emerald-400/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  filter: 'blur(1px)'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="h-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
            style={{
              transform: `translateY(${scrollProgress * 20}px)`
            }}
          >
           <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg blur opacity-30 animate-pulse" />
                <div className="relative px-4 py-2 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-blue-500/30">
                  <div className="flex items-center gap-2">
                    <Suspense fallback={<IconFallback />}>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </Suspense>
                    <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      Welcome to my portfolio
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Title with enhanced effects */}
            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h1 className={`${titleSizes.base} sm:${titleSizes.sm} md:${titleSizes.md} lg:${titleSizes.lg} xl:${titleSizes.xl} font-bold leading-tight tracking-tight`}>
                  <span className="block text-gray-200">
                    Hi, I'm{" "}
                    <span
                      ref={titleRef}
                      className="bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                      style={{
                        backgroundSize: '200% auto'
                      }}
                    >
                      {name || "Sachin"}
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Animated role display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 shadow-lg">
                    <Suspense fallback={<IconFallback />}>
                      <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </Suspense>
                    <div className="flex items-center">
                      <span className="text-md md:text-xl font-semibold text-gray-300 mr-2">
                        I'm a
                      </span>
                      <div className="relative">
                        <span className="text-md md:text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                          {typingText}
                        </span>
                        <span className="ml-0.5 w-[2px] h-6 bg-emerald-400 inline-block animate-blink" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Quote Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative max-w-xl"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 blur-xl rounded-2xl" />
              <div className="relative p-4 md:p-6 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-base md:text-lg text-gray-300 leading-relaxed italic">
                      "{quote}"
                    </p>
                    
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-4">
                <a
                  href={resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-500/40 overflow-hidden"
                  aria-label="Preview Resume"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-700 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-emerald-400 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-3 text-white">
                    <Suspense fallback={<IconFallback />}>
                      <Eye className="w-5 h-5 md:w-6 md:h-6" />
                    </Suspense>
                    <span>Preview Resume</span>
                  </span>
                </a>

                <a
                  href={downloadableResume}
                  download
                  className="group relative px-6 py-2 rounded-xl border-2 border-emerald-500/50 bg-slate-900/60 backdrop-blur-sm font-semibold text-base md:text-lg hover:bg-emerald-500/10 hover:border-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-emerald-500/30 overflow-hidden"
                  aria-label="Download Resume"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Suspense fallback={<IconFallback />}>
                    <Download className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors relative z-10" />
                  </Suspense>
                  <span className="text-gray-200 group-hover:text-white transition-colors relative z-10">
                    Download CV
                  </span>
                </a>
              </div>

              {/* Enhanced Social Links */}
              <div className="pt-2">
                <p className="text-sm text-gray-400 mb-4 font-medium">Connect with me</p>
                <div className="flex gap-3 md:gap-4">
                  {[
                    { icon: Github, href: socialLinks?.github, label: "GitHub", color: "hover:bg-gray-900/80", gradient: "from-gray-700 to-gray-900" },
                    { icon: Linkedin, href: socialLinks?.linkedin, label: "LinkedIn", color: "hover:bg-blue-900/80", gradient: "from-blue-600 to-blue-800" },
                    { icon: Twitter, href: socialLinks?.twitter, label: "Twitter", color: "hover:bg-sky-900/80", gradient: "from-sky-500 to-sky-700" },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 hover:scale-110 active:scale-95 transition-all duration-300 ${social.color} overflow-hidden`}
                      aria-label={social.label}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                      <Suspense fallback={<IconFallback />}>
                        <social.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300 relative z-10" />
                      </Suspense>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Enhanced 3D Image with Orbiting Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center lg:justify-end order-1 lg:order-2 relative"
            style={{
              transform: `translateY(${scrollProgress * -30}px)`
            }}
          >
            <div className="relative max-w-sm lg:max-w-md w-full flex items-center justify-center">
              {/* Tech Stack Container */}
              <div
                ref={techContainerRef}
                className="absolute inset-0 z-10"
              >
                <TechStackIcons
                  containerRef={techContainerRef}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>

              {/* 3D Image Container */}
              <div
                ref={imageContainerRef}
                className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 preserve-3d"
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main 3D Image Card with enhanced effects */}
                <div className="relative w-full h-full transform-gpu transition-transform duration-300 ease-out">
                  {/* Multiple glow layers for depth */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 blur-3xl transform translate-z-[-40px]" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/15 to-blue-500/15 blur-2xl transform translate-z-[-20px]" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-bl from-sky-500/10 to-emerald-500/10 blur-xl transform translate-z-[-10px]" />

                  {/* Floating particles around image */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(prefersReducedMotion ? 0 : 8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: prefersReducedMotion ? 'none' : `float ${Math.random() * 5 + 3}s infinite ease-in-out`,
                          animationDelay: `${Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Main image container */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 bg-gradient-to-br from-slate-900/50 to-blue-900/30 shadow-2xl shadow-blue-500/30 backdrop-blur-sm transform translate-z-0">
                    <img
                      src={profileImage || "placeholder.jpg"}
                      alt={about.name || "Profile"}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x400/0f172a/ffffff?text=Profile";
                      }}
                    />

                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-emerald-900/20" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                  </div>

                  {/* Floating decorative elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-emerald-500/30 blur-xl animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {scrollToSection && (
       <motion.button
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 0.6 }}
  onClick={() => scrollToSection("about")}
  className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 z-20 focus:outline-none hover:ring-2 hover:ring-blue-400/50 cursor-pointer rounded-2xl p-3 group/scroll"
  aria-label="Scroll to next section"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* Text */}
  <span className="text-blue-300 text-xs uppercase tracking-widest font-semibold">
    Scroll Down
  </span>

  {/* Arrow with trail effect */}
  <div className="relative flex justify-center items-center h-8 w-8">
    <Suspense fallback={<div className="w-6 h-6" />}>
      {/* Trail chevron 1 */}
      <motion.div
        className="absolute"
        animate={{
          y: [-8, 0],
          opacity: [0, 0.3, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-blue-400" strokeWidth={2} />
      </motion.div>
      
      {/* Trail chevron 2 */}
      <motion.div
        className="absolute"
        animate={{
          y: [-4, 4],
          opacity: [0, 0.6, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-blue-300" strokeWidth={2} />
      </motion.div>
      
      {/* Main chevron */}
      <motion.div
        className="absolute"
        animate={{
          y: [0, 8],
          opacity: [1, 0.8, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-blue-200" strokeWidth={2} />
      </motion.div>
    </Suspense>
  </div>
</motion.button>
      )}

      {/* CSS Animations */}
      <style jsx='true'>{`
       @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
         .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .transform-gpu {
          transform: translate3d(0, 0, 0);
        }
        
        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          .tech-icon-wrapper,
          .tech-icon-container,
          .tech-icon-label {
            animation: none !important;
            transition: none !important;
          }
          
          .animate-pulse,
          .animate-bounce,
          .animate-shimmer,
          .animate-blink {
            animation: none !important;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .tech-icon-container {
            transform: scale(0.8);
          }
          
          .tech-icon-label {
            font-size: 10px;
            padding: 2px 4px;
          }
        }
        
        @media (max-width: 640px) {
          .tech-icon-container {
            transform: scale(0.6);
          }
        }
        
        /* Smooth transitions for all interactive elements */
        .tech-icon-wrapper {
          transition: filter 0.3s ease;
        }
        
        .tech-icon-wrapper:hover {
          filter: drop-shadow(0 0 20px var(--tech-color));
        }
        
      `}</style>
    </section>
  );
};

export default React.memo(HeroSection);

//////////./././