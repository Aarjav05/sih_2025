import { useState, useEffect } from "react"
import { Calendar, TrendingUp, Users, GraduationCap, CalendarDays, BarChart3 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "../Context/AuthContext"

import { fetchSchoolAnalytics, fetchDistrictOverview, fetchSchoolClasses, fetchSchoolClassStudents } from "../api/analytics";
import { use } from "react"

import { useTranslation } from "react-i18next";

// const fetchSchoolAnalytics = async (token, startDate, endDate) => {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     return {
//         overall_stats: {
//             total_students: 1247,
//             average_attendance: 87.5,
//             best_performing_class: "Class 10A",
//             total_teaching_days: 45,
//         },
//         daily_attendance: [
//             { date: "2024-01-01", attendance_rate: 85 },
//             { date: "2024-01-02", attendance_rate: 88 },
//             { date: "2024-01-03", attendance_rate: 92 },
//             { date: "2024-01-04", attendance_rate: 87 },
//             { date: "2024-01-05", attendance_rate: 90 },
//             { date: "2024-01-08", attendance_rate: 89 },
//             { date: "2024-01-09", attendance_rate: 91 },
//             { date: "2024-01-10", attendance_rate: 86 },
//             { date: "2024-01-11", attendance_rate: 93 },
//             { date: "2024-01-12", attendance_rate: 88 },
//         ],
//         class_performance: [
//             { class_name: "Class 10A", attendance_rate: 94, sessions: 45 },
//             { class_name: "Class 10B", attendance_rate: 89, sessions: 45 },
//             { class_name: "Class 9A", attendance_rate: 87, sessions: 45 },
//             { class_name: "Class 9B", attendance_rate: 85, sessions: 45 },
//             { class_name: "Class 8A", attendance_rate: 91, sessions: 45 },
//         ],
//     }
// }

// const fetchDistrictOverview = async (token) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     return {
//         district_name: "Central Education District",
//         summary: {
//             total_schools: 25,
//             active_schools: 23,
//             total_students: 15420,
//             total_teachers: 892,
//             average_attendance: 86.2,
//         },
//         schools: [
//             {
//                 school_id: 1,
//                 school_name: "Lincoln High School",
//                 students_count: 1247,
//                 teachers_count: 68,
//                 recent_attendance_rate: 87.5,
//             },
//             {
//                 school_id: 2,
//                 school_name: "Washington Elementary",
//                 students_count: 892,
//                 teachers_count: 45,
//                 recent_attendance_rate: 91.2,
//             },
//             {
//                 school_id: 3,
//                 school_name: "Roosevelt Middle School",
//                 students_count: 1156,
//                 teachers_count: 62,
//                 recent_attendance_rate: 84.8,
//             },
//         ],
//     }
// }

function DatePicker({ value, onChange, placeholder = "Select date" }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-transparent">
                    <Calendar className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={value} onSelect={onChange} initialFocus />
            </PopoverContent>
        </Popover>
    )
}

function KpiCard({ title, value, icon: Icon, trend, description }) {
    return (
        <Card className="shadow-md hover:shadow-lg transition-all ease-in bg-gradient-to-t from-blue-100 to-white">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-md lg:text-xl font-medium text-foreground">{title}</p>
                        <div className="flex items-center space-x-2">
                            <p className="text-2xl font-bold">{value}</p>
                            {trend && (
                                <Badge variant={trend > 0 ? "default" : "destructive"} className="text-xs">
                                    {trend > 0 ? "+" : ""}
                                    {trend}%
                                </Badge>
                            )}
                        </div>
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AnalyticsPage() {

    const { t } = useTranslation();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    const [districtOverview, setDistrictOverview] = useState(null);
    const [selectedSchoolId, setSelectedSchoolId] = useState();
    const [schoolClasses, setSchoolClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState();
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const { toast } = useToast();

    const { user } = useAuth();
    const userRole = user?.role || localStorage.getItem("user_role");
    console.log("Role is: ", userRole);

    //const token = localStorage.getItem("token");


    useEffect(() => {
        async function loadAnalytics() {
            setLoading(true)
            setError(null)

            try {
                if (userRole === "district") {
                    const data = await fetchDistrictOverview();
                    console.log("District data from backend: ", data);
                    setDistrictOverview(data);
                    setAnalytics(null);
                } else {
                    const data = await fetchSchoolAnalytics(
                        startDate ? format(startDate, "yyyy-MM-dd") : null,
                        endDate ? format(endDate, "yyyy-MM-dd") : null
                    );
                    setAnalytics(data);
                    setDistrictOverview(null);
                }
            } catch (e) {
                toast({
                    title: "Error",
                    description: "Failed to load analytics data",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }

        loadAnalytics();
    }, [startDate, endDate, userRole])

    useEffect(() => {
        if (selectedSchoolId) {
            fetchSchoolClasses(selectedSchoolId).then(res => {
                setSchoolClasses(res.classes);
                setSelectedClass(""); // reset on school change
                setStudents([]);
            });
        }
    }, [selectedSchoolId]);

    useEffect(() => {
        if (selectedSchoolId && selectedClass) {
            fetchSchoolClassStudents(selectedSchoolId, selectedClass).then(res => {
                setStudents(res.students);
            });
        }
    }, [selectedSchoolId, selectedClass]);


    const chartData =
        analytics?.daily_attendance?.map(({ date, attendance_rate }) => ({
            date: format(new Date(date), "MMM dd"),
            attendance: attendance_rate,
        })) || []

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="p-2 space-y-6 max-w-7xl mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold tracking-tight">Attendance Analytics</h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <span className="text-sm font-medium text-muted-foreground">Date Range:</span>
                            <DatePicker value={startDate} onChange={setStartDate} placeholder="Start date" />
                            <span className="text-muted-foreground">to</span>
                            <DatePicker value={endDate} onChange={setEndDate} placeholder="End date" />
                        </div>
                        {(startDate || endDate) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setStartDate(null)
                                    setEndDate(null)
                                }}
                            >
                                Clear Dates
                            </Button>
                        )}
                    </div>
                </div>
                <hr className="w-full h-1.5 mb-4" />

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-8 w-16 mb-2" />
                                        <Skeleton className="h-3 w-32" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="h-6 w-48 mb-4" />
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {analytics && !loading && (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <KpiCard
                                title="Total Students"
                                value={analytics.overall_stats.total_students.toLocaleString()}
                                icon={Users}
                                description="Enrolled students"
                            />
                            <KpiCard
                                title="Average Attendance"
                                value={`${analytics.overall_stats.average_attendance}%`}
                                icon={TrendingUp}
                                trend={2.3}
                                description="Last 30 days"
                            />
                            <KpiCard
                                title="Best Performing Class"
                                value={analytics.overall_stats.best_performing_class}
                                icon={GraduationCap}
                                description="Highest attendance rate"
                            />
                            <KpiCard
                                title="Teaching Days"
                                value={analytics.overall_stats.total_teaching_days}
                                icon={CalendarDays}
                                description="In selected period"
                            />
                        </div>

                        <Card className="shadow-xl hover:shadow-2xl transition-all ease-in">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span>Daily Attendance Trend</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={{ stroke: "#e2e8f0" }} />
                                        <YAxis
                                            domain={[70, 100]}
                                            tick={{ fontSize: 12 }}
                                            tickLine={{ stroke: "#e2e8f0" }}
                                            label={{ value: "Attendance %", angle: -90, position: "insideLeft" }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                            }}
                                            formatter={(value) => [`${value}%`, "Attendance"]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="attendance"
                                            stroke="#3182ce"
                                            strokeWidth={3}
                                            dot={{ fill: "#3182ce", strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: "#3182ce", strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl hover:shadow-2xl transition-all ease-in">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <GraduationCap className="h-5 w-5" />
                                    <span>Class Performance Overview</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.class_performance.map(({ class_name, attendance_rate, sessions }) => (
                                        <div
                                            key={class_name}
                                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium">{class_name}</p>
                                                <p className="text-sm text-muted-foreground">{sessions} sessions recorded</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold">{attendance_rate}%</p>
                                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        attendance_rate >= 90 ? "default" : attendance_rate >= 80 ? "secondary" : "destructive"
                                                    }
                                                    className="ml-2"
                                                >
                                                    {attendance_rate >= 90 ? "Excellent" : attendance_rate >= 80 ? "Good" : "Needs Improvement"}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {districtOverview && !loading && (
                    <>
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-900">
                                    District Overview: {districtOverview.district_name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-2xl font-bold text-blue-600">{districtOverview.summary.total_schools}</p>
                                        <p className="text-sm text-muted-foreground">{t('Total Schools')}</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-2xl font-bold text-green-600">{districtOverview.summary.active_schools}</p>
                                        <p className="text-sm text-muted-foreground">{t('Active Schools')}</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {districtOverview.summary.total_students.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{t('Total Students')}</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-2xl font-bold text-orange-600">{districtOverview.summary.total_teachers}</p>
                                        <p className="text-sm text-muted-foreground">{t('Total Teachers')}</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-2xl font-bold text-indigo-600">{districtOverview.summary.average_attendance}%</p>
                                        <p className="text-sm text-muted-foreground">{t('Avg Attendance')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="my-6 p-4 bg-white rounded-md border">
                            <div className="flex gap-4 mb-4">
                                {/* School dropdown */}
                                <select
                                    className="border p-2 rounded"
                                    value={selectedSchoolId || ""}
                                    onChange={e => setSelectedSchoolId(e.target.value)}
                                >
                                    <option value="">Select School</option>
                                    {districtOverview.schools.map(school => (
                                        <option key={school.school_id} value={school.school_id}>
                                            {school.school_name}
                                        </option>
                                    ))}
                                </select>

                                {/* Class dropdown */}
                                {schoolClasses.length > 0 && (
                                    <select
                                        className="border p-2 rounded"
                                        value={selectedClass || ""}
                                        onChange={e => setSelectedClass(e.target.value)}
                                    >
                                        <option value="">Select Class</option>
                                        {schoolClasses.map(className => (
                                            <option key={className} value={className}>
                                                {className}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Student list conditional */}
                            {selectedClass && (
                                <div className="rounded-md border p-4 max-h-72 overflow-auto">
                                    <h3 className="text-base font-semibold mb-2">Students in {selectedClass}</h3>
                                    <ul className="divide-y divide-gray-100">
                                        {students.length > 0 ? (
                                            students.map(student => (
                                                <li
                                                    key={student.id}
                                                    className="flex justify-between py-2 text-sm"
                                                >
                                                    <span>{student.name}</span>
                                                    <span className="text-gray-500">ID: {student.student_id}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="py-2 text-center text-gray-400">No students found.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>


                        <Card>
                            <CardHeader>
                                <CardTitle>Schools Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {districtOverview.schools.map((school) => (
                                        <div
                                            key={school.school_id}
                                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div>
                                                <p className="font-medium">{school.school_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {school.students_count} students • {school.teachers_count} teachers
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold">{school.recent_attendance_rate}%</p>
                                                <Badge variant={school.recent_attendance_rate >= 90 ? "default" : "secondary"}>
                                                    {school.recent_attendance_rate >= 90 ? "Excellent" : "Good"}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}