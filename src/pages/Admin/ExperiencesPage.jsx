import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import ExperienceForm from "../../components/ExperienceForm";
import {
  fetchExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  clearError,
} from "../../store/slices/experiencesSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Eye,
  Edit2,
  Trash2,
  Briefcase,
  MapPin,
  Calendar,
  Tag,
  Clock,
  X,
  Plus,
  AlertTriangle,
  Loader2,
  Globe,
  Building2,
  Zap, // Added for count badge
} from "lucide-react";

const ExperiencesPage = () => {
  const dispatch = useDispatch();
  const { experiences, loading, error, operationLoading } = useSelector(
    (state) => state.experiences
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchExperiences());
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
      console.error("Experience Error:", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    setEditingExperience(null);
    setIsFormOpen(true);
    dispatch(clearError());
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setIsFormOpen(true);
    dispatch(clearError());
  };

  const handleDeleteClick = (experience) => {
    setDeleteConfirmation(experience);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation) {
      setDeletingId(deleteConfirmation._id);
      try {
        await dispatch(deleteExperience(deleteConfirmation._id)).unwrap();
        toast.success('Experience deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setDeleteConfirmation(null);
      } catch (err) {
        toast.error(`Failed to delete experience: ${err.message || err || 'Something went wrong'}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error("Delete error:", err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingExperience) {
        await dispatch(
          updateExperience({ id: editingExperience._id, formData })
        ).unwrap();
        toast.success('Experience updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else {
        await dispatch(addExperience(formData)).unwrap();
        toast.success('Experience added successfully!', {
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
      setEditingExperience(null);
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
    setEditingExperience(null);
    dispatch(clearError());
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

      <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4">
        {/* Updated Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-0.5"
              >

                Work Experience

              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xs sm:text-sm text-slate-600"
              >
                Manage and showcase your professional experiences
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              disabled={loading || operationLoading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </motion.button>
          </div>

          {/* Count Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-2"
          >
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Total Experiences</span>

              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-semibold rounded-full shadow"
              >
                {experiences.length}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Loading skeleton */}
        {loading && experiences.length === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-white rounded-xl shadow-sm h-40"
              >
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Experiences list */}
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {experiences.map((exp) => (
              <CompactExperienceCard
                key={exp._id}
                experience={exp}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={() => setViewing(exp)}
                loading={operationLoading}
                isDeleting={deletingId === exp._id}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {experiences.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-md border border-slate-100"
          >
            <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-slate-100 to-white flex items-center justify-center shadow mb-4">
              <Briefcase className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mt-3">No Experiences Yet</h3>
            <p className="text-sm text-slate-500 mt-1.5 mb-4">
              Start building your professional portfolio by adding your first experience
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Your First Experience
            </motion.button>
          </motion.div>
        )}

        {/* Experience Form Modal */}
        <ExperienceForm
          experience={editingExperience}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          loading={operationLoading}
          error={error}
        />
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewing && (
          <ExperienceViewModal experience={viewing} onClose={() => setViewing(null)} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <DeleteConfirmationModal
            experience={deleteConfirmation}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteConfirmation(null)}
            isDeleting={deletingId === deleteConfirmation._id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* Compact Experience Card (unchanged) */
const CompactExperienceCard = ({
  experience,
  onEdit,
  onDelete,
  onView,
  loading,
  isDeleting,
}) => {
  const company = experience.companyName || "Company";
  const role = experience.workedRole || "Role";
  const duration = experience.experienceDuration || "";
  const workMode = experience.workMode || "";
  const location = experience.location || "";
  const techs = (experience.technologiesUsed || []).slice(0, 4);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      whileHover={{
        y: -3,
        boxShadow: "0px 12px 28px rgba(0,0,0,0.1)",
      }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col h-full cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Logo / Image */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden"
        >
          {experience.experienceImage ? (
            <img
              src={experience.experienceImage}
              alt={company}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-indigo-600 text-lg font-bold">
              {(company[0] || "C").toUpperCase()}
            </span>
          )}
        </motion.div>

        {/* Title + Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">
            {role}
          </h3>
          <p className="text-sm text-indigo-600 font-medium truncate">
            {company}
          </p>

          {/* Details */}
          <div className="mt-3 space-y-1.5 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{duration}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{workMode}</span>
            </div>

            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      {(techs.length > 0 || experience.technologiesUsed?.length > 4) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {techs.map((t, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {t}
            </span>
          ))}

          {experience.technologiesUsed?.length > 4 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              +{experience.technologiesUsed.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onView}
          className="flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white hover:bg-slate-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">View</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading || isDeleting}
          onClick={() => onEdit(experience)}
          className="flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-2 text-sm hover:bg-indigo-100 disabled:opacity-50 transition-colors disabled:cursor-not-allowed"
        >
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading || isDeleting}
          onClick={() => onDelete(experience)}
          className="flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-red-50 text-red-600 border border-red-200 px-3 py-2 text-sm hover:bg-red-100 disabled:opacity-50 transition-colors disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isDeleting ? "Deleting..." : "Delete"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};


/* Delete Confirmation Modal (unchanged) */
const DeleteConfirmationModal = ({ experience, onConfirm, onCancel, isDeleting }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isDeleting ? undefined : onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">Delete Experience</h3>
              <p className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete your experience at{" "}
                <span className="font-semibold text-slate-900">"{experience.companyName}"</span>?
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            This action cannot be undone. All information associated with this experience will be permanently removed.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* Experience View Modal (unchanged) */
const ExperienceViewModal = ({ experience, onClose }) => {
  const descriptions = experience.experienceDescription || [];
  const responsibilities = experience.keyResponsibilities || [];
  const techs = experience.technologiesUsed || [];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative z-10 max-w-3xl w-full mx-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-4 p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0 shadow-md"
            >
              {experience.experienceImage ? (
                <img src={experience.experienceImage} alt={experience.companyName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xl">
                  {(experience.companyName || "C").charAt(0).toUpperCase()}
                </div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900">{experience.workedRole}</h2>
              <p className="text-sm text-blue-600 font-medium">{experience.companyName}</p>

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> <span>{experience.experienceDuration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> <span>{experience.workMode}</span>
                </div>
                {experience.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> <span>{experience.location}</span>
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
            {descriptions.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  Description
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-2 ml-3">
                  {descriptions.map((d, i) => (
                    <li key={i} className="leading-relaxed">{d}</li>
                  ))}
                </ul>
              </motion.section>
            )}

            {responsibilities.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  Key Responsibilities
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-2 ml-3">
                  {responsibilities.map((r, i) => (
                    <li key={i} className="leading-relaxed">{r}</li>
                  ))}
                </ul>
              </motion.section>
            )}

            {techs.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((t, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="text-xs px-3 py-1.5 bg-slate-100 rounded-full text-slate-700 font-medium cursor-default"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </motion.section>
            )}

            {experience.companyAddress && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-slate-100"
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Company Address
                </h3>
                <p className="text-sm text-slate-700">{experience.companyAddress}</p>
              </motion.section>
            )}

            {(experience.companyWebsite || experience.industry || experience.companyType) && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-slate-100"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {experience.companyWebsite && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <a
                        href={experience.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {experience.companyWebsite}
                      </a>
                    </div>
                  )}
                  {(experience.industry || experience.companyType) && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold">Company Type</span>
                      <span>{experience.industry || experience.companyType}</span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-slate-100 bg-slate-50">
            <div className="text-xs text-slate-500">
              Viewed on {new Date().toLocaleDateString()}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExperiencesPage;