// store/slices/experiencesSlice.js
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
export const fetchExperiences = createAsyncThunk(
  'experiences/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/experiences');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch experiences');
    }
  }
);

export const addExperience = createAsyncThunk(
  'experiences/addExperience',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/api/experiences/add-experience',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.experience;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add experience');
    }
  }
);

export const updateExperience = createAsyncThunk(
  'experiences/updateExperience',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/experiences/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.experience;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update experience');
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'experiences/deleteExperience',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/experiences/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete experience');
    }
  }
);

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState: {
    experiences: [],
    loading: false,
    error: null,
    operationLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Manual update for testing
    manualUpdateExperience: (state, action) => {
      const updatedExperience = action.payload;
      const index = state.experiences.findIndex(exp => exp._id === updatedExperience._id);
      if (index !== -1) {
        state.experiences[index] = updatedExperience;
      }
    },
    // Add logout clear state
    clearExperiences: (state) => {
      state.experiences = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch experiences
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Clear experiences on auth error
        if (action.payload?.includes('Unauthorized') || 
            action.payload?.includes('No token') ||
            action.payload?.includes('No token provided')) {
          state.experiences = [];
        }
      })
      // Add experience
      .addCase(addExperience.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.experiences.unshift(action.payload); // Add to beginning
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Update experience
      .addCase(updateExperience.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedExperience = action.payload;
        const index = state.experiences.findIndex(
          (exp) => exp._id === updatedExperience._id
        );
        if (index !== -1) {
          state.experiences[index] = updatedExperience;
        }
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Delete experience
      .addCase(deleteExperience.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.operationLoading = false;
        const deletedId = action.payload;
        state.experiences = state.experiences.filter(
          (exp) => exp._id !== deletedId
        );
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, manualUpdateExperience, clearExperiences } = experiencesSlice.actions;
export default experiencesSlice.reducer;