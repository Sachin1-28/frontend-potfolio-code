import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Upload, Building2, Briefcase, Calendar, MapPin, Globe, Package } from "lucide-react";

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

const ExperienceForm = ({
  experience,
  isOpen,
  onClose,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    companyName: "",
    workedRole: "",
    experienceDuration: "",
    experienceDescription: [""],
    location: "",
    companyAddress: "",
    keyResponsibilities: [""],
    technologiesUsed: [""],
    workMode: "On-site",
    companyWebsite: "",
    companyType: "",
  });

  const [experienceImage, setExperienceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (experience) {
      setFormData({
        companyName: experience.companyName || "",
        workedRole: experience.workedRole || "",
        experienceDuration: experience.experienceDuration || "",
        experienceDescription:
          experience.experienceDescription?.length
            ? experience.experienceDescription
            : [""],
        location: experience.location || "",
        companyAddress: experience.companyAddress || "",
        keyResponsibilities:
          experience.keyResponsibilities?.length
            ? experience.keyResponsibilities
            : [""],
        technologiesUsed:
          experience.technologiesUsed?.length
            ? experience.technologiesUsed
            : [""],
        workMode: experience.workMode || "On-site",
        companyWebsite: experience.companyWebsite || "",
        companyType: experience.companyType || "",
      });
      setImagePreview(experience.experienceImage || "");
    } else {
      resetForm();
    }
  }, [experience, isOpen]);

  const resetForm = () => {
    setFormData({
      companyName: "",
      workedRole: "",
      experienceDuration: "",
      experienceDescription: [""],
      location: "",
      companyAddress: "",
      keyResponsibilities: [""],
      technologiesUsed: [""],
      workMode: "On-site",
      companyWebsite: "",
      companyType: "",
    });
    setExperienceImage(null);
    setImagePreview("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (index, value, field) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      const arr = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, [field]: arr }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExperienceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => {
          if (item.trim()) submitData.append(key, item);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (experienceImage) submitData.append("experienceImage", experienceImage);

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
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {experience ? "Edit Experience" : "Add New Experience"}
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
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <Building2 size={16} className="text-indigo-600" />
                Company Logo
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
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-indigo-200 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={20} className="text-white" />
                    </div>
                  </motion.div>
                )}

                <label className="cursor-pointer border-2 border-dashed border-indigo-300 bg-white p-3 sm:p-4 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center w-full sm:flex-1 group">
                  <Upload className="text-indigo-500 mb-1 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    {experienceImage ? "Change Logo" : "Upload Logo"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG (Max 5MB)</span>
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
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                placeholder="Acme Inc."
                onChange={handleInputChange}
                loading={loading}
                icon={<Building2 size={16} />}
                required
              />

              <InputField
                label="Job Role"
                name="workedRole"
                value={formData.workedRole}
                placeholder="Senior Software Engineer"
                onChange={handleInputChange}
                loading={loading}
                icon={<Briefcase size={16} />}
                required
              />

              <InputField
                label="Duration"
                name="experienceDuration"
                value={formData.experienceDuration}
                placeholder="Jan 2022 - Present"
                onChange={handleInputChange}
                loading={loading}
                icon={<Calendar size={16} />}
                required
              />

              <SelectField
                label="Work Mode"
                name="workMode"
                value={formData.workMode}
                onChange={handleInputChange}
                loading={loading}
                options={["On-site", "Remote", "Hybrid"]}
                icon={<MapPin size={16} />}
              />

              <InputField
                label="Location"
                name="location"
                value={formData.location}
                placeholder="San Francisco, CA"
                onChange={handleInputChange}
                loading={loading}
                icon={<MapPin size={16} />}
              />

              <InputField
                label="Company Type"
                name="companyType"
                value={formData.companyType}
                placeholder="Technology, Startup"
                onChange={handleInputChange}
                loading={loading}
                icon={<Package size={16} />}
              />

              <InputField
                label="Company Website"
                name="companyWebsite"
                value={formData.companyWebsite}
                placeholder="https://example.com"
                onChange={handleInputChange}
                loading={loading}
                icon={<Globe size={16} />}
              />

              <InputField
                label="Company Address"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                placeholder="123 Tech Street"
                loading={loading}
                icon={<Building2 size={16} />}
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
                label="Experience Description"
                field="experienceDescription"
                values={formData.experienceDescription}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="Describe your role and achievements"
              />

              <ArrayField
                label="Key Responsibilities"
                field="keyResponsibilities"
                values={formData.keyResponsibilities}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="Led team of developers..."
              />

              <ArrayField
                label="Technologies Used"
                field="technologiesUsed"
                values={formData.technologiesUsed}
                loading={loading}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                handleArrayInputChange={handleArrayInputChange}
                placeholder="React, Node.js, MongoDB"
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
                className="flex-1 py-3 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  experience ? "Update Experience" : "Add Experience"
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
  required
}) => (
  <div className="space-y-1.5">
    <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
      {icon && <span className="text-indigo-600">{icon}</span>}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={loading}
      placeholder={placeholder}
      className="w-full border border-slate-200 px-3 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, loading, options, icon }) => (
  <div className="space-y-1.5">
    <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
      {icon && <span className="text-indigo-600">{icon}</span>}
      {label}
      <span className="text-red-500">*</span>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={loading}
      className="w-full border border-slate-200 px-3 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
    >
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
  placeholder
}) => (
  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200">
    <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
      {label}
      <span className="text-red-500">*</span>
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
            className="flex-1 border border-slate-200 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
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

export default ExperienceForm;