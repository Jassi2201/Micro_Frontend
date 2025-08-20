import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiTrash2, FiDownload } from 'react-icons/fi';
import api from '../../services/api';

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TutorialVideos = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Column Definitions
  const [colDefs] = useState([
    { 
      field: 'id', 
      headerName: 'ID', 
      flex: 1,
      filter: 'agNumberColumnFilter'
    },
     { 
    field: 'tutorial_video_url', 
    headerName: 'Video URL', 
    flex: 2,
    cellRenderer: (params) => {
      // Prepend localhost URL if the path doesn't already start with http
      const fullUrl = params.value.startsWith('http') 
        ? params.value 
        : `http://localhost:3000${params.value}`;
      
      return (
        <a 
          href={fullUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {params.value}
        </a>
      );
    }
  },
    { 
      field: 'created_at', 
      headerName: 'Upload Date', 
      flex: 2,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex gap-4 items-center">
          <a
            href={`${api.FILE_BASE_URL}${params.data.tutorial_video_url}`}
            download
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Download"
          >
            <FiDownload size={18} />
          </a>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      sortable: false,
      filter: false,
    },
  ]);

  useEffect(() => {
    fetchTutorialVideos();
  }, []);

const fetchTutorialVideos = async () => {
  try {
    setLoading(true);
    const data = await api.getAllTutorialVideos();
    // If the API returns a single video object, wrap it in an array
    setRowData(data.video ? [data.video] : []);
    setError('');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('tutorialVideo', selectedFile);
      
      await api.uploadTutorialVideo(formData);
      setSuccess('Video uploaded successfully!');
      setError('');
      setSelectedFile(null);
      document.getElementById('video-upload').value = '';
      fetchTutorialVideos();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this tutorial video?')) {
      try {
        await api.deleteTutorialVideo(videoId);
        setSuccess('Video deleted successfully!');
        fetchTutorialVideos();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading && rowData.length === 0) {
    return <div className="text-lg">Loading...</div>;
  }

  return (
    <>
      <h1 className="text-xl lg:text-2xl font-head mb-4 lg:mb-6">Tutorial Videos</h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm lg:text-base">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm lg:text-base">
          {success}
        </div>
      )}
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium mb-3">Upload New Tutorial Video</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="bg-blue-600 text-white font-body px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>
      
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            headerClass: 'font-head'
          }}
          domLayout='autoHeight'
          suppressCellFocus={true}
          headerHeight={40}
          rowHeight={40}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </>
  );
};

export default TutorialVideos;