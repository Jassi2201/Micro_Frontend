import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { 
  FiBook,
  FiTrendingUp,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';
import logo from '../assets/l1.png'; // Your normal logo with solid background

const UserHeader = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/user/progress', name: 'Progress', icon: <FiTrendingUp className="w-4 h-4" /> },
    { path: '/user/assignments', name: 'Assessments', icon: <FiBook className="w-4 h-4" /> },
  ];

  return (
    <header className="py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16"> {/* Increased height */}
          {/* Logo - Normal with increased size */}
          <Link 
            to="/user/assignments" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Logo"
              className="h-8 w-auto" // Increased size, width auto to maintain aspect ratio
            />
          </Link>
          
          {/* Navigation - Glass Effect (unchanged) */}
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center p-2 rounded-full transition-all backdrop-blur-sm bg-white/10 hover:bg-white/20 ${
                  location.pathname === item.path
                    ? 'border border-opacity-30 border-white text-white bg-white/20'
                    : 'border border-opacity-20 border-white text-gray-300 hover:text-white'
                }`}
                title={item.name}
              >
                {item.icon}
                <span className="sr-only md:not-sr-only md:ml-1.5 md:text-xs font-head">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* User Section - Glass Effect (unchanged) */}
          {user && (
            <div className="flex items-center space-x-2">
              <div className="border border-opacity-30 border-white p-2 rounded-full flex items-center transition-all backdrop-blur-sm bg-white/10 hover:bg-white/20">
                <div className="h-6 w-6 rounded-full border border-opacity-30 border-white flex items-center justify-center backdrop-blur-sm bg-white/10">
                  <FiUser className="h-3.5 w-3.5 text-gray-300" />
                </div>
                <span className="hidden md:inline ml-2 text-xs font-head text-gray-100 truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="border border-opacity-30 border-white p-2 rounded-full text-gray-300 hover:text-white transition-all backdrop-blur-sm bg-white/10 hover:bg-white/20"
                title="Sign Out"
              >
                <FiLogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;