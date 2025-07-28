import { useState, useEffect } from 'react'
import UserSidebar from '../../components/UserSidebar'
import api from '../../services/api'
import { useAuth } from '../../services/auth'
import { FiBook, FiCheckCircle, FiXCircle, FiBarChart2, FiAward, FiClock } from 'react-icons/fi'

const Progress = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await api.getUserProgress(user.id)
        setProgress(data.progress)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchProgress()
    }
  }, [user])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <>
      <h1 className="text-2xl font-head sm:text-3xl font-bold text-gray-800 mb-6">My Progress</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      {progress && (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Assignments Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-head text-gray-500">Total Assessments</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{progress.overallStats.total_assignments}</h3>
                </div>
                <div className="p-2 rounded-lg bg-blue-50">
                  <FiBook className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Questions Attempted Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-head text-gray-500">Questions Attempted</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{progress.overallStats.total_questions_attempted}</h3>
                </div>
                <div className="p-2 rounded-lg bg-purple-50">
                  <FiBarChart2 className="w-5 h-5 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Correct Answers Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-head text-gray-500">Correct Answers</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{progress.overallStats.correct_answers}</h3>
                </div>
                <div className="p-2 rounded-lg bg-green-50">
                  <FiCheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-xs mt-2">
                <span className="text-gray-500 font-head">Accuracy: </span>
                <span className="font-medium">{progress.overallStats.accuracy}%</span>
              </p>
            </div>

            {/* Mastery Level Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-head text-gray-500">Mastery Level</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{progress.overallStats.mastery}%</h3>
                </div>
                <div className="p-2 rounded-lg bg-yellow-50">
                  <FiAward className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-xs mt-2">
                <span className="text-gray-500">Mastered Questions: </span>
                <span className="font-medium">{progress.overallStats.mastered_questions}</span>
              </p>
            </div>
          </div>

          {/* Categories Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-head text-gray-800 mb-4">Category-wise Progress</h2>
            
            <div className="space-y-4">
              {progress.categories.map((category) => (
                <div key={category.categoryId} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex font-head justify-between items-center mb-2">
                    <h3 className="font-head text-gray-800">{category.categoryName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.accuracy >= 70 ? 'bg-green-100 text-green-800' : 
                      category.accuracy >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.accuracy}% accuracy
                    </span>
                  </div>
                  
                  <div className="flex justify-between font-head mb-1 text-sm">
                    <span className="text-gray-500 font-head">Completion</span>
                    <span className="font-medium">{category.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${category.completionPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center">
                      <FiCheckCircle className="text-green-500 mr-1" />
                      <span>{category.correctAnswers} correct</span>
                    </div>
                    <div className="flex items-center">
                      <FiXCircle className="text-red-500 mr-1" />
                      <span>{category.incorrectAnswers} incorrect</span>
                    </div>
                    <div className="flex items-center">
                      <FiAward className="text-blue-500 mr-1" />
                      <span>Mastered: {category.masteredQuestions}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-gray-500 mr-1" />
                      <span>Confidence: {category.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg sm:text-xl font-head text-gray-800 mb-4">Recent Activity</h2>
            
            <div className="overflow-x-auto font-body">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Your Answer</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Correct Answer</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y font-body divide-gray-200">
                  {progress.recentActivity.map((activity) => (
                    <tr key={activity.responseId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.question}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.userAnswer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.correctAnswer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.isCorrect 
                            ? activity.status.includes('sure') 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                            : activity.status.includes('sure') 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(activity.responseTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Progress