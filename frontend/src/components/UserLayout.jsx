// import { Outlet } from 'react-router-dom';
// import UserHeader from '../components/UserHeader';

// const UserLayout = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <UserHeader />
//       <div className="container mx-auto p-4 sm:p-2">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default UserLayout;



import UserHeader from '../components/UserHeader';
import { Outlet } from "react-router-dom";
import decorativeImage from '../assets/shape-01.svg';

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Decorative Image */}
            <div className="absolute top-0 right-0 z-0" style={{ width: '600px', height: '600px' }}>
                <img 
                    src={decorativeImage} 
                    alt="Decorative Element" 
                    className="absolute right-0 top-0 h-full w-auto opacity-50"
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <UserHeader />
                <div className="px-1 py-2 sm:px-0 text-gray-800">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserLayout;