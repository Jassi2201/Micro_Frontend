import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../services/auth'
import ConfidencePopup from '../../components/ConfidencePopup'
import DocumentPopup from '../../components/DocumentPopup'
import {FaCheck,FaTimes} from 'react-icons/fa'
import "./Assignment.css"
import { FiDownload, FiAlertCircle } from 'react-icons/fi';

const Assignments = () => {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [completedAssignments, setCompletedAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [questionsByCategory, setQuestionsByCategory] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [userConfidence, setUserConfidence] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showConfidencePopup, setShowConfidencePopup] = useState(false)
  const [currentAnswerText, setCurrentAnswerText] = useState('')
  const [showDocumentPopup, setShowDocumentPopup] = useState(false)
  const [currentDocumentPath, setCurrentDocumentPath] = useState('')

  // Flatten all questions into a single array for navigation
  const allQuestions = questionsByCategory.reduce((acc, category) => {
    return [...acc, ...category.questions]
  }, [])

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await api.getUserAssignmentCompletionDetails(user.id)
        // Separate completed and not completed assignments
        const completed = []
        const notCompleted = []
        
        for (const assignment of data.assignments) {
          if (assignment.isCompleted) {
            completed.push(assignment)
          } else {
            notCompleted.push(assignment)
          }
        }
        
        setAssignments(notCompleted)
        setCompletedAssignments(completed)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchAssignments()
    }
  }, [user])

  const startAssignment = async (assignmentId) => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getAssignmentQuestions(user.id, assignmentId)
      const assignment = [...assignments, ...completedAssignments].find(a => a.id === assignmentId)
      
      // Process the new response format with categories
      const parsedCategories = data.questions.map(category => ({
        ...category,
        questions: category.questions.map(question => {
          try {
            return {
              ...question,
              options: typeof question.options === 'string' 
                ? JSON.parse(question.options) 
                : question.options
            }
          } catch (e) {
            console.error('Failed to parse options for question:', question.id, e)
            return {
              ...question,
              options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] // fallback
            }
          }
        })
      }))
      
      setSelectedAssignment(assignment)
      setQuestionsByCategory(parsedCategories)
      setCurrentQuestionIndex(0)
      setUserAnswers({})
      setUserConfidence({})
      setSubmitted(false)
      setResults(null)
    } catch (err) {
      setError(err.message || 'Failed to load assignment')
    } finally {
      setLoading(false)
    }
  }

  const viewResults = async (assignmentId) => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getAssignmentResults(user.id, assignmentId)
      const assignment = completedAssignments.find(a => a.id === assignmentId)
      
      // Safely parse options for each response
      const parsedResults = {
        ...data.assignment,
        responses: data.assignment.responses.map(response => {
          try {
            return {
              ...response,
              options: typeof response.options === 'string'
                ? JSON.parse(response.options)
                : response.options
            }
          } catch (e) {
            console.error('Failed to parse options for response:', response.questionId, e)
            return {
              ...response,
              options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] // fallback
            }
          }
        })
      }
      
      setSelectedAssignment(assignment)
      setResults(parsedResults)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    const question = allQuestions.find(q => q.id === parseInt(questionId))
    const selectedOption = question.options[answerIndex]
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
    
    // Set the current answer text for the popup
    setCurrentAnswerText(selectedOption)
    
    // Show the confidence popup
    setShowConfidencePopup(true)
  }

  const handleConfidenceSelect = (questionId, isSure) => {
    setUserConfidence(prev => ({
      ...prev,
      [questionId]: isSure
    }))
    setShowConfidencePopup(false)
  }

  const handleViewDocument = (documentPath) => {
    setCurrentDocumentPath(documentPath)
    setShowDocumentPopup(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Prepare responses for submission - use the actual option text instead of index
      const responses = Object.entries(userAnswers).map(([questionId, answerIndex]) => {
        const question = allQuestions.find(q => q.id === parseInt(questionId))
        const selectedOption = question.options[answerIndex]
        
        return {
          questionId: parseInt(questionId),
          answer: selectedOption,  // Send the actual option text
          isSure: userConfidence[questionId] || false
        }
      })
      
      // Submit all responses at once
      const submissionResponse = await api.submitAssignment(user.id, selectedAssignment.id, responses)
      
      // Update the results state with the response data
      setResults({
        ...submissionResponse,
        responses: submissionResponse.results.map(result => ({
          ...result,
          question: allQuestions.find(q => q.id === result.questionId)?.question || 'Unknown question',
          userAnswer: result.userAnswer,
          correctAnswer: result.correctAnswer,
          status: result.status,
          feedback: {
            short: result.feedback?.shortContent || '',
            long: {
              text: result.feedback?.longContent?.text || '',
              filePath: result.feedback?.longContent?.filePath || ''
            }
          }
        })),
        completedAt: new Date().toISOString()
      })
      
      setSubmitted(true)
      
      // Update assignments list
      const updatedAssignments = assignments.filter(a => a.id !== selectedAssignment.id)
      setAssignments(updatedAssignments)
      setCompletedAssignments(prev => [...prev, {...selectedAssignment, isCompleted: true}])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToAssignments = () => {
    setSelectedAssignment(null)
    setSubmitted(false)
    setResults(null)
  }

  // Helper function to determine file type
  const getFileType = (filePath) => {
    if (!filePath) return null;
    const extension = filePath.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    }
    return null;
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
  <div className="container mx-auto px-4 pb-8 -mt-4">  {/* Negative margin pulls content up */}
  <h1 className="text-2xl font-head mb-4">My Assessments</h1>  {/* Reduce heading margin */}
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      {!selectedAssignment ? (
        <div>
          <h2 className="text-xl font-head mb-4">Active Assessments</h2>
          {assignments.length === 0 ? (
            <p className="text-gray-500 mb-8">No active assessments at this time.</p>
          ) : (
            <div className="grid gap-6 font-head md:grid-cols-2 lg:grid-cols-3 mb-8">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-xl border border-opacity-20 border-white p-6 shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
                  <h3 className="text-lg font-semibold mb-2">{assignment.name}</h3>
                  <p className="text-white mb-4">Created: {new Date(assignment.createdAt).toLocaleDateString()}</p>
                  <button 
                    onClick={() => startAssignment(assignment.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Start Assessment
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <h2 className="text-xl font-head mb-4">Completed Assessments</h2>
          {completedAssignments.length === 0 ? (
            <p className="text-gray-500">No completed assessments yet.</p>
          ) : (
            <div className="grid font-body gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedAssignments.map((assignment) => (
                <div key={assignment.id} className="rounded-xl border border-opacity-20 border-white p-6 shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
                  <h3 className="text-lg font-semibold mb-2">{assignment.name}</h3>
                  <p className="text-white mb-2">Completed: {new Date(assignment.completedAt).toLocaleDateString()}</p>
                  <div className="mb-4">
                    <p className="text-sm">Mastery: {assignment.stats.masteryPercentage}%</p>
                    <p className="text-sm">{assignment.stats.masteredQuestions}/{assignment.stats.totalQuestions} questions mastered</p>
                  </div>
                  <button 
                    onClick={() => viewResults(assignment.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    View Results
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : submitted ? (
        <div className=" font-body rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedAssignment.name} - Results</h2>
            <button
              onClick={handleBackToAssignments}
              className=" border border-opacity-20 border-white text-white px-4 py-2 rounded shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10"
            >
              Back to Assessments
            </button>
          </div>
          
          {results ? (
            <div>
              <div className="mb-6 p-4  rounded">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p>Completed on: {new Date(results.completedAt).toLocaleString()}</p>
                <p>Total Questions: {results.responses.length}</p>
                <p>Correct Answers: {
                  results.responses.filter(r => 
                    r.status === 'sure_correct' || r.status === 'not_sure_correct'
                  ).length
                }</p>
              </div>
              
              <div className="space-y-6">
              {results.responses.map((response, index) => {
  // Determine status display properties
  const statusDisplay = {
    'sure_correct': {
      text: 'Sure & Correct',
      color: 'text-green-800',
      bg: 'bg-green-100',
      border: 'border-green-200',
      icon: (
        <FaCheck className="w-4 h-4 text-white"/>
      )
    },
    'not_sure_correct': {
      text: 'Not Sure & Correct',
      color: 'text-blue-800',
      bg: 'bg-blue-100',
      border: 'border-blue-200',
       icon: <FaCheck className="w-4 h-4 text-white" />
    },
    'not_sure_incorrect': {
      text: 'Not Sure & Incorrect',
      color: 'text-yellow-800',
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
     
     icon: <FaTimes className="w-4 h-4 text-white" />
    },
    'sure_incorrect': {
      text: 'Sure & Incorrect',
      color: 'text-red-800',
      bg: 'bg-red-100',
      border: 'border-red-200',
       icon: <FaTimes className="w-4 h-4 text-white" />
    }
  }[response.status] || {
    text: response.status.replace(/_/g, ' '),
    color: 'text-gray-800',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    icon: null
  };

  // Determine feedback message based on status
  let statusMessage = '';
  
  switch(response.status) {
    case 'sure_correct':
      statusMessage = 'The answer is correct!\n\nGreat job — you\'ve mastered this question like a pro!';
      break;
    case 'not_sure_correct':
      statusMessage = 'Correct answer — but not sure.\n\nCheck the quick summary below to refresh your understanding!';
      break;
    case 'not_sure_incorrect':
      statusMessage = 'Incorrect answer — and unsure about it.\n\nGo through the attached document to strengthen your understanding!';
      break;
    case 'sure_incorrect':
      statusMessage = 'Incorrect answer — but you seemed confident.\n\nCheck the attached document to clear up the concept!';
      break;
    default:
      statusMessage = '';
  }

  return (
<div 
  key={index} 
  className={`status-card p-6 rounded-lg mb-6 
    backdrop-blur-sm bg-opacity-20 shadow-lg
    border border-opacity-30
    transition-all duration-300
    hover:bg-opacity-30 hover:shadow-md`}
  style={{
    '--neon-clr': statusDisplay.color === 'text-green-800' ? '#10b981' :
                 statusDisplay.color === 'text-blue-800' ? '#3b82f6' :
                 statusDisplay.color === 'text-yellow-800' ? '#f59e0b' :
                 statusDisplay.color === 'text-red-800' ? '#ef4444' : '#6b7280',
    backgroundColor: statusDisplay.color === 'text-green-800' ? 'rgba(16, 185, 129, 0.1)' :
                    statusDisplay.color === 'text-blue-800' ? 'rgba(59, 130, 246, 0.1)' :
                    statusDisplay.color === 'text-yellow-800' ? 'rgba(245, 158, 11, 0.1)' :
                    statusDisplay.color === 'text-red-800' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
    borderColor: statusDisplay.color === 'text-green-800' ? 'rgba(16, 185, 129, 0.3)' :
                statusDisplay.color === 'text-blue-800' ? 'rgba(59, 130, 246, 0.3)' :
                statusDisplay.color === 'text-yellow-800' ? 'rgba(245, 158, 11, 0.3)' :
                statusDisplay.color === 'text-red-800' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 114, 128, 0.3)'
  }}
>
      <div className="flex items-center mb-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusDisplay.color.replace('text-', 'bg-')} bg-opacity-20`}>
          {statusDisplay.icon}
        </div>
        <div className="ml-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white`}>
            {statusDisplay.text}
          </span>
        </div>
      </div>
      
      <div className="pl-11 text-white">
        <h4 className="font-medium text-lg mb-2">Question {index + 1}: {response.question}</h4>
        
        <div className="mb-4">
          <p className="text-sm">Your answer: <span className="font-medium">{response.userAnswer}</span></p>
          <p className="text-sm">Correct answer: <span className="font-medium">{response.correctAnswer}</span></p>
        </div>
        
        {/* Status message */}
        {statusMessage && (
          <p className="text-sm mb-4 whitespace-pre-line">{statusMessage}</p>
        )}
        
 
{response.feedback?.short && (
  <div className="mb-4 bg-white/60 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-sm">
    <h6 className="text-sm font-semibold mb-1 text-black">Quick Summary</h6>
    <p className="text-sm whitespace-pre-line text-black">{response.feedback.short}</p>
  </div>
)}
        
        {/* Detailed explanation */}
   {response.feedback?.long?.text && (
  <div className="mb-4">
    <h6 className="text-sm font-semibold mb-1">Detailed Explanation</h6>
    <p className="text-sm">{response.feedback.long.text}</p>
  </div>
)}
        
        {/* Resources */}
       {response.feedback.long.filePath && (
  <div className="mt-4">
    <button
      onClick={() => window.open(`${'http://localhost:3000'}${response.feedback.long.filePath}`, '_blank')}
      className="flex items-center px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-300 text-white"
    >
      <FiDownload className="mr-2" />
      <span>Additional Resources</span>
    </button>
  </div>
)}
      </div>
    </div>
  );
})}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p>Loading results...</p>
            </div>
          )}
        </div>
      ) : (
        <div className=" font-head rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-head">{selectedAssignment.name}</h2>
            <div className='font-head text-xl'>
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </div>
          </div>

          {allQuestions.length > 0 && (
            <div>
              {/* Display current category */}
              {questionsByCategory.map(category => {
                if (category.questions.some(q => q.id === allQuestions[currentQuestionIndex].id)) {
                  return (
                    <div key={category.category_id} className="mb-2">
                      <span className="text-xl font-head text-[#3b82f6]">
                        Category: {category.category_name}
                      </span>
                    </div>
                  )
                }
                return null
              })}
              
              <div className="mb-6">
                {/* Display question media (image or video) if available */}
                {allQuestions[currentQuestionIndex].question_media_path && (
                  <div className="mb-4">
                    {getFileType(allQuestions[currentQuestionIndex].question_media_path) === 'image' ? (
                      <img 
                        src={`${'http://localhost:3000'}${allQuestions[currentQuestionIndex].question_media_path}`}
                        alt="Question media"
                        className="w-full h-64 object-contain mx-auto"
                      />
                    ) : getFileType(allQuestions[currentQuestionIndex].question_media_path) === 'video' ? (
                      <video 
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-64 object-contain mx-auto"
                      >
                        <source 
                          src={`${'http://localhost:3000'}${allQuestions[currentQuestionIndex].question_media_path}`}
                          type={`video/${allQuestions[currentQuestionIndex].question_media_path.split('.').pop()}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-head mb-4 flex-1">
                    {allQuestions[currentQuestionIndex].question}
                  </h3>
{allQuestions[currentQuestionIndex].long_content_file_path && (
  <button
    onClick={() => handleViewDocument(allQuestions[currentQuestionIndex].long_content_file_path)}
    className="ml-2 flex items-center px-3 py-1 text-white/80 hover:text-white rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
    title="View document"
  >
    <FiAlertCircle className="w-4 h-4 mr-1 text-[#3b82f6]" />
    <span className="text-sm">View Document</span>
  </button>
)}
                </div>
                
                <div className="space-y-3 mb-6">
                  {allQuestions[currentQuestionIndex].options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`p-3 border font-body rounded cursor-pointer ${
                        userAnswers[allQuestions[currentQuestionIndex].id] === index 
                          ? 'bg-[#3b82f6] border-white' 
                          : 'hover:bg-[#3b82f6]'
                      }`}
                      onClick={() => handleAnswerSelect(allQuestions[currentQuestionIndex].id, index)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                
                {showConfidencePopup && (
                  <ConfidencePopup
                    isOpen={showConfidencePopup}
                    onClose={() => setShowConfidencePopup(false)}
                    onConfidenceSelect={handleConfidenceSelect}
                    questionId={allQuestions[currentQuestionIndex]?.id}
                    currentAnswer={currentAnswerText}
                  />
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded ${
                    currentQuestionIndex === 0 
                      ? '  border border-opacity-20 border-white cursor-not-allowed' 
                      : 'bg-[#3b82f6] text-white '
                  }`}
                >
                  Previous
                </button>
                
                {currentQuestionIndex < allQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    disabled={userAnswers[allQuestions[currentQuestionIndex].id] === undefined}
                    className={`px-4 py-2 rounded ${
                      userAnswers[allQuestions[currentQuestionIndex].id] === undefined
                        ? 'p-4  border border-opacity-20 border-white cursor-not-allowed'
                        : 'bg-[#3b82f6] text-white '
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(userAnswers).length !== allQuestions.length}
                    className={`px-4 py-2 rounded ${
                      Object.keys(userAnswers).length !== allQuestions.length
                        ? 'p-4  border border-opacity-20 border-whitecursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Submit Assignment
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document Popup */}
      <DocumentPopup
        isOpen={showDocumentPopup}
        onClose={() => setShowDocumentPopup(false)}
        documentPath={currentDocumentPath}
      />
    </div>
  )
}

export default Assignments