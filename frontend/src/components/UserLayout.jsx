import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';

const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 overflow-auto h-screen p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;