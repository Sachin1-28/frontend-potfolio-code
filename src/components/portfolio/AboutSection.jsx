import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Code, Palette, Rocket, Heart, Shield, Cpu, Sparkles, Zap, Target, Users, Cloud, Code2, ChevronRight, GraduationCap, BookOpen, Award, Calendar } from "lucide-react";
import { fetchAbout } from '../../store/slices/aboutSlice';
import { motion } from "framer-motion";
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

  // Memoize cards data
  const cards = useMemo(() => [
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
  ], []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="relative">
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-transparent"
            animate={{
              rotate: 360,
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
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/30 backdrop-blur-xl max-w-xs sm:max-w-md mx-4"
        >
          <div className="text-red-400 text-3xl sm:text-4xl mb-3 sm:mb-4">⚠️</div>
          <p className="text-lg sm:text-xl font-bold text-red-300">Error loading data</p>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Please try refreshing the page</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 font-serif">
      {/* Background Elements - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs - reduced animation */}
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl sm:blur-2xl lg:blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 rounded-full bg-gradient-to-r from-pink-500/10 to-yellow-500/10 blur-xl sm:blur-2xl lg:blur-3xl" />

        {/* Simplified mouse trail */}
        <motion.div
          className="absolute w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-xl lg:blur-2xl"
          animate={{
            x: mousePosition.x - 64,
            y: mousePosition.y - 64
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Header - Optimized but same design */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative"
        >
          {/* Simplified orbital rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border border-cyan-500/10" />
            <div className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full border border-purple-500/10" />
          </div>

          {/* Main Header Container */}
          <div className="relative z-10 inline-block">
            <motion.div
              className="relative px-8 py-6 md:px-12 md:py-8 rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setIsHoveringHeader(true)}
              onMouseLeave={() => setIsHoveringHeader(false)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border border-cyan-500/30 group-hover:border-cyan-500/50 transition-all duration-300" />

              {/* Main Content */}
              <div className="relative flex flex-col items-center">
                {/* Top Icon Row */}
                <div className="flex gap-4 mb-4">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  <Code2 className="w-6 h-6 md:w-8 md:h-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Title */}
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    About
                  </span>
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Me
                  </span>
                </div>

                {/* Subtitle */}
                <div className="flex items-center gap-2 md:gap-3 mt-4">
                  <Rocket className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  <p className="text-sm md:text-base lg:text-lg text-gray-300 font-medium">
                    Crafting digital excellence • Innovative solutions
                  </p>
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                </div>

                {/* Animated Bottom Border */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent group-hover:via-purple-500 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid - Same layout */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
          {/* Left Column - Dynamic Content */}
          <div className="space-y-4 sm:space-y-6">
            {about?.description?.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Background Shapes - Outer lines kept as requested */}
                <div className="absolute -inset-1 sm:-inset-2 opacity-20 sm:opacity-30">
                  <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-purple-500/50 rounded-br-lg" />
                  <div className="absolute top-1/2 -left-0.5 sm:-left-1 w-0.5 h-6 sm:h-8 bg-gradient-to-b from-cyan-500/30 to-purple-500/30 rounded-full" />
                </div>

                {/* Content Card */}
                <div className="relative p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all font-sans duration-300">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1 group-hover:rotate-90 transition-transform duration-300">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                    </div>
                    <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                      {paragraph}
                    </p>
                  </div>

                  {/* Static line - removed animation for performance */}
                  <div className="h-0.5 sm:h-1 rounded-full mt-2 sm:mt-3 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 group-hover:from-cyan-500/50 group-hover:via-purple-500/50 group-hover:to-cyan-500/50 transition-all duration-300" />

                  {/* Sparkle icon on hover */}
                  <div className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Education Card - Optimized but same design */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative group"
              onMouseEnter={() => setIsHoveringEducation(true)}
              onMouseLeave={() => setIsHoveringEducation(false)}
            >
              {/* Main Card */}
              <div className="relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-cyan-900/40 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <GraduationCap className="relative w-8 h-8 sm:w-10 sm:h-10 text-emerald-300 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      Education
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                    </h3>
                    <p className="text-emerald-300/80 text-xs sm:text-sm">Academic Background</p>
                  </div>
                </div>

                {/* Degree Details */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Degree Row */}
                  <div className="flex items-start gap-3 group/degree hover:translate-x-1 transition-transform duration-300">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-1 group-hover/degree:rotate-12 transition-transform duration-300" />
                    <div>
                      <h4 className="text-white font-semibold text-sm sm:text-base">B.Tech - Computer Science and Business Systems</h4>
                      <p className="text-emerald-200/70 text-xs sm:text-sm mt-1">Knowledge Institute of Technology</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-emerald-500/20">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400/70" />
                    <span className="text-emerald-300/60 text-xs sm:text-sm">2020 - 2024</span>
                  </div>
                </div>

                {/* Static Progress Line */}
                <div className="h-1 rounded-full mt-4 sm:mt-5 overflow-hidden bg-emerald-900/30">
                  <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column - Cards Grid - Optimized animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
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
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                  }}
                  onHoverStart={() => setActiveCard(index)}
                  onHoverEnd={() => setActiveCard(null)}
                  transition={{ delay: card.delay, type: "spring", stiffness: 300 }}
                  className={`relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl backdrop-blur-lg sm:backdrop-blur-xl border transition-all duration-300 
                    bg-gradient-to-br ${baseColors[index]} ${borderColors[index]} hover:${hoverColors[index]} hover:border-opacity-50`}
                >
                  {/* Card Background Gradient */}
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl -z-10 bg-gradient-to-br ${baseColors[index]} transition-all duration-300`} />

                  {/* Animated Icon */}
                  <div className="relative mb-3 sm:mb-4">
                    <div className={`absolute inset-0 blur-lg sm:blur-xl rounded-full transition-all duration-300 
                      ${activeCard === index ? 'opacity-100' : 'opacity-50'}`} />
                    <card.icon className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${iconColors[index]} transition-all duration-300
                      ${activeCard === index ? 'scale-110' : 'scale-100'}`} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {card.description}
                  </p>

                  {/* Static underline */}
                  <div className={`h-0.5 mt-2 sm:mt-3 md:mt-4 bg-gradient-to-r ${activeCard === index ? 'from-cyan-500 to-blue-500' : 'from-cyan-500/30 to-blue-500/30'} transition-all duration-300`} />
                </motion.div>
              );
            })}
             <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-cyan-400">
                  {totalProjects}+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Projects Completed</div>
                <div className="h-0.5 sm:h-1 rounded-full mt-1 sm:mt-2 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 group-hover:from-cyan-500/50 group-hover:to-blue-500/50 transition-all duration-300" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-purple-400">
                  {skills.length}+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Skills Expertise</div>
                <div className="h-0.5 sm:h-1 rounded-full mt-1 sm:mt-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 group-hover:from-purple-500/50 group-hover:to-pink-500/50 transition-all duration-300" />
              </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;