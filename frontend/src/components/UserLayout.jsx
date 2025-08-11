import { Outlet } from 'react-router-dom';
import UserHeader from '../components/UserHeader';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="container mx-auto p-4 sm:p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;