import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Code, Palette, Rocket, Heart, Shield, Cpu, Sparkles, Zap, Target, Users, Cloud, Code2, ChevronRight, GraduationCap, BookOpen, Award, Calendar } from "lucide-react";
import { fetchAbout } from '../../store/slices/aboutSlice';
import { motion, AnimatePresence } from "framer-motion";
import { fetchProjects } from "../../store/slices/projectsSlice";
import { fetchSkills } from "../../store/slices/skillsSlice";

const AboutSection = () => {
  const dispatch = useDispatch();
  const { about, loading, error } = useSelector((state) => state.about);
  const [activeCard, setActiveCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const [isHoveringEducation, setIsHoveringEducation] = useState(false);

  useEffect(() => {
    dispatch(fetchAbout());

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  useEffect(() => {
      dispatch(fetchSkills());
    }, [dispatch]);
    const { skills = [] } = useSelector((state) => state.skills);
  const { projects = [] } = useSelector((s) => s.projects || {});
  const totalProjects = projects.length;

  const floatingIcons = [
    { Icon: Sparkles, delay: 0, color: "text-cyan-300" },
    { Icon: Zap, delay: 0.5, color: "text-purple-300" },
    { Icon: Target, delay: 1, color: "text-pink-300" },
    { Icon: Users, delay: 1.5, color: "text-yellow-300" },
    { Icon: Cloud, delay: 2, color: "text-blue-300" },
    { Icon: Code2, delay: 2.5, color: "text-green-300" },
  ];

  const cards = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable and efficient code",
      gradient: "from-cyan-500 to-blue-500",
      border: "border-cyan-500/30",
      delay: 0.1
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Creating beautiful user experiences",
      gradient: "from-purple-500 to-pink-500",
      border: "border-purple-500/30",
      delay: 0.2
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "Optimizing for speed and efficiency",
      gradient: "from-green-500 to-teal-500",
      border: "border-green-500/30",
      delay: 0.3
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Love what I do every single day",
      gradient: "from-orange-500 to-red-500",
      border: "border-orange-500/30",
      delay: 0.4
    },
    {
      icon: Shield,
      title: "Security",
      description: "Building secure and reliable applications",
      gradient: "from-indigo-500 to-blue-500",
      border: "border-indigo-500/30",
      delay: 0.5
    },
    {
      icon: Cpu,
      title: "Scalability",
      description: "Architecting scalable solutions",
      gradient: "from-yellow-500 to-orange-500",
      border: "border-yellow-500/30",
      delay: 0.6
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="relative">
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-transparent"
            animate={{
              rotate: 360,
              borderColor: ["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)"
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            animate={{
              rotate: -360,
              borderColor: ["#ec4899", "#06b6d4", "#8b5cf6", "#ec4899"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/30 backdrop-blur-xl max-w-xs sm:max-w-md mx-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-red-400 text-3xl sm:text-4xl mb-3 sm:mb-4"
          >
            ⚠️
          </motion.div>
          <p className="text-lg sm:text-xl font-bold text-red-300">Error loading data</p>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Please try refreshing the page</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 font-serif">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl sm:blur-2xl lg:blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 rounded-full bg-gradient-to-r from-pink-500/20 to-yellow-500/20 blur-xl sm:blur-2xl lg:blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating icons - Responsive positioning and sizing */}
        {floatingIcons.map(({ Icon, delay, color }, index) => (
          <motion.div
            key={index}
            className={`absolute ${color} opacity-10 sm:opacity-20`}
            initial={{ y: 0 }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(index) * 15, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8 + index,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${8 + (index * 10)}%`
            }}
          >
            <Icon size={24} className="sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </motion.div>
        ))}

        {/* Interactive mouse trail effect */}
        <motion.div
          className="absolute w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl lg:blur-2xl"
          animate={{
            x: mousePosition.x - 64,
            y: mousePosition.y - 64
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Enhanced Header with Advanced Morphing Animation */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative"
        >
          {/* Background Orbital Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border border-cyan-500/20"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div
              className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full border border-purple-500/20"
              animate={{
                rotate: -360,
                scale: [1, 0.95, 1]
              }}
              transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </div>

          {/* Main Header Container */}
          <div className="relative z-10 inline-block">
            {/* Morphing Background Plate */}
            <motion.div
              className="relative px-8 py-6 md:px-12 md:py-8 rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setIsHoveringHeader(true)}
              onMouseLeave={() => setIsHoveringHeader(false)}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
            >
              {/* Animated Gradient Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border border-cyan-500/30"
                animate={isHoveringHeader ? {
                  borderColor: [
                    "rgba(6, 182, 212, 0.3)",
                    "rgba(168, 85, 247, 0.3)",
                    "rgba(236, 72, 153, 0.3)",
                    "rgba(6, 182, 212, 0.3)"
                  ],
                  background: [
                    "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))",
                    "linear-gradient(225deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))",
                    "linear-gradient(315deg, rgba(6, 182, 212, 0.1), rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))",
                    "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))"
                  ]
                } : {}}
                transition={{ duration: 4, repeat: isHoveringHeader ? Infinity : 0 }}
              />

              {/* Animated Particles */}
              <AnimatePresence>
                {isHoveringHeader && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                        initial={{
                          scale: 0,
                          opacity: 0,
                          x: "50%",
                          y: "50%"
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: `calc(50% + ${Math.cos(i * 45 * Math.PI / 180) * 120}px)`,
                          y: `calc(50% + ${Math.sin(i * 45 * Math.PI / 180) * 120}px)`
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <div className="relative flex flex-col items-center">
                {/* Top Icon Row */}
                <motion.div
                  className="flex gap-4 mb-4"
                  animate={isHoveringHeader ? {
                    gap: ["1rem", "3rem", "1rem"],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 1.5, repeat: isHoveringHeader ? Infinity : 0 }}
                >
                  <motion.div
                    animate={isHoveringHeader ? {
                      rotate: [0, 360],
                      y: [0, -10, 0]
                    } : {}}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      y: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                  </motion.div>
                  <motion.div
                    animate={isHoveringHeader ? {
                      rotate: [0, -360],
                      y: [0, 10, 0]
                    } : {}}
                    transition={{
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                      y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Code2 className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                  </motion.div>
                </motion.div>

                {/* Morphing Title */}
                <div className="relative overflow-hidden h-14 md:h-20 mb-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isHoveringHeader ? "hover" : "normal"}
                      className="flex items-center gap-2"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isHoveringHeader ? (
                        // Hover State: Split and rearrange text
                        <div className="flex items-center gap-3 md:gap-4">
                          <motion.span
                            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
                            initial={{ x: -50 }}
                            animate={{ x: 0 }}
                            transition={{ type: "spring" }}
                          >
                            Me
                          </motion.span>
                          <motion.span
                            className="text-2xl md:text-3xl text-cyan-400"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, ease: "linear" }}
                          >
                            &
                          </motion.span>
                          <motion.span
                            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                            initial={{ x: 50 }}
                            animate={{ x: 0 }}
                            transition={{ type: "spring", delay: 0.1 }}
                          >
                            About
                          </motion.span>
                        </div>
                      ) : (
                        // Normal State
                        <div className="flex items-center gap-3 md:gap-4">
                          <motion.span
                            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                            animate={{
                              backgroundPosition: ["0%", "100%", "0%"]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            style={{ backgroundSize: "200% 100%" }}
                          >
                            About
                          </motion.span>
                          <motion.span
                            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                            animate={{
                              backgroundPosition: ["0%", "100%", "0%"]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: 0.5,
                              ease: "linear"
                            }}
                            style={{ backgroundSize: "200% 100%" }}
                          >
                            Me
                          </motion.span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Animated Subtitle */}
                <motion.div
                  className="relative"
                  animate={isHoveringHeader ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: isHoveringHeader ? Infinity : 0 }}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <motion.div
                      animate={isHoveringHeader ? {
                        rotate: 360,
                        scale: [1, 1.3, 1]
                      } : {}}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Rocket className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    </motion.div>
                    <p className="text-sm md:text-base lg:text-lg text-gray-300 font-medium">
                      <motion.span
                        animate={isHoveringHeader ? {
                          letterSpacing: ["0em", "0.2em", "0em"]
                        } : {}}
                        transition={{ duration: 2, repeat: isHoveringHeader ? Infinity : 0 }}
                      >
                        Crafting digital excellence
                      </motion.span>
                      <motion.span
                        className="mx-2 text-cyan-400"
                        animate={isHoveringHeader ? {
                          opacity: [1, 0.5, 1]
                        } : {}}
                        transition={{ duration: 1, repeat: isHoveringHeader ? Infinity : 0 }}
                      >
                        •
                      </motion.span>
                      <motion.span
                        animate={isHoveringHeader ? {
                          letterSpacing: ["0em", "0.2em", "0em"]
                        } : {}}
                        transition={{ duration: 2, repeat: isHoveringHeader ? Infinity : 0, delay: 0.5 }}
                      >
                        Innovative solutions
                      </motion.span>
                    </p>
                    <motion.div
                      animate={isHoveringHeader ? {
                        rotate: -360,
                        scale: [1, 1.3, 1]
                      } : {}}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                      }}
                    >
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Animated Bottom Border */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                    animate={{
                      x: ["-100%", "100%", "-100%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>

              {/* Floating Elements */}
              <AnimatePresence>
                {isHoveringHeader && (
                  <>
                    <motion.div
                      className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1, 0.8, 1], opacity: [0, 1, 1, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 1.5 }}
                    />
                    <motion.div
                      className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1, 0.8, 1], opacity: [0, 1, 1, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                    />
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 -z-10 blur-2xl opacity-20"
              animate={isHoveringHeader ? {
                background: [
                  "radial-gradient(circle at 30% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 30% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)"
                ]
              } : {}}
              transition={{ duration: 3, repeat: isHoveringHeader ? Infinity : 0 }}
            />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
          {/* Left Column - Dynamic Content */}
          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence>
              {about?.description?.map((paragraph, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  className="group relative"
                >
                  {/* Background Shapes */}
                  <div className="absolute -inset-1 sm:-inset-2 opacity-20 sm:opacity-30">
                    <motion.div
                      className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg"
                      animate={{
                        width: ["4px", "8px", "4px"],
                        height: ["4px", "8px", "4px"]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-purple-500/50 rounded-br-lg"
                      animate={{
                        width: ["4px", "8px", "4px"],
                        height: ["4px", "8px", "4px"]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 + 0.5 }}
                    />
                    <div className="absolute top-1/2 -left-0.5 sm:-left-1 w-0.5 h-6 sm:h-8 bg-gradient-to-b from-cyan-500/30 to-purple-500/30 rounded-full" />
                  </div>

                  {/* Content Card */}
                  <div className="relative p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all font-sans duration-300">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <motion.div
                        className="flex-shrink-0 mt-0.5 sm:mt-1"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                      </motion.div>
                      <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                        {paragraph}
                      </p>
                    </div>

                    {/* Animated line below */}
                    <motion.div
                      className="h-0.5 rounded-full mt-2 sm:mt-3 overflow-hidden"
                      initial={{ width: "100%" }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-cyan-500/50"
                        initial={{ x: "-100%" }}
                        animate={{
                          x: ["-100%", "100%", "-100%"]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.5,
                          ease: "linear"
                        }}
                      />
                    </motion.div>

                    {/* Sparkle icon on hover */}
                    <motion.div
                      className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        rotate: 360,
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Education Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative group"
              onMouseEnter={() => setIsHoveringEducation(true)}
              onMouseLeave={() => setIsHoveringEducation(false)}
            >
              {/* Animated Background Elements */}
              <motion.div
                className="absolute -inset-2 sm:-inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={isHoveringEducation ? {
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0]
                } : {}}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-xl"></div>
              </motion.div>

              {/* Main Card */}
              <div className="relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-cyan-900/40 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300">
                {/* Header */}
                <motion.div
                  className="flex items-center gap-3 mb-4"
                  animate={isHoveringEducation ? {
                    gap: ["0.75rem", "1rem", "0.75rem"]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="relative"
                    animate={isHoveringEducation ? {
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md"></div>
                    <GraduationCap className="relative w-8 h-8 sm:w-10 sm:h-10 text-emerald-300" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      Education
                      <motion.span
                        animate={isHoveringEducation ? {
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      </motion.span>
                    </h3>
                    <p className="text-emerald-300/80 text-xs sm:text-sm">Academic Background</p>
                  </div>
                </motion.div>

                {/* Degree Details */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Degree Row */}
                  <motion.div
                    className="flex items-start gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.div
                      className="flex-shrink-0 mt-1"
                      animate={isHoveringEducation ? {
                        rotate: [0, 360]
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </motion.div>
                    <div>
                      <h4 className="text-white font-semibold text-sm sm:text-base">B.Tech - Computer Science and Business Systems</h4>
                      <p className="text-emerald-200/70 text-xs sm:text-sm mt-1">Knowledge Institute of Technology</p>
                      
                      {/* Animated Tags */}
                    
                    </div>
                  </motion.div>

                  {/* Timeline */}
                  <motion.div
                    className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-emerald-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400/70" />
                    <span className="text-emerald-300/60 text-xs sm:text-sm">2020 - 2024</span>
                    <motion.div
                      className="ml-auto flex items-center gap-1"
                      animate={isHoveringEducation ? {
                        gap: ["0.25rem", "0.5rem", "0.25rem"]
                      } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400/70"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400/50"></div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Animated Progress Line */}
                <motion.div
                  className="h-1 rounded-full mt-4 sm:mt-5 overflow-hidden bg-emerald-900/30"
                  initial={{ width: "100%" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                    initial={{ x: "-100%" }}
                    animate={{
                      x: ["-100%", "100%", "-100%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>

                {/* Floating Elements on Hover */}
                <AnimatePresence>
                  {isHoveringEducation && (
                    <>
                      <motion.div
                        className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1, 0.8, 1],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 2 }}
                      />
                      <motion.div
                        className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-cyan-400"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1, 0.8, 1],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 2, delay: 0.3 }}
                      />
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Stats Cards */}
           
          </div>

          {/* Right Column - Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence>
              {cards.map((card, index) => {
                const baseColors = [
                  "from-cyan-500/10 to-blue-500/10",
                  "from-purple-500/10 to-pink-500/10",
                  "from-green-500/10 to-teal-500/10",
                  "from-orange-500/10 to-red-500/10",
                  "from-indigo-500/10 to-blue-500/10",
                  "from-yellow-500/10 to-orange-500/10"
                ];

                const hoverColors = [
                  "from-cyan-500/20 to-blue-500/20",
                  "from-purple-500/20 to-pink-500/20",
                  "from-green-500/20 to-teal-500/20",
                  "from-orange-500/20 to-red-500/20",
                  "from-indigo-500/20 to-blue-500/20",
                  "from-yellow-500/20 to-orange-500/20"
                ];

                const borderColors = [
                  "border-cyan-500/30",
                  "border-purple-500/30",
                  "border-green-500/30",
                  "border-orange-500/30",
                  "border-indigo-500/30",
                  "border-yellow-500/30"
                ];

                const iconColors = [
                  "text-cyan-400",
                  "text-purple-400",
                  "text-green-400",
                  "text-orange-400",
                  "text-indigo-400",
                  "text-yellow-400"
                ];

                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    onHoverStart={() => setActiveCard(index)}
                    onHoverEnd={() => setActiveCard(null)}
                    transition={{ delay: card.delay, type: "spring" }}
                    className={`relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl backdrop-blur-lg sm:backdrop-blur-xl border transition-all duration-300 
                    bg-gradient-to-br ${baseColors[index]} ${borderColors[index]}`}
                    style={{
                      borderColor: activeCard === index ?
                        `hsl(${index * 60}, 100%, 50%, 0.5)` :
                        `rgba(255,255,255,0.1)`
                    }}
                  >
                    {/* Card Background Gradient */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl -z-10 bg-gradient-to-br ${baseColors[index]} transition-all duration-300`}
                      animate={activeCard === index ? {
                        background: [
                          `linear-gradient(135deg, var(--tw-gradient-stops))`,
                          `linear-gradient(315deg, var(--tw-gradient-stops))`,
                          `linear-gradient(135deg, var(--tw-gradient-stops))`
                        ]
                      } : {}}
                      transition={{ duration: 3, repeat: activeCard === index ? Infinity : 0 }}
                      style={{
                        opacity: activeCard === index ? 0.8 : 0.3
                      }}
                    />

                    {/* Overlay on hover */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl -z-9 bg-gradient-to-br ${hoverColors[index]} transition-all duration-300`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeCard === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Animated Icon */}
                    <motion.div
                      className="relative mb-3 sm:mb-4"
                      animate={activeCard === index ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`absolute inset-0 blur-lg sm:blur-xl rounded-full transition-all duration-300 
                        ${activeCard === index ? 'opacity-100' : 'opacity-50'}`}
                        style={{
                          background: `radial-gradient(circle, 
                            hsl(${index * 60}, 100%, 50%, ${activeCard === index ? 0.3 : 0.1}), 
                            transparent 70%)`
                        }}
                      />
                      <card.icon className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${iconColors[index]} transition-colors duration-300`}
                        style={{
                          filter: activeCard === index ? `drop-shadow(0 0 6px hsl(${index * 60}, 100%, 50%, 0.5))` : 'none'
                        }}
                      />
                    </motion.div>

                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {card.description}
                    </p>

                    {/* Morphing underline */}
                    <motion.div
                      className="h-0.5 mt-2 sm:mt-3 md:mt-4"
                      initial={{ width: "0%" }}
                      animate={{
                        width: activeCard === index ? "100%" : "0%",
                        background: `linear-gradient(90deg, 
                          hsl(${index * 60}, 100%, 50%), 
                          hsl(${(index * 60 + 60) % 360}, 100%, 50%))`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
             {/* <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 pt-2"
            > */}
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
              >
                <motion.div
                  className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2"
                  animate={{
                    scale: [1, 1.1, 1],
                    color: ["#22d3ee", "#06b6d4", "#22d3ee"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {totalProjects}+
                </motion.div>
                <div className="text-gray-400 text-xs sm:text-sm">Projects Completed</div>
                <motion.div
                  className="h-0.5 sm:h-1 rounded-full mt-1 sm:mt-2 overflow-hidden"
                  initial={{ width: "100%" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotateY: -10 }}
                className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <motion.div
                  className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2"
                  animate={{
                    scale: [1, 1.1, 1],
                    color: ["#a855f7", "#8b5cf6", "#a855f7"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  {skills.length}+
                </motion.div>
                <div className="text-gray-400 text-xs sm:text-sm">Skills Expertise</div>
                <motion.div
                  className="h-0.5 sm:h-1 rounded-full mt-1 sm:mt-2 overflow-hidden"
                  initial={{ width: "100%" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.3,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </motion.div>
            {/* </motion.div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;