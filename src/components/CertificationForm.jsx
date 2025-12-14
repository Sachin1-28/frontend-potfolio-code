import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Upload, BookOpen, Calendar, Clock, Globe, Award, FileText, GraduationCap, Users, Download } from "lucide-react";

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", duration: 0.4, bounce: 0.3 }
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const CertificationForm = ({ certification, isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseMode: '',
    courseProvider: '',
    courseDuration: '',
    courseCompletedDate: '',
    keyLearnings: ['']
  });
  const [certificatePdf, setCertificatePdf] = useState(null);
  const [pdfPreview, setPdfPreview] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  useEffect(() => {
    if (certification) {
      // Format date for input field (YYYY-MM-DD)
      const completedDate = certification.courseCompletedDate 
        ? new Date(certification.courseCompletedDate).toISOString().split('T')[0]
        : '';
      
      setFormData({
        courseName: certification.courseName || '',
        courseMode: certification.courseMode || '',
        courseProvider: certification.courseProvider || '',
        courseDuration: certification.courseDuration || '',
        courseCompletedDate: completedDate,
        keyLearnings: certification.keyLearnings?.length ? certification.keyLearnings : ['']
      });
      
      if (certification.certificatePdf) {
        setPdfPreview(certification.certificatePdf);
        setPdfFileName(certification.certificatePdf.split('/').pop() || 'certificate.pdf');
      }
    } else {
      resetForm();
    }
  }, [certification, isOpen]);

  const resetForm = () => {
    setFormData({
      courseName: '',
      courseMode: '',
      courseProvider: '',
      courseDuration: '',
      courseCompletedDate: '',
      keyLearnings: ['']
    });
    setCertificatePdf(null);
    setPdfPreview('');
    setPdfFileName('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (index, value) => {
    const newKeyLearnings = [...formData.keyLearnings];
    newKeyLearnings[index] = value;
    setFormData(prev => ({ ...prev, keyLearnings: newKeyLearnings }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      const arr = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: arr }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setCertificatePdf(file);
      setPdfFileName(file.name);
      setPdfPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    
    // Append basic fields
    Object.keys(formData).forEach(key => {
      if (key === 'keyLearnings') {
        formData[key].forEach(item => {
          if (item.trim()) submitData.append(key, item);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });
    
    // Append PDF file if exists
    if (certificatePdf) {
      submitData.append('certificatePdf', certificatePdf);
    }

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalBackdrop}
        onClick={onClose}
      >
        <motion.div
          variants={modalPanel}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-4"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {certification ? "Edit Certification" : "Add New Certification"}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                disabled={loading}
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[calc(90vh-80px)] overflow-y-auto">
            {/* PDF Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-4 rounded-xl border border-emerald-100"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <FileText size={16} className="text-emerald-600" />
                Certificate PDF *
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {pdfPreview && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group min-w-[80px] sm:min-w-[96px]"
                  >
                    <div className="w-20 h-24 sm:w-24 sm:h-28 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl border-2 border-red-200 shadow-md flex flex-col items-center justify-center p-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 truncate max-w-full">
                        {pdfFileName || 'certificate.pdf'}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">PDF</span>
                    </div>
                    
                    {pdfPreview && !pdfPreview.startsWith('blob:') && (
                      <a
                        href={pdfPreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm font-medium"
                      >
                        <Download size={16} />
                        View
                      </a>
                    )}
                  </motion.div>
                )}

                <label className="cursor-pointer border-2 border-dashed border-emerald-300 bg-white p-3 sm:p-4 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center w-full sm:flex-1 group">
                  <Upload className="text-emerald-500 mb-1 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    {certificatePdf ? "Change PDF" : "Upload Certificate PDF"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">PDF only (Max 5MB)</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                    required={!certification}
                  />
                </label>
              </div>
            </motion.div>

            {/* Grid Fields */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              <InputField
                label="Course Name"
                name="courseName"
                value={formData.courseName}
                placeholder="Advanced React Masterclass"
                onChange={handleInputChange}
                loading={loading}
                icon={<BookOpen size={16} />}
                required
              />

              <SelectField
                label="Course Mode"
                name="courseMode"
                value={formData.courseMode}
                onChange={handleInputChange}
                loading={loading}
                options={["Online", "Offline", "Hybrid", "Self-paced"]}
                icon={<Users size={16} />}
                required
              />

              <InputField
                label="Course Provider"
                name="courseProvider"
                value={formData.courseProvider}
                placeholder="Coursera, Udemy, etc."
                onChange={handleInputChange}
                loading={loading}
                icon={<Globe size={16} />}
                required
              />

              <InputField
                label="Course Duration"
                name="courseDuration"
                value={formData.courseDuration}
                placeholder="3 months, 40 hours"
                onChange={handleInputChange}
                loading={loading}
                icon={<Clock size={16} />}
                required
              />

              <InputField
                label="Completion Date"
                name="courseCompletedDate"
                value={formData.courseCompletedDate}
                onChange={handleInputChange}
                loading={loading}
                icon={<Calendar size={16} />}
                type="date"
                required
              />

              <InputField
                label="Certificate ID (Optional)"
                name="certificateId"
                value={formData.certificateId || ''}
                placeholder="Certificate ID if any"
                onChange={handleInputChange}
                loading={loading}
                icon={<Award size={16} />}
              />
            </motion.div>

            {/* Array Fields */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <ArrayField
                label="Key Learnings"
                field="keyLearnings"
                values={formData.keyLearnings}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="Describe what you learned..."
                required
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 py-3 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Saving...
                  </span>
                ) : (
                  certification ? "Update Certification" : "Add Certification"
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                disabled={loading}
                className="py-3 px-6 border-2 cursor-pointer border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* --------------------------------------------
   REUSABLE COMPONENTS
--------------------------------------------- */

const InputField = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  loading,
  icon,
  type = "text",
  required
}) => (
  <div className="space-y-1.5">
    <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
      {icon && <span className="text-emerald-600">{icon}</span>}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={loading}
      placeholder={placeholder}
      className="w-full border border-slate-200 px-3 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, loading, options, icon, required }) => (
  <div className="space-y-1.5">
    <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
      {icon && <span className="text-emerald-600">{icon}</span>}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={loading}
      className="w-full border border-slate-200 px-3 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const ArrayField = ({
  label,
  field,
  values,
  loading,
  addArrayField,
  removeArrayField,
  handleArrayInputChange,
  placeholder,
  required
}) => (
  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200">
    <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>

    <div className="space-y-2">
      {values.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayInputChange(idx, e.target.value)}
            disabled={loading}
            placeholder={placeholder}
            className="flex-1 border border-slate-200 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
            required={required}
          />

          {values.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              disabled={loading}
              onClick={() => removeArrayField(idx, field)}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => addArrayField(field)}
      disabled={loading}
      className="mt-3 w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md text-sm font-medium"
    >
      <Plus size={16} />
      Add More
    </motion.button>
  </div>
);

export default CertificationForm;