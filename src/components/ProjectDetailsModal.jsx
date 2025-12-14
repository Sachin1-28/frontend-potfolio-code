// components/ProjectDetailsModal.js
import React from 'react';
import { motion } from 'framer-motion';
import { X, Edit2, Trash2, Laptop, Layers, Target, Users } from 'lucide-react';

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const panel = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 260, damping: 28 } 
  },
  exit: { y: 20, opacity: 0, transition: { duration: 0.15 } }
};

const ProjectDetailsModal = ({ project, onClose, onEdit, onDelete }) => {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        variants={backdrop}
        onClick={onClose}
        style={{ cursor: "pointer" }}
      />

      {/* PANEL */}
      <motion.div
        variants={panel}
        className="relative z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-xl w-full max-w-3xl 
        overflow-auto max-h-[90vh] border border-gray-200"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{project.projectName}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {project.projectClient || "No client"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded cursor-pointer hover:bg-gray-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* LEFT COLUMN */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
              {project.projectImage ? (
                <img
                  src={project.projectImage}
                  alt={project.projectName}
                  className="w-full h-44 sm:h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="mt-4 space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <Laptop size={14} className="text-gray-500" />
                <span><strong>Duration:</strong> {project.projectDuration || "—"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-500" />
                <span><strong>Role:</strong> {project.projectRole || "—"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Target size={14} className="text-gray-500" />
                <span><strong>Client:</strong> {project.projectClient || "—"}</span>
              </div>

              {project.projectLink && (
                <div className="mt-1 break-words">
                  <strong className="text-gray-700">Visit:</strong>
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-xs break-all ml-1"
                  >
                    {project.projectLink}
                  </a>
                </div>
              )}
              {project.GithubLink && (
                <div className="mt-1 break-words">
                  <strong className="text-gray-700">GitHub:</strong>
                  <a
                    href={project.GithubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-xs break-all ml-1"
                  >
                    {project.GithubLink}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-2 space-y-5">

            {/* TECH STACK */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Layers size={16} className="text-purple-600" />
                Tech Stack
              </div>
              {project.projectTechStack && project.projectTechStack.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.projectTechStack.map((tech, i) => (
                    <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No tech stack added</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Description</div>
              {project.projectDescription && project.projectDescription.length ? (
                <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1 max-h-32 overflow-auto pr-1">
                  {project.projectDescription.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">No description</p>
              )}
            </div>

            {/* FEATURES */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Features</div>
              {project.projectFeatures && project.projectFeatures.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.projectFeatures.map((f, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded shadow-sm">{f}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No features</p>
              )}
            </div>

            {/* AUDIENCE */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Target Audience</div>
              {project.targetAudience && project.targetAudience.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.targetAudience.map((t, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded shadow-sm">{t}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No audience specified</p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-3 flex justify-end gap-3">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 text-xs cursor-pointer bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 shadow transition flex items-center gap-1"
              >
                <Edit2 size={16} />
                Edit
              </button>

              <button
                onClick={onDelete}
                className="px-3 py-1.5 text-xs cursor-pointer bg-red-50 text-red-700 rounded-lg hover:bg-red-100 shadow transition flex items-center gap-1"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetailsModal;
