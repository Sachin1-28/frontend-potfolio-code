import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  FolderOpen,
  Upload,
  Loader2,
  Settings,
  Shield
} from "lucide-react";
import {
  fetchSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  clearError,
} from "../../store/slices/skillsSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SkillManager = () => {
  const dispatch = useDispatch();
  const { skills, loading, error, operationLoading } = useSelector((state) => state.skills);

  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [skillId, setSkillId] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillIcon, setSkillIcon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message || 'Something went wrong'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const openAddModal = () => {
    setIsEdit(false);
    setOpenModal(true);
    setSkillId("");
    setSkillName("");
    setSkillCategory("");
    setSkillIcon(null);
    setPreview(null);
  };

  const openEditModal = (skill) => {
    setIsEdit(true);
    setOpenModal(true);
    setSkillId(skill._id);
    setSkillName(skill.skillName);
    setSkillCategory(skill.skillCategory);
    setPreview(skill.skillIcon);
    setSkillIcon(null);
  };

  const handleDeleteSkill = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await dispatch(deleteSkill(deleteConfirm)).unwrap();
        toast.success('Skill deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setDeleteConfirm(null);
        dispatch(fetchSkills());
      } catch (error) {
        toast.error(`Failed to delete skill: ${error.message || 'Something went wrong'}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("skillName", skillName);
    formData.append("skillCategory", skillCategory);
    if (skillIcon) formData.append("skillIcon", skillIcon);

    try {
      if (isEdit) {
        await dispatch(updateSkill({ id: skillId, formData })).unwrap();
        toast.success('Skill updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else {
        await dispatch(addSkill(formData)).unwrap();
        toast.success('Skill added successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }

      setOpenModal(false);
      setSkillName("");
      setSkillCategory("");
      setSkillIcon(null);
      setPreview(null);
      dispatch(fetchSkills());
    } catch (error) {
      const errorMessage = error.message || 'Operation failed';
      toast.error(`Error: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error('Operation failed:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-700',
      'Backend': 'bg-green-100 text-green-700',
      'Database': 'bg-purple-100 text-purple-700',
      'DevOps': 'bg-orange-100 text-orange-700',
      'Mobile': 'bg-pink-100 text-pink-700',
      'Design': 'bg-yellow-100 text-yellow-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-22vh)] rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50 p-2 sm:p-2 lg:p-4">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: '60px' }} // Adjusted to not overlap with header
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Improved & Compact */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-0.5"
              >
                Skills Management
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xs sm:text-sm text-gray-600"
              >
                Manage and organize your technical skills
              </motion.p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddModal}
                disabled={loading}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </motion.button>
            </div>
          </div>

          {/* Stats Card - Improved with Badge Design */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-2"
          >
            {/* Small Icon */}
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>

            {/* Label + Count */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-medium">Total Skills</span>

              {/* Compact Count Badge */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-semibold rounded-full shadow"
              >
                {skills.length}
              </motion.span>
            </div>
          </motion.div>

        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 sm:py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 rounded-full border-t-transparent absolute top-0 left-0"></div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-gray-600 font-medium text-xs sm:text-sm"
            >
              Loading skills...
            </motion.p>
          </motion.div>
        )}

        {/* Skills Grid */}
        {!loading && skills.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill._id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer"
              >
                <div className="relative h-28 sm:h-32 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 transition-opacity duration-300"
                  ></motion.div>
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    src={skill.skillIcon}
                    alt={skill.skillName}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-lg relative z-10"
                  />
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1.5 truncate group-hover:text-blue-600 transition-colors">
                    {skill.skillName}
                  </h3>
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getCategoryColor(skill.skillCategory)}`}>
                      {skill.skillCategory}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(skill)}
                      disabled={operationLoading}
                      className="flex-1 px-2 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs font-medium shadow-sm cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteSkill(skill._id)}
                      disabled={operationLoading}
                      className="flex-1 px-2 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs font-medium shadow-sm cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-xl shadow-md border border-gray-100"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1.5">No Skills Yet</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center px-4">
              Start building your skill portfolio by adding your first skill
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Your First Skill
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Modal - Compact Design */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
            onClick={() => setOpenModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 rounded-t-2xl">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  {isEdit ? (
                    <>
                      <Edit className="w-5 h-5" />
                      Edit Skill
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add New Skill
                    </>
                  )}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Skill Name</label>
                  <input
                    type="text"
                    placeholder="e.g., React.js"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="w-full border-2 border-gray-200 p-2 sm:p-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm cursor-text"
                    required
                    disabled={operationLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Frontend"
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="w-full border-2 border-gray-200 p-2 sm:p-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm cursor-text"
                    required
                    disabled={operationLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Skill Icon</label>
                  <div className="relative">
                    <input
                      type="file"
                      className="w-full border-2 border-gray-200 p-2 sm:p-2.5 rounded-xl focus:outline-none focus:border-blue-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer text-xs"
                      onChange={(e) => {
                        setSkillIcon(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      }}
                      accept="image/*"
                      disabled={operationLoading}
                    />
                  </div>
                </div>

                {preview && (
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative group"
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-[10px] font-medium">Preview</p>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setOpenModal(false)}
                    disabled={operationLoading}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 inline-block mr-1" />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={operationLoading}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-xs sm:text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {operationLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-3.5 h-3.5" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        {isEdit ? "Update Skill" : "Add Skill"}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal - Compact Design */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-800 mb-1.5">Delete Skill?</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-5">
                  This action cannot be undone. Are you sure you want to delete this skill?
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 inline-block mr-1" />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDelete}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {operationLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-3.5 h-3.5" />
                        </motion.div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5 inline-block mr-1" />
                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillManager;