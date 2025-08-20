import AdminSidebar from '../../components/AdminSidebar'
import { useAuth } from '../../services/auth'

const AdminDashboard = () => {
  const { user } = useAuth()

  // Static data for the performance table
  const performanceData = [
    { dc: 'NJ179', name: 'Askriti World - Jalandhar', designation: 'Team Leader', city: 'Jalandhar', product: 15, competition: 13, salesProcess: 6, teamLeaderRole: 3, aptitude: 4, total: 41 },
    { dc: 'NJ178.01', name: 'Askriti World - Nawanshahr', designation: 'Team Leader', city: 'Nawashahar', product: 11, competition: 8, salesProcess: 7, teamLeaderRole: 3, aptitude: 3, total: 32 },
    { dc: 'NE555', name: 'Aryaman Motors - Karnal', designation: 'Team Leader', city: 'Karnal', product: 12, competition: 9, salesProcess: 6, teamLeaderRole: 4, aptitude: 2, total: 33 },
    { dc: 'NE555', name: 'Aryaman Motors - Karnal', designation: 'Team Leader', city: 'Karnal', product: 11, competition: 7, salesProcess: 6, teamLeaderRole: 4, aptitude: 1, total: 29 },
    { dc: 'NP221', name: 'Aryaman Motors - Panipat', designation: 'Team Leader', city: 'Panipat', product: 14, competition: 11, salesProcess: 6, teamLeaderRole: 2, aptitude: 1, total: 34 },
    { dc: 'NE266', name: 'Atharva Motors - Jodhpur', designation: 'Team Leader', city: 'Jodhpur', product: 10, competition: 10, salesProcess: 8, teamLeaderRole: 4, aptitude: 2, total: 34 },
    { dc: 'NE266', name: 'Atharva Motors - Jodhpur', designation: 'Team Leader', city: 'Jodhpur', product: 15, competition: 13, salesProcess: 10, teamLeaderRole: 5, aptitude: 3, total: 46 },
  ];

  // Data for average scores table
  const averageScoresData = [
    { label: 'National Average Score', salesConsultant: '70%', teamLeader: '' },
    { label: 'Regional Average Score: East', salesConsultant: '71%', teamLeader: '' },
    { label: 'Regional Average Score: West', salesConsultant: '70%', teamLeader: '' },
    { label: 'Regional Average Score: North', salesConsultant: '68%', teamLeader: '' },
    { label: 'Regional Average Score: South', salesConsultant: '71%', teamLeader: '' },
  ];

  // Data for dealerwise scorecard
  const dealerwiseScorecardData = [
    { sno: 1, dealerName: 'Askriti World - Jalandhar', location: 'Jalandhar', region: 'North', salesConsultantScore: '', teamLeaderScore: '79.00' },
    { sno: 2, dealerName: 'Askriti World - Nawanshahr', location: 'Nawanshahr', region: 'North', salesConsultantScore: '', teamLeaderScore: '66.00' },
    { sno: 3, dealerName: 'Aryaman Motors - Karnal', location: 'Karnal', region: 'North', salesConsultantScore: '', teamLeaderScore: '61.50' },
    { sno: 4, dealerName: 'Aryaman Motors - Panipat', location: 'Panipat', region: 'North', salesConsultantScore: '', teamLeaderScore: '64.00' },
    { sno: 5, dealerName: 'Atharva Motors - Jodhpur', location: 'Jodhpur', region: 'North', salesConsultantScore: '', teamLeaderScore: '80.00' },
    { sno: 6, dealerName: 'Atharva Motors - Udaipur', location: 'Udaipur', region: 'North', salesConsultantScore: '', teamLeaderScore: '24.75' },
    { sno: 7, dealerName: 'Baid Motors - Jaipur', location: 'Jaipur', region: 'North', salesConsultantScore: '', teamLeaderScore: '73.67' },
    { sno: 8, dealerName: 'Bhanu Motor - Gurgaon', location: 'Gurgaon', region: 'North', salesConsultantScore: '', teamLeaderScore: '57.00' },
    { sno: 9, dealerName: 'Cross Road Auto - Kanpur', location: 'Kanpur', region: 'North', salesConsultantScore: '', teamLeaderScore: '75.00' },
    { sno: 10, dealerName: 'DPM Auto - Dehradun', location: 'Dehradun', region: 'North', salesConsultantScore: '', teamLeaderScore: '74.00' },
    { sno: 11, dealerName: 'Dynamic Motors - Chandigarh', location: 'Chandigarh', region: 'North', salesConsultantScore: '', teamLeaderScore: '65.50' },
    { sno: 12, dealerName: 'Gentech Toolings - Gurgaon (Iffoo Chowk)', location: 'Gurgaon (Iffoo Chowk)', region: 'North', salesConsultantScore: '', teamLeaderScore: '76.00' },
    { sno: 13, dealerName: 'Gentech Toolings - Gurgaon (Mg Road)', location: 'Gurgaon (Mg Road)', region: 'North', salesConsultantScore: '', teamLeaderScore: '78.00' },
  ];

  return (
    <div className="flex-1 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-head text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1 font-body">Welcome back, {user?.email}</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {/* Stat Card 1 - Total Dealers */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-body text-gray-500">Total Dealers</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">24</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-body text-green-500 mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            5 new this month
          </p>
        </div>

        {/* Stat Card 2 - Average Score */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-body text-gray-500">Average Score</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">34.5</h3>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-body text-green-500 mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            2.5% from last month
          </p>
        </div>

        {/* Stat Card 3 - Top Performer */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-body text-gray-500">Top Performer</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">46</h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-50">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-body text-gray-500 mt-2">
            Atharva Motors - Jodhpur
          </p>
        </div>

        {/* Stat Card 4 - Needs Improvement */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-body text-gray-500">Needs Improvement</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">3</h3>
            </div>
            <div className="p-2 rounded-lg bg-orange-50">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-body text-gray-500 mt-2">
            Scores below 20
          </p>
        </div>
      </div>

      {/* Performance Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-body text-gray-800">Dealer Performance</h2>
          <button className="text-xs font-body sm:text-sm text-blue-500 hover:text-blue-700">
            Export Data
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DC</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer's Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Process</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Leader</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aptitude</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.dc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.competition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.salesProcess}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.teamLeaderRole}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.aptitude}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Average Scores Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-body text-gray-800">Average Scores</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Consultant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Leader</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {averageScoresData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.salesConsultant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.teamLeader}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dealerwise Scorecard Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-body text-gray-800">Dealerwise Scorecard</h2>
          <button className="text-xs font-body sm:text-sm text-blue-500 hover:text-blue-700">
            Export Data
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Consultant Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Leader Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dealerwiseScorecardData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sno}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dealerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.salesConsultantScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.teamLeaderScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard