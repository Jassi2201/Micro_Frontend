import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../services/auth'
import ConfidencePopup from '../../components/ConfidencePopup'
import DocumentPopup from '../../components/DocumentPopup'
import {FaCheck,FaTimes} from 'react-icons/fa'
import "./Assignment.css"
import { FiDownload, FiAlertCircle } from 'react-icons/fi';
import AudioButton from '../../components/AudioButton'
import { FILE_BASE_URL } from '../../services/api'; // Import the base URL from api.js



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
  const [currentDocumentAudioPath, setCurrentDocumentAudioPath] = useState('');

  const allQuestions = questionsByCategory.reduce((acc, category) => {
    return [...acc, ...category.questions]
  }, [])

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await api.getUserAssignmentCompletionDetails(user.id)
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
              options: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
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
              options: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
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
    
    setCurrentAnswerText(selectedOption)
    setShowConfidencePopup(true)
  }

  const handleConfidenceSelect = (questionId, isSure) => {
    setUserConfidence(prev => ({
      ...prev,
      [questionId]: isSure
    }))
    setShowConfidencePopup(false)
  }

 const handleViewDocument = (documentPath, audioPath) => {
  setCurrentDocumentPath(documentPath);
  setCurrentDocumentAudioPath(audioPath); // You'll need to add this state
  setShowDocumentPopup(true);
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
      
      const responses = Object.entries(userAnswers).map(([questionId, answerIndex]) => {
        const question = allQuestions.find(q => q.id === parseInt(questionId))
        const selectedOption = question.options[answerIndex]
        
        return {
          questionId: parseInt(questionId),
          answer: selectedOption,
          isSure: userConfidence[questionId] || false
        }
      })
      
      const submissionResponse = await api.submitAssignment(user.id, selectedAssignment.id, responses)
      
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
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-xl font-head mb-4">My Assessments</h1>
      
      {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

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
                  <p className="text-gray-600 mb-4">Created: {new Date(assignment.createdAt).toLocaleDateString()}</p>
                  <button 
                    onClick={() => startAssignment(assignment.id)}
                    className="bg-blue-600 text-white  px-4 py-2 rounded hover:bg-blue-700"
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
                  <p className="text-gray-600 mb-2">Completed: {new Date(assignment.completedAt).toLocaleDateString()}</p>
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
      onClick={() => window.open(`${FILE_BASE_URL}${response.feedback.long.filePath}`, '_blank')}
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
        <div className="mb-4">
    <div className="flex justify-between items-center mb-5">
  <h2 className="text-lg font-head">{selectedAssignment.name}</h2>
  <div className="absolute left-1/2 transform -translate-x-1/2">
    {questionsByCategory.map(category => {
      if (category.questions.some(q => q.id === allQuestions[currentQuestionIndex].id)) {
        return (
          <span 
            key={category.category_id} 
            className="text-lg font-head text-white "
          >
           Category: {category.category_name}
          </span>
        )
      }
      return null
    })}
  </div>
  <div className=" font-head">
    Question {currentQuestionIndex + 1} of {allQuestions.length}
  </div>
</div>

          {allQuestions.length > 0 && (
            <div className={`flex flex-col ${allQuestions[currentQuestionIndex].question_media_path ? 'lg:flex-row' : ''} gap-4`}>
              {/* Media section */}
            {allQuestions[currentQuestionIndex].question_media_path && (
  <div className="lg:w-1/2 flex items-center justify-center">
    <div className="w-full">
      {getFileType(allQuestions[currentQuestionIndex].question_media_path) === 'image' ? (
        <img 
          src={`${FILE_BASE_URL}${allQuestions[currentQuestionIndex].question_media_path}`}
          alt="Question media"
          className="w-full max-w-md mx-auto object-contain" 
          style={{ maxHeight: '300px' }}
        />
      ) : getFileType(allQuestions[currentQuestionIndex].question_media_path) === 'video' ? (
        <div className="w-full max-w-md mx-auto"> 
          <video 
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full"
            style={{ maxHeight: '300px' }}
          >
            <source 
              src={`${FILE_BASE_URL}${allQuestions[currentQuestionIndex].question_media_path}`}
              type={`video/${allQuestions[currentQuestionIndex].question_media_path.split('.').pop()}`}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}
    </div>
  </div>
)}
              {/* Question section */}
              <div className={allQuestions[currentQuestionIndex].question_media_path ? "lg:w-1/2" : "w-full"}>
               
                
                <h3 className="text-base font-head mb-3 flex items-center">
                  {allQuestions[currentQuestionIndex].question}
                  {allQuestions[currentQuestionIndex].question_answer_audio_path && (
                    <AudioButton 
                      audioUrl={`${FILE_BASE_URL}${allQuestions[currentQuestionIndex].question_answer_audio_path}`}
                      className="ml-2"
                    />
                  )}
                </h3>
                
                {allQuestions[currentQuestionIndex].long_content_file_path && (
                  <button
                    onClick={() => handleViewDocument(
                      allQuestions[currentQuestionIndex].long_content_file_path,
                      allQuestions[currentQuestionIndex].long_content_audio_path
                    )}
                    className="mb-3 flex items-center px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 text-xs"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    View Document
                  </button>
                )}
                
             <div className="space-y-2 mb-4">
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
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
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
                className={`px-3 py-1.5 rounded text-sm ${
                  userAnswers[allQuestions[currentQuestionIndex].id] === undefined
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length !== allQuestions.length}
                className={`px-3 py-1.5 rounded text-sm ${
                  Object.keys(userAnswers).length !== allQuestions.length
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Submit
              </button>
            )}
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
      )}

      <DocumentPopup
        isOpen={showDocumentPopup}
        onClose={() => setShowDocumentPopup(false)}
        documentPath={currentDocumentPath}
        audioPath={currentDocumentAudioPath}
      />
    </div>
  )
}

export default Assignments