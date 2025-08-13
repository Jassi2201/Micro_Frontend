import { FiX, FiChevronDown, FiUpload } from 'react-icons/fi';

const QuestionFormPopup = ({
  formData,
  categories,
  handleChange,
  handleOptionChange,
  handleFileChange,
  handleSubmit,
  onClose,
  isEditing,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{background : '#00000091'}}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-head text-gray-800">
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          {/* Category Select */}
          <div className="space-y-2">
            <label className="block text-sm font-body text-gray-700">Category</label>
            <div className="relative">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label className="block text-sm font-body text-gray-700">Question Text</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="w-full px-4 py-2 font-body border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter the question"
            />
          </div>

          {/* Question Media Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-body text-gray-700">Question Media (Image/Audio/Video)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    {formData.questionMedia 
                      ? formData.questionMedia.name 
                      : 'Click to upload image, audio, or video file'}
                  </p>
                </div>
                <input 
                  type="file" 
                  name="questionMedia"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,audio/*,video/*"
                />
              </label>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            <label className="block text-sm font-body text-gray-700">Answer Options</label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={parseInt(formData.correctAnswer) === index}
                  onChange={() => handleChange({ 
                    target: { 
                      name: 'correctAnswer', 
                      value: index.toString() 
                    } 
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 font-body border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>


{/* Question Answer Audio Upload */}
<div className="space-y-2">
  <label className="block text-sm font-body text-gray-700">Answer Explanation Audio</label>
  <div className="flex items-center justify-center w-full">
    <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 text-center">
          {formData.questionAnswerAudio 
            ? formData.questionAnswerAudio.name 
            : 'Click to upload answer explanation audio (MP3/MP4)'}
        </p>
      </div>
      <input 
        type="file" 
        name="questionAnswerAudio"
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*"
      />
    </label>
  </div>
</div>
          {/* Short Explanation */}
          <div className="space-y-2">
            <label className="block text-sm font-body text-gray-700">Short Explanation</label>
            <textarea
              name="shortContent"
              value={formData.shortContent}
              onChange={handleChange}
              className="w-full px-4 py-2 font-body border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Brief explanation of the answer"
            />
          </div>

          {/* Detailed Explanation (Text) */}
          <div className="space-y-2">
            <label className="block text-sm font-body text-gray-700">Detailed Explanation (Text)</label>
            <textarea
              name="longContentText"
              value={formData.longContentText}
              onChange={handleChange}
              className="w-full px-4 py-2 font-body border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="5"
              placeholder="Detailed explanation with references"
            />
          </div>

          {/* Detailed Explanation (File) */}
          <div className="space-y-2">
            <label className="block text-sm font-body text-gray-700">Detailed Explanation (File)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    {formData.longContentFile 
                      ? formData.longContentFile.name 
                      : 'Click to upload or drag and drop PDF, Word, or text file'}
                  </p>
                </div>
                <input 
                  type="file" 
                  name="longContentFile"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
            </div>
          </div>
<div className="space-y-2">
  <label className="block text-sm font-body text-gray-700">Detailed Explanation Audio</label>
  <div className="flex items-center justify-center w-full">
    <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 text-center">
          {formData.longContentAudio 
            ? formData.longContentAudio.name 
            : 'Click to upload audio explanation (MP3/MP4)'}
        </p>
      </div>
      <input 
        type="file" 
        name="longContentAudio"
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*"
      />
    </label>
  </div>
</div>
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-body border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 font-body text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isEditing ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormPopup;