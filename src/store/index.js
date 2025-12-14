// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import skillsReducer from './slices/skillsSlice';
import certificationsReducer from './slices/certificationsSlice';
import experiencesReducer from './slices/experiencesSlice';
import projectsReducer from './slices/projectsSlice';
import aboutReducer from './slices/aboutSlice';
import authReducer from './slices/authSlice';
import contactReducer from './slices/contactSlice';

export const store = configureStore({
    reducer: {
        skills: skillsReducer,
        certifications: certificationsReducer,
        experiences: experiencesReducer,
        projects: projectsReducer,
        about: aboutReducer,
        auth: authReducer,
        contact: contactReducer,
    },
});

export default store;