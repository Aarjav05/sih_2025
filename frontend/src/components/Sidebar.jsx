import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, LayoutDashboard, Hand, Calendar, BarChart3, X, LogOut, UserCheck, ChartPie } from "lucide-react";
import { useAuth } from '../Context/AuthContext';
import { Button } from "@/components/ui/button";
import { Menu, Eye } from "lucide-react";
import Language from "./Language";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useTranslation } from 'react-i18next';

const allMenuItems = [
    { label: "Dashboard", icon: <LayoutDashboard />, to: "/dashboard", roles: ["teacher", "principal"] },
    { label: "Students", icon: <Users />, to: "/students", roles: ["teacher", "principal"] },
    { label: "ViewAttendance", icon: <Eye />, to: "/view-attendance", roles: ["teacher", "principal"] },
    { label: "TakeAttendance", icon: <Hand />, to: "/attendance", roles: ["teacher"] },
    { label: "Analytics", icon: <BarChart3 />, to: "/analytics", roles: ["teacher", "principal", "district"] }
];

export default function Sidebar({ open, setOpen }) {
    const { t, i18n } = useTranslation();

    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const { logout, user } = useAuth();
    const [selectedOption, setSelectedOption] = useState("Dashboard");

    const userRole = user?.role || "teacher";
    const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

    const getDefaultRoute = (role) => {
        switch (role) {
            case "district":
                return "/analytics";
            case "principal":
                return "/dashboard";
            case "teacher":
            default:
                return "/dashboard";
        }
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <>
            {/* Top Navbar - Mobile Only */}
            <div className="z-50 bg-blue-50 lg:hidden top-0 sticky border-b rounded-xl border-border p-5 text-center shadow-md">
                <h1 className="text-lg font-semibold ">{t(selectedOption)}</h1>
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
                        <img src="/attendance.png" className="w-9 h-9" alt="" />
                        <span className="font-bold text-lg text-white">Markr</span>
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
                    <img src="/attendance.png" className="w-11 h-10" alt="" />
                    <span className={`ml-3 font-bold text-xl text-white transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
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
                            onClick={() => { setOpen(false); setSelectedOption(t(item.label)) }}
                        >
                            <span className="text-xl flex-shrink-0">{item.icon}</span>
                            <span className={`
                whitespace-nowrap transition-all duration-300
                ${(isHovered || open) ? 'opacity-100 w-auto' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden'}
              `}>
                                {t(item.label)}
                            </span>
                        </Link>
                    ))}

                    <Language></Language>

                    {/* Language Dropdown */}
                    {/* <div className="mt-4 px-3">
                        <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
                            <SelectTrigger className={`w-full text-white bg-transparent border border-white rounded-md ${isHovered || open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'} transition-opacity duration-300`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">हिन्दी</SelectItem>
                                <SelectItem value="mr">मराठी</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                </nav>

                {/* Logout button - positioned at bottom */}
                <div className="relative -bottom-10 left-0 right-0 px-3">
                    <button
                        onClick={() => {
                            logout();
                            setOpen(false);
                        }}
                        className="z-100 flex items-center gap-3 w-full px-3 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
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
