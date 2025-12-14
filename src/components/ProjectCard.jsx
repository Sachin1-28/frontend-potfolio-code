// components/ProjectCard.js
import React from "react";
import { motion } from "framer-motion";
import { Eye, Edit2, Trash2, User, BadgeCheck, CalendarClock } from "lucide-react";

const ProjectCard = ({ project, onEdit, onDelete, onView, loading }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow"
    >
      {/* Project Image */}
      {project.projectImage ? (
        <div className="h-40 overflow-hidden">
          <img
            src={project.projectImage}
            alt={project.projectName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            draggable={false}
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Title + Duration */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-base font-semibold text-gray-900 leading-tight line-clamp-2"
            title={project.projectName}
          >
            {project.projectName}
          </h3>

          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
            <CalendarClock className="w-3 h-3" />
            {project.projectDuration ? `${project.projectDuration}` : "—"}
          </div>
        </div>

        {/* Client & Role */}
        <div className="mt-1 text-sm text-gray-600 space-y-1">
          {project.projectClient && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-800">
                {project.projectClient}
              </span>
            </div>
          )}

          {project.projectRole && (
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-800">
                {project.projectRole}
              </span>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {project.projectTechStack &&
          project.projectTechStack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.projectTechStack.slice(0, 5).map((tech, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200 text-gray-700"
                >
                  {tech}
                </span>
              ))}

              {project.projectTechStack.length > 5 && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200 text-gray-700">
                  +{project.projectTechStack.length - 5}
                </span>
              )}
            </div>
          )}

        {/* Actions */}
        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
          {/* Left Actions */}
          <button
            onClick={onView}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-all text-gray-700"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline font-medium">View</span>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 cursor-pointer text-sm rounded-lg hover:bg-blue-50 transition-all text-blue-600 disabled:opacity-50"
            >
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Edit</span>
            </button>

            <button
              onClick={onDelete}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 cursor-pointer text-sm rounded-lg hover:bg-red-50 transition-all text-red-600 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
