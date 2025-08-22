import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import { useAuth } from '../../services/auth'
import {  FiBarChart2, FiAward, FiTrendingUp, FiTrendingDown, FiActivity, FiUsers } from 'react-icons/fi'
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
import GurgaonGlobe from '../../components/GurgaonGlobe'
import OverallScoreIcon from '../../assets/score.png'
import RegionalRankIcon from '../../assets/ranking.png'
import TeamMembersIcon from '../../assets/team.png'
import CertificationsIcon from '../../assets/certificate.png'


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

const Progess = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // State to track which cards are flipped
  const [flippedCards, setFlippedCards] = useState({})

  const toggleFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

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
  const ProgressCard = ({ title, value, trend, icon, color, id }) => {
    const colorClasses = {
      blue: 'from-blue-900 to-blue-700',
      purple: 'from-purple-900 to-purple-700',
      green: 'from-green-900 to-green-700',
      red: 'from-red-900 to-red-700'
    }

    return (
      <motion.div 
        className="cursor-pointer"
        onClick={() => toggleFlip(id)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <motion.div 
          className="p-4 rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 h-full"
          animate={{ rotateY: flippedCards[id] ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flex flex-col justify-between h-full" style={{ transform: flippedCards[id] ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{title}</span>
              {/* Replace with your custom icon */}
              <img src={icon} alt={title} className="w-12 h-12" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{value}</p>
            {trend && (
              <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                {trend}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Flip Container component for all glassy containers
  const FlipContainer = ({ id, title, children, className = "" }) => {
    return (
      <motion.div 
        className={`cursor-pointer ${className}`}
        onClick={() => toggleFlip(id)}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <motion.div 
          className="h-full rounded-xl border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10"
          animate={{ rotateY: flippedCards[id] ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="h-full p-6" style={{ transform: flippedCards[id] ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
            {title && <h3 className="text-md font-medium text-white mb-3">{title}</h3>}
            {children}
          </div>
        </motion.div>
      </motion.div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Gurgaon Globe */}
        <div className='h-96'>
          <h2 className="text-lg font-semibold text-white mb-4">Location Overview</h2>
          <FlipContainer id="globe" className="h-full">
            <GurgaonGlobe />
          </FlipContainer>
        </div>
        
        {/* Right column - System Login Details */}
        <div className='h-96'>
          <h2 className="text-lg font-semibold text-white mb-4">System Access & Analytics</h2>
          <FlipContainer id="system" className="h-full">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <img 
                  src="https://png.pngtree.com/png-vector/20240628/ourmid/pngtree-laptop-with-blank-screen-and-png-image_12732543.png"
                  alt="System Device" 
                  className="w-96 h-auto"
                />
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-48 h-32 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-green-400 font-semibold">● Online</span>
                    <span className="text-xs text-white">Dell Latitude 5420</span>
                  </div>
                  <div className="bg-blue-900 bg-opacity-30 p-2 rounded mb-2">
                    <p className="text-xs text-white">Last login: Today, 09:42 AM</p>
                  </div>
                  <div className="flex justify-between text-xs text-white">
                    <span>IP: 192.168.1.45</span>
                    <span>VPN: Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </FlipContainer>
        </div>
      </div>  

    {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-20">
        <ProgressCard 
          id="score"
          title="Overall Score" 
          value="65.33%" 
          trend="+2.1% vs last month" 
          icon={OverallScoreIcon} // Use your custom icon
          color="blue" 
        />
        <ProgressCard 
          id="rank"
          title="Regional Rank" 
          value="12/25" 
          trend="+3 ranks" 
          icon={RegionalRankIcon} // Use your custom icon
          color="purple" 
        />
        <ProgressCard 
          id="team"
          title="Team Members" 
          value="8" 
          icon={TeamMembersIcon} // Use your custom icon
          color="green" 
        />
        <ProgressCard 
          id="cert"
          title="Certifications" 
          value="3" 
          trend="1 new" 
          icon={CertificationsIcon} // Use your custom icon
          color="red" 
        />
      </div>
          
 {/* Section 1 */}
<div className="mb-8">
  <h2 className="text-lg font-semibold text-white mt-8 mb-3">Dealership Performance</h2>
  
  <FlipContainer id="performance" className="mb-6">
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
          <tr>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">Premium Motors - Gurgaon</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">82.15%</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20">
              <span className="px-2 py-1 bg-green-500 bg-opacity-20  text-white  text-white rounded-full text-xs">Excellent</span>
            </td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">5</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">3/25</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">42/320</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">City Auto - Delhi</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">78.42%</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20">
              <span className="px-2 py-1 bg-blue-500 bg-opacity-20  text-white rounded-full text-xs">Good</span>
            </td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">3</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">7/25</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">78/320</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">Metro Cars - Noida</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">71.89%</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20">
              <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300  text-white rounded-full text-xs">Good</span>
            </td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">4</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">9/25</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">92/320</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">Elite Automotives - Ghaziabad</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">68.24%</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20">
              <span className="px-2 py-1 bg-yellow-500 bg-opacity-20  text-white rounded-full text-xs">Average</span>
            </td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 font-semibold text-white">2</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">14/25</td>
            <td className="px-4 py-2 border-b border-white border-opacity-20 text-white">156/320</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold text-white">Speed Wheels - Faridabad</td>
            <td className="px-4 py-2 font-semibold text-white">59.76%</td>
            <td className="px-4 py-2">
              <span className="px-2 py-1 bg-red-500 bg-opacity-20  text-white rounded-full text-xs">Needs Improvement</span>
            </td>
            <td className="px-4 py-2 font-semibold text-white">1</td>
            <td className="px-4 py-2 text-white">22/25</td>
            <td className="px-4 py-2 text-white">278/320</td>
          </tr>
        </tbody>
      </table>
    </div>
  </FlipContainer>
  
  {/* Line Chart with more data points */}
{/* Enhanced Line Chart with gradient fills and annotations */}
<FlipContainer id="trend" className="mb-6">
  <h3 className="text-md font-medium text-white mb-3">Performance Trend Analysis (Last 12 Months)</h3>
  <div className="h-64">
    <Line
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Dealer Performance',
            data: [62, 64, 63, 65, 66, 65, 67, 68, 67, 66, 65, 65.33],
            borderColor: 'rgba(147, 51, 234, 1)', // Vibrant purple
            borderWidth: 3,
            pointBackgroundColor: 'rgba(147, 51, 234, 1)',
            pointBorderColor: '#fff',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            fill: true,
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
              gradient.addColorStop(1, 'rgba(147, 51, 234, 0.05)');
              return gradient;
            },
            tension: 0.4,
            segment: {
              borderDash: (ctx) => ctx.p0.parsed.y > ctx.p1.parsed.y ? [5, 5] : undefined,
            },
          },
          {
            label: 'Regional Benchmark',
            data: [65, 66, 67, 68, 68, 68, 69, 70, 71, 70, 69, 68.5],
            borderColor: 'rgba(16, 185, 129, 1)', // Emerald green
            borderWidth: 3,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            fill: true,
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
              gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
              return gradient;
            },
            tension: 0.4,
          },
          {
            label: 'National Average',
            data: [67, 67, 68, 69, 69, 70, 70, 71, 71, 72, 72, 72.5],
            borderColor: 'rgba(245, 158, 11, 1)', // Amber
            borderWidth: 3,
            pointBackgroundColor: 'rgba(245, 158, 11, 1)',
            pointBorderColor: '#fff',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            fill: true,
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
              gradient.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
              return gradient;
            },
            tension: 0.4,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            right: 15,
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 55,
            max: 75,
            title: {
              display: true,
              text: 'Performance Score (%)',
              color: '#fff',
              font: {
                weight: 'bold',
                size: 12
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false,
            },
            ticks: {
              color: '#fff',a
              display: false, 
              stepSize: 5,
              font: {
                size: 11
              },
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false,
            },
            ticks: {
              color: '#fff',
              font: {
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}%`;
              },
              title: function(context) {
                return `Month: ${context[0].label}`;
              }
            }
          },
          crosshair: {
            line: {
              color: 'rgba(255, 255, 255, 0.3)',
              width: 1,
            },
            sync: {
              enabled: false
            },
            zoom: {
              enabled: false
            },
            snap: {
              enabled: true
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 0.5,
            to: 0.4,
            loop: false
          }
        },
        elements: {
          line: {
            cubicInterpolationMode: 'monotone'
          }
        }
      }}
    />
  </div>
  
  {/* Performance insights below the chart */}
  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-indigo-900 bg-opacity-30 p-3 rounded-lg">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
        <span className="text-sm font-medium text-white">Your Performance</span>
      </div>
      <p className="text-xs text-white mt-1">Peaked at 68% in August</p>
    </div>
    <div className="bg-green-900 bg-opacity-30 p-3 rounded-lg">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <span className="text-sm font-medium text-white">Regional Trend</span>
      </div>
      <p className="text-xs text-white mt-1">Consistently above national average</p>
    </div>
    <div className="bg-amber-900 bg-opacity-30 p-3 rounded-lg">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
        <span className="text-sm font-medium text-white">National Average</span>
      </div>
      <p className="text-xs text-white mt-1">Steady growth throughout the year</p>
    </div>
  </div>
</FlipContainer>
</div>
      
      {/* Section 2 */}
     <div className="mb-8">
  <h2 className="text-lg font-semibold text-white mb-4">Score Comparison</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {/* Enhanced Bar Chart */}
    <FlipContainer id="barchart">
      <h3 className="text-md font-medium text-white mb-3">Attribute Performance Comparison</h3>
      <div className="h-64">
        <Bar
          data={{
            labels: ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude'],
            datasets: [
              {
                label: 'All India Average',
                data: [80, 65, 71, 81, 49],
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
                categoryPercentage: 0.6,
                barPercentage: 0.8,
              },
              {
                label: 'Regional Average',
                data: [80, 67, 67, 78, 39],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
                categoryPercentage: 0.6,
                barPercentage: 0.8,
              },
              {
                label: 'Dealer Average',
                data: [87, 60, 70, 80, 30],
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
                categoryPercentage: 0.6,
                barPercentage: 0.8,
              },
            ],
          }}
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
                  color: '#fff',
                  font: {
                    weight: 'bold',
                    size: 12
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: '#fff',
                  callback: function(value) {
                    return value + '%';
                  }
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: '#fff',
                  font: {
                    size: 11
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#fff',
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  font: {
                    size: 11,
                    weight: 'bold'
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}%`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </FlipContainer>
    
    {/* Enhanced Radar Chart */}
    <FlipContainer id="radarchart">
      <h3 className="text-md font-medium text-white mb-3">Skill Competency Radar</h3>
      <div className="h-64">
        <Radar
          data={{
            labels: ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude'],
            datasets: [
              {
                label: 'All India Average',
                data: [80, 65, 71, 81, 49],
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: 'Regional Average',
                data: [80, 67, 67, 78, 39],
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: 'Dealer Average',
                data: [87, 60, 70, 80, 30],
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(245, 158, 11, 1)',
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          }}
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
                  color: '#fff',
                  backdropColor: 'transparent',
                  callback: function(value) {
                    return value + '%';
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                  color: '#fff',
                  font: {
                    size: 11,
                    weight: 'bold'
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#fff',
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  font: {
                    size: 11,
                    weight: 'bold'
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}%`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </FlipContainer>
  </div>
  
  {/* Enhanced Pie and Doughnut Charts */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {/* Enhanced Pie Chart */}
    <FlipContainer id="piechart">
      <h3 className="text-md font-medium text-white mb-3">Performance Distribution</h3>
      <div className="h-64">
        <Pie
          data={{
            labels: ['Excellent', 'Good', 'Average', 'Need Improvement'],
            datasets: [
              {
                data: [12, 35, 28, 25],
                backgroundColor: [
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                  'rgba(16, 185, 129, 1)',
                  'rgba(59, 130, 246, 1)',
                  'rgba(245, 158, 11, 1)',
                  'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 15,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: '#fff',
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  font: {
                    size: 11
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.raw}%`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </FlipContainer>
    
    {/* Enhanced Doughnut Chart */}
    <FlipContainer id="doughnutchart">
      <h3 className="text-md font-medium text-white mb-3">Team Composition Analysis</h3>
      <div className="h-64">
        <Doughnut
          data={{
            labels: ['Sales Executives', 'Team Leaders', 'Managers', 'Others'],
            datasets: [
              {
                data: [45, 25, 20, 10],
                backgroundColor: [
                  'rgba(99, 102, 241, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(156, 163, 175, 0.8)',
                ],
                borderColor: [
                  'rgba(99, 102, 241, 1)',
                  'rgba(245, 158, 11, 1)',
                  'rgba(16, 185, 129, 1)',
                  'rgba(156, 163, 175, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 15,
                borderRadius: 6,
                spacing: 4,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: '#fff',
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  font: {
                    size: 11
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.raw}%`;
                  }
                }
              }
            }
          }}
        />
      </div>
      
    </FlipContainer>
  </div>
  
  {/* Enhanced Heatmap Chart */}
  <FlipContainer id="heatmap" className="mb-6">
    <h3 className="text-md font-medium text-white mb-3">Performance Heatmap Analysis</h3>
    <div className="p-4">
      <HeatmapChart />
    </div>

  </FlipContainer>
</div>
      
      {/* Section 3 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Team Performance</h2>
        
        <FlipContainer id="teamperformance" className="mb-6">
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
                      {member.category === 'Excellent' && <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-white rounded-full text-xs">Excellent</span>}
                      {member.category === 'Good' && <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-white rounded-full text-xs">Good</span>}
                      {member.category === 'Average' && <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-white rounded-full text-xs">Average</span>}
                      {member.category === 'Need Improvement' && <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-white rounded-full text-xs">Need Improvement</span>}
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
        </FlipContainer>
      </div>
      
      {/* Section 4 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Training Needs Analysis</h2>
        
        <FlipContainer id="training" className="mb-6">
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
                      {training.priority === 'High' && <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-white rounded-full text-xs">High</span>}
                      {training.priority === 'Medium' && <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-white rounded-full text-xs">Medium</span>}
                      {training.priority === 'Low' && <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-white rounded-full text-xs">Low</span>}
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
        </FlipContainer>
        
        {/* Detailed Attribute Comparison */}
        <FlipContainer id="attribute">
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
      </ FlipContainer>
      </div>
    </div>
  )
}

export default Progess