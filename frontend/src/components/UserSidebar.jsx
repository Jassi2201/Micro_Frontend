import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { 
  FiHome,
  FiBook,
  FiTrendingUp,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiAward,
  FiSettings
} from 'react-icons/fi';

const UserSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
     { path: '/user/progress', name: 'My Progress', icon: <FiTrendingUp className="w-5 h-5" /> },
    { path: '/user/assignments', name: 'Assessments', icon: <FiBook className="w-5 h-5" /> },
   
  
    
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-4 left-4 p-2 rounded-md bg-indigo-600 text-white shadow-lg focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-72 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white min-h-screen transition-all duration-300 ease-in-out shadow-lg ${
          isOpen ? 'left-0' : '-left-72 md:left-0'
        }`}
      >
        <div className="p-6 border-b border-indigo-500 flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-body flex items-center">
              <span className="bg-white text-indigo-600 rounded-full p-2 mr-3">
                <FiUser size={18} />
              </span>
              My Learning
            </h1>
            {isMobile && (
              <button onClick={toggleSidebar} className="p-1 rounded hover:bg-indigo-500">
                <FiX size={20} />
              </button>
            )}
          </div>
          {user && (
            <div className="mt-4 text-sm bg-white/10 p-3 rounded-lg">
              <p className="font-body truncate">{user.email}</p>
              <p className="font-body text-xs text-indigo-100">Student Account</p>
            </div>
          )}
        </div>

        <nav className="mt-4 font-body px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={`flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-white text-indigo-600 shadow-md font-medium'
                  : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
              {location.pathname === item.path && (
                <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-500">
          <button
            onClick={() => {
              logout();
              if (isMobile) setIsOpen(false);
            }}
            className="w-full flex font-head items-center justify-center px-4 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg shadow transition-all duration-200 font-medium"
          >
            <FiLogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-30  bg-opacity-50 md:hidden"style={{background : '#00000091'}}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default UserSidebar;