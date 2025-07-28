import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import api from '../../services/api'
import { FiBook, FiCheckCircle, FiXCircle, FiBarChart2, FiClock, FiAward } from 'react-icons/fi'

const UserProgress = () => {
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getAllRegularUsers()
        if (response.success) {
          setUsers(response.users)
          if (response.users.length > 0) {
            setSelectedUserId(response.users[0].id)
          }
        } else {
          setError('Failed to fetch users')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUserId) {
      const fetchProgress = async () => {
        try {
          setLoading(true)
          const response = await api.getUserHistory(selectedUserId)
          if (response.success) {
            setHistory(response)
            setError('')
          } else {
            setError('Failed to fetch user progress')
          }
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchProgress()
    }
  }, [selectedUserId])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
  <>
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-head text-gray-800">User Progress</h1>
      {error && <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
    </div>

        {/* User Selection */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-body text-gray-700 mb-2">Select User</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 font-body border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </select>
        </div>

        {/* Overall Stats */}
        {history?.overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Assignments Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-body text-gray-500">Total Assessments</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{history.overallStats.total_assignments}</h3>
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
                  <p className="text-xs sm:text-sm font-body text-gray-500">Questions Attempted</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{history.overallStats.total_questions_attempted}</h3>
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
                  <p className="text-xs sm:text-sm font-body text-gray-500">Correct Answers</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{history.overallStats.total_correct}</h3>
                </div>
                <div className="p-2 rounded-lg bg-green-50">
                  <FiCheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-xs mt-2">
                <span className="text-gray-500 font-body">Accuracy: </span>
                <span className="font-medium">{history.overallStats.overall_accuracy}%</span>
              </p>
            </div>

            {/* Incorrect Answers Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-body text-gray-500">Incorrect Answers</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{history.overallStats.total_incorrect}</h3>
                </div>
                <div className="p-2 rounded-lg bg-red-50">
                  <FiXCircle className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignments List */}
        {history?.assignments && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-head text-gray-800 mb-4">Assessment  History</h2>
            
            <div className="space-y-6">
              {history.assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{assignment.name}</h3>
                      <p className="text-sm text-gray-500">
                        Completed on {new Date(assignment.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      assignment.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.is_completed ? 'Completed' : 'In Progress'}
                    </div>
                  </div>

                  {/* Assignment Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Total Questions</p>
                      <p className="font-medium">{assignment.stats.total_questions}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-500">Correct</p>
                      <p className="font-medium">{assignment.stats.correct_answers}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-xs text-red-500">Incorrect</p>
                      <p className="font-medium">{assignment.stats.incorrect_answers}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-500">Accuracy</p>
                      <p className="font-medium">{assignment.stats.accuracy}%</p>
                    </div>
                  </div>

                  {/* Categories Breakdown */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Categories Performance</h4>
                    <div className="space-y-3">
                      {assignment.categories.map((category) => (
                        <div key={category.category_id} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{category.category_name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              category.accuracy >= 70 ? 'bg-green-100 text-green-800' : 
                              category.accuracy >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {category.accuracy}% accuracy
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className="flex items-center">
                              <FiCheckCircle className="text-green-500 mr-1" />
                              <span>{category.correct_answers} correct</span>
                            </div>
                            <div className="flex items-center">
                              <FiXCircle className="text-red-500 mr-1" />
                              <span>{category.incorrect_answers} incorrect</span>
                            </div>
                            <div className="flex items-center">
                              <FiAward className="text-blue-500 mr-1" />
                              <span>Confidence: {category.confidence}</span>
                            </div>
                            <div className="flex items-center">
                              <FiClock className="text-gray-500 mr-1" />
                              <span>{category.sure_correct} sure correct</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !history && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-gray-500">No progress data available for this user</p>
          </div>
        )}
     </>
  )
}

export default UserProgress