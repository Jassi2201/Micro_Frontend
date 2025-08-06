import { useState } from 'react';

const DocumentPopup = ({ isOpen, onClose, documentPath }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{background : '#000000c2'}}>
      <div className="  rounded-lg border-opacity-20 border-white  max-w-4xl w-full max-h-[90vh] flex flex-col p-1 border border-opacity-20  shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Document Viewer</h3>
          <button 
            onClick={onClose}
            className="text-white "
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
              src={`${'http://localhost:3000'}${documentPath}`}
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