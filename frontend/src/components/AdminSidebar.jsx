import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { 
  FiHome, 
  FiGrid, 
  FiHelpCircle, 
  FiBook, 
  FiTrendingUp,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiUser,
   FiVideo,        // Added for Tutorial
  FiShoppingCart,  // Added for FlipCart
  FiBox
} from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Using 1024 as breakpoint for tablets
      setIsMobile(mobile);
      setIsOpen(!mobile); // Open by default on desktop, closed on mobile
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/admin/categories', name: 'Categories', icon: <FiGrid className="w-5 h-5" /> },
    { path: '/admin/questions', name: 'Questions', icon: <FiHelpCircle className="w-5 h-5" /> },
    { path: '/admin/assignments', name: 'Assessments', icon: <FiBook className="w-5 h-5" /> },
    { path: '/admin/tutorial', name: 'Tutorial Video', icon: <FiVideo className="w-5 h-5" /> },
      { path: '/admin/flipkart', name: 'Latest Update', icon: <FiBox className="w-5 h-5" /> },
    { path: '/admin/user-progress', name: 'User Progress', icon: <FiTrendingUp className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-4 left-4 p-2 rounded-md bg-orange-500 text-white shadow-lg focus:outline-none lg:hidden"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
     className={`fixed lg:relative z-40 w-64 lg:w-72 bg-gradient-to-b from-orange-500 to-orange-600 text-white h-screen transition-all duration-300 ease-in-out shadow-xl ${
    isOpen ? 'left-0' : '-left-64 lg:left-0'
  }`}
>

        <div className="p-4 lg:p-6 border-b border-orange-400 flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-xl lg:text-2xl font-body flex items-center">
              <span className="bg-white text-orange-500 rounded-lg p-1 mr-2">
                <FiUser size={18} className="lg:w-5 lg:h-5" />
              </span>
              Admin
            </h1>
            {isMobile && (
              <button onClick={toggleSidebar} className="p-1 rounded hover:bg-orange-400 lg:hidden">
                <FiX size={20} />
              </button>
            )}
          </div>
          {user && (
            <div className="mt-3 lg:mt-4 font-body text-xs lg:text-sm bg-white/10 p-2 rounded-lg">
              <p className="font-medium truncate">{user.email}</p>
              <p className="text-xs text-orange-100">Admin Account</p>
            </div>
          )}
        </div>

        <nav className="mt-2 lg:mt-4 px-2 lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={`flex items-center justify-between px-3 py-2 lg:px-4 lg:py-3 my-1 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'text-orange-100 hover:bg-orange-400 hover:text-white'
              }`}
            >
              <div className="flex font-body items-center">
                <span className="mr-2 lg:mr-3">{item.icon}</span>
                <span className="text-sm lg:text-base">{item.name}</span>
              </div>
              <FiChevronRight className="text-orange-300 w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-3 lg:p-4 border-t border-orange-400">
          <button
            onClick={() => {
              logout();
              if (isMobile) setIsOpen(false);
            }}
            className="w-full flex items-center justify-center px-3 py-2 lg:px-4 lg:py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-lg shadow transition-all duration-200 font-body text-sm lg:text-base"
          >
            <FiLogOut className="mr-2 w-4 h-4 lg:w-5 lg:h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-30  bg-opacity-50 lg:hidden" style={{background : '#00000091'}}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;