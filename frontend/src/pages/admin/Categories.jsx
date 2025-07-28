import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Import icons
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Categories = () => {
  const [rowData, setRowData] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Column Definitions
  const [colDefs] = useState([
    { field: 'id', headerName: 'ID', flex: 1, },
    { field: 'name', headerName: 'Name', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex gap-4 items-center">
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
    const fetchCategories = async () => {
      try {
        const data = await api.getAllCategories();
        setRowData(data.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const data = await api.addCategory(newCategory);
      setRowData([...rowData, { id: data.categoryId, name: newCategory }]);
      setNewCategory('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    // Implement edit functionality
    const newName = prompt('Edit category name', category.name);
    if (newName && newName !== category.name) {
      api.updateCategory(category.id, newName)
        .then(() => {
          setRowData(rowData.map(item => 
            item.id === category.id ? { ...item, name: newName } : item
          ));
        })
        .catch(err => setError(err.message));
    }
  };

  const handleDelete = (id) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this category?')) {
      api.deleteCategory(id)
        .then(() => {
          setRowData(rowData.filter(item => item.id !== id));
        })
        .catch(err => setError(err.message));
    }
  };

  if (loading) return <div className="text-lg">Loading...</div>;


  return (
<>
    <h1 className="text-xl lg:text-2xl font-head mb-4 lg:mb-6">Categories</h1>
    
    {error && (
      <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm lg:text-base">
        {error}
      </div>
    )}
        
        <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded sm:rounded-r-none"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white font-body px-4 py-2 rounded sm:rounded-l-none hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
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
          />
        </div>
     </>
  );
};

export default Categories;