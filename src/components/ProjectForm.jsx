import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Upload, Calendar, User, Globe, Building, Code, Users, ListChecks, FileText, Sparkles, ExternalLink, Briefcase, Image as ImageIcon, Github } from "lucide-react";

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

const ProjectForm = ({ project, isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDuration: '',
    projectDescription: [''],
    projectTechStack: [''],
    projectClient: '',
    targetAudience: [''],
    projectFeatures: [''],
    projectRole: '',
    GithubLink: '',
    projectLink: ''
  });
  const [projectImage, setProjectImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || '',
        projectDuration: project.projectDuration || '',
        projectDescription: project.projectDescription?.length ? project.projectDescription : [''],
        projectTechStack: project.projectTechStack?.length ? project.projectTechStack : [''],
        projectClient: project.projectClient || '',
        targetAudience: project.targetAudience?.length ? project.targetAudience : [''],
        projectFeatures: project.projectFeatures?.length ? project.projectFeatures : [''],
        projectRole: project.projectRole || '',
        GithubLink: project.GithubLink || '',
        projectLink: project.projectLink || ''
      });
      setImagePreview(project.projectImage || '');
    } else {
      resetForm();
    }
  }, [project, isOpen]);

  const resetForm = () => {
    setFormData({
      projectName: '',
      projectDuration: '',
      projectDescription: [''],
      projectTechStack: [''],
      projectClient: '',
      targetAudience: [''],
      projectFeatures: [''],
      projectRole: '',
      GithubLink: '',
      projectLink: ''
    });
    setProjectImage(null);
    setImagePreview('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // Append basic fields
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(item => {
          if (item.trim()) submitData.append(key, item);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Append image if exists
    if (projectImage) {
      submitData.append('projectImage', projectImage);
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
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {project ? "Edit Project" : "Create New Project"}
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
            {/* Project Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <ImageIcon size={16} className="text-blue-600" />
                Project Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {imagePreview && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-blue-200 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={20} className="text-white" />
                    </div>
                  </motion.div>
                )}

                <label className="cursor-pointer border-2 border-dashed border-blue-300 bg-white p-3 sm:p-4 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center w-full sm:flex-1 group">
                  <Upload className="text-blue-500 mb-1 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    {projectImage ? "Change Image" : "Upload Project Image"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
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
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                placeholder="My Awesome Project"
                onChange={handleInputChange}
                loading={loading}
                icon={<Sparkles size={16} />}
                required
              />

              <InputField
                label="Project Duration"
                name="projectDuration"
                value={formData.projectDuration}
                placeholder="e.g., Jan 2022 - Present"
                onChange={handleInputChange}
                loading={loading}
                icon={<Calendar size={16} />}
                required
              />

              <InputField
                label="Your Role"
                name="projectRole"
                value={formData.projectRole}
                placeholder="e.g., Full Stack Developer"
                onChange={handleInputChange}
                loading={loading}
                icon={<Briefcase size={16} />}
              />

              <InputField
                label="Project Link"
                name="projectLink"
                value={formData.projectLink}
                placeholder="https://example.com"
                onChange={handleInputChange}
                loading={loading}
                icon={<ExternalLink size={16} />}
                type="url"
              />

              <InputField
                label="GitHub Repository"
                name="GithubLink"
                value={formData.GithubLink}
                placeholder="https://github.com/username/repo"
                onChange={handleInputChange}
                loading={loading}
                icon={<Github size={16} />}
                type="url"
              />

              <InputField
                label="Client"
                name="projectClient"
                value={formData.projectClient}
                placeholder="Client name or company"
                onChange={handleInputChange}
                loading={loading}
                icon={<Building size={16} />}
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
                label="Project Description"
                field="projectDescription"
                values={formData.projectDescription}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="Describe your project..."
                icon={<FileText size={16} />}
                color="blue"
                required
              />

              <ArrayField
                label="Tech Stack"
                field="projectTechStack"
                values={formData.projectTechStack}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="e.g., React, Node.js, MongoDB"
                icon={<Code size={16} />}
                color="purple"
                required
              />

              <ArrayField
                label="Target Audience"
                field="targetAudience"
                values={formData.targetAudience}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="e.g., Small businesses, Students"
                icon={<Users size={16} />}
                color="green"
                required
              />

              <ArrayField
                label="Key Features"
                field="projectFeatures"
                values={formData.projectFeatures}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="e.g., Real-time updates, User dashboard"
                icon={<ListChecks size={16} />}
                color="orange"
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
                className="flex-1 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  project ? "Update Project" : "Create Project"
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
      {icon && <span className="text-blue-600">{icon}</span>}
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
      className="w-full border border-slate-200 px-3 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
    />
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
  icon,
  color = "blue",
  required
}) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      purple: 'border-purple-200 bg-purple-50',
      green: 'border-emerald-200 bg-emerald-50',
      orange: 'border-orange-200 bg-orange-50'
    };
    return colors[color] || colors.blue;
  };

  const getButtonColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      purple: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      green: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
      orange: 'from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200 ${getColorClasses(color)}`}>
      <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
        {icon && <span className={`text-${color}-600`}>{icon}</span>}
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
              onChange={(e) => handleArrayInputChange(idx, e.target.value, field)}
              disabled={loading}
              placeholder={placeholder}
              className="flex-1 border border-slate-200 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
        className={`mt-3 w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r ${getButtonColorClasses(color)} text-white px-4 py-2 rounded-lg transition-all shadow-md text-sm font-medium`}
      >
        <Plus size={16} />
        Add More
      </motion.button>
    </div>
  );
};

export default ProjectForm;