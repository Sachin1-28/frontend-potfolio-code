// store/slices/skillsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get token from localStorage or Redux state
const getToken = () => {
  return localStorage.getItem('token'); // Adjust based on where you store token
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
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/api/skills');
      // console.log('Fetch Skills Response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addSkill = createAsyncThunk(
  'skills/addSkill',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/skills/add-skill', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('Add Skill Response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/updateSkill',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/skills/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('Update Skill Response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/deleteSkill',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/skills/delete/${id}`);
      // console.log('Delete Skill ID:', id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    skills: [],
    loading: false,
    error: null,
    operationLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    manualUpdateSkill: (state, action) => {
      const updatedSkill = action.payload;
      const index = state.skills.findIndex(skill => skill._id === updatedSkill._id);
      if (index !== -1) {
        state.skills[index] = updatedSkill;
        // console.log('Manual update completed:', state.skills);
      }
    },
    // Add logout clear state
    clearSkills: (state) => {
      state.skills = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch skills
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
        // console.log('Skills after fetch:', state.skills);
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Clear skills on auth error
        if (action.payload?.message?.includes('Unauthorized') || 
            action.payload?.message?.includes('No token')) {
          state.skills = [];
        }
      })
      // Add skill
      .addCase(addSkill.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.operationLoading = false;
        // console.log('Before add - skills:', state.skills);
        // console.log('Adding new skill:', action.payload);
        state.skills.push(action.payload);
        // console.log('After add - skills:', state.skills);
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Update skill
      .addCase(updateSkill.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedSkill = action.payload;
        // console.log('Updating skill:', updatedSkill);
        // console.log('Current skills before update:', state.skills);
        
        const index = state.skills.findIndex(
          (skill) => skill._id === updatedSkill._id
        );
        // console.log('Found index:', index);
        
        if (index !== -1) {
          state.skills[index] = updatedSkill;
          // console.log('Skills after update:', state.skills);
        } else {
          // console.log('Skill not found in current state');
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Delete skill
      .addCase(deleteSkill.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.operationLoading = false;
        const deletedId = action.payload;
     
        state.skills = state.skills.filter(
          (skill) => skill._id !== deletedId
        );
       
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, manualUpdateSkill, clearSkills } = skillsSlice.actions;
export default skillsSlice.reducer;