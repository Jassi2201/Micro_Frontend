import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { 
  FiBook,
  FiTrendingUp,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import Logo from '../assets/Logo.png'; // Adjust the path and file extension as needed

const UserHeader = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/user/progress', name: 'Progress', icon: <FiTrendingUp className="w-4 h-4" /> },
    { path: '/user/assignments', name: 'Assessments', icon: <FiBook className="w-4 h-4" /> },
  ];

  return (
    <header className  >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/user" className="flex items-center">
              <img 
                src={Logo} 
                alt="LearnHub Logo" 
                className="h-8 w-auto mr-3" // Adjust size as needed
              />
            
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 border text-indigo-600 font-medium'
                    : 'text-black hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-2">
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium text-gray-800 truncate max-w-xs">{user.email}</p>
                 
                </div>
              </div>
            )}
            
            <button
              onClick={logout}
              className="flex items-center p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Sign out"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="sr-only">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between border-t border-gray-100 py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-2 py-1 rounded-md text-xs w-full ${
                location.pathname === item.path
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mb-1">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;