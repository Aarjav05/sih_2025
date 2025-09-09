"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Eye } from "lucide-react"
import Sidebar from "../Sidebar"

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navbar - Mobile Only */}
            <div className="lg:hidden bg-background border-b border-border p-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                    <Menu className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <div className="w-9" /> {/* Spacer for centering */}
            </div>



            {/* Main Content */}
            <div className="transition-all duration-300 ease-in-out">
                <div className="p-6">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
                            <p className="text-muted-foreground">Welcome back! Here's your attendance overview.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Reports
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Header */}
                    <div className="lg:hidden mb-6">
                        <p className="text-muted-foreground">Welcome back! Here's your attendance overview.</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}