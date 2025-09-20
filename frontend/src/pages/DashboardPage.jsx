import { useState, useEffect, Link } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { fetchTodayAttendance } from "../api/attendance"
import { fetchAttendanceAreaChartData, fetchGenderData, getTotalStudents, attendanceByClass, todayAttendanceTotals, fetchPresentToday, avgAttendanceAndBestClass, fetchLowAttendanceWatchlist } from "../api/dashboard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Users, UserCheck, TrendingUp, Award, UserPlus, Send, Play, AlertTriangle } from "lucide-react"
import KpiCard from "../components/Dashboard/KpiCard"
import ChartArea from "../components/Dashboard/ChartArea"
import ChartBar from "../components/Dashboard/ChartBar"
import ChartPie from "../components/Dashboard/ChartPie"
import GenderChart from "../components/Dashboard/GenderChart";


import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import Watchlist from "../components/Dashboard/WatchList"
//import SessionsFeed from "../components/Dashboard/SessionsFeed"
import DashboardLayout from "../components/Dashboard/DashboardLayout"
import { max } from "date-fns";

import { useTranslation } from "react-i18next";


export default function Dashboard() {

    const { t } = useTranslation();

    const [selectedClass, setSelectedClass] = useState("class-1");
    const [genderChartData, setGenderChartData] = useState([]);
    const [includeAttendance, setIncludeAttendance] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [averageAttendance, setAverageAttendance] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [bestClass, setBestClass] = useState("_");
    const [presentToday, setPresentToday] = useState({ count: 0, percent: 0 });
    const [attendanceByClassData, setAttendanceByClassData] = useState([]);
    const [areaChartData, setAreaChartData] = useState([]);
    const [timeRange, setTimeRange] = useState(15)
    const [pieData, setPieData] = useState([]);

    const [watchlistStudents, setWatchlistStudents] = useState([]);
    const [watchlistClasses, setWatchlistClasses] = useState([]);
    const [selectedWatchlistClass, setSelectedWatchlistClass] = useState("class-1");


    // Mock data - replace with real API calls
    // const kpiData = {
    //     totalStudents: 1247,
    //     averageAttendance: 87.3,
    //     presentToday: { count: 1089, percentage: 87.3 },
    //     bestClass: "Class 10A",
    // }
    const MOCK_CLASSES = [
        { id: "class-1", name: t("class-1") },
        { id: "class-2", name: t("Class 2") },
        { id: "class-3", name: t("Class 3") },
        { id: "class-4", name: t("Class 4") },
        // Add more as needed or fetch dynamically from backend
    ]


    const recentSMS = [
        { message: t("Attendance reminder for tomorrow's exam"), timestamp: "2 hours ago" },
        { message: t("Parent-teacher meeting scheduled"), timestamp: "4 hours ago" },
        { message: t("Holiday announcement for next week"), timestamp: "1 day ago" },
    ]


    // const recentSessions = [
    //     {
    //         id: 1,
    //         timestamp: "Today, 9:15 AM",
    //         uploader: "Mrs. Anderson",
    //         class: "Class 10A",
    //         facesDetected: 28,
    //         status: "completed",
    //     },
    //     {
    //         id: 2,
    //         timestamp: "Today, 8:45 AM",
    //         uploader: "Mr. Johnson",
    //         class: "Class 9B",
    //         facesDetected: 25,
    //         status: "processing",
    //     },
    // ]

    useEffect(() => {
        async function fetchKPIsandGraphData() {
            try {
                // Total Students
                const { totalStudents } = await getTotalStudents();
                setTotalStudents(totalStudents);

                // Average Attendance & Best Class
                const { averageAttendance, bestClass } = await avgAttendanceAndBestClass();
                setAverageAttendance(averageAttendance);
                setBestClass(bestClass);

                // Present Today
                const { presentCount, percentToday } = await fetchPresentToday();
                setPresentToday({ count: presentCount, percent: percentToday });

                // const rangeMap = { "7d": 7, "15d": 15, "30d": 30 };
                // const rangeDays = rangeMap[timeRange] ?? 7;
                const data = await fetchAttendanceAreaChartData(30);
                // console.log("Chart area data in dashboardPage.jsx: ", data);
                setAreaChartData(data);

                const pie = await todayAttendanceTotals();
                setPieData(pie);

                const barChat = await attendanceByClass();
                setAttendanceByClassData(barChat);
            } catch (error) {
                console.error("Error fetching KPIs:", error);
            }
        }

        fetchKPIsandGraphData();
    }, []);

    useEffect(() => {
        async function fetchWatchlist() {
            try {
                const students = await fetchLowAttendanceWatchlist(75, 30, selectedWatchlistClass);
                setWatchlistStudents(students);
            } catch (err) {
                console.error("Error fetching watchlist:", err);
                setWatchlistStudents([]);
            }
        }
        fetchWatchlist();
    }, [selectedWatchlistClass]);


    useEffect(() => {
        if (!selectedClass) return;


        async function loadData() {
            try {
                let attendanceRecords = [];
                if (includeAttendance) {
                    const today = new Date().toISOString().split("T")[0];
                    attendanceRecords = await fetchTodayAttendance(selectedClass, today);
                    setAttendanceData(attendanceRecords);
                } else {
                    setAttendanceData([]);
                }

                const genderData = await fetchGenderData(selectedClass, includeAttendance, attendanceRecords);
                console.log("Gender data recieved in DashboardPage.jsx", genderData);
                setGenderChartData(genderData);

            } catch (error) {
                console.error("Error loading data:", error);
                setAttendanceData([]);
                setGenderChartData([]);
            }
        }

        loadData();
    }, [selectedClass, includeAttendance]);

    return (
        <DashboardLayout>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <KpiCard icon={Users}
                    title={t("Total Students")}
                    value={totalStudents} />
                {/* <KpiCard icon={TrendingUp}
                    title="Avg Attendance(30d)"
                    value={`${averageAttendance}%`} /> */}
                <KpiCard
                    icon={UserCheck}
                    title={t("Present Today")}
                    value={`${presentToday.count} (${presentToday.percent}%)`}
                />
                {/* <KpiCard icon={Award}
                    title="Best Performing Class"
                    value={bestClass} /> */}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Area Chart - 2/3 width */}
                <div className="lg:col-span-2 space-y-4">
                    <ChartArea data={areaChartData} timeRange={parseInt(timeRange)} onTimeRangeChange={val => setTimeRange(`${val}d`)} />
                    {/* Gender Chart with Demo Toggle */}
                    <div className="mb-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all ease-in">
                        <Card>
                            <CardHeader className="flex justify-between items-center">
                                <CardTitle className="font-medium text-lg md:text-xl lg:text-2xl" >{t('Students by Gender')}</CardTitle>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Choose class..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_CLASSES.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">{includeAttendance ? t("Present Students by Gender") : t("Gender")}</span>
                                    <Switch
                                        checked={includeAttendance}
                                        onCheckedChange={setIncludeAttendance}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <GenderChart data={genderChartData} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                    {/* Today's Attendance Pie Chart */}
                    <ChartPie data={pieData} />

                    {/* Quick Actions */}
                    <Card className="max-h-fit rounded-2xl shadow-xl hover:shadow-2xl transition-all ease-in">
                        <CardHeader>
                            <CardTitle className="text-lg">{t('Quick Actions')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start gap-2">
                                <Play className="w-4 h-4" />
                                <a href="/attendance">{t('Start Attendance')}</a>
                            </Button>
                            {/* <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                                <Send className="w-4 h-4" />
                                Send SMS
                            </Button> */}
                            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                                <UserPlus className="w-4 h-4" />
                                <a href="/students">{t('Add Student')}</a>
                            </Button>
                        </CardContent>
                    </Card>

                    Recent SMS
                    <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all ease-in">
                        <CardHeader>
                            <CardTitle className="text-lg">{t('Recent SMS')}</CardTitle>
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
                <ChartBar data={attendanceByClassData} />

                {/* Watchlist */}
                <Watchlist
                    students={watchlistStudents}
                    onUpdate={async () => {
                        const students = await fetchLowAttendanceWatchlist(75, 30, watchlistClass);
                        setWatchlistStudents(students);
                    }}
                    selectedWatchClass={selectedWatchlistClass}
                    setSelectedWatchClass={setSelectedWatchlistClass}
                />
            </div>

            {/* Gender Chart with Demo Toggle */}


            {/* Recent Sessions Feed */}
            {/* <SessionsFeed sessions={recentSessions} /> */}
        </DashboardLayout>
    )
}