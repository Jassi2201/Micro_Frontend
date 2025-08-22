import React, { useState, useEffect } from 'react';
import api, { FILE_BASE_URL } from '../services/api'; // Import both the api object and FILE_BASE_URL

const FlipkartImagesPopup = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await api.getFlipkartImagesOnly();
        setImages(response.images || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch images');
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">No images found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src={`${FILE_BASE_URL}${image.image_path}`}
              alt={`Flipkart Image ${image.id}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
              }}
            />
           
          </div>
        ))}
      </div>
      
     
    </div>
  );
};

export default FlipkartImagesPopup;