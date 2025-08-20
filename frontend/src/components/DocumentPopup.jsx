import { useState } from 'react';
import { FILE_BASE_URL } from '../services/api';
import AudioButton from './AudioButton'; // Import the AudioButton component

const DocumentPopup = ({ isOpen, onClose, documentPath, audioPath }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{background : '#00000091'}}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full border max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold">Document Viewer</h3>
            {audioPath && (
              <AudioButton 
                audioUrl={`${FILE_BASE_URL}${audioPath}`}
                className="ml-2"
              />
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close document viewer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {documentPath ? (
            <iframe 
              src={`${FILE_BASE_URL}${documentPath}#toolbar=0`}
              className="w-full h-full min-h-[70vh] border-0"
              title="Document Viewer"
            />
          ) : (
            <div className="text-center py-10 text-gray-500">
              No document available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPopup;