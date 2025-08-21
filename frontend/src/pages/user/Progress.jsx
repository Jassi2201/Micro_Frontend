import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../services/auth'
import { FiBook, FiCheckCircle, FiXCircle, FiBarChart2, FiAward, FiClock, FiTrendingUp, FiTrendingDown, FiActivity, FiUsers } from 'react-icons/fi'
import { TypeAnimation } from 'react-type-animation'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Bar, Radar, Line, Pie, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)

const Progress2 = () => {
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

  if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading...</div>

  // Data for charts
  const barChartData = {
    labels: ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude'],
    datasets: [
      {
        label: 'All India Average',
        data: [80, 65, 71, 81, 49],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Regional Average',
        data: [80, 67, 67, 78, 39],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Dealer Average',
        data: [87, 60, 70, 80, 30],
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  }

  const radarChartData = {
    labels: ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude'],
    datasets: [
      {
        label: 'All India Average',
        data: [80, 65, 71, 81, 49],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
      {
        label: 'Regional Average',
        data: [80, 67, 67, 78, 39],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      },
      {
        label: 'Dealer Average',
        data: [87, 60, 70, 80, 30],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
      },
    ],
  }

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Dealer Score Trend',
        data: [62, 64, 63, 65, 66, 65],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Regional Trend',
        data: [65, 66, 67, 68, 68, 68],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const pieChartData = {
    labels: ['Excellent', 'Good', 'Average', 'Need Improvement'],
    datasets: [
      {
        data: [12, 35, 28, 25],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const doughnutChartData = {
    labels: ['Sales Executives', 'Team Leaders', 'Managers', 'Others'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(156, 163, 175, 0.7)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Team performance data
  const teamPerformanceData = [
    { name: 'John Doe', role: 'Team Leader', score: 82, trend: '+5%', category: 'Excellent' },
    { name: 'Jane Smith', role: 'Sales Executive', score: 78, trend: '+12%', category: 'Good' },
    { name: 'Mike Johnson', role: 'Sales Executive', score: 65, trend: '-2%', category: 'Average' },
    { name: 'Sarah Williams', role: 'Sales Executive', score: 59, trend: '+8%', category: 'Average' },
    { name: 'David Brown', role: 'Sales Executive', score: 48, trend: '-10%', category: 'Need Improvement' },
  ]

  // Training needs data
  const trainingNeedsData = [
    { topic: 'Advanced Product Features', priority: 'High', employees: 8 },
    { topic: 'Competitor Analysis', priority: 'High', employees: 6 },
    { topic: 'Customer Handling', priority: 'Medium', employees: 4 },
    { topic: 'Sales Process Optimization', priority: 'Medium', employees: 3 },
    { topic: 'Team Leadership', priority: 'Low', employees: 2 },
  ]

  // Heatmap component
  const HeatmapChart = () => {
    const attributes = ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude']
    const benchmarks = ['All India', 'Regional', 'Dealer']
    const scores = [
      [80, 65, 71, 81, 49],  // All India
      [80, 67, 67, 78, 39],  // Regional
      [87, 60, 70, 80, 30]   // Dealer
    ]

    // Function to determine cell color based on score
    const getColor = (score) => {
      if (score >= 80) return 'bg-green-500'
      if (score >= 60) return 'bg-yellow-500'
      if (score >= 40) return 'bg-orange-500'
      return 'bg-red-500'
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-white"></th>
              {attributes.map((attr, i) => (
                <th key={i} className="px-4 py-2 text-center text-sm font-medium text-white whitespace-nowrap">
                  {attr}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((benchmark, rowIdx) => (
              <tr key={rowIdx}>
                <td className="px-4 py-2 text-sm font-medium text-white whitespace-nowrap">
                  {benchmark}
                </td>
                {scores[rowIdx].map((score, colIdx) => (
                  <td key={colIdx} className="px-4 py-2 text-center">
                    <div className={`${getColor(score)} text-white p-2 rounded-md font-semibold`}>
                      {score}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
            <span className="text-xs text-white">80-100%</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-1"></div>
            <span className="text-xs text-white">60-79%</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded mr-1"></div>
            <span className="text-xs text-white">40-59%</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
            <span className="text-xs text-white">0-39%</span>
          </div>
        </div>
      </div>
    )
  }

  // Progress Card component
  const ProgressCard = ({ title, value, trend, icon, color }) => {
    const colorClasses = {
      blue: 'from-blue-900 to-blue-700',
      purple: 'from-purple-900 to-purple-700',
      green: 'from-green-900 to-green-700',
      red: 'from-red-900 to-red-700'
    }

    return (
      <div className="p-4 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">{title}</span>
          {icon}
        </div>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
            {trend}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="text-white p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-head sm:text-3xl font-bold text-white mr-2">My</h1>
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
      
      {error && <div className="mb-4 p-2 bg-gradient-to-r from-red-900 to-red-700 border border-opacity-20 border-white rounded-lg shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)]">{error}</div>}
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <ProgressCard 
          title="Overall Score" 
          value="65.33%" 
          trend="+2.1% vs last month" 
          icon={<FiActivity className="text-blue-300" />} 
          color="blue" 
        />
        <ProgressCard 
          title="Regional Rank" 
          value="12/25" 
          trend="+3 ranks" 
          icon={<FiBarChart2 className="text-purple-300" />} 
          color="purple" 
        />
        <ProgressCard 
          title="Team Members" 
          value="8" 
          icon={<FiUsers className="text-green-300" />} 
          color="green" 
        />
        <ProgressCard 
          title="Certifications" 
          value="3" 
          trend="1 new" 
          icon={<FiAward className="text-red-300" />} 
          color="red" 
        />
      </div>
      
      {/* Section 1 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Dealership Performance</h2>
        <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white border-opacity-20">
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Dealer Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Dealership Score</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Total Participation</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Regional Rank</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">National Rank</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">Regent Automobiles - Faridabad</td>
                  <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">65.33%</td>
                  <td className="px-4 py-2 border-b border-white border-opacity-20">
                    <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-white rounded-full text-xs">Need Improvement</span>
                  </td>
                  <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">2</td>
                  <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">12/25</td>
                  <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">145/320</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Line Chart */}
        <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 mb-6">
          <h3 className="text-md font-medium text-white mb-3">Performance Trend (Last 6 Months)</h3>
          <div className="h-64">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 50,
                    max: 80,
                    title: {
                      display: true,
                      text: 'Score (%)',
                      color: '#fff'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#fff'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#fff'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#fff'
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw}%`
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Section 2 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Score Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
            <h3 className="text-md font-medium text-white mb-3">Attribute Comparison (Bar Chart)</h3>
            <div className="h-64">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Score (%)',
                        color: '#fff'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: '#fff'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: '#fff'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#fff'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.raw}%`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Radar Chart */}
          <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
            <h3 className="text-md font-medium text-white mb-3">Skill Assessment (Radar Chart)</h3>
            <div className="h-64">
              <Radar
                data={radarChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      angleLines: {
                        display: true,
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      suggestedMin: 0,
                      suggestedMax: 100,
                      ticks: {
                        stepSize: 20,
                        color: '#fff'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      pointLabels: {
                        color: '#fff'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#fff'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.raw}%`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Pie and Doughnut Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
            <h3 className="text-md font-medium text-white mb-3">Performance Category Distribution</h3>
            <div className="h-64">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#fff'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.raw}%`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Doughnut Chart */}
          <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
            <h3 className="text-md font-medium text-white mb-3">Team Composition</h3>
            <div className="h-64">
              <Doughnut
                data={doughnutChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#fff'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.raw}%`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Heatmap Chart */}
        <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 mb-6">
          <h3 className="text-md font-medium text-white mb-3">Performance Heatmap</h3>
          <div className="p-4">
            <HeatmapChart />
          </div>
        </div>
      </div>
      
      {/* Section 3 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Team Performance</h2>
        
        <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white border-opacity-20">
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Team Member</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Role</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Score</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Trend</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformanceData.map((member, index) => (
                  <tr key={index} className="border-b border-white border-opacity-20">
                    <td className="px-4 py-2 text-white">{member.name}</td>
                    <td className="px-4 py-2 text-white">{member.role}</td>
                    <td className="px-4 py-2 font-semibold text-white">{member.score}%</td>
                    <td className="px-4 py-2">
                      <span className={`flex items-center ${member.trend.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                        {member.trend.startsWith('+') ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                        {member.trend}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {member.category === 'Excellent' && <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded-full text-xs">Excellent</span>}
                      {member.category === 'Good' && <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-xs">Good</span>}
                      {member.category === 'Average' && <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-full text-xs">Average</span>}
                      {member.category === 'Need Improvement' && <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-red-300 rounded-full text-xs">Need Improvement</span>}
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-xs bg-blue-500 bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Section 4 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Training Needs Analysis</h2>
        
        <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white border-opacity-20">
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Training Topic</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Priority</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Employees Needing</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Suggested Programs</th>
                </tr>
              </thead>
              <tbody>
                {trainingNeedsData.map((training, index) => (
                  <tr key={index} className="border-b border-white border-opacity-20">
                    <td className="px-4 py-2 text-white">{training.topic}</td>
                    <td className="px-4 py-2">
                      {training.priority === 'High' && <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-red-300 rounded-full text-xs">High</span>}
                      {training.priority === 'Medium' && <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-full text-xs">Medium</span>}
                      {training.priority === 'Low' && <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded-full text-xs">Low</span>}
                    </td>
                    <td className="px-4 py-2 text-white">{training.employees}</td>
                    <td className="px-4 py-2">
                      <button className="text-xs bg-purple-500 bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded">
                        View Options
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Detailed Attribute Comparison */}
        <div className="p-6 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10">
          <h3 className="text-md font-medium text-white mb-3">Detailed Attribute Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white border-opacity-20">
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Attribute</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">All India Average Score %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Regional Average Score %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Dealer Average Score %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Variance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white border-opacity-20">
                  <td className="px-4 py-2 text-white">Product Knowledge</td>
                  <td className="px-4 py-2 text-white">80</td>
                  <td className="px-4 py-2 text-white">80</td>
                  <td className="px-4 py-2 font-semibold text-white">87</td>
                  <td className="px-4 py-2 text-green-300 font-semibold">+7%</td>
                </tr>
                <tr className="border-b border-white border-opacity-20">
                  <td className="px-4 py-2 text-white">Competition Knowledge</td>
                  <td className="px-4 py-2 text-white">65</td>
                  <td className="px-4 py-2 text-white">67</td>
                  <td className="px-4 py-2 font-semibold text-white">60</td>
                  <td className="px-4 py-2 text-red-300 font-semibold">-7%</td>
                </tr>
                <tr className="border-b border-white border-opacity-20">
                  <td className="px-4 py-2 text-white">Sales Process Knowledge</td>
                  <td className="px-4 py-2 text-white">71</td>
                  <td className="px-4 py-2 text-white">67</td>
                  <td className="px-4 py-2 font-semibold text-white">70</td>
                  <td className="px-4 py-2 text-green-300 font-semibold">+3%</td>
                </tr>
                <tr className="border-b border-white border-opacity-20">
                  <td className="px-4 py-2 text-white">Team Leader Role</td>
                  <td className="px-4 py-2 text-white">81</td>
                  <td className="px-4 py-2 text-white">78</td>
                  <td className="px-4 py-2 font-semibold text-white">80</td>
                  <td className="px-4 py-2 text-green-300 font-semibold">+2%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-white">Aptitude</td>
                  <td className="px-4 py-2 text-white">49</td>
                  <td className="px-4 py-2 text-white">39</td>
                  <td className="px-4 py-2 font-semibold text-white">30</td>
                  <td className="px-4 py-2 text-red-300 font-semibold">-9%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress2