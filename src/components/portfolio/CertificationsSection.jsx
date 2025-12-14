import React, { useEffect, useRef, useState } from "react";
import {
  Award, ExternalLink, Calendar, Clock, BookOpen,
  Sparkles, Target, ChevronRight, Layers,
  Cpu, Globe, Code, Database, Cloud, Shield,
  TrendingUp, Brain
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCertifications, clearError } from "../../store/slices/certificationsSlice";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

// Color constants for consistent theme
const COLORS = {
  primary: "#3B82F6", // Royal blue
  secondary: "#10B981", // Emerald
  accent: "#8B5CF6", // Violet
  darkBg: "#0F172A", // Dark slate
  cardBg: "#1E293B", // Slate 800
  lightBg: "#334155", // Slate 700
  text: "#F1F5F9", // Slate 100
  mutedText: "#94A3B8", // Slate 400
  gradient1: "from-[#3B82F6] via-[#10B981] to-[#8B5CF6]",
  gradient2: "from-[#0F172A] via-[#1E293B] to-[#0F172A]",
  gradient3: "from-[#3B82F6] to-[#10B981]",
  gradient4: "from-[#8B5CF6] to-[#3B82F6]",
};

// ==========================
// 3D Starfield Background with updated colors
// ==========================
function StarField() {
  const pointsRef = useRef();
  const materialRef = useRef();

  const [points] = useState(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    }
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        ref={materialRef}
        transparent
        color="#3B82F6"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

// ==========================
// Floating Icons Component
// ==========================
const FloatingIcons = () => {
  const icons = [Cpu, Globe, Code, Database, Cloud, Shield];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((Icon, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            rotate: 360,
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 20 + idx * 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            opacity: 0.08,
            filter: 'blur(1px)'
          }}
        >
          <Icon className="w-8 h-8 text-[#3B82F6]" />
        </motion.div>
      ))}
    </div>
  );
};

// ==========================
// Main Component
// ==========================
const CertificationsSection = () => {
  const dispatch = useDispatch();
  const { certifications, loading, error } = useSelector((state) => state.certifications);
  const [selectedCert, setSelectedCert] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const containerRef = useRef();
  const headerRef = useRef();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Dynamic card columns based on screen size
  const [columns, setColumns] = useState(3);
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    dispatch(fetchCertifications());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  // Get unique providers for filtering
  const providers = [...new Set(certifications?.map(cert => cert.courseProvider))];

  // Loading Animation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] justify-center px-4">
        <div className="text-center">
          {isClient && (
            <Canvas className="absolute inset-0">
              <StarField />
            </Canvas>
          )}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 mb-8"
              >
                <div className="absolute inset-0 border-4 border-transparent rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #3B82F6, #10B981, #8B5CF6, #3B82F6)',
                    mask: 'radial-gradient(circle, transparent 50%, black 51%)',
                    WebkitMask: 'radial-gradient(circle, transparent 50%, black 51%)'
                  }}
                />
                <Award className="absolute inset-0 m-auto w-16 h-16 text-white" />
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-1 bg-gradient-to-r from-[#3B82F6] via-[#10B981] to-[#8B5CF6] rounded-full"
              />

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 text-[#94A3B8] text-lg"
              >
                Loading Certifications...
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative">
        {isClient && (
          <Canvas className="absolute inset-0">
            <StarField />
          </Canvas>
        )}

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-center p-8 bg-[#1E293B]/90 backdrop-blur-xl rounded-3xl border border-red-500/30"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h3>
          <p className="text-[#94A3B8] mb-8 max-w-md">{error}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(clearError())}
            className="px-8 py-3 bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#10B981] rounded-full text-white font-bold text-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Try Again
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#10B981] via-[#3B82F6] to-[#8B5CF6]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-[#F1F5F9] relative overflow-hidden"
    >
      {/* 3D Starfield Background */}
      {isClient && (
        <div className="fixed inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <StarField />
          </Canvas>
        </div>
      )}

      {/* Floating Icons */}
      <FloatingIcons />

      {/* Animated Gradient Orbs */}
      <motion.div
        style={{ y: y1 }}
        className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-[#3B82F6]/10 via-[#10B981]/10 to-[#8B5CF6]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#8B5CF6]/10 via-[#3B82F6]/10 to-[#10B981]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Compact Header Section */}
        <motion.header
          ref={headerRef}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center">
              {/* Title with Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center gap-3 mb-4 sm:mb-6"
              >
                <div className="relative p-3 bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 rounded-2xl backdrop-blur-lg border border-white/10">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/30 to-[#8B5CF6]/30 rounded-2xl blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  <span className={`bg-gradient-to-r from-[#00D4FF] via-[#9D4EDD] to-[#FF2E63] bg-clip-text text-transparent`}>
                    Certifications
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <p className="text-[#94A3B8] text-sm sm:text-base md:text-lg max-w-2xl mb-6 sm:mb-8 leading-relaxed">
                Professional credentials and achievements across modern technologies
              </p>

              {/* Compact Stats */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-2xl">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 rounded-xl backdrop-blur-sm border border-[#3B82F6]/30"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6]" />
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {certifications?.length || 0}
                    </span>
                    <span className="text-[#94A3B8] text-sm">Certificates</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 rounded-xl backdrop-blur-sm border border-[#8B5CF6]/30"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {new Set(certifications?.map(c => c.courseProvider)).size || 0}
                    </span>
                    <span className="text-[#94A3B8] text-sm">Providers</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 rounded-xl backdrop-blur-sm border border-[#10B981]/30"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {certifications?.reduce((acc, cert) => acc + (cert.keyLearnings?.length || 0), 0) || 0}
                    </span>
                    <span className="text-[#94A3B8] text-sm">Skills Gained</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Grid */}
        <main className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Certifications Grid */}
            <div className={`grid gap-4 sm:gap-6 ${columns === 1 ? 'grid-cols-1' :
              columns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
              {certifications?.map((cert, index) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={() => setSelectedCert(cert)}
                  className="group relative cursor-pointer"
                  style={{
                    height: '100%',
                    minHeight: '320px'
                  }}
                >
                  {/* Card Container */}
                  <div className="h-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] backdrop-blur-xl rounded-2xl border border-[#334155] overflow-hidden relative group hover:border-[#3B82F6]/50 transition-all duration-300">
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'conic-gradient(from 0deg, #00D4FF, #9D4EDD, #FF2E63, #00D4FF)',
                        padding: '2px',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }}
                      animate={{ rotate: hoveredCard === index ? 360 : 0 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Card Content */}
                    <div className="relative h-full p-4 sm:p-6 flex flex-col z-10">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <motion.div
                          whileHover={{ rotate: 15 }}
                          className="p-2 sm:p-3 bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 rounded-2xl backdrop-blur-sm"
                        >
                          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </motion.div>

                        <div className="flex flex-col items-end gap-1 sm:gap-2">
                          <span className="text-xs text-[#94A3B8] bg-[#0F172A] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#3B82F6]/30 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(cert.courseCompletedDate)}
                          </span>
                          <span className="text-xs text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#3B82F6]/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {cert.courseDuration}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 line-clamp-2">
                        <span className="bg-gradient-to-r from-white to-[#CBD5E1] bg-clip-text text-transparent">
                          {cert.courseName}
                        </span>
                      </h3>

                      {/* Provider */}
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <span className="text-[#8B5CF6] font-semibold text-sm">
                          {cert.courseProvider}
                        </span>
                        <span className="text-xs bg-gradient-to-r from-[#8B5CF6]/20 to-[#10B981]/20 text-[#8B5CF6] px-2 py-1 rounded-full">
                          {cert.courseMode}
                        </span>
                      </div>

                      {/* Preview */}
                      {cert.keyLearnings && cert.keyLearnings[0] && (
                        <div className="mb-4 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                            <span className="text-sm text-[#94A3B8]">Key Learning</span>
                          </div>
                          <p className="text-sm text-[#CBD5E1] line-clamp-2">
                            {cert.keyLearnings[0]}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-3 sm:pt-4 border-t border-[#334155]">
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center gap-1 sm:gap-2 text-[#3B82F6] text-sm font-semibold"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Effects */}
                    {hoveredCard === index && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-t from-[#3B82F6]/10 via-transparent to-[#10B981]/10"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -inset-3 bg-gradient-to-r from-[#3B82F6]/20 via-[#8B5CF6]/20 to-[#10B981]/20 blur-xl"
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {(!certifications || certifications.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 sm:py-24"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
                  <Brain className="w-full h-full text-[#475569]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#64748B] mb-3">
                  No Certifications Yet
                </h3>
                <p className="text-[#64748B] max-w-md mx-auto text-lg">
                  Start your learning journey and earn your first certification!
                </p>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A]/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/95 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#3B82F6]/20 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Fixed Close Button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8 relative">
                <div className="flex-1 pr-10 sm:pr-0">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] via-[#10B981] to-[#8B5CF6] bg-clip-text text-transparent mb-2">
                    {selectedCert.courseName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 text-[#8B5CF6]">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold">{selectedCert.courseProvider}</span>
                    </div>
                    <span className="text-[#64748B] hidden sm:inline">•</span>
                    <span className="text-[#3B82F6]">{selectedCert.courseMode}</span>
                    <span className="text-[#64748B] hidden sm:inline">•</span>
                    <span className="text-[#10B981]">{selectedCert.courseDuration}</span>
                  </div>
                </div>

                {/* Close Button - Fixed for Mobile */}
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto p-2 bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/30 hover:from-[#EF4444]/30 hover:to-[#DC2626]/40 rounded-full transition-all backdrop-blur-sm cursor-pointer border border-[#EF4444]/30"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                      className="text-white"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Key Learnings */}
              {selectedCert.keyLearnings && selectedCert.keyLearnings.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6]" />
                    <span className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] bg-clip-text text-transparent">
                      Key Learnings
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {selectedCert.keyLearnings.map((learning, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-[#3B82F6]/10 to-[#10B981]/10 p-3 sm:p-4 rounded-2xl border border-[#3B82F6]/20"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 flex-shrink-0" />
                          <span className="text-[#CBD5E1] text-sm sm:text-base">{learning}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate Link */}
              {selectedCert.certificatePdf && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 sm:mt-8"
                >
                  <a
                    href={selectedCert.certificatePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#3B82F6] via-[#10B981] to-[#8B5CF6] hover:from-[#8B5CF6] hover:via-[#10B981] hover:to-[#3B82F6] rounded-full text-white font-bold text-base sm:text-lg relative overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#8B5CF6]/20"
                  >
                    <span className="relative z-10">View Full Certificate</span>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:scale-110 transition-transform" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#10B981] to-[#3B82F6]"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </a>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Required Installations */}
      <div className="hidden">
        {/* Required Dependencies:
        npm install framer-motion @react-three/fiber @react-three/drei three
        */}
      </div>
    </div>
  );
};

export default CertificationsSection;

<style jsx>{`
  /* Responsive utilities */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Custom scrollbar with updated colors */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.5);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3B82F6, #10B981, #8B5CF6);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #8B5CF6, #3B82F6, #10B981);
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Performance optimizations */
  .will-change-transform {
    will-change: transform;
  }

  .backface-hidden {
    backface-visibility: hidden;
  }

  /* Responsive font sizes */
  @media (max-width: 640px) {
    .text-responsive-title {
      font-size: 2rem;
    }
    .text-responsive-body {
      font-size: 0.875rem;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .text-responsive-title {
      font-size: 2.5rem;
    }
  }
`}</style>