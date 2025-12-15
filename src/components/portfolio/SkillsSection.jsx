import React, { useEffect, useState, useMemo, memo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills, clearError } from "../../store/slices/skillsSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Type, Server, Layers,
  Palette, FileCode, Database,
  Cloud, Layout, Wrench, Hexagon, AlertTriangle,
  RefreshCw, Sparkles, ChevronUp, ChevronDown, Search, Tag
} from "lucide-react";

// Icon mapping with direct imports
const iconMap = {
  javascript: Code2,
  typescript: Type,
  frontend: Layout,
  backend: Server,
  styling: Palette,
  tools: Wrench,
  database: Database,
  cloud: Cloud,
  uncategorized: Hexagon,
};


// Advanced color themes with geometric patterns
const colorThemes = [
  {
    name: "neon-cyber",
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
    glow: "shadow-cyan-500/40",
    border: "border-cyan-400/40",
    bg: "bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-purple-500/5",
    icon: "text-cyan-300",
    badge: "bg-cyan-500/25 text-cyan-200 border-cyan-400/40",
    shape: "triangle",
    pattern: "grid"
  },
  {
    name: "cosmic-purple",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
    glow: "shadow-purple-500/40",
    border: "border-purple-400/40",
    bg: "bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-fuchsia-500/5",
    icon: "text-purple-300",
    badge: "bg-purple-500/25 text-purple-200 border-purple-400/40",
    shape: "hexagon",
    pattern: "dots"
  },
  {
    name: "quantum-emerald",
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    glow: "shadow-emerald-500/40",
    border: "border-emerald-400/40",
    bg: "bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-teal-500/5",
    icon: "text-emerald-300",
    badge: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
    shape: "circle",
    pattern: "lines"
  },
  {
    name: "solar-flare",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "shadow-amber-500/40",
    border: "border-amber-400/40",
    bg: "bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-red-500/5",
    icon: "text-amber-300",
    badge: "bg-amber-500/25 text-amber-200 border-amber-400/40",
    shape: "diamond",
    pattern: "waves"
  },
  {
    name: "arctic-aurora",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    glow: "shadow-sky-500/40",
    border: "border-sky-400/40",
    bg: "bg-gradient-to-br from-sky-500/15 via-blue-500/10 to-indigo-500/5",
    icon: "text-sky-300",
    badge: "bg-sky-500/25 text-sky-200 border-sky-400/40",
    shape: "star",
    pattern: "circuit"
  },
  {
    name: "nebula-rose",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    glow: "shadow-rose-500/40",
    border: "border-rose-400/40",
    bg: "bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-fuchsia-500/5",
    icon: "text-rose-300",
    badge: "bg-rose-500/25 text-rose-200 border-rose-400/40",
    shape: "wave",
    pattern: "hexagons"
  }
];

// Function to generate random color theme
const generateRandomTheme = () => {
  return colorThemes[Math.floor(Math.random() * colorThemes.length)];
};

// Category themes
const categoryConfig = {
  frontend: colorThemes[0],
  backend: colorThemes[1],
  styling: colorThemes[2],
  database: colorThemes[3],
  cloud: colorThemes[4],
  tools: colorThemes[5],
  default: generateRandomTheme(),
};

// Geometric Shape Component
const GeometricShape = memo(({ type, theme, isHovered }) => {
  const shapes = {
    triangle: (
      <motion.div
        animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-24 h-24 opacity-5"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: `linear-gradient(${theme.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`,
        }}
      />
    ),
    hexagon: (
      <motion.div
        animate={isHovered ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-20 h-24 opacity-10"
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          background: `linear-gradient(${theme.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`,
        }}
      />
    ),
    diamond: (
      <motion.div
        animate={isHovered ? { rotate: [0, 45, 0] } : { rotate: 45 }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-16 h-16 opacity-10"
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          background: `linear-gradient(${theme.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`,
        }}
      />
    ),
    star: (
      <motion.div
        animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-20 h-20 opacity-10"
        style={{
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          background: `linear-gradient(${theme.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`,
        }}
      />
    ),
    circle: (
      <motion.div
        animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-20 h-20 rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, ${theme.gradient.replace('from-', '').replace('via-', '').replace('to-', '').replace('to-', 'transparent')})`,
        }}
      />
    ),
    wave: (
      <motion.div
        animate={isHovered ? { x: [-20, 20, -20] } : { x: 0 }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-32 h-16 opacity-10"
        style={{
          clipPath: "path('M0,32 Q20,0 40,32 T80,32 T120,32 T160,32 T200,32 T240,32 T280,32 T320,32 L320,64 L0,64 Z')",
          background: `linear-gradient(${theme.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`,
        }}
      />
    ),
  };

  return shapes[type] || shapes.circle;
});

GeometricShape.displayName = 'GeometricShape';

// Background Pattern Component
const BackgroundPattern = memo(({ type, theme }) => {
  const patterns = {
    grid: (
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${theme.border.replace('border-', '').replace('/40', '')} 1px, transparent 1px),
                           linear-gradient(90deg, ${theme.border.replace('border-', '').replace('/40', '')} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
    ),
    dots: (
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(${theme.border.replace('border-', '').replace('/40', '')} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
    ),
    lines: (
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${theme.border.replace('border-', '').replace('/40', '')} 10px, ${theme.border.replace('border-', '').replace('/40', '')} 20px)`,
        }}
      />
    ),
    waves: (
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${theme.border.replace('border-', '').replace('/40', '')} 10px, transparent 20px)`,
        }}
      />
    ),
    circuit: (
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(90deg, ${theme.border.replace('border-', '').replace('/40', '')} 1px, transparent 1px),
                           linear-gradient(${theme.border.replace('border-', '').replace('/40', '')} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    ),
    hexagons: (
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 15v30l-30 15L0 45V15z' fill='none' stroke='%23${theme.border.includes('cyan') ? '06b6d4' : theme.border.includes('purple') ? 'a855f7' : theme.border.includes('emerald') ? '10b981' : theme.border.includes('amber') ? 'f59e0b' : theme.border.includes('sky') ? '0ea5e9' : 'f43f5e'}' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />
    ),
  };

  return patterns[type] || patterns.grid;
});

BackgroundPattern.displayName = 'BackgroundPattern';

// Enhanced Skill Card Component
const SkillCard = memo(({ skill, theme, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const Icon = useMemo(() => {
    const nameKey = (skill.skillName || "").toLowerCase();
    const catKey = (skill.skillCategory || "").toLowerCase();
    return iconMap[nameKey] || iconMap[catKey] || Hexagon;
  }, [skill.skillName, skill.skillCategory]);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  // Generate floating particles
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9, rotateY: 180 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateY: 0,
        rotateX: -mousePosition.y * 0.5,
        rotateZ: mousePosition.x * 0.3,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        rotateY: -180,
        transition: { duration: 0.3 }
      }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
      whileHover={{
        y: -12,
        scale: 1.03,
        zIndex: 50,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="group relative h-full perspective-[1200px]"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Card Container */}
      <div className="relative h-full rounded-3xl overflow-hidden transition-all duration-500 transform-gpu">
        {/* Background Layers */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />

        {/* Background Pattern */}
        <BackgroundPattern type={theme.pattern} theme={theme} />

        {/* Animated Gradient Border */}
        <motion.div
          className="absolute inset-0 rounded-3xl p-[2px]"
          animate={isHovered ? {
            background: [
              `linear-gradient(45deg, transparent 40%, ${theme.border.replace('border-', '').replace('/40', '')} 50%, transparent 60%)`,
              `linear-gradient(135deg, transparent 40%, ${theme.border.replace('border-', '').replace('/40', '')} 50%, transparent 60%)`,
              `linear-gradient(225deg, transparent 40%, ${theme.border.replace('border-', '').replace('/40', '')} 50%, transparent 60%)`,
              `linear-gradient(315deg, transparent 40%, ${theme.border.replace('border-', '').replace('/40', '')} 50%, transparent 60%)`,
              `linear-gradient(45deg, transparent 40%, ${theme.border.replace('border-', '').replace('/40', '')} 50%, transparent 60%)`,
            ]
          } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-900 rounded-3xl" />
        </motion.div>

        {/* Floating Particles - Enhanced */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute rounded-full bg-gradient-to-r ${theme.gradient}`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: 0.3,
              }}
              animate={isHovered ? {
                y: [0, -150, 0],
                x: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.8, 0],
                opacity: [0.3, 1, 0],
              } : {}}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Geometric Shapes - Enhanced */}
        <div className="absolute inset-0 overflow-hidden">
          <GeometricShape type={theme.shape} theme={theme} isHovered={isHovered} />
          <motion.div
            className="absolute bottom-4 right-4"
            animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 90, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <GeometricShape type={theme.shape} theme={theme} isHovered={isHovered} />
          </motion.div>
          <motion.div
            className="absolute top-4 left-4"
            animate={isHovered ? { scale: [0.8, 1, 0.8], rotate: [0, -90, 0] } : { scale: 0.8, rotate: 0 }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            <GeometricShape type={theme.shape} theme={theme} isHovered={isHovered} />
          </motion.div>
        </div>

        {/* Inner Glow - Enhanced */}
        <motion.div
          className={`absolute inset-0 rounded-3xl ${theme.glow}`}
          animate={isHovered ? {
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.02, 1]
          } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Hover Overlay Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0`}
          animate={isHovered ? { opacity: 0.03 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card Content */}
        <div className="relative z-10 h-full p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Animated Icon Orb - Enhanced */}
              <motion.div
                animate={isHovered ? {
                  rotate: 360,
                  scale: [1, 1.1, 1],
                  y: [0, -5, 0]
                } : {}}
                transition={{
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                  y: { duration: 2, repeat: Infinity }
                }}
                className="relative"
              >
                {/* Outer ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 ${theme.border}`}
                  animate={isHovered ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  } : { scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Pulse ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full border ${theme.border}`}
                  animate={isHovered ? {
                    scale: [1, 2, 1],
                    opacity: [1, 0, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />

                {/* Icon container */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} shadow-2xl ${theme.glow} flex items-center justify-center`}>
                  <div className="absolute inset-2 rounded-xl bg-slate-900/80 backdrop-blur-sm" />

                  {skill.skillIcon ? (
                    <motion.img
                      src={skill.skillIcon}
                      alt={skill.skillName}
                      className="relative w-6 h-6 object-contain filter brightness-110"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      animate={isHovered ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, 15, -15, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  ) : (
                    <motion.div
                      animate={isHovered ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, 15, -15, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon className="relative w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Title and Category - Enhanced */}
              <div className="overflow-hidden flex-1 min-w-0">
                <motion.h3
                  animate={isHovered ? { x: 8 } : { x: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-white font-bold text-xl mb-2 truncate"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300">
                    {skill.skillName}
                  </span>
                </motion.h3>
                <motion.div
                  animate={isHovered ? { x: 8 } : { x: 0 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className={`text-sm font-semibold ${theme.icon} flex items-center gap-2`}
                >
                  <motion.div
                    animate={isHovered ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}
                  />
                  <span className="truncate">{(skill.skillCategory || 'Uncategorized').toString()}</span>
                </motion.div>
              </div>
            </div>

            {/* Level Badge with Enhanced Animation */}
            {skill.level && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`relative px-4 py-2 rounded-full border backdrop-blur-xl min-w-[60px] ${theme.badge}`}
              >
                <div className="text-xs font-bold text-center">
                  {skill.level}
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: theme.border.replace('border-', '').replace('/40', '') }}
                  animate={isHovered ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            )}
          </div>

          {/* Description - Enhanced */}
          {skill.description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.4 }}
              className="flex-1 mb-6 overflow-hidden"
            >
              <p className="text-gray-300/90 text-sm leading-relaxed line-clamp-3">
                {skill.description}
              </p>
            </motion.div>
          )}

          {/* Tags with Enhanced Floating Animation */}
          {skill.tags && skill.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {skill.tags.slice(0, 4).map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                  whileHover={{
                    scale: 1.1,
                    y: -4,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md ${theme.badge} cursor-default`}
                >
                  {tag}
                </motion.span>
              ))}
              {skill.tags.length > 4 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-800/50 text-gray-400 cursor-default"
                >
                  +{skill.tags.length - 4}
                </motion.span>
              )}
            </motion.div>
          )}

          {/* Bottom Accent Line with Enhanced Animation */}
          <div className="mt-4">
            <motion.div
              className={`h-1 rounded-full bg-gradient-to-r ${theme.gradient}`}
              initial={{ width: "30%" }}
              animate={{ width: isHovered ? "100%" : "30%" }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="h-full rounded-full bg-white/40"
                animate={isHovered ? {
                  x: ['-100%', '100%', '-100%'],
                  width: ['20%', '40%', '20%']
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          {/* Floating Indicator - Enhanced */}
          <motion.div
            className={`absolute -bottom-2 left-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-100`}
            animate={isHovered ? {
              y: [0, -15, 0],
              scale: [1, 0.8, 1],
              rotate: [0, 180, 360]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ x: "-50%" }}
          />
        </div>

        {/* Corner Decorative Elements - Enhanced */}
        <div className="absolute top-0 right-0 w-24 h-24">
          <motion.div
            className={`absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 ${theme.border} rounded-tr-xl`}
            animate={isHovered ? {
              scale: [1, 1.3, 1],
              rotate: [0, 90, 180, 270, 360]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24">
          <motion.div
            className={`absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 ${theme.border} rounded-bl-xl`}
            animate={isHovered ? {
              scale: [1, 1.3, 1],
              rotate: [0, -90, -180, -270, -360]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Edge Glow Effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute inset-0 border-2 ${theme.border} rounded-3xl`}
            animate={isHovered ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
});

SkillCard.displayName = 'SkillCard';

// Show More Button Component
const ShowMoreButton = memo(({ onClick, theme, showLess = false, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: disabled ? 1 : 1.05, y: -4 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={`
        relative px-4 py-2 rounded-2xl font-semibold text-lg
        flex items-center justify-center gap-3 transition-all duration-300
        ${disabled
          ? 'bg-slate-800/30 text-gray-500 cursor-not-allowed border border-slate-700/30'
          : `bg-gradient-to-r ${theme.gradient} text-white border-transparent shadow-xl ${theme.glow} cursor-pointer`
        }
      `}
    >
      {/* Background animation for hover effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={isHovered ? {
            background: [
              `radial-gradient(circle at center, ${theme.border.replace('border-', '').replace('/40', '')} 0%, transparent 70%)`,
              `radial-gradient(circle at center, transparent 0%, ${theme.border.replace('border-', '').replace('/40', '')} 70%, transparent 100%)`,
              `radial-gradient(circle at center, ${theme.border.replace('border-', '').replace('/40', '')} 0%, transparent 70%)`,
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Icon */}
      <motion.div
        animate={isHovered && !disabled ? {
          rotate: 360,
          scale: [1, 1.2, 1]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {showLess ? (
          <ChevronUp className="w-6 h-6" />
        ) : (
          <ChevronDown className="w-6 h-6" />
        )}
      </motion.div>

      {/* Text */}
      <span className="relative z-10">
        {showLess ? 'Show Less' : 'Show More'}
      </span>

      {/* Particles on hover */}
      {!disabled && isHovered && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full bg-gradient-to-r ${theme.gradient}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      )}

      {/* Border animation */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
          style={{ borderColor: theme.border.replace('border-', '').replace('/40', '') }}
          animate={isHovered ? {
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
});

ShowMoreButton.displayName = 'ShowMoreButton';

const SkillsSection = () => {
  const dispatch = useDispatch();
  const { skills = [], loading, error } = useSelector((state) => state.skills);
  const [filter, setFilter] = useState("All");
  const [defaultThemes, setDefaultThemes] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [visibleSkillsCount, setVisibleSkillsCount] = useState(8);

  const skillsSectionRef = useRef(null);
  const skillsGridRef = useRef(null);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleSkillsCount(8);
  }, [filter]);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Generate random themes for skills without specific categories
  useEffect(() => {
    if (skills.length > 0) {
      const themes = {};
      skills.forEach(skill => {
        const categoryKey = (skill.skillCategory || 'uncategorized').toLowerCase();
        if (!categoryConfig[categoryKey]) {
          themes[categoryKey] = themes[categoryKey] || generateRandomTheme();
        }
      });
      setDefaultThemes(themes);
    }
  }, [skills]);

  const categories = useMemo(() => {
    if (!skills || skills.length === 0) return ["All"];
    return [
      "All",
      ...Array.from(new Set(skills.map(s => (s.skillCategory || "Uncategorized").toLowerCase())))
    ];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    const filtered = filter === "All"
      ? skills
      : skills.filter(s => (s.skillCategory || "Uncategorized").toLowerCase() === filter.toLowerCase());

    // Sort by updatedAt in descending order (most recent first)
    return [...filtered].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
      return dateB - dateA; // Most recent first
    });
  }, [skills, filter]);

  const visibleSkills = useMemo(() => {
    return filteredSkills.slice(0, visibleSkillsCount);
  }, [filteredSkills, visibleSkillsCount]);

  const hasMoreSkills = useMemo(() => {
    return visibleSkillsCount < filteredSkills.length;
  }, [visibleSkillsCount, filteredSkills.length]);

  const getTheme = (category) => {
    const key = (category || "").toLowerCase();
    if (categoryConfig[key]) {
      return categoryConfig[key];
    }
    return defaultThemes[key] || generateRandomTheme();
  };

  const handleShowMore = () => {
    const newCount = Math.min(visibleSkillsCount + 8, filteredSkills.length);
    setVisibleSkillsCount(newCount);

    // If we're showing all skills, scroll to top of skills grid
    if (newCount === filteredSkills.length && skillsGridRef.current) {
      setTimeout(() => {
        skillsGridRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const handleShowLess = () => {
    // First scroll to the top of the skills section
    if (skillsSectionRef.current) {
      skillsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // After scrolling is complete, collapse the cards
    setTimeout(() => {
      setVisibleSkillsCount(8);
    }, 500); // Match this with scroll duration
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-12">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-12 w-64 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl mx-auto mb-6"
            />
            <div className="h-4 w-96 mx-auto bg-slate-800/30 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl h-56"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-red-500/20 text-center shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30"
          >
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-3">Oops! Something went wrong</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(fetchSkills())}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/40 to-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
            className={`absolute w-${Math.random() * 20 + 10} h-${Math.random() * 20 + 10} rounded-full blur-2xl opacity-5`}
            style={{
              background: `radial-gradient(circle, ${i % 3 === 0 ? 'cyan' :
                i % 3 === 1 ? 'purple' : 'pink'
                } 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 relative z-10">
        {/* Enhanced Header with Hover Effects */}
        <motion.header

          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-12 relative"
          onMouseEnter={() => setIsHeaderHovered(true)}
          onMouseLeave={() => setIsHeaderHovered(false)}
        >
          {/* Background Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={isHeaderHovered ? {
              background: [
                'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
              ]
            } : {}}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2"
            animate={isHeaderHovered ? {
              borderColor: [
                'rgba(6, 182, 212, 0.2)',
                'rgba(168, 85, 247, 0.2)',
                'rgba(236, 72, 153, 0.2)',
                'rgba(6, 182, 212, 0.2)',
              ],
              scale: [1, 1.02, 1],
            } : {}}
            transition={{
              borderColor: { duration: 3, repeat: Infinity },
              scale: { duration: 2, repeat: Infinity }
            }}
          />

          <div className="relative px-8 py-8 rounded-3xl bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/30">
            {/* Animated Top Badge */}
            <motion.div
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 backdrop-blur-sm mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </motion.div>
              <span className="text-xs font-medium text-gray-300">Tech Arsenal</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-cyan-400"
              />
            </motion.div>

            {/* Main Title with Enhanced Animation */}
            <div className="relative mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2"
              >
                <motion.span
                  animate={isHeaderHovered ? {
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-[length:200%_200%]"
                  style={{ backgroundSize: '200% 200%' }}
                >
                  EXPERTISE SKILLS
                </motion.span>
              </motion.h1>

              {/* Animated Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-md max-w-xl mx-auto"
              >
                Curated collection of mastered technologies & tools
              </motion.p>
            </div>

            {/* Stats Section - Only Total Count and Category Count */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mt-8"
            >
              {/* Total Skills Count */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative px-6 py-4 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 min-w-[200px]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-1">TOTAL SKILLS</div>
                    <div className="text-2xl font-bold text-white">{skills.length}</div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20"
                  >
                    <Layers className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                </div>

                {/* Animated Progress Bar */}
                <div className="mt-3 h-1 rounded-full bg-slate-700/50 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </div>
              </motion.div>

              {/* Total Categories Count */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative px-6 py-4 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 min-w-[200px]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-1">CATEGORIES</div>
                    <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                  >
                    <Tag className="w-6 h-6 text-purple-400" />
                  </motion.div>
                </div>

                {/* Animated Progress Bar */}
                <div className="mt-3 h-1 rounded-full bg-slate-700/50 overflow-hidden">
                  <motion.div
                    ref={skillsSectionRef}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(100, ((categories.length - 1) / 10) * 100)}%` }}
                    transition={{ duration: 2, delay: 0.7 }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Animated Orbs */}
            <div className="absolute top-4 left-4">
              <motion.div
                animate={isHeaderHovered ? {
                  x: [0, 10, 0],
                  y: [0, -10, 0],
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
            <div className="absolute bottom-4 right-4">
              <motion.div
                animate={isHeaderHovered ? {
                  x: [0, -10, 0],
                  y: [0, 10, 0],
                } : {}}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </motion.header>

        {/* Enhanced Filter Buttons */}
        <motion.div

          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((cat, idx) => {
            const theme = getTheme(cat === 'All' ? 'default' : cat);
            const isActive = filter.toLowerCase() === cat.toLowerCase();
            const Icon = iconMap[(cat || '').toLowerCase()] || FileCode;

            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.05, type: "spring" }}
                onClick={() => setFilter(cat)}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  group relative px-5 py-2.5 rounded-xl font-medium text-sm
                  flex items-center gap-2 transition-all cursor-pointer duration-300 border backdrop-blur-xl
                  ${isActive
                    ? `bg-gradient-to-r ${theme.gradient} text-white border-transparent shadow-lg ${theme.glow}`
                    : 'bg-slate-900/30 text-gray-300 border-slate-700/30 hover:border-slate-600/40 hover:bg-slate-800/30'
                  }
                `}
              >
                <motion.div
                  animate={isActive || hoveredCategory === cat ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : theme.icon}`} />
                </motion.div>
                <span className="relative z-10">
                  {cat === 'All' ? 'All Skills' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills Grid with Stagger Animation */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {visibleSkills.length > 0 ? (
              visibleSkills.map((skill, i) => {
                const categoryKey = (skill.skillCategory || 'uncategorized').toLowerCase();
                const theme = getTheme(categoryKey);
                return (
                  <SkillCard
                    key={skill._id || `${skill.skillName}-${i}`}
                    skill={skill}
                    theme={theme}
                    index={i}
                  />
                );
              })
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="col-span-full text-center py-20"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-slate-900/40 rounded-2xl mb-6 border-2 border-slate-700/30"
                >
                  <Search className="w-12 h-12 text-gray-500" />
                </motion.div>
                <h4 className="text-white font-bold text-xl mb-3">No Skills Found</h4>
                <p className="text-gray-400 max-w-md mx-auto">
                  Try selecting a different category to discover more technologies.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Show More/Less Button Section */}
        {filteredSkills.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center gap-4">
              {/* Count indicator */}
              <motion.div
                key={`count-${visibleSkillsCount}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="text-xs text-gray-400 font-medium px-4 py-2 rounded-full bg-slate-900/30 border border-slate-700/30 backdrop-blur-sm"
              >
                Showing {visibleSkills.length} of {filteredSkills.length} skills
              </motion.div>

              {/* Show More/Less Button */}
              {hasMoreSkills ? (
                <ShowMoreButton
                  onClick={handleShowMore}
                  theme={getTheme(filter === 'All' ? 'default' : filter)}
                  showLess={false}
                />
              ) : (
                <ShowMoreButton
                  onClick={handleShowLess}
                  theme={getTheme(filter === 'All' ? 'default' : filter)}
                  showLess={true}
                />
              )}
            </div>
          </motion.div>
        )}
      </div>

      <style jsx='true'>{`
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
        
      `}</style>
    </div>
  );
};

export default SkillsSection;