import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  Eye,
  Calendar,
  Mail,
  Phone,
  Building,
  Globe,
  MessageSquare,
  User,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
  X,
  Users,
  Clock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  fetchContacts,
  deleteContact,
  deleteMultipleContacts,
  fetchContactById,
  clearContactsError,
  clearContactDetails,
  clearAllContacts,
} from '../../store/slices/contactSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactResponsesPage = () => {
  const dispatch = useDispatch();
  const {
    contacts,
    contactDetails,
    loadingContacts,
    operationLoading,
    error,
    pagination,
  } = useSelector((state) => state.contact);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [bulkDeleteConfirmation, setBulkDeleteConfirmation] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch contacts on component mount and when filters change
  useEffect(() => {
    dispatch(fetchContacts({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
    }));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  // Handle search with debounce
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // Handle contact selection
  const handleSelectContact = (id) => {
    setSelectedContacts(prev =>
      prev.includes(id)
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  // Select all contacts on current page
  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact._id));
    }
  };

  // View contact details
  const handleViewDetails = async (id) => {
    try {
      await dispatch(fetchContactById(id)).unwrap();
      setIsDetailsOpen(true);
    } catch (err) {
      toast.error(`Failed to load contact details: ${err.message || err}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Delete single contact
  const handleDeleteClick = (contact) => {
    setDeleteConfirmation({
      id: contact._id,
      name: contact.name,
      email: contact.email,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation) {
      try {
        await dispatch(deleteContact(deleteConfirmation.id)).unwrap();
        toast.success('Contact response deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        setDeleteConfirmation(null);
        setSelectedContacts(prev => prev.filter(id => id !== deleteConfirmation.id));
      } catch (err) {
        toast.error(`Failed to delete: ${err.message || err}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  // Bulk delete contacts
  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;

    try {
      await dispatch(deleteMultipleContacts(selectedContacts)).unwrap();
      toast.success(`${selectedContacts.length} contact response(s) deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
      setSelectedContacts([]);
      setBulkDeleteConfirmation(false);
    } catch (err) {
      toast.error(`Failed to delete contacts: ${err.message || err}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) setCurrentPage(currentPage + 1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter contacts based on status
  const filteredContacts = contacts.filter(contact => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'with-company') return contact.companyName;
    if (selectedStatus === 'no-company') return !contact.companyName;
    return true;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`, {
        position: "top-right",
        autoClose: 5000,
      });
      dispatch(clearContactsError());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-[calc(100vh-22vh)] bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Toast Container */}
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
        style={{ marginTop: '60px' }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
                Contact Responses
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage and review contact form submissions from your portfolio
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedContacts.length > 0 && (
                <motion.button
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBulkDeleteConfirmation(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedContacts.length})
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetFilters();
                  dispatch(fetchContacts({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm,
                  }));
                }}
                disabled={loadingContacts}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingContacts ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Responses</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{pagination.total}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">With Company</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {contacts.filter(c => c.companyName).length}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Building className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Current Page</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {currentPage} / {pagination.totalPages || 1}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-4 sm:mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name, email, or company..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer w-full sm:w-auto"
              >
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Filter Dropdown */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-3"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Status Filter
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'all', label: 'All Responses', count: contacts.length },
                            { value: 'with-company', label: 'With Company', count: contacts.filter(c => c.companyName).length },
                            { value: 'no-company', label: 'Without Company', count: contacts.filter(c => !c.companyName).length },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedStatus(option.value)}
                              className={`flex items-center justify-between w-full p-2 rounded-lg transition-all cursor-pointer ${selectedStatus === option.value
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${selectedStatus === option.value ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                <span className="text-sm">{option.label}</span>
                              </div>
                              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                                {option.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Sort By
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'newest', label: 'Newest First' },
                            { value: 'oldest', label: 'Oldest First' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSortBy(option.value)}
                              className={`flex items-center justify-between w-full p-2 rounded-lg transition-all cursor-pointer ${sortBy === option.value
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                              <span className="text-sm">{option.label}</span>
                              {sortBy === option.value && (
                                <Check className="w-4 h-4 text-indigo-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <button
                          onClick={resetFilters}
                          className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Items Per Page Selector */}
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2.5 pr-10 rounded-lg transition-all text-sm font-medium cursor-pointer w-full sm:w-auto"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Selection Bar */}
        <AnimatePresence>
          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-900">
                    {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-indigo-700">
                    Click to unselect or use bulk actions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedContacts([])}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Clear selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loadingContacts && contacts.length === 0 && (
          <div className="flex flex-col justify-center items-center py-16">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Loading contact responses...</p>
          </div>
        )}

        {/* Contact Responses Grid/List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
              >
                <ContactResponseCard
                  contact={contact}
                  isSelected={selectedContacts.includes(contact._id)}
                  onSelect={() => handleSelectContact(contact._id)}
                  onView={() => handleViewDetails(contact._id)}
                  onDelete={() => handleDeleteClick(contact)}
                  formatDate={formatDate}
                  operationLoading={operationLoading}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {contacts.length === 0 && !loadingContacts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-md border border-slate-100"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block mb-5"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
              </div>
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1.5">
              No Contact Responses Yet
            </h3>
            <p className="text-slate-500 mb-5 text-sm px-4">
              Contact form submissions from your portfolio will appear here
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8 pt-6 border-t border-gray-200"
          >
            <div className="text-xs sm:text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, pagination.total)} of{' '}
              {pagination.total} responses
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loadingContacts}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all text-sm font-medium cursor-pointer ${currentPage === pageNum
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextPage}
                disabled={currentPage === pagination.totalPages || loadingContacts}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Contact Details Modal */}
        <AnimatePresence>
          {isDetailsOpen && contactDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
              onClick={() => {
                setIsDetailsOpen(false);
                setTimeout(() => dispatch(clearContactDetails()), 300);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-5 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted on {formatDate(contactDetails.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setTimeout(() => dispatch(clearContactDetails()), 300);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Personal Information</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-medium">{contactDetails.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium flex items-center gap-2">
                            {contactDetails.email}
                            <a
                              href={`mailto:${contactDetails.email}`}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-medium flex items-center gap-2">
                            {contactDetails.phone || 'N/A'}
                            {contactDetails.phone && (
                              <a
                                href={`tel:${contactDetails.phone}`}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <Building className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Company Information</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Company Name</p>
                          <p className="font-medium">{contactDetails.companyName || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Website</p>
                          <p className="font-medium flex items-center gap-2">
                            {contactDetails.companyWebsite ? (
                              <>
                                {contactDetails.companyWebsite}
                                <a
                                  href={contactDetails.companyWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </>
                            ) : (
                              'Not provided'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-purple-100 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Message</h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{contactDetails.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsDetailsOpen(false)}
                      className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setIsDetailsOpen(false);
                        handleDeleteClick(contactDetails);
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-lg transition-all cursor-pointer"
                    >
                      Delete Response
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setDeleteConfirmation(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Response</h3>
                    <p className="text-gray-600 text-xs mt-0.5">This action cannot be undone</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-5">
                  Are you sure you want to delete the response from{' '}
                  <span className="font-semibold">{deleteConfirmation.name}</span> ({deleteConfirmation.email})?
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirmation(null)}
                    disabled={operationLoading}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteConfirm}
                    disabled={operationLoading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    {operationLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Delete Confirmation Modal */}
        <AnimatePresence>
          {bulkDeleteConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setBulkDeleteConfirmation(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Multiple Responses</h3>
                    <p className="text-gray-600 text-xs mt-0.5">This action cannot be undone</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-5">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold">{selectedContacts.length}</span> selected contact response{selectedContacts.length !== 1 ? 's' : ''}?
                  This will permanently remove all selected responses.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setBulkDeleteConfirmation(false)}
                    disabled={operationLoading}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBulkDelete}
                    disabled={operationLoading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    {operationLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete All
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Contact Response Card Component
const ContactResponseCard = ({ contact, isSelected, onSelect, onView, onDelete, formatDate, operationLoading }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-100'
        }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Selection Checkbox */}
          <button
            onClick={onSelect}
            className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-all ${isSelected
                ? 'bg-indigo-600 border-indigo-600'
                : 'border-gray-300 hover:border-gray-400'
              }`}
            disabled={operationLoading}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </button>

          {/* Contact Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {contact.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{formatDate(contact.createdAt)}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">{contact.phone || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Building className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">
                  {contact.companyName || 'No company'}
                </span>
              </div>

              {contact.companyWebsite && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {contact.companyWebsite.replace(/^https?:\/\//, '')}
                  </span>
                </div>
              )}
            </div>

            {/* Message Preview */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">Message</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 rounded-lg p-3">
                {contact.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowActions(!showActions)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-2"
                    >
                      <button
                        onClick={() => {
                          onView();
                          setShowActions(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          onDelete();
                          setShowActions(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onView}
                  disabled={operationLoading}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Eye className="w-3 h-3" />
                  View
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDelete}
                  disabled={operationLoading}
                  className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactResponsesPage;