import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Award, 
  Calendar, 
  Clock, 
  BookOpen, 
  Eye, 
  Edit2, 
  Trash2, 
  FileText,
  X,
  AlertCircle,
  Loader2,
  Zap, // Added for count badge
} from 'lucide-react';
import CertificationForm from '../../components/CertificationForm';
import {
  fetchCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  clearError,
} from '../../store/slices/certificationsSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CertificationsPage = () => {
  const dispatch = useDispatch();
  const { certifications, loading, error, operationLoading } = useSelector((state) => state.certifications);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCertifications());
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
      console.error('Certification Error:', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    setEditingCertification(null);
    setIsFormOpen(true);
    dispatch(clearError());
  };

  const handleEdit = (certification) => {
    setEditingCertification(certification);
    setIsFormOpen(true);
    dispatch(clearError());
  };

  const handleDeleteClick = (certification) => {
    setDeleteConfirmation(certification);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation) {
      setIsDeleting(true);
      try {
        await dispatch(deleteCertification(deleteConfirmation._id)).unwrap();
        toast.success('Certification deleted successfully!', {
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
        toast.error(`Failed to delete certification: ${err.message || err || 'Something went wrong'}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error('Delete failed:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCertification) {
        await dispatch(updateCertification({ id: editingCertification._id, formData })).unwrap();
        toast.success('Certification updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else {
        await dispatch(addCertification(formData)).unwrap();
        toast.success('Certification added successfully!', {
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
      setEditingCertification(null);
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
      console.error('Form submission error:', err);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCertification(null);
    dispatch(clearError());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-[calc(100vh-22vh)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-6">
        {/* Header - Improved Design */}
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-0.5"
              >
                <span className="inline-flex items-center gap-2">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  Certifications
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xs sm:text-sm text-slate-600"
              >
                Manage and showcase your professional certifications
              </motion.p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              disabled={loading || operationLoading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Certification
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
              <span className="text-xs text-slate-600 font-medium">Total Certifications</span>

              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-semibold rounded-full shadow"
              >
                {certifications.length}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-2.5 rounded-lg mb-5 flex items-start gap-2 shadow-sm text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
              <button 
                onClick={() => dispatch(clearError())}
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && certifications.length === 0 && (
          <div className="flex flex-col justify-center items-center py-16">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Loading certifications...</p>
          </div>
        )}

        {/* Certifications Grid - Reduced gap */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {certifications.map((certification, index) => (
              <motion.div
                key={certification._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <CertificationCard
                  certification={certification}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onViewPdf={() => window.open(certification.certificatePdf, '_blank')}
                  formatDate={formatDate}
                  loading={operationLoading}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {certifications.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-md border border-slate-100"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block mb-5"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              </div>
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1.5">No Certifications Yet</h3>
            <p className="text-slate-500 mb-5 text-sm px-4">Start building your professional portfolio by adding your first certification</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Your First Certification
            </motion.button>
          </motion.div>
        )}

        {/* Certification Form Modal */}
        <CertificationForm
          certification={editingCertification}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          loading={operationLoading}
          error={error}
        />

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleDeleteCancel}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Certification</h3>
                    <p className="text-gray-600 text-xs mt-0.5">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-5">
                  Are you sure you want to delete <span className="font-semibold">"{deleteConfirmation.courseName}"</span>?
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteCancel}
                    disabled={isDeleting}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CertificationCard = ({ certification, onEdit, onDelete, onViewPdf, formatDate, loading }) => {
  const gradients = [
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
  ];
  
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all h-full flex flex-col"
    >
      {/* Header with Gradient - Reduced height */}
      <div className={`bg-gradient-to-r ${gradient} p-4 sm:p-5 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <Award className="w-5 h-5 text-blue-500" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold line-clamp-2 leading-tight">
                {certification.courseName}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-white text-opacity-90">
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <p className="font-medium text-xs truncate">{certification.courseProvider}</p>
          </div>
        </div>
      </div>

      {/* Content - Reduced spacing */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Course Details - Reduced spacing */}
        <div className="space-y-2.5 mb-3">
          <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-600">
              <FileText className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Mode</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">{certification.courseMode}</span>
          </div>
          
          <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Duration</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">{certification.courseDuration}</span>
          </div>
          
          <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">{formatDate(certification.courseCompletedDate)}</span>
          </div>
        </div>

        {/* Key Learnings - Now with scroll */}
        {certification.keyLearnings && certification.keyLearnings.length > 0 && (
          <div className="mb-3 flex-1 min-h-0">
            <h4 className="font-semibold text-gray-900 mb-2 text-xs flex items-center gap-1.5">
              <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              Key Learnings
            </h4>
            <div className="max-h-28 sm:max-h-32 overflow-y-auto pr-2 space-y-1.5">
              {certification.keyLearnings.map((learning, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-gray-600 text-xs flex items-start gap-1.5"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span className="line-clamp-2">{learning}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons - Smaller buttons */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 mt-auto">
          {certification.certificatePdf && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewPdf}
              disabled={loading}
              className="bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 py-2 px-1 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all text-xs font-semibold flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 border border-green-200 cursor-pointer disabled:cursor-not-allowed"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[10px] sm:text-xs">View</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(certification)}
            disabled={loading}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 py-2 px-1 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all text-xs font-semibold flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 border border-blue-200 cursor-pointer disabled:cursor-not-allowed"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs">Edit</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(certification)}
            disabled={loading}
            className="bg-gradient-to-br from-red-50 to-rose-50 text-red-600 py-2 px-1 rounded-lg hover:from-red-100 hover:to-rose-100 transition-all text-xs font-semibold flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 border border-red-200 cursor-pointer disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs">Delete</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificationsPage;