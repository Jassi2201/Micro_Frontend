import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../services/api';

const FlipkartContentForm = ({ content, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    flipkartImage: null,
    flipkartVideo: null
  });
  const [previewImage, setPreviewImage] = useState(content?.imagePath || null);
  const [previewVideo, setPreviewVideo] = useState(content?.videoPath || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (e.target.name === 'flipkartImage') {
        setPreviewImage(URL.createObjectURL(file));
      } else if (e.target.name === 'flipkartVideo') {
        setPreviewVideo(URL.createObjectURL(file));
      }
      setFormData({ ...formData, [e.target.name]: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      if (formData.flipkartImage) {
        formDataToSend.append('flipkartImage', formData.flipkartImage);
      }
      
      if (formData.flipkartVideo) {
        formDataToSend.append('flipkartVideo', formData.flipkartVideo);
      }

      if (content) {
        // Update existing content
        await api.updateFlipkartContent(content.id, formDataToSend);
      } else {
        // Add new content
        await api.addFlipkartContent(formDataToSend);
      }
      
      onSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50" style={{background : '#00000091'}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {content ? 'Edit Content' : 'Add New Content'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Image</label>
              <input
                type="file"
                name="flipkartImage"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
              />
              {previewImage && (
                <div className="mt-2">
                  <img 
                    src={previewImage.startsWith('blob:') ? previewImage : `${api.FILE_BASE_URL}${previewImage}`}
                    alt="Preview" 
                    className="h-32 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Video</label>
              <input
                type="file"
                name="flipkartVideo"
                onChange={handleFileChange}
                accept="video/*"
                className="w-full"
              />
              {previewVideo && !previewVideo.startsWith('blob:') && (
                <div className="mt-2">
                  <video controls className="h-32 w-full border rounded">
                    <source src={`${api.FILE_BASE_URL}${previewVideo}`} />
                  </video>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Processing...' : (content ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlipkartContentForm;