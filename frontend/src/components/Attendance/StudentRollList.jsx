"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Users, CheckCircle, XCircle, Clock, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudentRollList({ students, onStatusChange }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("name")

    // Filter and sort students
    const filteredStudents = useMemo(() => {
        const filtered = students.filter((student) => {
            const matchesSearch = (student.name || "").toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === "all" || student.status === statusFilter
            return matchesSearch && matchesStatus
        })

        // Sort students
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name)
                case "attendance_rate":
                    return b.attendance_rate - a.attendance_rate
                case "status":
                    return a.status.localeCompare(b.status)
                default:
                    return 0
            }
        })

        return filtered
    }, [students, searchTerm, statusFilter, sortBy])

    // Calculate statistics
    const stats = useMemo(() => {
        const total = students.length
        const present = students.filter((s) => s.status === "present").length
        const absent = students.filter((s) => s.status === "absent").length
        const unmarked = students.filter((s) => s.status === "unmarked").length

        return { total, present, absent, unmarked }
    }, [students])

    const handleQuickToggle = (studentId, currentStatus) => {
        // Toggle between present and absent (skip unmarked)
        const newStatus = currentStatus === "present" ? "absent" : "present"
        onStatusChange(studentId, newStatus)
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "present":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "absent":
                return <XCircle className="h-4 w-4 text-red-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-400" />
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "present":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100" variant="secondary">
                        Present
                    </Badge>
                )
            case "absent":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100" variant="secondary">
                        Absent
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100" variant="secondary">
                        Unmarked
                    </Badge>
                )
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Class Roll
                    </CardTitle>
                    <Badge variant="outline" className="bg-transparent">
                        {filteredStudents.length} of {students.length}
                    </Badge>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">{stats.total}</div>
                        <div className="text-gray-600">Total</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-700">{stats.present}</div>
                        <div className="text-green-600">Present</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-semibold text-red-700">{stats.absent}</div>
                        <div className="text-red-600">Absent</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-700">{stats.unmarked}</div>
                        <div className="text-gray-600">Unmarked</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <Filter className="h-4 w-4 mr-1" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="unmarked">Unmarked</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="attendance_rate">Attendance</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Student List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No students found</p>
                            {searchTerm && (
                                <Button variant="link" size="sm" onClick={() => setSearchTerm("")} className="mt-2">
                                    Clear search
                                </Button>
                            )}
                        </div>
                    ) : (
                        filteredStudents.map((student) => (
                            <div
                                key={student.student_id}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {/* Avatar */}
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage src={student.avatarUrl || "/placeholder.svg"} alt={student.name} />
                                    <AvatarFallback className="bg-purple-100 text-purple-600">{(student.name && student.name.length > 0) ? student.name.charAt(0) : "?"}</AvatarFallback>
                                </Avatar>

                                {/* Student Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900 truncate">{student.name}</h4>
                                        {getStatusIcon(student.status)}
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-sm text-gray-600">Attendance: {Math.round(student.attendance_rate * 100)}%</p>
                                        {getStatusBadge(student.status)}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Quick Toggle Switch */}
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-gray-500">P</span>
                                        <Switch
                                            checked={student.status === "present"}
                                            onCheckedChange={() => handleQuickToggle(student.student_id, student.status)}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </div>

                                    {/* Manual Status Buttons */}
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant={student.status === "present" ? "default" : "outline"}
                                            className={`h-8 w-8 p-0 ${student.status === "present" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                            onClick={() => onStatusChange(student.student_id, "present")}
                                            title="Mark Present"
                                        >
                                            <CheckCircle className="h-3 w-3" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={student.status === "absent" ? "destructive" : "outline"}
                                            className="h-8 w-8 p-0"
                                            onClick={() => onStatusChange(student.student_id, "absent")}
                                            title="Mark Absent"
                                        >
                                            <XCircle className="h-3 w-3" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={student.status === "unmarked" ? "secondary" : "outline"}
                                            className="h-8 w-8 p-0"
                                            onClick={() => onStatusChange(student.student_id, "unmarked")}
                                            title="Clear Status"
                                        >
                                            <Clock className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Bulk Actions */}
                {filteredStudents.length > 0 && (
                    <div className="border-t pt-4">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    filteredStudents.forEach((student) => onStatusChange(student.student_id, "present"))
                                }}
                                className="bg-transparent"
                            >
                                Mark All Present
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    filteredStudents.forEach((student) => onStatusChange(student.student_id, "absent"))
                                }}
                                className="bg-transparent"
                            >
                                Mark All Absent
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    filteredStudents.forEach((student) => onStatusChange(student.student_id, "unmarked"))
                                }}
                                className="bg-transparent"
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}