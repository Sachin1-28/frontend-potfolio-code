import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  ExternalLink,
  Github,
  Rocket,
  Code2,
  Server,
  Palette,
  Calendar,
  Users,
  Layers,
  Cpu,
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Award,
  Target,
  Zap,
  Globe,
  TrendingUp
} from "lucide-react";
import { fetchProjects } from "../../store/slices/projectsSlice";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useOptimizedThreeScene = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    mountedRef.current = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    let lastTime = 0;
    const throttle = 1000 / 30;

    const animate = (t) => {
      if (!mountedRef.current) return;
      rafRef.current = requestAnimationFrame(animate);
      if (pausedRef.current) return;
      if (t - lastTime < throttle) return;
      lastTime = t;

      mesh.rotation.x += 0.0015;
      mesh.rotation.y += 0.0022;

      renderer.render(scene, camera);
    };

    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      try {
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      } catch (err) { }
    };
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  return { canvasRef, pause, resume };
};

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const { projects = [], loading } = useSelector((s) => s.projects || {});
  const { canvasRef, pause, resume } = useOptimizedThreeScene();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusedElement = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const openModal = useCallback((project) => {
    lastFocusedElement.current = document.activeElement;
    pause();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
    }
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    setSelectedProject(project);
    setIsModalOpen(true);
    setTimeout(() => {
      if (firstFocusableRef.current) firstFocusableRef.current.focus();
    }, 60);
  }, [canvasRef, pause]);

  const closeModal = useCallback(() => {
    resume();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.opacity = "0.5";
      canvas.style.pointerEvents = "none";
    }
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 260);
    setTimeout(() => {
      lastFocusedElement.current?.focus?.();
    }, 120);
  }, [canvasRef, resume]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusables = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, closeModal]);

  const getRoleIcon = (role) => {
    const k = (role || "").toLowerCase();
    if (k.includes("full stack")) return <Layers className="w-4 h-4" />;
    if (k.includes("backend")) return <Server className="w-4 h-4" />;
    if (k.includes("frontend")) return <Palette className="w-4 h-4" />;
    return <Code2 className="w-4 h-4" />;
  };

  // Calculate stats
  const totalProjects = projects.length;
  const totalTechnologies = new Set(projects.flatMap(p => p.projectTechStack || [])).size;
  const totalClients = new Set(projects.map(p => p.projectClient)).size;
  const totalFeatures = projects.reduce((acc, p) => acc + (p.projectFeatures?.length || 0), 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none opacity-50 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/8 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Enhanced Header */}
        <motion.header
          ref={headerRef}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-4 sm:pt-6 md:pt-8 mb-8 sm:mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center">
              {/* Animated Title with Icons */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap"
              >
                <div className="relative p-2 sm:p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-lg border border-emerald-400/20">
                  <Rocket className="w-6 h-6 sm:w-9 sm:h-9 text-emerald-300" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-2xl blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-balance max-w-full">
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
                    Featured Projects
                  </span>
                </h1>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="hidden sm:block"
                >
                  <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 text-cyan-300" />
                </motion.div>
              </motion.div>

              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mb-6 sm:mb-8 leading-relaxed px-4">
                Crafting innovative digital solutions with cutting-edge technology and modern design patterns
              </p>

              {/* Enhanced Stats Cards */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-4xl mb-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-br from-emerald-600/10 to-emerald-600/20 rounded-xl backdrop-blur-sm border border-emerald-600/30 group cursor-pointer flex-1 min-w-[150px] max-w-[200px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-emerald-600/20">
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                      {totalProjects}
                    </motion.span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">Projects</div>
                  <div className="h-1 bg-emerald-600/30 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-br from-cyan-600/10 to-cyan-600/20 rounded-xl backdrop-blur-sm border border-cyan-600/30 group cursor-pointer flex-1 min-w-[150px] max-w-[200px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-cyan-600/20">
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                    >
                      {totalTechnologies}+
                    </motion.span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">Technologies</div>
                  <div className="h-1 bg-cyan-600/30 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-br from-amber-600/10 to-amber-600/20 rounded-xl backdrop-blur-sm border border-amber-600/30 group cursor-pointer flex-1 min-w-[150px] max-w-[200px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-amber-600/20">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
                    >
                      {totalClients}
                    </motion.span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">Clients</div>
                  <div className="h-1 bg-amber-600/30 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-br from-violet-600/10 to-violet-600/20 rounded-xl backdrop-blur-sm border border-violet-600/30 group cursor-pointer flex-1 min-w-[150px] max-w-[200px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-violet-600/20">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent"
                    >
                      {totalFeatures}+
                    </motion.span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">Features</div>
                  <div className="h-1 bg-violet-600/30 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Responsive Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={project._id || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -8 }}
              className="group relative transform-gpu"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-2xl blur-md group-hover:opacity-80 transition-opacity duration-400" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-slate-700/60 h-full flex flex-col">
                {project.projectImage && (
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={project.projectImage}
                      alt={project.projectName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <div className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-black shadow-lg border-2 border-emerald-600">
                        {project.projectClient}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      {project.GithubLink && (
                        <a href={project.GithubLink} target="_blank" rel="noreferrer" className="p-2 bg-slate-900/90 rounded-lg hover:bg-emerald-600 transition-colors shadow">
                          <Github className="w-4 h-4 text-white" />
                        </a>
                      )}
                      {project.projectLink && (
                        <a href={project.projectLink} target="_blank" rel="noreferrer" className="p-2 bg-slate-900/90 rounded-lg hover:bg-cyan-600 transition-colors shadow">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/10 to-cyan-500/10 border border-emerald-600/20">
                      {getRoleIcon(project.projectRole)}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 flex-1">
                      {project.projectName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{project.projectDuration}</span>
                    </div>
                    <span className="text-gray-600 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="line-clamp-1">{project.projectRole}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {project.projectDescription?.[0]}
                  </p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.projectTechStack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2.5 py-1 bg-slate-800/60 rounded-md text-xs text-emerald-400 font-semibold border border-slate-700">
                          {tech}
                        </span>
                      ))}
                      {project.projectTechStack?.length > 3 && (
                        <span className="px-2.5 py-1 bg-slate-800/60 rounded-md text-xs text-gray-500 font-medium border border-slate-700">
                          +{project.projectTechStack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openModal(project)}
                    className="mt-auto w-full py-2.5 cursor-pointer bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-xl font-semibold text-white text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform duration-200 transform-gpu hover:scale-[1.02] active:scale-95"
                  >
                    <span>Explore Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Improved Responsive Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
            aria-modal="true"
            role="dialog"
            onClick={closeModal}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(6, 8, 12, 0.72)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              className="relative w-full max-w-2xl md:max-w-4xl lg:max-w-5xl h-[90vh] sm:h-[90vh] md:h-[90vh] rounded-xl sm:rounded-2xl overflow-hidden transform-gpu bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50"
              style={{
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Mobile-optimized header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-600/20">
                      {getRoleIcon(selectedProject.projectRole)}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white truncate">
                      {selectedProject.projectName}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-300 text-xs font-bold border border-emerald-600/30">
                      {selectedProject.projectClient}
                    </span>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedProject.projectDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {selectedProject.GithubLink && (
                    <a
                      href={selectedProject.GithubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-slate-800 hover:bg-emerald-600 transition-colors rounded-lg text-xs sm:text-sm flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span className="hidden sm:inline">Code</span>
                    </a>
                  )}
                  {selectedProject.projectLink && (
                    <a
                      href={selectedProject.projectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-slate-800 hover:bg-cyan-600 transition-colors rounded-lg text-xs sm:text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Live</span>
                    </a>
                  )}
                  <button
                    ref={firstFocusableRef}
                    onClick={closeModal}
                    className="p-2 bg-slate-800 hover:bg-red-600 transition-colors cursor-pointer rounded-full"
                    aria-label="Close project details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="h-[calc(100%-120px)] modal-scroll-area overflow-y-auto">
                <div className="p-4 sm:p-6 md:p-8 space-y-6 mb-8 md:mb-0">
                  {/* Project Image - Responsive */}
                  {selectedProject.projectImage && (
                    <div className="rounded-xl overflow-hidden border border-slate-700/30 bg-black/10">
                      <img
                        src={selectedProject.projectImage}
                        alt={selectedProject.projectName}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Main Content - Responsive Layout */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-4">Project Overview</h4>
                      <div className="space-y-3 text-gray-300 text-sm sm:text-base">
                        {selectedProject.projectDescription?.map((d, i) => (
                          <p key={i} className="leading-relaxed">{d}</p>
                        ))}
                      </div>

                      {/* Features - Better spacing */}
                      <div className="mt-6">
                        <h4 className="text-lg font-bold text-white mb-4">Key Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedProject.projectFeatures?.map((f, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                              <div className="p-1.5 rounded bg-emerald-600/10 border border-emerald-600/20 flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              </div>
                              <div className="text-sm text-gray-300">{f}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar - Stacked on mobile */}
                    <div className="lg:w-72 flex-shrink-0">
                      <div className="space-y-4">
                        {/* Technologies */}
                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/40">
                          <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-cyan-300" />
                            Technologies Used
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.projectTechStack?.map((t) => (
                              <span
                                key={t}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-emerald-300 border border-slate-700"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Role */}
                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/40">
                          <h5 className="text-sm font-semibold text-white mb-2">Role</h5>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-cyan-300" />
                            <div className="text-sm text-gray-300">{selectedProject.projectRole}</div>
                          </div>
                        </div>

                        {/* Audience */}
                        {selectedProject.targetAudience?.length > 0 && (
                          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/40">
                            <h5 className="text-sm font-semibold text-white mb-2">Target Audience</h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.targetAudience.map((audience, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded bg-slate-800 text-xs text-amber-300 border border-slate-700"
                                >
                                  {audience}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons - Responsive */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-700/30">
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.projectLink && (
                        <a
                          href={selectedProject.projectLink}
                          className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 flex-1 sm:flex-none"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span><ExternalLink className="w-4 h-4" /></span>
                          Visit Live Project
                        </a>
                      )}
                      {selectedProject.GithubLink && (
                        <a
                          href={selectedProject.GithubLink}
                          className="px-5 py-3 rounded-lg bg-slate-800 text-gray-200 border border-slate-700 hover:border-slate-600 transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 flex-1 sm:flex-none"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span> <Github className="w-4 h-4" /></span>
                          View Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default ProjectsSection;