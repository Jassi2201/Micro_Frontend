import { useState, useEffect } from 'react';
import api from '../services/api';

const FlipkartImagesModal = ({ isOpen, onClose }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchFlipkartImages();
    }
  }, [isOpen]);

  const fetchFlipkartImages = async () => {
    try {
      setLoading(true);
      const response = await api.getFlipkartImagesOnly();
      setImages(response.images || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Flipkart Content Images</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          {loading && <div className="text-white text-center py-4">Loading images...</div>}
          
          {error && (
            <div className="bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-lg mb-4">
              Error: {error}
            </div>
          )}
          
          {!loading && images.length === 0 && !error && (
            <div className="text-white text-center py-4">No images found</div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.id} className="bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={`${api.FILE_BASE_URL}${image.image_path}`} 
                  alt={`Flipkart content ${image.id}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 text-sm text-gray-300">
                  Image ID: {image.id}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipkartImagesModal;