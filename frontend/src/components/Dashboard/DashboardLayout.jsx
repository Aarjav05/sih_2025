"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Eye } from "lucide-react"
import Sidebar from "../Sidebar"

import { useTranslation } from "react-i18next";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-100 p-2">
            {/* Main Content */}
            <div className="transition-all duration-300 ease-in-out">
                <div className="p-2">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">{t('Daily Overview')}</h3>
                            <p className="text-muted-foreground">{t("Welcome back! Here is your attendance overview.")}</p>
                        </div>
                    </div>

                    {/* Mobile Header */}
                    <div className="lg:hidden">
                        <p className="text-muted-foreground">{t('Welcome back! Here is your attendance overview.')}</p>
                    </div>
                    <hr className="w-full h-1.5 mb-4" />

                    {children}
                </div>

            </div>
        </div>
    )
}