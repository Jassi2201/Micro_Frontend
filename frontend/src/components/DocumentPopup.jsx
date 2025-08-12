import { useState, useEffect } from 'react';
import pdfToText from 'react-pdftotext';
import { FILE_BASE_URL } from '../services/api';
import AudioButton from './AudioButton';

const DocumentPopup = ({ isOpen, onClose, documentPath }) => {
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && documentPath) {
      extractTextFromPdf();
    }
  }, [isOpen, documentPath]);

  const extractTextFromPdf = async () => {
    if (!documentPath.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF documents are supported for text extraction');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');

    try {
      const pdfUrl = `${FILE_BASE_URL}${documentPath}`;
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const pdfBlob = await response.blob();
      const text = await pdfToText(pdfBlob);
      
      // Clean up the extracted text
      const cleanedText = text
        .replace(/\n+/g, ' ')      // Replace multiple newlines with space
        .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
        .replace(/-\s/g, '')       // Remove hyphenated word breaks
        .trim();
      
      setExtractedText(cleanedText);
    } catch (err) {
      console.error('Failed to extract text from PDF:', err);
      setError('Failed to extract text from PDF. Please try again or view the document directly.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{background : '#00000091'}}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Document Viewer</h3>
          <div className="flex items-center space-x-2">
            {extractedText && (
              <AudioButton texts={[extractedText]} />
            )}
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
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Extracting text from document...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              {error}
            </div>
          ) : documentPath ? (
            <>
              {/* {extractedText && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Extracted Text (Readable by Audio):</h4>
                  <div className="max-h-40 overflow-y-auto text-sm text-gray-700">
                    {extractedText.length > 500 
                      ? `${extractedText.substring(0, 500)}...` 
                      : extractedText}
                    {extractedText.length > 500 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Note: Only partial text shown for preview. Audio will read full content.
                      </p>
                    )}
                  </div>
                </div>
              )} */}
              
              <iframe 
                src={`${FILE_BASE_URL}${documentPath}`}
                className="w-full h-full min-h-[60vh] border-0"
                title="Document Viewer"
              />
            </>
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