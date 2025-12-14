// components/ProjectsPage.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectForm from "../../components/ProjectForm";

import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
  clearError,
} from "../../store/slices/projectsSlice";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FolderKanban,
  AlertCircle,
  Trash2,
  Pencil,
  Eye,
  X,
  AlertTriangle,
  Zap,
  FolderOpen,
  Loader2,
} from "lucide-react";

import ProjectCard from "../../components/ProjectCard";
import ProjectDetailsModal from "../../components/ProjectDetailsModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, operationLoading, projectName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Project
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{projectName}"
              </span>
              ? All project data will be permanently removed.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-gray-700 bg- cursor-pointer border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
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
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { projects, loading, error, operationLoading } = useSelector(
    (state) => state.projects
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: null,
    projectName: "",
  });

  // Fetch projects
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message || error || 'Something went wrong'}`, {
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

  const handleAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
    dispatch(clearError());
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
    dispatch(clearError());
  };

  const handleDelete = async (projectId) => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      toast.success('Project deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setDeleteModal({ isOpen: false, projectId: null, projectName: "" });
      if (viewProject && viewProject._id === projectId) setViewProject(null);
    } catch (err) {
      toast.error(`Failed to delete project: ${err.message || 'Something went wrong'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProject) {
        await dispatch(
          updateProject({ id: editingProject._id, formData })
        ).unwrap();
        toast.success('Project updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else {
        await dispatch(addProject(formData)).unwrap();
        toast.success('Project added successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (err) {
      const errorMessage = err.message || err || 'Operation failed';
      toast.error(`Error: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Form submission error:", err);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
    dispatch(clearError());
  };

  const openDeleteModal = (projectId, projectName) => {
    setDeleteModal({
      isOpen: true,
      projectId,
      projectName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      projectId: null,
      projectName: "",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      // transition: {
      //   staggerChildren: 0.05
      // }
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
        style={{ marginTop: '60px' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Section - Similar to Skills Manager */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-0.5"
              >
                Project Management
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xs sm:text-sm text-gray-600"
              >
                Manage & showcase your portfolio projects
              </motion.p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                disabled={loading || operationLoading}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Project
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
              <FolderOpen className="w-4 h-4 text-white" />
            </div>

            {/* Label + Count */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-medium">Total Projects</span>

              {/* Compact Count Badge */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-semibold rounded-full shadow"
              >
                {projects.length}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Error Box (optional - keeping as fallback) */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-900 font-bold"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-lg shadow rounded-xl p-5 animate-pulse h-48"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Grid List with animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key="projects-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
              >

                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                    className="group"
                  >
                    <ProjectCard
                      project={project}
                      loading={operationLoading}
                      onView={() => setViewProject(project)}
                      onEdit={() => handleEdit(project)}
                      onDelete={() => openDeleteModal(project._id, project.projectName)}
                    />
                  </motion.div>
                ))}

              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {projects.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-xl shadow-md border border-gray-100"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1.5">
                  No Projects Yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center px-4">
                  Start building your project portfolio by adding your first project
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdd}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Project
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Modal Form */}
        <ProjectForm
          project={editingProject}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          loading={operationLoading}
          error={error}
        />

        {/* Project Full View Modal */}
        <AnimatePresence>
          {viewProject && (
            <ProjectDetailsModal
              project={viewProject}
              onClose={() => setViewProject(null)}
              onEdit={() => {
                setEditingProject(viewProject);
                setIsFormOpen(true);
                setViewProject(null);
              }}
              onDelete={() => openDeleteModal(viewProject._id, viewProject.projectName)}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(deleteModal.projectId)}
          projectName={deleteModal.projectName}
          operationLoading={operationLoading}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;