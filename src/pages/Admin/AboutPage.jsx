import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Briefcase,
    Mail,
    Phone,
    Linkedin,
    Github,
    Twitter,
    Globe,
    FileText,
    Edit2,
    Trash2,
    Download,
    Upload,
    X,
    Check,
    AlertCircle,
    Loader2,
    Eye,
    Power,
    Save,
    Plus,
    Minus,
    Shield,
    Calendar,
    ExternalLink,
    Quote,
    Image,
    Camera,
    Instagram,
    MapPin
} from 'lucide-react';
import {
    fetchAbout,
    createOrUpdateAbout,
    updateResume,
    deleteResume,
    updateProfileImage,
    deleteProfileImage,
    toggleActiveStatus,
    clearError,
    updateField,
    addDescriptionItem,
    updateDescriptionItem,
    removeDescriptionItem
} from '../../store/slices/aboutSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AboutManagerPage = () => {
    const dispatch = useDispatch();
    const { about, loading, error, operationLoading, operationType } = useSelector((state) => state.about);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        role: '',
        quote: '',
        description: [],
        contactEmail: '',
        contactPhone: '',
        address: '',
        linkedin: '',
        github: '',
        twitter: '',
        instagram: '',
        portfolio: ''
    });
    const [newDescriptionItem, setNewDescriptionItem] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [deleteProfileConfirm, setDeleteProfileConfirm] = useState(false);

    useEffect(() => {
        dispatch(fetchAbout());
    }, [dispatch]);

    useEffect(() => {
        if (about) {
            setFormData({
                role: about.role || '',
                quote: about.quote || '',
                description: Array.isArray(about.description) ? about.description : [],
                contactEmail: about.contactEmail || '',
                contactPhone: about.contactPhone || '',
                address: about.address || '',
                linkedin: about.socialLinks?.linkedin || '',
                github: about.socialLinks?.github || '',
                twitter: about.socialLinks?.twitter || '',
                instagram: about.socialLinks?.instagram || '',
                portfolio: about.socialLinks?.portfolio || ''
            });
        }
    }, [about]);

    useEffect(() => {
        if (error) {
            toast.error(`Error: ${error.message || error || 'Something went wrong'}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
            console.error('About Error:', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('social.')) {
            const socialField = name.split('.')[1];
            const updatedSocialLinks = {
                ...formData,
                [socialField]: value
            };
            setFormData(updatedSocialLinks);

            dispatch(updateField({
                field: `socialLinks.${socialField}`,
                value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            if (name !== 'description') {
                dispatch(updateField({ field: name, value }));
            }
        }
    };

    const handleAddDescriptionItem = () => {
        if (newDescriptionItem.trim()) {
            const updatedDescription = [...formData.description, newDescriptionItem.trim()];
            setFormData(prev => ({
                ...prev,
                description: updatedDescription
            }));
            dispatch(addDescriptionItem(newDescriptionItem.trim()));
            setNewDescriptionItem('');
        }
    };

    const handleUpdateDescriptionItem = (index, value) => {
        const updatedDescription = [...formData.description];
        updatedDescription[index] = value;
        setFormData(prev => ({
            ...prev,
            description: updatedDescription
        }));
        dispatch(updateDescriptionItem({ index, value }));
    };

    const handleRemoveDescriptionItem = (index) => {
        const updatedDescription = formData.description.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            description: updatedDescription
        }));
        dispatch(removeDescriptionItem(index));
    };

    const handleSave = async () => {
        const descriptionArray = Array.isArray(formData.description)
            ? formData.description
            : formData.description.trim()
                ? [formData.description]
                : [];

        const data = new FormData();
        data.append('role', formData.role);
        data.append('quote', formData.quote || ""); // NEW FIELD
        data.append('description', JSON.stringify(descriptionArray));
        data.append('contactEmail', formData.contactEmail);
        data.append('contactPhone', formData.contactPhone);
        data.append('address', formData.address || "");
        data.append('socialLinks', JSON.stringify({
            linkedin: formData.linkedin,
            github: formData.github,
            twitter: formData.twitter,
            instagram: formData.instagram,
            portfolio: formData.portfolio
        }));

        // Handle profile image upload if selected
        if (profileImageFile) {
            data.append('profileImage', profileImageFile);
        }

        // Handle resume upload if selected
        if (resumeFile) {
            data.append('resumePdf', resumeFile);
        }

        try {
            await dispatch(createOrUpdateAbout(data)).unwrap();
            toast.success('About section saved successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            setIsEditing(false);
            setResumeFile(null);
            setProfileImageFile(null);
        } catch (err) {
            toast.error(`Failed to save: ${err.message || err || 'Something went wrong'}`, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setResumeFile(null);
        setProfileImageFile(null);
        setNewDescriptionItem('');

        if (about) {
            setFormData({
                role: about.role || '',
                quote: about.quote || '',
                description: Array.isArray(about.description) ? about.description : [],
                contactEmail: about.contactEmail || '',
                contactPhone: about.contactPhone || '',
                address: about.address || '',
                linkedin: about.socialLinks?.linkedin || '',
                github: about.socialLinks?.github || '',
                twitter: about.socialLinks?.twitter || '',
                instagram: about.socialLinks?.instagram || '',
                portfolio: about.socialLinks?.portfolio || ''
            });
        }
        dispatch(clearError());
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload a PDF file', {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB', {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

            setIsUploading(true);
            const formData = new FormData();
            formData.append('resumePdf', file);

            try {
                await dispatch(updateResume(formData)).unwrap();
                toast.success('Resume uploaded successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                });
                setResumeFile(null);
            } catch (err) {
                toast.error(`Failed to upload resume: ${err.message || err}`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file (JPG, PNG, etc.)', {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB', {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

            setIsImageUploading(true);
            const formData = new FormData();
            formData.append('profileImage', file);

            try {
                await dispatch(updateProfileImage(formData)).unwrap();
                toast.success('Profile image uploaded successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                });
                setProfileImageFile(null);
            } catch (err) {
                toast.error(`Failed to upload profile image: ${err.message || err}`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            } finally {
                setIsImageUploading(false);
            }
        }
    };

    const handleDeleteProfileImage = async () => {
        try {
            await dispatch(deleteProfileImage()).unwrap();
            toast.success('Profile image deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            setDeleteProfileConfirm(false);
        } catch (err) {
            toast.error(`Failed to delete profile image: ${err.message || err}`, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleDeleteResume = async () => {
        try {
            await dispatch(deleteResume()).unwrap();
            toast.success('Resume deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            setDeleteConfirm(false);
        } catch (err) {
            toast.error(`Failed to delete resume: ${err.message || err}`, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleToggleActive = async () => {
        try {
            await dispatch(toggleActiveStatus()).unwrap();
            toast.success(`About section ${!about.isActive ? 'activated' : 'deactivated'}!`, {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (err) {
            toast.error(`Failed to toggle status: ${err.message || err}`, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const SocialIcon = ({ platform }) => {
        const icons = {
            linkedin: Linkedin,
            github: Github,
            twitter: Twitter,
            instagram: Instagram,
            portfolio: Globe
        };

        const colors = {
            linkedin: 'text-[#0077B5]',
            github: 'text-gray-800',
            twitter: 'text-[#1DA1F2]',
            instagram: 'text-[#E4405F]',
            portfolio: 'text-purple-600'
        };

        const Icon = icons[platform];
        return Icon ? <Icon className={`w-3.5 h-3.5 ${colors[platform]}`} /> : null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600 text-xs">Loading about information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className="!text-xs"
            />

            <div className="max-w-7xl mx-auto px-3 py-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-white mb-2 border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col gap-4"
                >
                    {/* MOBILE LAYOUT (Heading top, buttons bottom) */}
                    <div className="flex flex-col gap-3 sm:hidden">

                        {/* HEADING */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                                <User className="w-5 h-5" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">About Section Manager</h2>
                                <p className="text-gray-500 text-xs">Manage your professional profile</p>
                            </div>
                        </div>

                        {/* BUTTONS BELOW HEADING */}
                        <div className="flex flex-col gap-2">

                            {/* EDIT BUTTON */}
                            <button
                                onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                                className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                {isEditing ? "Cancel" : "Edit"}
                            </button>

                            {/* ACTIVATE / DEACTIVATE BUTTON */}
                            <button
                                onClick={handleToggleActive}
                                disabled={operationLoading && operationType === "toggleActive"}
                                className={`w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow text-white transition
          ${about?.isActive
                                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                    }`}
                            >
                                <Power className="w-4 h-4" />
                                {operationLoading && operationType === "toggleActive" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : about?.isActive ? (
                                    "Deactivate"
                                ) : (
                                    "Activate"
                                )}
                            </button>

                        </div>
                    </div>

                    {/* DESKTOP + TABLET LAYOUT */}
                    <div className="hidden sm:flex items-center justify-between">

                        {/* LEFT TITLE */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                                <User className="w-5 h-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">About Section Manager</h2>
                                <p className="text-gray-500 text-sm">Manage your professional profile</p>
                            </div>
                        </div>

                        {/* RIGHT ACTION BUTTONS */}
                        <div className="flex items-center gap-3">

                            {/* EDIT BUTTON */}
                            <button
                                onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                {isEditing ? "Cancel" : "Edit"}
                            </button>

                            {/* ACTIVATE BUTTON */}
                            <button
                                onClick={handleToggleActive}
                                disabled={operationLoading && operationType === "toggleActive"}
                                className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm font-semibold rounded-lg shadow text-white transition
          ${about?.isActive
                                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                    }`}
                            >
                                <Power className="w-4 h-4" />
                                {operationLoading && operationType === "toggleActive" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : about?.isActive ? (
                                    "Deactivate"
                                ) : (
                                    "Activate"
                                )}
                            </button>

                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Left Column - Profile Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-3"
                    >
                        {/* Profile Image & Quote Card */}
                        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                            <div className={`p-3 text-white ${isEditing ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            {isEditing ? <Edit2 className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold">
                                                {isEditing ? 'Editing Profile Image & Quote' : 'Profile Image & Quote'}
                                            </h2>
                                            <p className={`text-xs ${isEditing ? 'text-amber-100' : 'text-indigo-100'}`}>
                                                {isEditing ? 'Update your visual profile and inspirational quote' : 'Your profile image and personal quote'}
                                            </p>
                                        </div>
                                    </div>
                                    {!isEditing && (
                                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${about?.isActive ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                                                {about?.isActive ? 'Active' : 'Inactive'}
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center cursor-pointer gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-xs"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-3">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        {/* Profile Image Upload */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-medium text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <Image className="w-3 h-3 text-orange-600" />
                                                    Profile Image
                                                </div>
                                            </label>
                                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                                {/* Current Profile Image Preview */}
                                                <div className="w-24 h-24 flex-shrink-0 relative">
                                                    {about?.profileImage ? (
                                                        <div className="relative w-full h-full">
                                                            <img
                                                                src={about.profileImage}
                                                                alt="Profile"
                                                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                            />
                                                            <button
                                                                onClick={() => setDeleteProfileConfirm(true)}
                                                                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                                                            <User className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload Area */}
                                                <div className="flex-1">
                                                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-3 text-center bg-orange-50 hover:border-orange-400 transition-colors">
                                                        <input
                                                            type="file"
                                                            id="profile-image-upload"
                                                            accept="image/*"
                                                            onChange={handleProfileImageUpload}
                                                            className="hidden"
                                                            disabled={isImageUploading || (operationLoading && operationType === 'updateProfileImage')}
                                                        />
                                                        <label
                                                            htmlFor="profile-image-upload"
                                                            className="cursor-pointer flex flex-col items-center justify-center"
                                                        >
                                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-2 border border-orange-200">
                                                                {isImageUploading || (operationLoading && operationType === 'updateProfileImage') ? (
                                                                    <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
                                                                ) : (
                                                                    <Upload className="w-5 h-5 text-orange-600" />
                                                                )}
                                                            </div>
                                                            <p className="font-medium text-gray-900 text-xs mb-0.5">
                                                                {isImageUploading || (operationLoading && operationType === 'updateProfileImage') ? 'Uploading...' : 'Click to upload'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">JPG, PNG, WEBP • Max 5MB</p>
                                                        </label>
                                                    </div>
                                                    {profileImageFile && (
                                                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                                            <p className="text-xs text-blue-700 font-medium">
                                                                New image selected: {profileImageFile.name}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quote Input */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                <div className="flex items-center gap-1">
                                                    <Quote className="w-3 h-3 text-orange-600" />
                                                    Personal Quote
                                                </div>
                                            </label>
                                            <textarea
                                                name="quote"
                                                value={formData.quote}
                                                onChange={handleInputChange}
                                                placeholder="Add an inspirational quote or personal motto..."
                                                rows="3"
                                                className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs resize-none"
                                            />
                                            <p className="text-xs text-gray-500 mt-0.5">This will appear as your personal quote</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* Profile Image Preview */}
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <div className="relative w-32 h-32 flex-shrink-0">
                                                {about?.profileImage ? (
                                                    <div className="w-full h-full rounded-lg overflow-hidden border-4 border-white shadow-lg">
                                                        <img
                                                            src={about.profileImage}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                                                        <User className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1">
                                                    <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                        Profile
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quote Preview */}
                                            <div className="flex-1 min-w-0">
                                                <div className="relative p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                                                    <Quote className="absolute top-2 right-2 w-3.5 h-3.5 text-indigo-400" />
                                                    <label className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1.5 block">
                                                        Personal Quote
                                                    </label>
                                                    {about?.quote ? (
                                                        <p className="text-gray-800 text-sm italic leading-relaxed">
                                                            "{about.quote}"
                                                        </p>
                                                    ) : (
                                                        <div className="p-2 bg-white/50 rounded border border-dashed border-gray-300">
                                                            <p className="text-xs text-gray-500 text-center">
                                                                No quote added yet. Add an inspirational quote to personalize your profile.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-200">
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${about?.profileImage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {about?.profileImage ? '✓ Profile Image Uploaded' : 'No Profile Image'}
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${about?.quote ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {about?.quote ? '✓ Quote Added' : 'No Quote Added'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Professional Info Card */}
                        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                            <div className={`p-3 text-white ${isEditing ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'}`}>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            {isEditing ? (
                                                <Edit2 className="w-4 h-4" />
                                            ) : (
                                                <Briefcase className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold">
                                                {isEditing ? 'Editing Professional Info' : 'Professional Information'}
                                            </h2>
                                            <p className={`text-xs ${isEditing ? 'text-amber-100' : 'text-blue-100'}`}>
                                                {isEditing ? 'Make your changes below' : 'Your professional details'}
                                            </p>
                                        </div>
                                    </div>
                                    {!isEditing && (
                                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center cursor-pointer gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-xs"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        {/* Role Input */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="w-3 h-3 text-orange-600" />
                                                    Professional Role *
                                                </div>
                                            </label>
                                            <input
                                                type="text"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Senior Full Stack Developer"
                                                className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs"
                                            />
                                        </div>

                                        {/* Description Input - Array */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                <div className="flex items-center gap-1">
                                                    <FileText className="w-3 h-3 text-orange-600" />
                                                    Description *
                                                </div>
                                            </label>

                                            {/* Existing description items */}
                                            <div className="space-y-1.5 mb-2">
                                                {formData.description.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-1.5">
                                                        <input
                                                            type="text"
                                                            value={item}
                                                            onChange={(e) => handleUpdateDescriptionItem(index, e.target.value)}
                                                            placeholder="Description point..."
                                                            className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveDescriptionItem(index)}
                                                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors cursor-pointer"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add new description item */}
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="text"
                                                    value={newDescriptionItem}
                                                    onChange={(e) => setNewDescriptionItem(e.target.value)}
                                                    placeholder="Add new description point..."
                                                    className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddDescriptionItem()}
                                                />
                                                <button
                                                    onClick={handleAddDescriptionItem}
                                                    className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">Press Enter or click + to add points</p>
                                        </div>

                                        {/* Contact Inputs */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3 text-orange-600" />
                                                        Contact Email
                                                    </div>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="contactEmail"
                                                    value={formData.contactEmail}
                                                    onChange={handleInputChange}
                                                    placeholder="your.email@example.com"
                                                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3 text-orange-600" />
                                                        Contact Phone
                                                    </div>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="contactPhone"
                                                    value={formData.contactPhone}
                                                    onChange={handleInputChange}
                                                    placeholder="+1 (555) 123-4567"
                                                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Address Input - NEW FIELD */}
                                        <div className="pt-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-orange-600" /> {/* Add MapPin import */}
                                                    Address
                                                </div>
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Enter your address..."
                                                rows="2"
                                                className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs resize-none"
                                            />
                                        </div>

                                        {/* Social Links Inputs */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-3 h-3 text-orange-600" />
                                                    Social Links
                                                </div>
                                            </label>
                                            <div className="space-y-1.5">
                                                {[
                                                    { key: 'social.linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/yourprofile' },
                                                    { key: 'social.github', label: 'GitHub', icon: Github, placeholder: 'github.com/yourusername' },
                                                    { key: 'social.twitter', label: 'Twitter', icon: Twitter, placeholder: 'twitter.com/yourhandle' },
                                                    { key: 'social.instagram', label: 'Instagram', icon: Instagram, placeholder: 'instagram.com/yourusername' },
                                                    { key: 'social.portfolio', label: 'Portfolio', icon: Globe, placeholder: 'yourportfolio.com' }
                                                ].map((social) => {
                                                    const Icon = social.icon;
                                                    const formKey = social.key.replace('social.', '');
                                                    return (
                                                        <div key={social.key} className="flex items-center gap-2">
                                                            <div className="w-7 h-7 bg-gradient-to-br from-orange-100 to-amber-100 rounded flex items-center justify-center flex-shrink-0 border border-orange-200">
                                                                <Icon className="w-3.5 h-3.5 text-orange-600" />
                                                            </div>
                                                            <input
                                                                type="url"
                                                                name={social.key}
                                                                value={formData[formKey]}
                                                                onChange={handleInputChange}
                                                                placeholder={social.placeholder}
                                                                className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all bg-gray-50 text-xs"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-1.5 pt-3 border-t border-gray-200">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSave}
                                                disabled={operationLoading && operationType === 'createOrUpdate'}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium flex items-center justify-center gap-1.5 shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                                            >
                                                {operationLoading && operationType === 'createOrUpdate' ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Save className="w-3.5 h-3.5" />
                                                )}
                                                Save All Changes
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleCancel}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs cursor-pointer"
                                            >
                                                Discard
                                            </motion.button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* Role Preview */}
                                        <div className="relative p-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-100">
                                            <div className="absolute top-1.5 right-1.5">
                                                <div className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                    Role
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center">
                                                    <Briefcase className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Professional Role</label>
                                                    <h3 className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                                                        {about?.role || 'Your Professional Role'}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description Preview */}
                                        <div className="relative p-2.5 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-lg border border-purple-100">
                                            <div className="absolute top-1.5 right-1.5">
                                                <div className="px-1 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                                    Description
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <FileText className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <label className="text-xs font-medium text-purple-600 uppercase tracking-wide">About Me</label>
                                                    <div className="mt-1">
                                                        {Array.isArray(about?.description) && about.description.length > 0 ? (
                                                            <ul className="space-y-1">
                                                                {about.description.map((item, index) => (
                                                                    <li key={index} className="text-gray-700 text-xs leading-relaxed flex items-start">
                                                                        <span className="text-purple-500 mr-1.5">•</span>
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <div className="mt-1 p-2 bg-white/50 rounded border border-dashed border-gray-300">
                                                                <p className="text-xs text-gray-500 text-center">
                                                                    No description added yet. Click Edit to add one.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info Preview */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="relative p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded flex items-center justify-center">
                                                        <Mail className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <label className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-0.5">Contact Email</label>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-gray-900 font-medium text-xs truncate">
                                                                {about?.contactEmail || 'Not set'}
                                                            </p>
                                                            {about?.contactEmail && (
                                                                <a href={`mailto:${about.contactEmail}`} className="text-emerald-600 hover:text-emerald-700 ml-1 cursor-pointer">
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 rounded flex items-center justify-center">
                                                        <Phone className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <label className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-0.5">Contact Phone</label>
                                                        <p className="text-gray-900 font-medium text-xs truncate">
                                                            {about?.contactPhone || 'Not set'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Address Preview - NEW FIELD */}
                                        <div className="relative p-2.5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-gradient-to-br from-rose-500 to-pink-600 rounded flex items-center justify-center">
                                                    <MapPin className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <label className="text-xs font-medium text-rose-600 uppercase tracking-wide mb-0.5">Address</label>
                                                    <p className="text-gray-900 text-xs">
                                                        {about?.address || 'Not set'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Social Links Preview */}
                                        <div className="relative p-2.5 bg-gradient-to-r from-gray-50 to-slate-100 rounded-lg border border-gray-200">
                                            <div className="absolute top-1.5 right-1.5">
                                                <div className="px-1 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                    Social Links
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 bg-gradient-to-br from-gray-600 to-slate-700 rounded flex items-center justify-center">
                                                    <Globe className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Connect With Me</label>
                                                    <p className="text-xs text-gray-500 truncate">Professional social profiles</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                                                {['linkedin', 'github', 'twitter', 'instagram', 'portfolio'].map((platform) => {
                                                    const hasLink = about?.socialLinks?.[platform];
                                                    return (
                                                        <a
                                                            key={platform}
                                                            href={hasLink || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`flex flex-col items-center justify-center p-1.5 rounded transition-all transform hover:-translate-y-0.5 ${hasLink ? 'bg-white hover:shadow border border-gray-200 hover:border-blue-300 cursor-pointer' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}
                                                        >
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-0.5 ${hasLink ? 'bg-gray-50' : 'bg-gray-200'}`}>
                                                                <SocialIcon platform={platform} />
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-700 capitalize">
                                                                {platform}
                                                            </span>
                                                            <span className={`text-xs mt-0.5 ${hasLink ? 'text-blue-600' : 'text-gray-500'}`}>
                                                                {hasLink ? 'View' : 'Not set'}
                                                            </span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Resume Management & Status */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        {/* Resume Card */}
                        <div className={`bg-white rounded-lg shadow border border-gray-100 overflow-hidden ${isEditing ? 'border-orange-200' : ''}`}>
                            <div className={`p-3 text-white ${isEditing ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            {isEditing ? <Edit2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold">
                                                {isEditing ? 'Editing Resume' : 'Resume Management'}
                                            </h2>
                                            <p className={`text-xs ${isEditing ? 'text-amber-100' : 'text-emerald-100'}`}>
                                                {isEditing ? 'Upload or manage your resume' : 'Manage your CV/Resume'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        {/* Upload Section */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-medium text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <Upload className="w-3 h-3 text-orange-600" />
                                                    Upload New Resume
                                                </div>
                                            </label>
                                            <div className="border-2 border-dashed border-orange-300 rounded-lg p-3 text-center bg-orange-50 hover:border-orange-400 transition-colors">
                                                <input
                                                    type="file"
                                                    id="resume-upload"
                                                    accept=".pdf"
                                                    onChange={handleResumeUpload}
                                                    className="hidden"
                                                    disabled={isUploading || (operationLoading && operationType === 'updateResume')}
                                                />
                                                <label
                                                    htmlFor="resume-upload"
                                                    className="cursor-pointer flex flex-col items-center justify-center"
                                                >
                                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-2 border border-orange-200">
                                                        {isUploading || (operationLoading && operationType === 'updateResume') ? (
                                                            <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
                                                        ) : (
                                                            <Upload className="w-5 h-5 text-orange-600" />
                                                        )}
                                                    </div>
                                                    <p className="font-medium text-gray-900 text-xs mb-0.5">
                                                        {isUploading || (operationLoading && operationType === 'updateResume') ? 'Uploading...' : 'Click to upload'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">PDF files only, max 5MB</p>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Current Resume (if exists) */}
                                        {about?.resumePdf && (
                                            <div className="p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                                                <label className="text-xs font-medium text-gray-500 mb-1.5">Current Resume</label>
                                                <div className="flex items-center justify-between p-1.5 bg-white rounded border border-emerald-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                                                            <FileText className="w-3.5 h-3.5 text-red-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-900 text-xs truncate">Resume.pdf</p>
                                                            <p className="text-xs text-gray-500">PDF Document</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <motion.a
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            href={about.resumePdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors cursor-pointer"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                        </motion.a>
                                                        <motion.a
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            href={about.resumePdf}
                                                            download
                                                            className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors cursor-pointer"
                                                        >
                                                            <Download className="w-3 h-3" />
                                                        </motion.a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : about?.resumePdf ? (
                                    <div className="space-y-3">
                                        {/* Current Resume */}
                                        <div className="p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                                            <label className="text-xs font-medium text-gray-500 mb-1.5">Current Resume</label>
                                            <div className="flex items-center justify-between p-1.5 bg-white rounded border border-emerald-200">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                                                        <FileText className="w-3.5 h-3.5 text-red-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 text-xs truncate">Resume.pdf</p>
                                                        <p className="text-xs text-gray-500">PDF Document</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={about.resumePdf}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors cursor-pointer"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </motion.a>
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={about.resumePdf}
                                                        download
                                                        className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors cursor-pointer"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                    </motion.a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <FileText className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-0.5">No Resume Uploaded</h3>
                                        <p className="text-gray-600 text-xs mb-3">Upload your resume to make it available</p>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium text-xs cursor-pointer"
                                        >
                                            <Upload className="w-3 h-3" />
                                            Upload Resume
                                        </motion.button>
                                    </div>
                                )}

                                {/* Delete Resume Button (only in edit mode) */}
                                {isEditing && about?.resumePdf && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setDeleteConfirm(true)}
                                            disabled={operationLoading && operationType === 'deleteResume'}
                                            className="w-full flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 rounded-lg hover:from-red-100 hover:to-rose-100 transition-all border border-red-200 font-medium text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {operationLoading && operationType === 'deleteResume' ? (
                                                <>
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete Current Resume
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white rounded-lg shadow border border-gray-100 p-3">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center">
                                    <Shield className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Status Overview</h3>
                                    <p className="text-xs text-gray-500">Current section status</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${about?.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                        <span className="text-xs font-medium text-gray-700">Profile Status</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${about?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {about?.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${about?.profileImage ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <span className="text-xs font-medium text-gray-700">Profile Image</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${about?.profileImage ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {about?.profileImage ? 'Uploaded' : 'Not Uploaded'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${about?.quote ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <span className="text-xs font-medium text-gray-700">Quote</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${about?.quote ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {about?.quote ? 'Added' : 'Not Added'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${about?.resumePdf ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <span className="text-xs font-medium text-gray-700">Resume Status</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${about?.resumePdf ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {about?.resumePdf ? 'Uploaded' : 'Not Uploaded'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-amber-600" />
                                        <span className="text-xs font-medium text-gray-700">Last Updated</span>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">
                                        {about?.updatedAt ? new Date(about.updatedAt).toLocaleDateString() : 'Never'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Delete Resume Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg p-4 max-w-xs w-full shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Delete Resume</h3>
                                    <p className="text-gray-600 text-xs">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-gray-700 text-xs mb-3">
                                Are you sure you want to delete your current resume? This will remove it from your profile.
                            </p>

                            <div className="flex flex-col gap-1.5">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setDeleteConfirm(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors font-medium text-xs cursor-pointer"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDeleteResume}
                                    disabled={operationLoading && operationType === 'deleteResume'}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded hover:from-red-600 hover:to-red-700 transition-all font-medium shadow disabled:opacity-50 flex items-center justify-center gap-1 text-xs cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {operationLoading && operationType === 'deleteResume' ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3 h-3" />
                                    )}
                                    Delete Resume
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Profile Image Confirmation Modal */}
            <AnimatePresence>
                {deleteProfileConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setDeleteProfileConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg p-4 max-w-xs w-full shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Delete Profile Image</h3>
                                    <p className="text-gray-600 text-xs">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-gray-700 text-xs mb-3">
                                Are you sure you want to delete your profile image? This will remove it from your profile.
                            </p>

                            <div className="flex flex-col gap-1.5">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setDeleteProfileConfirm(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors font-medium text-xs cursor-pointer"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDeleteProfileImage}
                                    disabled={operationLoading && operationType === 'deleteProfileImage'}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded hover:from-red-600 hover:to-red-700 transition-all font-medium shadow disabled:opacity-50 flex items-center justify-center gap-1 text-xs cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {operationLoading && operationType === 'deleteProfileImage' ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3 h-3" />
                                    )}
                                    Delete Image
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AboutManagerPage;