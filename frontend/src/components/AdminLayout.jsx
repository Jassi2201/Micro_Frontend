import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto h-screen p-4 lg:p-8">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout