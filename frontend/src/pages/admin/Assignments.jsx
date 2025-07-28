import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiEdit, FiTrash2, FiX, FiPlus } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';
import AssignmentFormPopup from '../../components/AssignmentFormPopup';

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '',
    adminId: '',
    selectedCategories: [],
    questionCount: 0,
    categoryQuestions: {}
  });
  const [isEditing, setIsEditing] = useState(false);

  // Column Definitions for Assignments List
const [colDefs] = useState([
  { field: 'id', headerName: 'ID', flex: 1 ,},
  { 
    field: 'name', 
    headerName: 'Assessment Name', 
    flex: 3,
    cellStyle: { whiteSpace: 'normal' },
    autoHeight: true
  },
  { 
    field: 'categories', 
    headerName: 'Categories', 
    flex: 2,
    valueGetter: (params) => {
      if (!params.data.categories || params.data.categories.length === 0) {
        return 'No categories';
      }
      return params.data.categories.map(c => c.category_name).join('| ');
    },
    cellStyle: { whiteSpace: 'normal' },
    autoHeight: true
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
      <div className="flex gap-4 items-center">
        <button
          onClick={() => handleEditAssignment(params.data)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={() => handleDeleteAssignment(params.data.id)}
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
    const fetchData = async () => {
      try {
        const [assignmentsRes, categoriesRes] = await Promise.all([
          api.getAllAssignments(),
          api.getAllCategories()
        ]);
        
        setAssignments(assignmentsRes.assignments);
        setCategories(categoriesRes.categories);
        
        // Get adminId from localStorage
        const adminData = JSON.parse(localStorage.getItem('user'));
        if (adminData) {
          setFormData(prev => ({
            ...prev,
            adminId: adminData.id
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelection = (categoryId) => {
    setFormData(prev => {
      const isSelected = prev.selectedCategories.includes(categoryId);
      return {
        ...prev,
        selectedCategories: isSelected
          ? prev.selectedCategories.filter(id => id !== categoryId)
          : [...prev.selectedCategories, categoryId]
      };
    });
  };

  const applyQuestionCount = () => {
    const { selectedCategories, questionCount } = formData;
    const categoryQuestions = {};
    
    selectedCategories.forEach(categoryId => {
      categoryQuestions[categoryId] = parseInt(questionCount) || 0;
    });
    
    setFormData(prev => ({
      ...prev,
      categoryQuestions
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Apply the question count to selected categories before submission
    const { selectedCategories, questionCount } = formData;
    const categoryQuestions = {};
    
    selectedCategories.forEach(categoryId => {
      categoryQuestions[categoryId] = parseInt(questionCount) || 0;
    });

    // Ensure adminId is a number
    const adminId = parseInt(formData.adminId);
    if (isNaN(adminId)) {
      throw new Error('Invalid admin ID');
    }

    const payload = {
      adminId: adminId,
      name: formData.name,
      categoryQuestions: categoryQuestions
    };

    if (isEditing) {
      await api.updateAssignment(formData.id, payload);
    } else {
      await api.createTestAssignment(payload);
    }
    
    // Refresh the assignments list
    const response = await api.getAllAssignments();
    setAssignments(response.assignments);
    
    resetForm();
    setShowForm(false);
  } catch (err) {
    setError(err.message || 'Failed to save assignment');
  }
};

  const resetForm = () => {
    const adminData = JSON.parse(localStorage.getItem('user'));
    setFormData({ 
      name: '',
      adminId: adminData?.id || '',
      selectedCategories: [],
      questionCount: 0,
      categoryQuestions: {}
    });
    setIsEditing(false);
  };

  const handleEditAssignment = (assignment) => {
    const adminData = JSON.parse(localStorage.getItem('user'));
    const selectedCategories = Object.keys(assignment.categoryQuestions || {}).map(Number);
    const questionCounts = Object.values(assignment.categoryQuestions || {});
    const defaultQuestionCount = questionCounts.length > 0 ? questionCounts[0] : 0;
    
    setFormData({
      id: assignment.id,
      name: assignment.name,
      adminId: adminData?.id || '',
      selectedCategories,
      questionCount: defaultQuestionCount,
      categoryQuestions: assignment.categoryQuestions || {}
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.deleteAssignment(id);
        const response = await api.getAllAssignments();
        setAssignments(response.assignments);
      } catch (err) {
        setError(err.message);
      }
    }
  };

   if (loading) return <div className="text-lg">Loading...</div>;


  return (
   <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl lg:text-2xl font-head">Assessment Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-body flex items-center gap-2"
          >
            <FiPlus /> Create Assessment
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm lg:text-base">
            {error}
          </div>
        )}

        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            rowData={assignments}
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

        {showForm && (
<AssignmentFormPopup
  formData={formData}
  handleChange={handleChange}
  handleCategorySelection={handleCategorySelection}
  handleSubmit={handleSubmit}
  onClose={() => {
    setShowForm(false);
    resetForm();
  }}
  isEditing={isEditing}
  categories={categories}
/>
        )}
    </>
  );
};

export default Assignments;