import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Users, UserCheck, TrendingUp, Award, UserPlus, Send, Play, AlertTriangle } from "lucide-react"
import KpiCard from "../components/Dashboard/KpiCard"
import ChartArea from "../components/Dashboard/ChartArea"
import ChartBar from "../components/Dashboard/ChartBar"
import ChartPie from "../components/Dashboard/ChartPie"
import Watchlist from "../components/Dashboard/WatchList"
//import SessionsFeed from "../components/Dashboard/SessionsFeed"
import DashboardLayout from "../components/Dashboard/DashboardLayout"

export default function Dashboard() {
    const [showDemoGender, setShowDemoGender] = useState(false)

    // Mock data - replace with real API calls
    const kpiData = {
        totalStudents: 1247,
        averageAttendance: 87.3,
        presentToday: { count: 1089, percentage: 87.3 },
        bestClass: "Class 10A",
    }

    const attendanceData = [
        { date: "2024-01-01", attendance: 85 },
        { date: "2024-01-02", attendance: 88 },
        { date: "2024-01-03", attendance: 82 },
        { date: "2024-01-04", attendance: 90 },
        { date: "2024-01-05", attendance: 87 },
        { date: "2024-01-06", attendance: 89 },
        { date: "2024-01-07", attendance: 91 },
    ]

    const todayAttendance = {
        present: 1089,
        absent: 158,
    }

    const classBars = [
        { class: "Class 10A", attendance: 95 },
        { class: "Class 9B", attendance: 92 },
        { class: "Class 8A", attendance: 89 },
        { class: "Class 7C", attendance: 87 },
        { class: "Class 6B", attendance: 85 },
    ]

    // Demo gender data - replace with real data when available
    const demoGenderData = {
        male: 48,
        female: 50,
        other: 2,
    }

    const recentSMS = [
        { message: "Attendance reminder for tomorrow's exam", timestamp: "2 hours ago" },
        { message: "Parent-teacher meeting scheduled", timestamp: "4 hours ago" },
        { message: "Holiday announcement for next week", timestamp: "1 day ago" },
    ]

    const watchlistStudents = [
        { name: "John Smith", class: "Class 9A", attendance: 65 },
        { name: "Sarah Johnson", class: "Class 8B", attendance: 58 },
        { name: "Mike Wilson", class: "Class 10C", attendance: 72 },
    ]

    const recentSessions = [
        {
            id: 1,
            timestamp: "Today, 9:15 AM",
            uploader: "Mrs. Anderson",
            class: "Class 10A",
            facesDetected: 28,
            status: "completed",
        },
        {
            id: 2,
            timestamp: "Today, 8:45 AM",
            uploader: "Mr. Johnson",
            class: "Class 9B",
            facesDetected: 25,
            status: "processing",
        },
    ]

    return (
        <DashboardLayout>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <KpiCard title="Total Students" value={kpiData.totalStudents.toLocaleString()} icon={Users} trend="+2.5%" />
                <KpiCard title="Average Attendance" value={`${kpiData.averageAttendance}%`} icon={TrendingUp} trend="+1.2%" />
                <KpiCard
                    title="Present Today"
                    value={`${kpiData.presentToday.count} (${kpiData.presentToday.percentage}%)`}
                    icon={UserCheck}
                    trend="+0.8%"
                />
                <KpiCard title="Best Performing Class" value={kpiData.bestClass} icon={Award} trend="95% attendance" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Line Chart - 2/3 width */}
                <div className="lg:col-span-2">
                    <ChartArea data={attendanceData} />
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                    {/* Today's Attendance Pie Chart */}
                    <ChartPie data={todayAttendance} />

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start gap-2">
                                <Play className="w-4 h-4" />
                                Start Attendance
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                                <Send className="w-4 h-4" />
                                Send SMS
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                                <UserPlus className="w-4 h-4" />
                                Add Student
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent SMS */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent SMS</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentSMS.map((sms, index) => (
                                <div key={index} className="border-b border-border last:border-0 pb-2 last:pb-0">
                                    <p className="text-sm text-foreground">{sms.message}</p>
                                    <p className="text-xs text-muted-foreground">{sms.timestamp}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Bar Chart */}
                <ChartBar data={classBars} />

                {/* Watchlist */}
                <Watchlist students={watchlistStudents} />
            </div>

            {/* Gender Chart with Demo Toggle */}
            <div className="mb-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Students by Gender</CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Show demo data</span>
                                <Switch checked={showDemoGender} onCheckedChange={setShowDemoGender} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!showDemoGender ? (
                            <div className="flex items-center justify-center h-48 text-center">
                                <div>
                                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Students by gender — data not available yet. Toggle to view demo sample.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-48">
                                {/* TODO: Replace with real gender data when available in database */}
                                <ChartPie
                                    data={{
                                        male: demoGenderData.male,
                                        female: demoGenderData.female,
                                        other: demoGenderData.other,
                                    }}
                                    showGenderLabels={true}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Sessions Feed */}
            {/* <SessionsFeed sessions={recentSessions} /> */}
        </DashboardLayout>
    )
}