import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../services/auth'
import { FiBook, FiCheckCircle, FiXCircle, FiBarChart2, FiAward, FiClock } from 'react-icons/fi'
import { TypeAnimation } from 'react-type-animation'

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

  if (loading) return <div className="flex justify-center items-center h-screen text-black">Loading...</div>

  return (
    <div className="text-black p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-head sm:text-3xl font-bold text-black mr-2">My</h1>
   <TypeAnimation
  sequence={[
    "Learning Journey",
    1000,
    "Knowledge Progress", 
    1000,
    "Skill Mastery",
    1000,
    "Assessment Results",
    1000,
    "Performance Insights",
    1000,
  ]}
  wrapper="span"
  speed={50}
  style={{ 
    fontSize: '1.5rem',
    display: 'inline-block',
    color: '#3b82f6',
    fontWeight: 'bold'
  }}
  repeat={Infinity}
/>
      </div>
      
      {error && <div className="mb-4 p-2 bg-white border border-opacity-20 border-white rounded-lg shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)]">{error}</div>}
      
      {progress && (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Assignments Card */}
           {/* Total Assignments Card - with glass effect */}
<div className=" p-4 rounded-xl  border-black border">
  <div className="flex items-center justify-between">
    <div>
      <p className="font-head text-black">Total Assessments</p>
      <h3 className="text-xl sm:text-2xl font-bold mt-1 text-black">{progress.overallStats.total_assignments}</h3>
    </div>
    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 bg-opacity-30">
      <FiBook className="w-5 h-5 text-blue-300" />
    </div>
  </div>
</div>

            {/* Questions Attempted Card */}
          <div className=" p-4 rounded-xl  border-black border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-head text-black">Questions Attempted</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-black">{progress.overallStats.total_questions_attempted}</h3>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-900 to-purple-700 bg-opacity-30">
                  <FiBarChart2 className="w-5 h-5 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Correct Answers Card */}
           <div className=" p-4 rounded-xl  border-black border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-head text-black">Correct Answers</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-black">{progress.overallStats.correct_answers}</h3>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-900 to-green-700 bg-opacity-30">
                  <FiCheckCircle className="w-5 h-5 text-green-300" />
                </div>
              </div>
              <p className="text-xs mt-2">
                <span className="font-head text-black">Accuracy: </span>
                <span className="font-medium text-black">{progress.overallStats.accuracy}%</span>
              </p>
            </div>

            {/* Mastery Level Card */}
        <div className=" p-4 rounded-xl  border-black border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-head text-black">Mastery Level</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-black">{progress.overallStats.mastery}%</h3>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-900 to-yellow-700 bg-opacity-30">
                  <FiAward className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
              <p className="text-xs mt-2">
                <span className="text-black">Mastered Questions: </span>
                <span className="font-medium text-black">{progress.overallStats.mastered_questions}</span>
              </p>
            </div>
          </div>

          {/* Categories Progress */}
      <div className=" p-6 mb-8 rounded-xl  border-black border">
            <h2 className="text-lg sm:text-xl font-head text-black mb-4">Category-wise Progress</h2>
            
            <div className="space-y-4">
              {progress.categories.map((category) => (
                <div key={category.categoryId} className="   pl-4 py-3 rounded-r-lg border border-opacity-20 border-white shadow-[0_2px_4px_rgba(255,255,255,0.05)]">
                  <div className="flex font-head justify-between items-center mb-2">
                    <h3 className="font-head text-black">{category.categoryName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.accuracy >= 70 ? 'bg-gradient-to-br from-green-900 to-green-700 text-green-100' : 
                      category.accuracy >= 50 ? 'bg-gradient-to-br from-yellow-900 to-yellow-700 text-yellow-100' : 
                      'bg-gradient-to-br from-red-900 to-red-700 text-red-100'
                    }`}>
                      {category.accuracy}% accuracy
                    </span>
                  </div>
                  
                  <div className="flex justify-between font-head mb-1 text-sm">
                    <span className="text-black font-head">Completion</span>
                    <span className="font-head text-black">{category.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" 
                      style={{ width: `${category.completionPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-head">
                    <div className="flex items-center  text-black">
                      <FiCheckCircle className="text-green-300 mr-1" />
                      <span>{category.correctAnswers} correct</span>
                    </div>
                    <div className="flex items-center text-black">
                      <FiXCircle className="text-red-300 mr-1" />
                      <span>{category.incorrectAnswers} incorrect</span>
                    </div>
                    <div className="flex items-center text-black">
                      <FiAward className="text-blue-300 mr-1" />
                      <span>Mastered: {category.masteredQuestions}</span>
                    </div>
                    <div className="flex items-center text-black">
                      <FiClock className="text-gray-300 mr-1" />
                      <span>Confidence: {category.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

     {/* Recent Activity */}
<div className=" p-6 rounded-xl  border-black border">
  <h2 className="text-lg sm:text-xl font-head text-black mb-4">Recent Activity</h2>
  
  <div className="overflow-x-auto w-full">
    <table className="w-full table-fixed divide-y divide-gray-600">
      <colgroup>
        <col className="w-[30%]" /> {/* Question */}
        <col className="w-[15%]" /> {/* Category */}
        <col className="w-[15%]" /> {/* Your Answer */}
        <col className="w-[15%]" /> {/* Correct Answer */}
        <col className="w-[15%]" /> {/* Status */}
        <col className="w-[10%]" /> {/* Time */}
      </colgroup>
      <thead>
        <tr className="border border-opacity-20 ">
          <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider truncate">Question</th>
          <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider truncate">Category</th>
          <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider truncate">Your Answer</th>
          <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider truncate">Correct Answer</th>
          <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider truncate">Status</th>
          <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider truncate">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-600">
        {progress.recentActivity.map((activity) => (
          <tr key={activity.responseId}>
            <td className="px-3 py-4 text-sm font-medium text-black truncate" title={activity.question}>
              {activity.question}
            </td>
            <td className="px-3 py-4 text-sm text-black truncate" title={activity.category}>
              {activity.category}
            </td>
            <td className="px-3 py-4 text-sm text-black truncate" title={activity.userAnswer}>
              {activity.userAnswer}
            </td>
            <td className="px-3 py-4 text-sm text-black truncate" title={activity.correctAnswer}>
              {activity.correctAnswer}
            </td>
            <td className="px-3 py-4 truncate">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                activity.isCorrect 
                  ? activity.status.includes('sure') 
                    ? 'bg-gradient-to-br from-green-900 to-green-700 text-green-100' 
                    : 'bg-gradient-to-br from-blue-900 to-blue-700 text-blue-100'
                  : activity.status.includes('sure') 
                    ? 'bg-gradient-to-br from-red-900 to-red-700 text-red-100' 
                    : 'bg-gradient-to-br from-yellow-900 to-yellow-700 text-yellow-100'
              } truncate`} title={activity.status.replace(/_/g, ' ')}>
                {activity.status.replace(/_/g, ' ')}
              </span>
            </td>
            <td className="px-3 py-4 text-sm text-black truncate" title={new Date(activity.responseTime).toLocaleString()}>
              {new Date(activity.responseTime).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        </>
      )}
    </div>
  )
}

export default Progress


