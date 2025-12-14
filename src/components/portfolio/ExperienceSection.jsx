import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Briefcase,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Building,
  Code,
  CheckCircle,
  Sparkles,
  TrendingUp
} from "lucide-react";
import {
  fetchExperiences,
} from "../../store/slices/experiencesSlice";

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const { experiences, loading, error } = useSelector((state) => state.experiences);
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.97
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      scale: 1.01,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const glowEffect = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 border-3 border-transparent border-t-emerald-400 border-r-violet-500 rounded-full mx-auto mb-4"
          />
          <p className="text-lg bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
            Loading experiences...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="text-center p-6 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-2xl border border-rose-500/20">
          <p className="text-lg text-rose-400">Error loading experiences</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-16 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-16 left-8 w-64 h-64 bg-gradient-to-r from-emerald-500/8 to-violet-500/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, y: [0, 15, 0] }}
          className="absolute bottom-16 right-8 w-80 h-80 bg-gradient-to-r from-rose-500/8 to-orange-500/8 rounded-full blur-3xl"
        />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px),
                             linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Centered Header */}
        {/* Enhanced Header - Icon and Text in Same Line */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                transition: {
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -180, -360],
                transition: {
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-rose-500/10 to-orange-500/10 rounded-full blur-3xl"
            />
          </div>

          {/* Main header container - flex layout for same line */}
          <motion.div
            className="relative group cursor-default inline-flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 px-4 py-6 rounded-2xl"
            whileHover="hover"
            initial="initial"
            animate="animate"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.01 }
            }}
          >
            {/* Animated icon container - reduced size */}
            <motion.div
              className="relative"
              variants={{
                initial: { rotate: 0 },
                hover: { rotate: 5 }
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                {/* Glowing background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-violet-500/20 to-rose-500/20 rounded-xl blur-lg"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Main icon container - reduced size */}
                <motion.div
                  className="relative p-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border-2 border-emerald-500/30 shadow-lg"
                  whileHover={{
                    boxShadow: "0 10px 40px -8px rgba(16, 185, 129, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)"
                  }}
                  variants={{
                    initial: { y: 0 },
                    hover: { y: -3 }
                  }}
                >
                  {/* Animated ring */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-transparent"
                    animate={{
                      borderColor: ["rgba(16, 185, 129, 0.3)", "rgba(139, 92, 246, 0.3)", "rgba(16, 185, 129, 0.3)"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Compact icon with animations */}
                  <div className="relative">
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 border border-dashed border-emerald-400/20 rounded-full" />
                    </motion.div>

                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Enhanced compact icon */}
                      <div className="relative">
                        {/* Main icon - reduced size */}
                        <motion.div
                          className="p-2 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-lg shadow-md"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <TrendingUp className="w-6 h-6 text-white" />
                        </motion.div>

                        {/* Floating smaller icons - reduced and hidden on mobile */}
                        <motion.div
                          className="absolute -top-1 -right-1 p-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-md shadow-md hidden sm:block"
                          animate={{
                            y: [0, -4, 0],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        >
                          <Sparkles className="w-3 h-3 text-white" />
                        </motion.div>

                        <motion.div
                          className="absolute -bottom-1 -left-1 p-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md shadow-md hidden sm:block"
                          animate={{
                            y: [0, 4, 0],
                            rotate: [0, -5, 5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                          }}
                        >
                          <Briefcase className="w-3 h-3 text-white" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text content - positioned inline with icon */}
            <motion.div
              className="space-y-2 text-center lg:text-left"
              variants={{
                initial: { opacity: 1, x: 0 },
                hover: { opacity: 0.95, x: 5 }
              }}
            >
              {/* Title with gradient */}
              <motion.h2
                className="text-3xl sm:text-5xl font-bold tracking-tight relative z-10"
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.02 }
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="bg-gradient-to-r from-emerald-400 via-violet-500 to-rose-500 bg-clip-text text-transparent">
                  Professional Journey
                </span>
              </motion.h2>

              {/* Subtitle */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-base text-gray-400 max-w-lg">
                  A timeline of my career progression, roles, and key achievements
                </p>

                {/* Animated underline - centered on mobile, aligned left on desktop */}
                <motion.div
                  className="mt-3 h-0.5 w-24 bg-gradient-to-r from-emerald-500 via-violet-500 to-rose-500 mx-auto lg:mx-0 rounded-full"
                  variants={{
                    initial: { scaleX: 0.8 },
                    hover: { scaleX: 1 }
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Timeline connector line */}
        <div className="relative">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-violet-500 to-rose-500 opacity-20 rounded-full" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 lg:space-y-0"
          >
            {experiences?.map((exp, index) => (
              <motion.div
                key={exp._id}
                variants={cardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredCard(exp._id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative lg:flex items-center gap-6 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
              >
                {/* Timeline node */}
                <div className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-7 h-7 flex items-center justify-center z-20">
                  <motion.div
                    animate={hoveredCard === exp._id ? { scale: 1.4 } : { scale: 1 }}
                    className={`w-3.5 h-3.5 rounded-full border-3 ${expandedId === exp._id
                      ? 'border-white bg-gradient-to-r from-emerald-500 to-violet-500'
                      : 'border-gray-700 bg-gradient-to-r from-emerald-400/40 to-violet-400/40'
                      }`}
                  />
                  <motion.div
                    animate={
                      hoveredCard === exp._id
                        ? { scale: 1.8, opacity: 0 }
                        : { scale: 1, opacity: 0 }
                    }
                    className="absolute inset-0 border-2 border-emerald-400 rounded-full"
                  />
                </div>

                {/* Experience card */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-10' : 'lg:pl-10'
                  } ml-10 lg:ml-0`}>
                  <motion.div
                    className={`relative p-5 sm:p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 ${expandedId === exp._id
                      ? 'border-emerald-400/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90'
                      : 'border-violet-500/30 bg-gradient-to-br from-gray-800/70 to-gray-900/70'
                      } shadow-xl`}
                    style={{
                      boxShadow: hoveredCard === exp._id
                        ? '0 15px 40px -12px rgba(16, 185, 129, 0.25), 0 0 25px rgba(139, 92, 246, 0.15)'
                        : '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {/* Glow effect */}
                    {hoveredCard === exp._id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/8 to-violet-500/8 rounded-2xl blur-xl"
                      />
                    )}

                    <div className="relative z-10">
                      {/* Company logo and info */}
                      <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:gap-4 mb-5 lg:text-left">
                        {exp.experienceImage && (
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-emerald-400/30 mb-3 lg:mb-0 flex-shrink-0"
                          >
                            <img
                              src={exp.experienceImage}
                              alt={exp.companyName}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        )}
                        <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                            <span> <Building className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> </span>
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                              {exp.companyName}
                            </h3>
                          </div>
                          <div className="flex items-center justify-center lg:justify-start gap-2">
                            <span> <Code className="w-4 h-4 text-violet-400" /> </span>
                            <span className="text-base text-emerald-300 font-semibold">
                              {exp.workedRole}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Basic info */}
                      <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-5 ${index % 2 === 0 ? 'lg:justify-end' : ''
                        }`}>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 rounded-full">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
                          <span className="text-xs sm:text-sm text-emerald-100">{exp.experienceDuration}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-500/20 to-rose-500/20 rounded-full">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-300" />
                          <span className="text-xs sm:text-sm text-violet-100">{exp.location}</span>
                        </div>
                      </div>

                      {/* Company type and mode */}
                      <div className="flex flex-wrap justify-center gap-2 mb-5">
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 rounded-full text-xs text-emerald-200 border border-emerald-400/30">
                          {exp.companyType}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-500/30 to-violet-600/30 rounded-full text-xs text-violet-200 border border-violet-400/30">
                          {exp.workMode}
                        </span>
                      </div>

                      {/* Toggle expand button */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setExpandedId(expandedId === exp._id ? null : exp._id)}
                        className="flex items-center justify-center cursor-pointer gap-2 w-full py-2.5 mb-5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-emerald-500/30 hover:border-emerald-400/50 transition-colors"
                      >
                        <span className="text-sm text-emerald-300">
                          {expandedId === exp._id ? 'Show Less' : 'View Details'}
                        </span>
                        <motion.div
                          animate={{ rotate: expandedId === exp._id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {expandedId === exp._id ? (
                            <ChevronUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-400" />
                          )}
                        </motion.div>
                      </motion.button>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedId === exp._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {/* Description */}
                            <div className="mb-6">
                              <h4 className="text-base font-semibold text-white mb-3 flex items-center justify-center lg:justify-start gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                Key Responsibilities & Projects
                              </h4>
                              <ul className="space-y-2.5">
                                {exp.experienceDescription?.map((desc, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-2.5 text-sm text-gray-300"
                                  >
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>{desc}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>

                            {/* Technologies */}
                            <div className="mb-6">
                              <h4 className="text-base font-semibold text-white mb-3 text-center lg:text-left">
                                Technologies & Tools
                              </h4>
                              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {exp.technologiesUsed?.map((tech, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg text-xs text-gray-300 border border-gray-700 hover:border-emerald-500/50 transition-all cursor-pointer"
                                  >
                                    {tech}
                                  </motion.span>
                                ))}
                              </div>
                            </div>

                            {/* Key Responsibilities */}
                            <div className="mb-6">
                              <h4 className="text-base font-semibold text-white mb-3 text-center lg:text-left">
                                Key Skills Developed
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {exp.keyResponsibilities?.map((resp, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700"
                                  >
                                    <p className="text-gray-300 text-sm">{resp}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* Company info */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-900/20 to-violet-900/20 rounded-lg">
                              <div className="text-center sm:text-left">
                                <p className="text-xs text-gray-400">Company Address</p>
                                <p className="text-sm text-gray-300">{exp.companyAddress}</p>
                              </div>
                              {exp.companyWebsite && (
                                <motion.a
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  href={exp.companyWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-lg text-white text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                                >
                                  <Globe className="w-4 h-4" />
                                  Visit Website
                                  <ExternalLink className="w-4 h-4" />
                                </motion.a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>

                {/* Date indicator */}
                <div className={`hidden lg:block lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-10' : 'lg:pr-10 lg:text-right'
                  }`}>
                  <motion.div
                    animate={hoveredCard === exp._id ? { scale: 1.08 } : { scale: 1 }}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 rounded-full border border-emerald-500/30"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-base font-bold text-white">
                      {exp.experienceDuration.split('(')[0].trim()}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Particle effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -800],
              x: [0, Math.sin(i) * 80],
              opacity: [0, 0.5, 0],
              transition: {
                duration: 10 + Math.random() * 8,
                delay: Math.random() * 4,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            className={`absolute w-0.5 h-0.5 rounded-full ${i % 3 === 0 ? 'bg-emerald-400' :
              i % 3 === 1 ? 'bg-violet-400' : 'bg-rose-400'
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;