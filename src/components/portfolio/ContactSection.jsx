import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Github,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Building,
  User,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage, clearContactStatus } from "../../store/slices/contactSlice";
import { fetchAbout } from "../../store/slices/aboutSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedToast from "./AnimatedToast";

const ContactSection = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);
  const { about } = useSelector((state) => state.about);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    companyName: "",
    companyWebsite: "",
  });

  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);

  // Fetch contact data from about
  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendContactMessage(formData));
  };

  // Handle toast notifications for success/error
  useEffect(() => {
    if (success) {
      toast.success(<AnimatedToast message="✓ Message sent successfully! I'll get back to you soon." />, {
        className: "super-toast",
      });

      // Clear form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        companyName: "",
        companyWebsite: "",
      });
      dispatch(clearContactStatus());
    }

    if (error) {
      toast.error(<AnimatedToast message={`Error: ${error.message || error || '❌ Something went wrong'}`} />, {
        className: "super-toast",
      });

      dispatch(clearContactStatus());
    }
  }, [success, error, dispatch]);

  // Contact info from Redux
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: about?.contactEmail || "sachin7708437122@gmail.com",
      description: "Send me an email anytime!",
      gradient: "from-cyan-400 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      link: about?.contactEmail ? `mailto:${about.contactEmail}` : "mailto:sachin7708437122@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: about?.contactPhone || "+91 7708437122",
      description: "Reach out for inquiries",
      gradient: "from-purple-400 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      link: about?.contactPhone ? `tel:${about.contactPhone}` : "tel:+917708437122",
    },
    {
      icon: Github,
      title: "GitHub",
      value: about?.socialLinks?.github ? `@${about.socialLinks.github.split('/').pop()}` : "@johndoe",
      description: "Check out my projects",
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      link: about?.socialLinks?.github || "https://github.com/johndoe",
    },
    {
      icon: MapPin,
      title: "Location",
      value: about?.address || "San Francisco, CA",
      description: "Open to global opportunities",
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      link: about?.address ? `https://maps.google.com/?q=${encodeURIComponent(about.address)}` : "#",
    },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-blue-600/20",
      iconColor: "text-blue-400",
      link: about?.socialLinks?.linkedin || "https://linkedin.com/in/johndoe",
    },
    {
      name: "GitHub",
      icon: Github,
      color: "hover:bg-gray-700/50",
      iconColor: "text-gray-300",
      link: about?.socialLinks?.github || "https://github.com/johndoe",
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-sky-500/20",
      iconColor: "text-sky-400",
      link: about?.socialLinks?.twitter || "https://twitter.com/johndoe",
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "hover:bg-pink-500/20",
      iconColor: "text-pink-400",
      link: about?.socialLinks?.instagram || "https://instagram.com/johndoe",
    },
    // Add portfolio link if available
    ...(about?.socialLinks?.portfolio ? [{
      name: "Portfolio",
      icon: ExternalLink,
      color: "hover:bg-purple-600/20",
      iconColor: "text-purple-400",
      link: about.socialLinks.portfolio,
    }] : []),
    // Add Facebook if available
    ...(about?.socialLinks?.facebook ? [{
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-700/20",
      iconColor: "text-blue-500",
      link: about.socialLinks.facebook,
    }] : []),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -5 },
  };

  const iconVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 12, scale: 1.1 },
  };

  // Show loading state while fetching data
  if (!about) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gray-900"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
            Let's{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Have a question or want to work together? Drop me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left Side - Redesigned Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Animated Header Card */}
            <motion.div
              variants={cardHoverVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="relative p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl sm:rounded-3xl border border-purple-500/30 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
              <div className="relative z-10 flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Get In Touch</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Info Grid - Responsive */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                // Check if the value exists before rendering the card
                if (!info.value || info.value.trim() === "") return null;

                return (
                  <motion.a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`relative p-4 sm:p-6 bg-gray-800/50 rounded-xl sm:rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group ${hoveredCard === index
                      ? "border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                      : "border-purple-500/20 hover:border-purple-500/40"
                      }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl`}></div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <motion.div
                          variants={iconVariants}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold truncate">{info.title}</h3>
                          <p className={`text-sm sm:text-base font-medium truncate bg-gradient-to-r ${info.gradient} bg-clip-text text-transparent`} title={info.value}>
                            {info.value}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400">{info.description}</p>
                    </div>

                    {/* Animated corner accent */}
                    <div className={`absolute top-0 right-0 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br ${info.gradient} opacity-10 rounded-bl-full transition-all duration-300 ${hoveredCard === index ? "scale-125" : "scale-100"
                      }`}></div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Social Media Card - Redesigned with Icons */}
            <motion.div
              variants={itemVariants}
              className="p-4 sm:p-6 bg-gray-800/50 rounded-xl sm:rounded-2xl border border-purple-500/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
                <h3 className="text-lg sm:text-xl font-semibold">Follow Me</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {socialLinks.map((social, idx) => {
                  // Check if the link exists before rendering the social icon
                  if (!social.link || social.link.trim() === "") return null;

                  const SocialIcon = social.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-700/30 rounded-xl ${social.color} transition-all duration-300 group`}
                    >
                      <div className="relative">
                        <SocialIcon className={`w-5 h-5 sm:w-6 sm:h-6 mb-2 ${social.iconColor}`} />
                        <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-300">{social.name}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            variants={itemVariants}
            className="lg:sticky lg:top-8"
          >
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-800/50 rounded-xl sm:rounded-2xl lg:rounded-3xl backdrop-blur-sm border border-purple-500/30 shadow-xl lg:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">Send a Message</h3>
                  <p className="text-xs sm:text-sm text-gray-400">All fields marked * are required</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Maari Muthu"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-900/70 border border-purple-500/30 rounded-lg sm:rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 placeholder-gray-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        placeholder="maari@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-900/70 border border-purple-500/30 rounded-lg sm:rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 placeholder-gray-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="phone"
                        placeholder="+91 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-900/70 border border-purple-500/30 rounded-lg sm:rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 placeholder-gray-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Your Company"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-900/70 border border-purple-500/30 rounded-lg sm:rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 placeholder-gray-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="companyWebsite"
                      placeholder="https://example.com"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-900/70 border border-purple-500/30 rounded-lg sm:rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 placeholder-gray-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      rows="4"
                      name="message"
                      placeholder="Your Message..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-900/70 border border-purple-500/30 rounded-lg sm:rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 resize-none placeholder-gray-500 text-sm sm:text-base"
                    ></textarea>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full px-6 py-3 sm:px-8 sm:py-4 cursor-pointer bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                {/* Privacy Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-gray-500 text-center mt-4 sm:mt-6"
                >
                  Your information is secure and will never be shared with third parties.
                </motion.p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactSection;