import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { 
  FiBook,
  FiTrendingUp,
  FiLogOut,
  FiUser,
  FiRefreshCw,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api, {FILE_BASE_URL} from '../services/api';
import logo from '../assets/l1.png';

const UserHeader = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUpdates, setShowUpdates] = useState(false);
  const [flipkartImages, setFlipkartImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navItems = [
    { path: '/user/progress', name: 'Progress', icon: <FiTrendingUp className="w-4 h-4" /> },
    { path: '/user/assignments', name: 'Assessments', icon: <FiBook className="w-4 h-4" /> },
    { 
      type: 'button', 
      name: 'Latest Update', 
      icon: <FiRefreshCw className="w-4 h-4" />,
      onClick: () => handleLatestUpdateClick()
    },
  ];

  const handleLatestUpdateClick = async () => {
    setShowUpdates(true);
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getFlipkartImagesOnly();
      if (response.success && response.images.length > 0) {
        setFlipkartImages(response.images);
        setCurrentImageIndex(0);
      } else {
        setError('No updates available at the moment.');
      }
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError('Failed to fetch updates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === flipkartImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? flipkartImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setShowUpdates(false);
    setFlipkartImages([]);
    setCurrentImageIndex(0);
    setError(null);
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    
    if (showUpdates) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showUpdates]);

  return (
    <>
      <header className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/user/assignments" 
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src={logo} 
                alt="Logo"
                className="h-8 w-auto"
              />
            </Link>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              {navItems.map((item) => (
                item.type === 'button' ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="flex items-center justify-center p-2 rounded-full transition-all backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-opacity-20 border-white text-gray-300 hover:text-white"
                    title={item.name}
                  >
                    {item.icon}
                    <span className="sr-only md:not-sr-only md:ml-1.5 md:text-xs font-head">
                      {item.name}
                    </span>
                  </button>
                ) : (
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
                )
              ))}
            </nav>
            
            {/* User Section */}
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

      {/* Latest Updates Modal - Container-free version */}
      {showUpdates && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center "style={{background : '#00000091'}}
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - top right */}
            <button
              onClick={closeModal}
              className="absolute  right-0 z-60 p-2 rounded-full bg-black/50 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64 text-red-400 text-xl">
                <p>{error}</p>
              </div>
            ) : flipkartImages.length > 0 ? (
              <div className="relative">
                {/* Image */}
                <img 
                  src={`${FILE_BASE_URL}${flipkartImages[currentImageIndex].image_path}`} 
                  alt={`Update ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
                
                {/* Navigation Arrows */}
                {flipkartImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50  transition-colors"
                      aria-label="Previous image"
                    >
                      <FiChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 transition-colors"
                      aria-label="Next image"
                    >
                      <FiChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}
                
                {/* Indicators */}
                {flipkartImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {flipkartImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-gray-500 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-400 text-xl">
                <p>No updates available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserHeader;