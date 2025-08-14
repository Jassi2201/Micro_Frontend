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



import { useCallback } from "react";
import { Particles } from "react-particles";
import { loadSlim } from "tsparticles-slim";
import UserHeader from '../components/UserHeader';
import { Outlet } from "react-router-dom";
import decorativeImage from '../assets/shape-01.svg';

const UserLayout = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Particle Background with Blur */}
            <div className="absolute inset-0 z-0 backdrop-blur-[2px]">
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    options={{
                        background: {
                            color: {
                                value: "#ffffff",
                            },
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                resize: true,
                            },
                            modes: {
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#3b82f6", // Blue-500 from Tailwind
                            },
                            links: {
                                color: "#3b82f6", // Blue-500 from Tailwind
                                distance: 150,
                                enable: true,
                                opacity: 0.3, // Reduced opacity
                                width: 1,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 0.5,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 40,
                            },
                            opacity: {
                                value: 0.2, // Reduced opacity
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 1, max: 3 }, // Smaller particles
                            },
                        },
                        detectRetina: true,
                    }}
                />
            </div>

            {/* Decorative Image - Also blurred */}
            <div className="absolute top-0 right-0 z-0" style={{ width: '600px', height: '600px' }}>
                <img 
                    src={decorativeImage} 
                    alt="Decorative Element" 
                    className="absolute right-0 top-0 h-full w-auto opacity-50" // Reduced opacity
                />
            </div>

            {/* Content - Not blurred */}
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