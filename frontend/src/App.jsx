import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './services/auth'
import ProtectedRoute from './components/ProtectedRoute'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Public Pages
import UserLogin from './pages/user/Login'
import AdminLogin from './pages/admin/Login'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminCategories from './pages/admin/Categories'
import AdminQuestions from './pages/admin/Questions'
import AdminAssignments from './pages/admin/Assignments'
import AdminUserProgress from './pages/admin/UserProgress'

// User Pages

import UserAssignments from './pages/user/Assignments'
import UserProgress from './pages/user/Progress'

// Layout Components
import AdminLayout from './components/AdminLayout'
import UserLayout from './components/UserLayout'
import TutorialVideos from './pages/admin/TutorialVideos';
import FlipkartContent from './pages/admin/FlipkartContent';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes with Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute isAdmin={true}>
              <AdminCategories />
            </ProtectedRoute>
          } />
            <Route path="/admin/tutorial" element={
            <ProtectedRoute isAdmin={true}>
              <TutorialVideos />
            </ProtectedRoute>
          } />
           <Route path="/admin/flipkart" element={
            <ProtectedRoute isAdmin={true}>
              <FlipkartContent />
            </ProtectedRoute>
          } />
          <Route path="/admin/questions" element={
            <ProtectedRoute isAdmin={true}>
              <AdminQuestions />
            </ProtectedRoute>
          } />
          <Route path="/admin/assignments" element={
            <ProtectedRoute isAdmin={true}>
              <AdminAssignments />
            </ProtectedRoute>
          } />
          <Route path="/admin/user-progress" element={
            <ProtectedRoute isAdmin={true}>
              <AdminUserProgress />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* User Routes with Layout */}
        <Route element={<UserLayout />}>
        
          <Route path="/user/assignments" element={
            <ProtectedRoute>
              <UserAssignments />
            </ProtectedRoute>
          } />
          <Route path="/user/progress" element={
            <ProtectedRoute>
              <UserProgress />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App