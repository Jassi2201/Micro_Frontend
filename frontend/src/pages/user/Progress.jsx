import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiAward, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { Bar, Radar, Line, Pie, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';
import api, { FILE_BASE_URL } from '../../services/api'; // Adjust the import path as needed

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
);

// Heatmap component
const HeatmapChart = ({ data }) => {
  const attributes = ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude'];
  const benchmarks = ['All India', 'Regional', 'Dealer'];
  const scores = [
    [80, 65, 71, 81, 49],  // All India
    [80, 67, 67, 78, 39],  // Regional
    [87, 60, 70, 80, 30]   // Dealer
  ];

  // Function to determine cell color based on score
  const getColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
            {attributes.map((attr, i) => (
              <th key={i} className="px-4 py-2 text-center text-sm font-medium text-gray-700 whitespace-nowrap">
                {attr}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {benchmarks.map((benchmark, rowIdx) => (
            <tr key={rowIdx}>
              <td className="px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap">
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
          <span className="text-xs">80-100%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-1"></div>
          <span className="text-xs">60-79%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded mr-1"></div>
          <span className="text-xs">40-59%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
          <span className="text-xs">0-39%</span>
        </div>
      </div>
    </div>
  );
};

// Progress Card component
const ProgressCard = ({ title, value, trend, icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-100 border-blue-300',
    purple: 'bg-purple-100 border-purple-300',
    green: 'bg-green-100 border-green-300',
    red: 'bg-red-100 border-red-300',
    yellow: 'bg-yellow-100 border-yellow-300',
    pink: 'bg-pink-100 border-pink-300',
    indigo: 'bg-indigo-100 border-indigo-300'
  };

  return (
    <div className={`${colorMap[color]} p-4 rounded-lg border-2 shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
      {trend && (
        <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      )}
    </div>
  );
};

// Flipkart Images Carousel component
const FlipkartCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);  

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">Flipkart Content</h3>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
  <div className='p-6'>
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <img 
            src={`${FILE_BASE_URL}${images[currentIndex].image_path}`} 
            alt={`Flipkart content ${currentIndex + 1}`}
            className="w-full h-64 object-contain"
          />
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              &lt;
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              &gt;
            </button>
            
            {/* Navigation dots positioned inside the image */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Progress = () => {
  const [flipkartImages, setFlipkartImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlipkartImages = async () => {
      try {
        setLoading(true);
        const response = await api.getFlipkartImagesOnly();
        if (response.success) {
          setFlipkartImages(response.images);
        } else {
          setError('Failed to fetch images');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlipkartImages();
  }, []);
  
  // Data for the bar chart
  const barChartData = {
    labels: ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude'],
    datasets: [
      {
        label: 'All India Average',
        data: [80, 65, 71, 81, 49],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Regional Average',
        data: [80, 67, 67, 78, 39],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Dealer Average',
        data: [87, 60, 70, 80, 30],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the radar chart
  const radarChartData = {
    labels: ['Product Knowledge', 'Competition Knowledge', 'Sales Process', 'Team Leader Role', 'Aptitude'],
    datasets: [
      {
        label: 'All India Average',
        data: [80, 65, 71, 81, 49],
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
      {
        label: 'Regional Average',
        data: [80, 67, 67, 78, 39],
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      },
      {
        label: 'Dealer Average',
        data: [87, 60, 70, 80, 30],
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
      },
    ],
  };

  // Data for line chart (trend over months)
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Dealer Score Trend',
        data: [62, 64, 63, 65, 66, 65],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Regional Trend',
        data: [65, 66, 67, 68, 68, 68],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Data for pie chart (category distribution)
  const pieChartData = {
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
        borderWidth: 1,
      },
    ],
  };

  // Data for doughnut chart (team distribution)
  const doughnutChartData = {
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
        borderWidth: 1,
      },
    ],
  };

  // Team performance data
  const teamPerformanceData = [
    { name: 'John Doe', role: 'Team Leader', score: 82, trend: '+5%', category: 'Excellent' },
    { name: 'Jane Smith', role: 'Sales Executive', score: 78, trend: '+12%', category: 'Good' },
    { name: 'Mike Johnson', role: 'Sales Executive', score: 65, trend: '-2%', category: 'Average' },
    { name: 'Sarah Williams', role: 'Sales Executive', score: 59, trend: '+8%', category: 'Average' },
    { name: 'David Brown', role: 'Sales Executive', score: 48, trend: '-10%', category: 'Need Improvement' },
  ];

  // Training needs data
  const trainingNeedsData = [
    { topic: 'Advanced Product Features', priority: 'High', employees: 8 },
    { topic: 'Competitor Analysis', priority: 'High', employees: 6 },
    { topic: 'Customer Handling', priority: 'Medium', employees: 4 },
    { topic: 'Sales Process Optimization', priority: 'Medium', employees: 3 },
    { topic: 'Team Leadership', priority: 'Low', employees: 2 },
  ];

  return (
    <div className="p-6">
     
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Scorecard</h1>
        <div className="text-sm text-gray-500">Last updated: June 15, 2023</div>
      </div>
      
      {/* Flipkart Carousel - Placed right after the header */}
      {loading ? (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Flipkart Content</h3>
          <p className="text-gray-500">Loading images...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Flipkart Content</h3>
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <FlipkartCarousel images={flipkartImages} />
      )}
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <ProgressCard 
          title="Overall Score" 
          value="65.33%" 
          trend="+2.1% vs last month" 
          icon={<FiActivity className="text-blue-600 text-xl" />} 
          color="blue" 
        />
        <ProgressCard 
          title="Regional Rank" 
          value="12/25" 
          trend="+3 ranks" 
          icon={<FiBarChart2 className="text-purple-600 text-xl" />} 
          color="purple" 
        />
        <ProgressCard 
          title="Team Members" 
          value="8" 
          icon={<FiUsers className="text-green-600 text-xl" />} 
          color="green" 
        />
         <ProgressCard 
          title="Certifications" 
          value="3" 
           trend="1 new" 
          icon={<FiAward className="text-red-600 text-xl" />} 
          color="red" 
        />
      </div>
      
      {/* Section 2 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Score Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md">
            <h3 className="text-md font-medium text-gray-700 mb-3">Attribute Comparison (Bar Chart)</h3>
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
                        text: 'Score (%)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
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
          </div>
          
          {/* Radar Chart */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md">
            <h3 className="text-md font-medium text-gray-700 mb-3">Skill Assessment (Radar Chart)</h3>
            <div className="h-64">
              <Radar
                data={radarChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      angleLines: {
                        display: true
                      },
                      suggestedMin: 0,
                      suggestedMax: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
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
          </div>
        </div>
        
        {/* Pie and Doughnut Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md">
            <h3 className="text-md font-medium text-gray-700 mb-3">Performance Category Distribution</h3>
            <div className="h-64">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
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
          </div>
          
          {/* Doughnut Chart */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md">
            <h3 className="text-md font-medium text-gray-700 mb-3">Team Composition</h3>
            <div className="h-64">
              <Doughnut
                data={doughnutChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
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
          </div>
        </div>
        
        {/* Heatmap Chart */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Performance Heatmap</h3>
          <div className="p-4">
            <HeatmapChart />
          </div>
        </div>
      </div>
      
      {/* Section 3 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Team Performance</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Team Member</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Score</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trend</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamPerformanceData.map((member, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 border-b border-gray-200">{member.name}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{member.role}</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-semibold">{member.score}%</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <span className={`flex items-center ${member.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {member.trend.startsWith('+') ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                      {member.trend}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {member.category === 'Excellent' && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Excellent</span>}
                    {member.category === 'Good' && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Good</span>}
                    {member.category === 'Average' && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Average</span>}
                    {member.category === 'Need Improvement' && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Need Improvement</span>}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Section 4 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Training Needs Analysis</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Training Topic</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Employees Needing</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Suggested Programs</th>
              </tr>
            </thead>
            <tbody>
              {trainingNeedsData.map((training, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 border-b border-gray-200">{training.topic}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {training.priority === 'High' && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>}
                    {training.priority === 'Medium' && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>}
                    {training.priority === 'Low' && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">{training.employees}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <button className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded shadow-sm">
                      View Options
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Detailed Attribute Comparison */}
      
          <h3 className="text-md font-medium text-gray-700 mb-3">Detailed Attribute Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Attribute</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">All India Average Score %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Regional Average Score %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Dealer Average Score %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Variance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-b border-gray-200">Product Knowledge</td>
                  <td className="px-4 py-2 border-b border-gray-200">80</td>
                  <td className="px-4 py-2 border-b border-gray-200">80</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-semibold">87</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-green-600 font-semibold">+7%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">Competition Knowledge</td>
                  <td className="px-4 py-2 border-b border-gray-200">65</td>
                  <td className="px-4 py-2 border-b border-gray-200">67</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-semibold">60</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-red-600 font-semibold">-7%</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-b border-gray-200">Sales Process Knowledge</td>
                  <td className="px-4 py-2 border-b border-gray-200">71</td>
                  <td className="px-4 py-2 border-b border-gray-200">67</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-semibold">70</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-green-600 font-semibold">+3%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">Team Leader Role</td>
                  <td className="px-4 py-2 border-b border-gray-200">81</td>
                  <td className="px-4 py-2 border-b border-gray-200">78</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-semibold">80</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-green-600 font-semibold">+2%</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-b border-gray-200">Aptitude</td>
                  <td className="px-4 py-2 border-b border-gray-200">49</td>
                  <td className="px-4 py-2 border-b border-gray-200">39</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-semibold">30</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-red-600 font-semibold">-9%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default Progress;  