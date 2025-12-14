// store/slices/certificationsSlice.js
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
export const fetchCertifications = createAsyncThunk(
    'certifications/fetchCertifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/certifications');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch certifications');
        }
    }
);

export const addCertification = createAsyncThunk(
    'certifications/addCertification',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/certifications/add-certification',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.certification;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add certification');
        }
    }
);

export const updateCertification = createAsyncThunk(
    'certifications/updateCertification',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `/api/certifications/update/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.certification;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update certification');
        }
    }
);

export const deleteCertification = createAsyncThunk(
    'certifications/deleteCertification',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/certifications/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete certification');
        }
    }
);

const certificationsSlice = createSlice({
    name: 'certifications',
    initialState: {
        certifications: [],
        loading: false,
        error: null,
        operationLoading: false, // Separate loading for CRUD operations
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        // Manual update for testing
        manualUpdateCertification: (state, action) => {
            const updatedCertification = action.payload;
            const index = state.certifications.findIndex(cert => cert._id === updatedCertification._id);
            if (index !== -1) {
                state.certifications[index] = updatedCertification;
            }
        },
        // Add logout clear state
        clearCertifications: (state) => {
            state.certifications = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch certifications
            .addCase(fetchCertifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCertifications.fulfilled, (state, action) => {
                state.loading = false;
                state.certifications = action.payload;
            })
            .addCase(fetchCertifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Clear certifications on auth error
                if (action.payload?.includes('Unauthorized') ||
                    action.payload?.includes('No token') ||
                    action.payload?.includes('No token provided')) {
                    state.certifications = [];
                }
            })
            // Add certification
            .addCase(addCertification.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(addCertification.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.certifications.unshift(action.payload); // Add to beginning
            })
            .addCase(addCertification.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update certification
            .addCase(updateCertification.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateCertification.fulfilled, (state, action) => {
                state.operationLoading = false;
                const updatedCertification = action.payload;
                const index = state.certifications.findIndex(
                    (cert) => cert._id === updatedCertification._id
                );
                if (index !== -1) {
                    state.certifications[index] = updatedCertification;
                }
            })
            .addCase(updateCertification.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete certification
            .addCase(deleteCertification.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteCertification.fulfilled, (state, action) => {
                state.operationLoading = false;
                const deletedId = action.payload;
                state.certifications = state.certifications.filter(
                    (cert) => cert._id !== deletedId
                );
            })
            .addCase(deleteCertification.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, manualUpdateCertification, clearCertifications } = certificationsSlice.actions;
export default certificationsSlice.reducer;