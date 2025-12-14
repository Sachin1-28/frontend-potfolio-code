// store/slices/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const api = axios.create({
  baseURL: import.meta.env.VITE_API
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/projects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch projects');
    }
  }
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/api/projects/add-project',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/projects/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/projects/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete project');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
    error: null,
    operationLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Manual update for testing
    manualUpdateProject: (state, action) => {
      const updatedProject = action.payload;
      const index = state.projects.findIndex(proj => proj._id === updatedProject._id);
      if (index !== -1) {
        state.projects[index] = updatedProject;
      }
    },
    // Add logout clear state
    clearProjects: (state) => {
      state.projects = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Clear projects on auth error
        if (action.payload?.includes('Unauthorized') || 
            action.payload?.includes('No token') ||
            action.payload?.includes('No token provided')) {
          state.projects = [];
        }
      })
      // Add project
      .addCase(addProject.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.projects.unshift(action.payload); // Add to beginning
      })
      .addCase(addProject.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(
          (proj) => proj._id === updatedProject._id
        );
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.operationLoading = false;
        const deletedId = action.payload;
        state.projects = state.projects.filter(
          (proj) => proj._id !== deletedId
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, manualUpdateProject, clearProjects } = projectsSlice.actions;
export default projectsSlice.reducer;