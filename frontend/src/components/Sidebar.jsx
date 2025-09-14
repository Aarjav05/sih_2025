import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, LayoutDashboard, Hand, Calendar, BarChart3, X, LogOut, UserCheck, ChartPie } from "lucide-react";
import { useAuth } from '../Context/AuthContext';
import { Button } from "@/components/ui/button";
import { Menu, Eye } from "lucide-react"

const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard />, to: "/dashboard" },
    { label: "Students", icon: <Users />, to: "/students" },
    // { label: "Teachers", icon: <Users />, to: "/teachers" },
    { label: "View Attendance", icon: <Users />, to: "/view-attendance" },
    { label: "Take Attendance", icon: <Hand />, to: "/attendance" },
    { label: "Analytics", icon: <BarChart3 />, to: "/analytics" }
];

export default function Sidebar({ open, setOpen }) {
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();
    const [selectedOption, setSelectedOption] = useState("Dashboard");

    return (
        <>
            {/* Top Navbar - Mobile Only */}

            <div className="z-50 bg-blue-50 lg:hidden top-0 sticky border-b rounded-xl border-border p-5 text-center shadow-md">

                <h1 className="text-lg font-semibold ">{selectedOption}</h1>
            </div>

            {/* Sidebar */}
            <aside
                className={` my-1 rounded-e-xl text-white opacity-99 shadow-md hover:opacity-100
          fixed left-0 top-0 h-full bg-gradient-to-r from-[#003080] to-[#002768] z-50 transition-all duration-300 ease-in-out
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
                        <span className="font-bold text-lg text-blue-900">Markr</span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-blue-100 hover:text-white p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Desktop logo - ONLY visible on desktop */}
                <div className="hidden lg:flex items-center justify-start p-4 mb-8">
                    <span className="bg-[#18183C] text-white p-2 rounded-lg">
                        <Users size={32} />
                    </span>
                    <span className={`ml-3 font-bold text-xl text-white transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                        }`}>
                        Markr
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
                                    ? "bg-gradient-to-r from-[#001233] to-[#003080] text-white shadow-md"
                                    : "hover:bg-gradient-to-r from-[#001233] to-[#003080] text-white"
                                }
              `}
                            onClick={() => { setOpen(false); setSelectedOption(item.label) }} // Close mobile menu on navigation
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