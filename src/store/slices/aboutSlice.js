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
export const fetchAbout = createAsyncThunk(
    'about/fetchAbout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/about');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch about information');
        }
    }
);

export const createOrUpdateAbout = createAsyncThunk(
    'about/createOrUpdateAbout',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/about',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.about;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update about section');
        }
    }
);

export const updateResume = createAsyncThunk(
    'about/updateResume',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                '/api/about/resume',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update resume');
        }
    }
);

// NEW: Update Profile Image
export const updateProfileImage = createAsyncThunk(
    'about/updateProfileImage',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                '/api/about/profile-image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update profile image');
        }
    }
);

// NEW: Delete Profile Image
export const deleteProfileImage = createAsyncThunk(
    'about/deleteProfileImage',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.delete('/api/about/profile-image');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete profile image');
        }
    }
);

export const deleteResume = createAsyncThunk(
    'about/deleteResume',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.delete('/api/about/resume');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete resume');
        }
    }
);

export const toggleActiveStatus = createAsyncThunk(
    'about/toggleActiveStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.patch('/api/about/toggle-active');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to toggle active status');
        }
    }
);

// Helper function to safely parse description array
const safeParseDescription = (description) => {
    if (Array.isArray(description)) {
        return description;
    }
    if (typeof description === 'string') {
        try {
            const parsed = JSON.parse(description);
            return Array.isArray(parsed) ? parsed : [description];
        } catch {
            return description.trim() ? [description] : [];
        }
    }
    return [];
};

const aboutSlice = createSlice({
    name: 'about',
    initialState: {
        about: {
            role: "",
            description: [], // Changed from string to array
            quote: "", // NEW FIELD
            profileImage: "", // NEW FIELD
            contactEmail: "",
            contactPhone: "",
            address:"",
            socialLinks: {
                linkedin: "",
                github: "",
                twitter: "",
                instagram:"",
                portfolio: ""
            },
            resumePdf: "",
            isActive: true
        },
        loading: false,
        error: null,
        operationLoading: false,
        operationType: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        // Manual update for testing or form changes
        updateAboutFields: (state, action) => {
            const payload = action.payload;
            
            // Handle description array properly
            if (payload.description !== undefined) {
                state.about.description = safeParseDescription(payload.description);
            }
            
            // Handle other fields
            state.about = {
                ...state.about,
                ...payload,
                description: payload.description !== undefined 
                    ? safeParseDescription(payload.description) 
                    : state.about.description
            };
        },
        // Update specific fields like role or description
        updateField: (state, action) => {
            const { field, value } = action.payload;
            
            if (field === 'description') {
                // Handle description as array
                state.about.description = safeParseDescription(value);
            } else if (field.includes('.')) {
                // Handle nested fields like socialLinks.linkedin
                const [parent, child] = field.split('.');
                if (parent in state.about && child in state.about[parent]) {
                    state.about[parent][child] = value;
                }
            } else {
                state.about[field] = value;
            }
        },
        // Add description item
        addDescriptionItem: (state, action) => {
            const newItem = action.payload;
            if (newItem && newItem.trim()) {
                state.about.description.push(newItem.trim());
            }
        },
        // Update description item by index
        updateDescriptionItem: (state, action) => {
            const { index, value } = action.payload;
            if (index >= 0 && index < state.about.description.length) {
                state.about.description[index] = value.trim();
            }
        },
        // Remove description item by index
        removeDescriptionItem: (state, action) => {
            const index = action.payload;
            if (index >= 0 && index < state.about.description.length) {
                state.about.description.splice(index, 1);
            }
        },
        // Add logout clear state
        clearAbout: (state) => {
            state.about = {
                role: "",
                description: [],
                quote: "", // NEW FIELD
                profileImage: "", // NEW FIELD
                contactEmail: "",
                contactPhone: "",
                address:"",
                socialLinks: {
                    linkedin: "",
                    github: "",
                    twitter: "",
                    instagram:"",
                    portfolio: ""
                },
                resumePdf: "",
                isActive: true
            };
            state.error = null;
        },
        // Reset to initial state
        resetAbout: (state) => {
            state.about = {
                role: "",
                description: [],
                quote: "", // NEW FIELD
                profileImage: "", // NEW FIELD
                contactEmail: "",
                contactPhone: "",
                address:"",
                socialLinks: {
                    linkedin: "",
                    github: "",
                    twitter: "",
                    instagram:"",
                    portfolio: ""
                },
                resumePdf: "",
                isActive: true
            };
            state.error = null;
            state.loading = false;
            state.operationLoading = false;
            state.operationType = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch about information
            .addCase(fetchAbout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAbout.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && typeof action.payload === 'object') {
                    if (action.payload._id) {
                        // Full about object returned
                        state.about = {
                            ...state.about,
                            ...action.payload,
                            description: safeParseDescription(action.payload.description)
                        };
                    } else {
                        // Default structure returned when no about exists
                        state.about = {
                            ...state.about,
                            ...action.payload,
                            description: action.payload.description 
                                ? safeParseDescription(action.payload.description)
                                : state.about.description
                        };
                    }
                }
            })
            .addCase(fetchAbout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create or Update about
            .addCase(createOrUpdateAbout.pending, (state) => {
                state.operationLoading = true;
                state.operationType = 'createOrUpdate';
                state.error = null;
            })
            .addCase(createOrUpdateAbout.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.about = {
                    ...state.about,
                    ...action.payload,
                    description: safeParseDescription(action.payload.description)
                };
            })
            .addCase(createOrUpdateAbout.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.error = action.payload;
            })
            // Update resume only
            .addCase(updateResume.pending, (state) => {
                state.operationLoading = true;
                state.operationType = 'updateResume';
                state.error = null;
            })
            .addCase(updateResume.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.about.resumePdf = action.payload.resumeUrl || "";
            })
            .addCase(updateResume.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.error = action.payload;
            })
            // NEW: Update profile image only
            .addCase(updateProfileImage.pending, (state) => {
                state.operationLoading = true;
                state.operationType = 'updateProfileImage';
                state.error = null;
            })
            .addCase(updateProfileImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.about.profileImage = action.payload.profileImageUrl || "";
            })
            .addCase(updateProfileImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.error = action.payload;
            })
            // NEW: Delete profile image
            .addCase(deleteProfileImage.pending, (state) => {
                state.operationLoading = true;
                state.operationType = 'deleteProfileImage';
                state.error = null;
            })
            .addCase(deleteProfileImage.fulfilled, (state) => {
                state.operationLoading = false;
                state.operationType = null;
                state.about.profileImage = "";
            })
            .addCase(deleteProfileImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.error = action.payload;
            })
            // Delete resume
            .addCase(deleteResume.pending, (state) => {
                state.operationLoading = true;
                state.operationType = 'deleteResume';
                state.error = null;
            })
            .addCase(deleteResume.fulfilled, (state) => {
                state.operationLoading = false;
                state.operationType = null;
                state.about.resumePdf = "";
            })
            .addCase(deleteResume.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.error = action.payload;
            })
            // Toggle active status
            .addCase(toggleActiveStatus.pending, (state) => {
                state.operationLoading = true;
                state.operationType = 'toggleActive';
                state.error = null;
            })
            .addCase(toggleActiveStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.about.isActive = action.payload.isActive;
            })
            .addCase(toggleActiveStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationType = null;
                state.error = action.payload;
            });
    },
});

export const { 
    clearError, 
    updateAboutFields, 
    updateField, 
    addDescriptionItem,
    updateDescriptionItem,
    removeDescriptionItem,
    clearAbout, 
    resetAbout 
} = aboutSlice.actions;

export default aboutSlice.reducer;