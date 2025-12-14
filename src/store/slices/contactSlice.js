// store/slices/contactSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// =========================
// Send Contact Message (public - no auth needed)
// =========================
export const sendContactMessage = createAsyncThunk(
    "contact/sendMessage",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/contact/submit", formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// =========================
// Get All Contacts (protected - requires auth)
// =========================
export const fetchContacts = createAsyncThunk(
    "contact/fetchContacts",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { page = 1, limit = 20, search = '' } = params;
            const response = await api.get("/api/contact", {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch contacts');
        }
    }
);

// =========================
// Get Single Contact by ID (protected - requires auth)
// =========================
export const fetchContactById = createAsyncThunk(
    "contact/fetchContactById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/contact/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch contact');
        }
    }
);

// =========================
// Delete Single Contact (protected - requires auth)
// =========================
export const deleteContact = createAsyncThunk(
    "contact/deleteContact",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/api/contact/${id}`);
            return { id, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete contact');
        }
    }
);

// =========================
// Delete Multiple Contacts (protected - requires auth)
// =========================
export const deleteMultipleContacts = createAsyncThunk(
    "contact/deleteMultipleContacts",
    async (ids, { rejectWithValue }) => {
        try {
            const response = await api.delete("/api/contact", {
                data: { ids }
            });
            return { ids, message: response.data.message, deletedCount: response.data.deletedCount };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete contacts');
        }
    }
);

const contactSlice = createSlice({
    name: "contact",
    initialState: {
        // For send contact message
        loading: false,
        success: false,
        error: null,
        
        // For contact management (admin)
        contacts: [],
        contactDetails: null,
        loadingContacts: false,
        operationLoading: false, // For CRUD operations
        pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0
        }
    },

    reducers: {
        clearContactStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
        clearContactsError: (state) => {
            state.error = null;
        },
        clearContactDetails: (state) => {
            state.contactDetails = null;
        },
        clearAllContacts: (state) => {
            state.contacts = [];
            state.contactDetails = null;
            state.pagination = {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0
            };
        }
    },

    extraReducers: (builder) => {
        builder
            // ====================================
            // Send Contact Message
            // ====================================
            .addCase(sendContactMessage.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(sendContactMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(sendContactMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ====================================
            // Fetch All Contacts
            // ====================================
            .addCase(fetchContacts.pending, (state) => {
                state.loadingContacts = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loadingContacts = false;
                state.contacts = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loadingContacts = false;
                state.error = action.payload;
                // Clear contacts on auth error
                if (action.payload?.includes('Unauthorized') ||
                    action.payload?.includes('No token') ||
                    action.payload?.includes('No token provided')) {
                    state.contacts = [];
                }
            })

            // ====================================
            // Fetch Contact by ID
            // ====================================
            .addCase(fetchContactById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchContactById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.contactDetails = action.payload.data;
            })
            .addCase(fetchContactById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // ====================================
            // Delete Single Contact
            // ====================================
            .addCase(deleteContact.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.operationLoading = false;
                // Remove deleted contact from list
                const deletedId = action.payload.id;
                state.contacts = state.contacts.filter(
                    (contact) => contact._id !== deletedId
                );
                // Update pagination
                state.pagination.total -= 1;
                state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                // Clear contact details if it was the deleted one
                if (state.contactDetails && state.contactDetails._id === deletedId) {
                    state.contactDetails = null;
                }
            })
            .addCase(deleteContact.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // ====================================
            // Delete Multiple Contacts
            // ====================================
            .addCase(deleteMultipleContacts.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteMultipleContacts.fulfilled, (state, action) => {
                state.operationLoading = false;
                // Filter out deleted contacts
                const deletedIds = action.payload.ids;
                state.contacts = state.contacts.filter(
                    (contact) => !deletedIds.includes(contact._id)
                );
                // Update pagination
                state.pagination.total -= action.payload.deletedCount;
                state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                // Clear contact details if it was deleted
                if (state.contactDetails && deletedIds.includes(state.contactDetails._id)) {
                    state.contactDetails = null;
                }
            })
            .addCase(deleteMultipleContacts.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { 
    clearContactStatus, 
    clearContactsError, 
    clearContactDetails, 
    clearAllContacts 
} = contactSlice.actions;
export default contactSlice.reducer;