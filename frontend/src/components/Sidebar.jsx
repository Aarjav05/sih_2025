"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users, Calendar, UserCheck, TrendingUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
    { icon: Calendar, label: "Dashboard", page: "dashboard" },
    { icon: Users, label: "Students", page: "students" },
    { icon: UserCheck, label: "Attendance", page: "attendance" },
    { icon: TrendingUp, label: "Reports", page: "reports" },
]

export default function Sidebar({ isOpen, onToggle, onNavigate, currentPage = "dashboard", className }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen && isMobile) {
                onToggle()
            }
        }

        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isOpen, isMobile, onToggle])

    const sidebarWidth = isHovered && !isMobile ? "w-64" : "w-16"
    const showLabels = (isHovered && !isMobile) || (isMobile && isOpen)

    if (isMobile) {
        return (
            <>
                {/* Mobile Overlay */}
                {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} aria-hidden="true" />}

                {/* Mobile Sidebar */}
                <div
                    className={cn(
                        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
                        isOpen ? "translate-x-0" : "-translate-x-full",
                        className,
                    )}
                >
                    <div className="p-6">
                        {/* Header with close button */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <h1 className="text-xl font-bold text-sidebar-foreground">AttendanceHub</h1>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { console.log("clicked") }} aria-label="Close sidebar">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            {navigationItems.map((item, index) => (
                                <Button
                                    key={index}
                                    variant={currentPage === item.page ? "secondary" : "ghost"}
                                    className="w-full justify-start gap-2"
                                    onClick={() => {
                                        onNavigate?.(item.page)
                                        onToggle() // Close mobile sidebar after navigation
                                    }}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Button>
                            ))}
                        </nav>
                    </div>
                </div>
            </>
        )
    }

    // Desktop Sidebar
    return (
        <div
            className={cn(
                "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out group z-30 hidden lg:block",
                sidebarWidth,
                className,
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="py-6 px-2">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8 overflow-hidden">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h1
                        className={cn(
                            "text-xl font-bold text-sidebar-foreground whitespace-nowrap transition-opacity duration-300",
                            showLabels ? "opacity-100" : "opacity-0",
                        )}
                    >
                        AttendanceHub
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    {navigationItems.map((item, index) => (
                        <Button
                            key={index}
                            variant={currentPage === item.page ? "secondary" : "ghost"}
                            className={cn(
                                "w-full transition-all duration-300",
                                showLabels ? "justify-start gap-2" : "justify-center px-2",
                            )}
                            aria-label={!showLabels ? item.label : undefined}
                            onClick={() => onNavigate?.(item.page)}
                        >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span
                                className={cn(
                                    "whitespace-nowrap transition-opacity duration-300",
                                    showLabels ? "opacity-100" : "opacity-0 w-0",
                                )}
                            >
                                {item.label}
                            </span>
                        </Button>
                    ))}
                </nav>
            </div>
        </div>
    )
}