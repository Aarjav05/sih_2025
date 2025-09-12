import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Calendar, BarChart, X, LogOut, UserCheck, ChartPie } from "lucide-react";
import { useAuth } from '../Context/AuthContext';

const menuItems = [
    { label: "Dashboard", icon: <Calendar />, to: "/dashboard" },
    { label: "Students", icon: <Users />, to: "/students" },
    { label: "Teachers", icon: <Users />, to: "/teachers" },
    { label: "Attendance", icon: <UserCheck />, to: "/attendance" },
    { label: "Analytics", icon: <ChartPie />, to: "/analytics" }
];

export default function Sidebar({ open, setOpen }) {
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <>
            {/* Mobile backdrop - ONLY show on mobile when open */}
            {open && (
                <div
                    className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed left-0 top-0 h-full bg-[#edeafd] z-50 transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isHovered ? 'lg:w-64' : 'lg:w-18'}
          w-64 lg:block
        `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Mobile header with close button - ONLY visible on mobile */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-blue-200">
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white p-2 rounded-lg">
                            <Users size={24} />
                        </span>
                        <span className="font-bold text-lg text-blue-900">AttendanceHub</span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-blue-900 hover:text-blue-700 p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Desktop logo - ONLY visible on desktop */}
                <div className="hidden lg:flex items-center justify-center p-4 mb-8">
                    <span className="bg-blue-600 text-white p-2 rounded-lg">
                        <Users size={32} />
                    </span>
                    <span className={`ml-3 font-bold text-lg text-blue-900 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                        }`}>
                        AttendanceHub
                    </span>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col gap-2 px-3 mt-4 lg:mt-0">
                    {menuItems.map(item => (
                        <Link
                            to={item.to}
                            key={item.label}
                            className={`
                flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
                ${location.pathname === item.to
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "hover:bg-blue-100 text-blue-900 hover:text-blue-700"
                                }
              `}
                            onClick={() => setOpen(false)} // Close mobile menu on navigation
                        >
                            <span className="text-xl flex-shrink-0">{item.icon}</span>
                            <span className={`
                whitespace-nowrap transition-all duration-300
                ${(isHovered || open) ? 'opacity-100 w-auto' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden'}
              `}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Logout button - positioned at bottom */}
                <div className="absolute bottom-4 left-0 right-0 px-3">
                    <button
                        onClick={() => {
                            logout();
                            setOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        <span className={`
              whitespace-nowrap transition-all duration-300
              ${(isHovered || open) ? 'opacity-100 w-auto' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden'}
            `}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}