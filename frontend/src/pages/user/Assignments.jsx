import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../services/auth'
import ConfidencePopup from '../../components/ConfidencePopup'
import DocumentPopup from '../../components/DocumentPopup'
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
    <div className="container mx-auto px-4 py-3"> {/* Adjusted padding */}
      <h1 className="text-xl font-head mb-3">My Assessments</h1> {/* Adjusted margin */}
      
      {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      {!selectedAssignment ? (
        <div>
          <h2 className="text-xl font-head mb-4">Active Assessments</h2>
          {assignments.length === 0 ? (
            <p className="text-gray-500 mb-8">No active assessments at this time.</p>
          ) : (
            <div className="grid gap-6 font-head md:grid-cols-2 lg:grid-cols-3 mb-8">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">{assignment.name}</h3>
                  <p className="text-gray-600 mb-4">Created: {new Date(assignment.createdAt).toLocaleDateString()}</p>
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
                <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
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
        <div className="bg-white font-body rounded-lg shadow p-4"> {/* Adjusted padding */}
          <div className="flex justify-between items-center mb-3"> {/* Adjusted margin */}
            <h2 className="text-xl font-bold">{selectedAssignment.name} - Results</h2>
            <button
              onClick={handleBackToAssignments}
              className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm" /* Adjusted padding */
            >
              Back to Assessments
            </button>
          </div>
          
          {results ? (
            <div>
              <div className="mb-6 p-4 bg-gray-50 rounded">
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
                  const statusDisplay = {
                    'sure_correct': {
                      text: 'Sure & Correct',
                      color: 'text-green-800',
                      bg: 'bg-green-100',
                      border: 'border-green-200',
                      icon: (
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )
                    },
                    'not_sure_correct': {
                      text: 'Not Sure & Correct',
                      color: 'text-blue-800',
                      bg: 'bg-blue-100',
                      border: 'border-blue-200',
                      icon: (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )
                    },
                    'not_sure_incorrect': {
                      text: 'Not Sure & Incorrect',
                      color: 'text-yellow-800',
                      bg: 'bg-yellow-100',
                      border: 'border-yellow-200',
                      icon: (
                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    },
                    'sure_incorrect': {
                      text: 'Sure & Incorrect',
                      color: 'text-red-800',
                      bg: 'bg-red-100',
                      border: 'border-red-200',
                      icon: (
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    }
                  }[response.status] || {
                    text: response.status.replace(/_/g, ' '),
                    color: 'text-gray-800',
                    bg: 'bg-gray-100',
                    border: 'border-gray-200',
                    icon: null
                  };

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
                    <div key={index} className="p-4 rounded border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Question {index + 1}: {response.question}</h4>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Your answer: <span className="font-medium">{response.userAnswer}</span></p>
                        <p className="text-sm text-gray-600">Correct answer: <span className="font-medium">{response.correctAnswer}</span></p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${statusDisplay.bg} ${statusDisplay.border}`}>
                        <div className="flex items-center mb-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusDisplay.color.replace('text-', 'bg-')} bg-opacity-20`}>
                            {statusDisplay.icon}
                          </div>
                          <div className="ml-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusDisplay.color} ${statusDisplay.bg}`}>
                              {statusDisplay.text}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pl-11">
                          {statusMessage && (
                            <p className="text-sm mb-4 whitespace-pre-line">{statusMessage}</p>
                          )}
                          
                          {response.feedback?.short && (
  <div className="mb-4 bg-white/60 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-sm">
    <h6 className="text-sm font-semibold mb-1 text-black">Quick Summary</h6>
    <p className="text-sm whitespace-pre-line text-black">{response.feedback.short}</p>
  </div>
)}
                          
                      {response.feedback?.long?.text && (
  <div className="mb-4">
    <h6 className="text-sm font-semibold mb-1">Detailed Explanation</h6>
    <p className="text-sm">{response.feedback.long.text}</p>
  </div>
)}
                          
                          {response.feedback.long.filePath && (
                            <div className="mt-4 flex items-center space-x-4">
                              <a 
                                href={`${FILE_BASE_URL}${response.feedback.long.filePath}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download Additional Resources
                              </a>
                            </div>
                          )}
                        </div>
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
        <div className="mb-3"> {/* Adjusted margin */}
          <div className="flex justify-between items-center mb-3"> {/* Adjusted margin */}
            <h2 className="text-lg font-semibold">{selectedAssignment.name}</h2>
            <div className="text-sm">
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </div>
          </div>

{allQuestions.length > 0 && (
  <div className={`flex flex-col ${allQuestions[currentQuestionIndex].question_media_path ? 'lg:flex-row' : ''} gap-5`}>
    {/* Left side - Media (only show if media exists) */}
    {allQuestions[currentQuestionIndex].question_media_path && (
      <div className="lg:w-1/2 flex items-center justify-center">
        <div className="w-full">
          {getFileType(allQuestions[currentQuestionIndex].question_media_path) === 'image' ? (
            <img 
              src={`${FILE_BASE_URL}${allQuestions[currentQuestionIndex].question_media_path}`}
              alt="Question media"
              className="w-full max-w-sm mx-auto object-contain" 
              style={{ maxHeight: '250px' }}
            />
          ) : getFileType(allQuestions[currentQuestionIndex].question_media_path) === 'video' ? (
            <div className="w-full max-w-sm mx-auto"> 
              <video 
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full shadow-2xl"
                style={{ maxHeight: '250px' }}
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

    {/* Right side - Question and Options */}
    <div className={allQuestions[currentQuestionIndex].question_media_path ? "lg:w-1/2" : "w-full"}>
      {questionsByCategory.map(category => {
        if (category.questions.some(q => q.id === allQuestions[currentQuestionIndex].id)) {
          return (
            <div key={category.category_id} className="mb-2">
              <span className="text-xs font-bold text-blue-600">
                Category: {category.category_name}
              </span>
            </div>
          )
        }
        return null
      })}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-md font-head flex-1">
          {allQuestions[currentQuestionIndex].question}
        </h3>
        <AudioButton texts={[
          allQuestions[currentQuestionIndex].question,
          `Options are: ${allQuestions[currentQuestionIndex].options.join(', ')}`
        ]} />
      </div>
      
      {allQuestions[currentQuestionIndex].long_content_file_path && (
        <button
          onClick={() => handleViewDocument(allQuestions[currentQuestionIndex].long_content_file_path)}
          className="mb-3 flex items-center px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full border border-blue-200 text-xs"
          title="View document"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">View Document</span>
        </button>
      )}
      
      <div className="space-y-2.5 mb-3">
        {allQuestions[currentQuestionIndex].options.map((option, index) => (
          <div 
            key={index} 
            className={`p-2.5 border font-body rounded cursor-pointer text-sm ${
              userAnswers[allQuestions[currentQuestionIndex].id] === index 
                ? 'bg-blue-100 border-blue-500' 
                : 'hover:bg-gray-50'
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

          {/* Navigation buttons - adjusted spacing */}
          <div className="flex justify-between mt-3"> {/* Adjusted margin */}
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-3.5 py-1.5 rounded text-sm ${ /* Adjusted padding */
                currentQuestionIndex === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            
            {currentQuestionIndex < allQuestions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={userAnswers[allQuestions[currentQuestionIndex].id] === undefined}
                className={`px-3.5 py-1.5 rounded text-sm ${ /* Adjusted padding */
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
                className={`px-3.5 py-1.5 rounded text-sm ${ /* Adjusted padding */
                  Object.keys(userAnswers).length !== allQuestions.length
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Submit Assignment
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
      />
    </div>
  )
}

export default Assignments