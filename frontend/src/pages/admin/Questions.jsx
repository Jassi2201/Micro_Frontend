import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';
import QuestionFormPopup from '../../components/QuestionFormPopup';

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Questions = () => {
  const [rowData, setRowData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    shortContent: '',
    longContentText: '',
    longContentFile: null,
    questionMedia: null,
    longContentAudio: null,      // New field
  questionAnswerAudio: null    // New field
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Column Definitions
  const [colDefs] = useState([
    { field: 'id', headerName: 'ID', flex: 1 },
    { 
      field: 'question', 
      headerName: 'Question', 
      flex: 3,
      cellStyle: { whiteSpace: 'normal' },
      autoHeight: true
    },
    {
      headerName: 'Options',
      flex: 3,
      valueGetter: (params) => {
        try {
          const options = JSON.parse(params.data.options);
          return options.join(' | ');
        } catch (e) {
          return params.data.options;
        }
      },
      cellStyle: { whiteSpace: 'normal' },
      autoHeight: true
    },
    {
    headerName: 'Correct Answer',
    field: 'correct_answer', // Use the field directly from the API
    flex: 2,
    cellStyle: { whiteSpace: 'normal' },
    autoHeight: true
  },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex gap-2 md:gap-4 items-center h-full">
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
    const fetchInitialData = async () => {
      try {
        const categoriesData = await api.getAllCategories();
        setCategories(categoriesData.categories);
        
        if (categoriesData.categories.length > 0) {
          const defaultCategoryId = categoriesData.categories[0].id.toString();
          setSelectedCategoryId(defaultCategoryId);
          setFormData(prev => ({
            ...prev,
            categoryId: defaultCategoryId
          }));
          await fetchQuestions(defaultCategoryId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchQuestions = async (categoryId) => {
    try {
      const questionsData = await api.getCategoryQuestions(categoryId);
      setRowData(questionsData.questions);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    await fetchQuestions(categoryId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('question', formData.question);
      formDataToSend.append('options', JSON.stringify(formData.options));
      const correctAnswerText = formData.options[parseInt(formData.correctAnswer)];
      formDataToSend.append('correctAnswer', correctAnswerText);
      formDataToSend.append('shortContent', formData.shortContent);
      formDataToSend.append('longContentText', formData.longContentText);
      
      if (formData.longContentFile) {
        formDataToSend.append('longContentFile', formData.longContentFile);
      }
      
      if (formData.questionMedia) {
        formDataToSend.append('questionMedia', formData.questionMedia);
      }
        // Add new audio files
    if (formData.longContentAudio) {
      formDataToSend.append('longContentAudio', formData.longContentAudio);
    }
    
    if (formData.questionAnswerAudio) {
      formDataToSend.append('questionAnswerAudio', formData.questionAnswerAudio);
    }

      if (isEditing) {
        await api.updateQuestion(formData.id, formDataToSend);
      } else {
        await api.addQuestion(formDataToSend);
      }
      
      await fetchQuestions(formData.categoryId);
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: selectedCategoryId,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      shortContent: '',
      longContentText: '',
      longContentFile: null,
      questionMedia: null,
      longContentAudio: null,      // New field
    questionAnswerAudio: null    // New field
    });
    setIsEditing(false);
  };

  const handleEdit = (question) => {
    const editedQuestion = {
      ...question,
      options: JSON.parse(question.options),
      correctAnswer: question.correct_answer.toString(),
      categoryId: question.category_id.toString()
    };
    
    setFormData({
      id: question.id,
      categoryId: editedQuestion.categoryId,
      question: editedQuestion.question,
      options: editedQuestion.options,
      correctAnswer: editedQuestion.correctAnswer,
      shortContent: editedQuestion.short_content,
      longContentText: editedQuestion.long_content_text,
      longContentFile: null,
      questionMedia: null,
      longContentAudio: null,      // New field
    questionAnswerAudio: null    // New field
    });
    
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.deleteQuestion(id);
        await fetchQuestions(selectedCategoryId);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="text-lg">Loading...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl lg:text-2xl font-head">Questions Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 font-body text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add New Question
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm lg:text-base">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-body">Filter Questions by Category</label>
        <select
          onChange={handleCategoryChange}
          value={selectedCategoryId}
          className="w-full md:w-1/3 px-4 font-body py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Questions in {categories.find(c => c.id.toString() === selectedCategoryId)?.name || 'Selected Category'}
        </h2>
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

      {showForm && (
        <QuestionFormPopup
          formData={formData}
          categories={categories}
          handleChange={handleChange}
          handleOptionChange={handleOptionChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            resetForm();
          }}
          isEditing={isEditing}
        />
      )}
    </>
  );
};

export default Questions;