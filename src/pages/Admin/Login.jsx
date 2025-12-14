import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin, clearError } from "../../store/slices/authSlice";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/skills");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await dispatch(loginAdmin({ email, password })).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  // Floating particles animation
  const particles = Array.from({ length: 20 });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 relative overflow-hidden">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 px-4 py-2 flex items-center gap-2 
             bg-white/10 hover:bg-white/20 backdrop-blur-md 
             border border-white/20 rounded-xl text-white 
             shadow-lg transition-all cursor-pointer"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
      </motion.button>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Dynamic Gradient Orbs */}
      <motion.div
        animate={{
          x: mousePosition.x / 50,
          y: mousePosition.y / 50,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className="absolute top-0 left-0 w-96 h-96 bg-purple-600/40 blur-[120px] rounded-full"
      ></motion.div>

      <motion.div
        animate={{
          x: -mousePosition.x / 40,
          y: -mousePosition.y / 40,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/40 blur-[120px] rounded-full"
      ></motion.div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/30 blur-[150px] rounded-full"
      ></motion.div>

      {/* Floating Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          animate={{
            y: [0, -1000],
            x: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 20}%`,
          }}
        />
      ))}

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Animated Border Effect */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-75 blur-xl"
        ></motion.div>

        {/* Card */}
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10">

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/50 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-500/50 rounded-br-3xl"></div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-lg shadow-purple-500/50 relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 blur-md opacity-50"></div>
              <ShieldCheck className="w-10 h-10 text-white relative z-10" />

              {/* Sparkle Effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mt-6"
            >
              Admin Portal
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 mt-2 text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Secure Access Dashboard
            </motion.p>
          </motion.div>

          {/* Error Popup */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="mb-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 backdrop-blur-sm text-red-200 px-4 py-3 rounded-xl relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <span className="relative z-10">{error}</span>
                <button
                  onClick={() => dispatch(clearError())}
                  className="absolute top-3 right-3 z-10 hover:bg-red-500/30 rounded-lg p-1 transition-all"
                >
                  <X className="w-4 h-4 text-red-300 hover:text-red-100" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="text-gray-300 text-sm mb-2 block font-medium">
                Email Address
              </label>
              <div className="relative group">
                <motion.div
                  animate={{
                    scale: focusedField === "email" ? 1 : 0,
                    opacity: focusedField === "email" ? 1 : 0,
                  }}
                  className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30"
                />

                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${focusedField === "email" ? "text-purple-400 scale-110" : "text-gray-400"
                    }`}
                />

                <input
                  type="email"
                  required
                  className={`relative w-full py-4 pl-12 pr-4 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300
                    ${focusedField === "email"
                      ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
                      : "border-white/10"
                    }
                    text-white placeholder-gray-500 hover:border-white/20`}
                  placeholder="admin@example.com"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="text-gray-300 text-sm mb-2 block font-medium">
                Password
              </label>
              <div className="relative group">
                <motion.div
                  animate={{
                    scale: focusedField === "password" ? 1 : 0,
                    opacity: focusedField === "password" ? 1 : 0,
                  }}
                  className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30"
                />

                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${focusedField === "password" ? "text-purple-400 scale-110" : "text-gray-400"
                    }`}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`relative w-full py-4 pl-12 pr-12 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300
                    ${focusedField === "password"
                      ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
                      : "border-white/10"
                    }
                    text-white placeholder-gray-500 hover:border-white/20`}
                  placeholder="••••••••••••"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>

                <motion.div
                  animate={{
                    x: loading ? ["-100%", "100%"] : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: loading ? Infinity : 0,
                    ease: "linear"
                  }}
                  className="absolute inset-0 cursor-pointer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />

                <span className="relative z-10 flex items-center cursor-pointer justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              © {new Date().getFullYear()} Admin Portal. Secured & Protected.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;