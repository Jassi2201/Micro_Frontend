import { useState } from 'react';

const ConfidencePopup = ({ 
  isOpen, 
  onClose, 
  onConfidenceSelect, 
  questionId,
  currentAnswer 
}) => {
  if (!isOpen) return null;

  const handleSelect = (isSure) => {
    onConfidenceSelect(questionId, isSure);
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4" style={{background : '#00000091'}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">Confirmation</h3>
        <p className="mb-4">You selected: <strong>{currentAnswer}</strong></p>
        <p className="mb-6">How confident are you in your answer?</p>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => handleSelect(true)}
            className="flex-1 py-3 px-4 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
          >
            Sure
          </button>
          <button
            onClick={() => handleSelect(false)}
            className="flex-1 py-3 px-4 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
          >
            Not Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfidencePopup;