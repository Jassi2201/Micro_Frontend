import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../services/api';
import FlipkartContentForm from '../../components/FlipkartContentForm';

const FlipkartContent = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  // Column Definitions
  const [colDefs] = useState([
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 2 },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 3,
      cellStyle: { whiteSpace: 'normal' },
      autoHeight: true
    },
    {
      field: 'image_path',
      headerName: 'Image',
      flex: 1,
      cellRenderer: (params) => (
        params.value ? (
          <a 
            href={params.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Image
          </a>
        ) : 'No Image'
      )
    },
    {
      field: 'video_path',
      headerName: 'Video',
      flex: 1,
      cellRenderer: (params) => (
        params.value ? (
          <a 
            href={params.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Video
          </a>
        ) : 'No Video'
      )
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 2,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex gap-2 items-center h-full">
          <button
            onClick={() => handleEdit(params.data)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit"
          >
            <FiEdit size={18} />
          </button>
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
    fetchFlipkartContent();
  }, []);

  const fetchFlipkartContent = async () => {
    try {
      setLoading(true);
      const response = await api.getAllFlipkartContent();
      setRowData(response.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedContent(null);
    setShowForm(true);
  };

  const handleEdit = (content) => {
    setSelectedContent(content);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.deleteFlipkartContent(id);
        await fetchFlipkartContent();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFormSubmit = async () => {
    await fetchFlipkartContent();
    setShowForm(false);
  };

  if (loading) return <div className="text-lg">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl lg:text-2xl font-head">Flipkart Content Management</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 font-body text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus /> Add New Content
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm lg:text-base">
          {error}
        </div>
      )}

      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
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
          rowHeight={60}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {showForm && (
        <FlipkartContentForm
          content={selectedContent}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default FlipkartContent;