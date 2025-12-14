import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Briefcase,
    FileText,
    Award,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Home,
    User,
    Bell,
    Search,
    Shield,
    User2,
    MailQuestionMark
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close sidebar on mobile/tablet by default
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        dispatch(logoutAdmin());    
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin/skills', label: 'Skills', icon: Brain },
        { path: '/admin/projects', label: 'Projects', icon: Briefcase },
        { path: '/admin/experiences', label: 'Experiences', icon: FileText },
        { path: '/admin/certifications', label: 'Certifications', icon: Award },
        { path: '/admin/about', label: 'About', icon: User2 },
        { path: '/admin/responses', label: 'Manage Responses', icon: MailQuestionMark },
    ];

    const getPageTitle = () => {
        const currentItem = menuItems.find(item => location.pathname.startsWith(item.path));
        return currentItem?.label || '';
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 240 : 72 }}
                className="hidden lg:block fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 shadow-2xl"
            >
                <div className="h-full flex flex-col">

                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-700/50">
                        <div className="flex items-center justify-between">
                            {sidebarOpen ? (
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                            Admin Panel
                                        </h2>
                                        <p className="text-[10px] text-slate-400">Control Center</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mx-auto shadow-lg">
                                    <Shield className="w-5 h-5" />
                                </div>
                            )}

                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-1.5 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
                            >
                                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : ''}
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center p-2.5 rounded-lg transition-all duration-200 group relative
                                        ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30' : 'hover:bg-slate-700/50'}
                                        ${sidebarOpen ? 'justify-start' : 'justify-center'}
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'} ${!sidebarOpen && 'mx-auto'}`} />
                                    {sidebarOpen && <span className="ml-2.5 text-sm font-medium">{item.label}</span>}
                                    {isActive && sidebarOpen && (
                                        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-700/50">
                        {sidebarOpen ? (
                            <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-xs font-semibold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{user?.name || 'Admin'}</h4>
                                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-xs font-semibold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.aside
                        initial={{ x: -240 }}
                        animate={{ x: 0 }}
                        exit={{ x: -240 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed lg:hidden left-0 top-0 h-screen w-60 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 shadow-2xl"
                    >
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                            Admin Panel
                                        </h2>
                                    </div>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center p-2.5 rounded-lg transition-all duration-200 relative
                                                ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30' : 'hover:bg-slate-700/50'}
                                            `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="ml-2.5 text-sm font-medium">{item.label}</span>
                                            {isActive && (
                                                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-slate-700/50">
                                <div className="flex items-center space-x-2.5">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-xs font-semibold shadow-lg">
                                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm truncate">{user?.name || 'Admin'}</h4>
                                        <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 w-full
                ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-[72px]'}
            `}>

                {/* Top Navbar */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm z-30">
                    <div className="px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2">

                        {/* Left */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                                <Menu className="w-5 h-5 text-slate-700" />
                            </button>

                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="hidden lg:block p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>

                            <div className="min-w-0 flex-1">
                                <h1 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{getPageTitle()}</h1>
                                <p className="text-xs text-slate-500 hidden sm:block">Manage your content</p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    className="pl-8 pr-3 py-1.5 w-32 lg:w-48 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Search..."
                                />
                            </div>

                            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </button>

                            <Link to="/" className="hidden sm:block p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <Home className="w-5 h-5 text-slate-600" />
                            </Link>

                            <div className="hidden md:flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-xs font-medium text-slate-700 leading-tight">{user?.name || 'Admin'}</p>
                                    <p className="text-[10px] text-slate-500">Administrator</p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            </div>

                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-2.5 sm:px-3 py-1.5 sm:py-2 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all text-sm"
                            >
                                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-2 sm:px-3 lg:px-5 py-4 sm:py-5">
                    <div className="bg-white rounded-xl shadow-md border border-slate-200">
                        {children}
                    </div>

                    <footer className="text-center text-slate-500 text-xs mt-4 sm:mt-6 pb-4">
                        © {new Date().getFullYear()} Admin Panel v1.0 — All rights reserved.
                    </footer>
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;