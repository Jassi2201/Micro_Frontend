import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const AssignmentFormPopup = ({
  formData,
  handleChange,
  handleSubmit,
  onClose,
  isEditing,
  categories,
  handleCategorySelection,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50  bg-opacity-50" style={{background : '#00000091'}}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-head">
            {isEditing ? 'Edit Assessment' : 'Create New Assessments'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-body">Assessment Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 font-body border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter assessment  name"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-body">Select Categories</label>
              <div className="space-y-2 mb-4">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={formData.selectedCategories.includes(category.id)}
                      onChange={() => handleCategorySelection(category.id)}
                      className="mr-2 "
                    />
                    <label htmlFor={`category-${category.id}`}>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>

              {formData.selectedCategories.length > 0 && (
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2 font-body">
                    Questions per selected category
                  </label>
                  <input
                    type="number"
                    name="questionCount"
                    min="1"
                    value={formData.questionCount}
                    onChange={handleChange}
                    className="w-full font-body px-3 py-2 border rounded"
                    placeholder="Enter question count"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border font-body border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 font-body text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.selectedCategories.length === 0}
              >
                {isEditing ? 'Update Assessment' : 'Create Assessment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentFormPopup;