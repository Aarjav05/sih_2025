import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Search, Plus, Trash2, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockTeachers = [
    {
        id: "TCH001",
        name: "Sarah Johnson",
        email: "sarah.johnson@school.edu",
        phone: "+1-555-0123",
        gender: "Female",
        dateOfBirth: "15-08-1985",
        address: "123 Oak Street, Springfield, IL 62701",
        subjects: ["Mathematics", "Physics"],
        assignedClasses: ["Class 10A", "Class 11B"],
        status: "active",
        performance: 92,
        emergencyContacts: {
            father: { name: "Robert Johnson", phone: "+1-555-0124" },
            mother: { name: "Mary Johnson", phone: "+1-555-0125" },
        },
    },
    {
        id: "TCH002",
        name: "Michael Chen",
        email: "michael.chen@school.edu",
        phone: "+1-555-0126",
        gender: "Male",
        dateOfBirth: "22-03-1980",
        address: "456 Pine Avenue, Springfield, IL 62702",
        subjects: ["English", "Literature"],
        assignedClasses: ["Class 9A", "Class 10B"],
        status: "active",
        performance: 88,
        emergencyContacts: {
            father: { name: "David Chen", phone: "+1-555-0127" },
            mother: { name: "Lisa Chen", phone: "+1-555-0128" },
        },
    },
    {
        id: "TCH003",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@school.edu",
        phone: "+1-555-0129",
        gender: "Female",
        dateOfBirth: "10-11-1987",
        address: "789 Maple Drive, Springfield, IL 62703",
        subjects: ["Science", "Biology"],
        assignedClasses: ["Class 8A", "Class 9B"],
        status: "inactive",
        performance: 85,
        emergencyContacts: {
            father: { name: "Carlos Rodriguez", phone: "+1-555-0130" },
            mother: { name: "Maria Rodriguez", phone: "+1-555-0131" },
        },
    },
]

const performanceData = [
    { period: "Test 1", Math: 85, Science: 90, English: 88, History: 82 },
    { period: "Test 2", Math: 88, Science: 92, English: 85, History: 86 },
    { period: "Test 3", Math: 90, Science: 89, English: 91, History: 88 },
    { period: "Test 4", Math: 92, Science: 94, English: 89, History: 90 },
    { period: "Test 5", Math: 89, Science: 91, English: 93, History: 87 },
    { period: "Test 6", Math: 94, Science: 96, English: 90, History: 92 },
]

export default function TeachersPage() {
    const [teachers, setTeachers] = useState(mockTeachers)
    const [selectedTeacher, setSelectedTeacher] = useState(mockTeachers[0])
    const [searchTerm, setSearchTerm] = useState("")
    const [classFilter, setClassFilter] = useState("all")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const [newTeacher, setNewTeacher] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        subjects: [],
        assignedClasses: [],
        emergencyContacts: {
            father: { name: "", phone: "" },
            mother: { name: "", phone: "" },
        },
    })

    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch =
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesClass = classFilter === "all" || teacher.assignedClasses.some((cls) => cls.includes(classFilter))
        return matchesSearch && matchesClass
    })

    const handleAddTeacher = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const teacherId = `TCH${String(teachers.length + 1).padStart(3, "0")}`
            const teacher = {
                ...newTeacher,
                id: teacherId,
                status: "active",
                performance: Math.floor(Math.random() * 20) + 80,
            }

            setTeachers([...teachers, teacher])
            setIsAddModalOpen(false)
            setNewTeacher({
                name: "",
                email: "",
                phone: "",
                gender: "",
                dateOfBirth: "",
                address: "",
                subjects: [],
                assignedClasses: [],
                emergencyContacts: {
                    father: { name: "", phone: "" },
                    mother: { name: "", phone: "" },
                },
            })

            toast({
                title: "Success",
                description: "Teacher added successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add teacher",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteTeacher = (teacherId) => {
        setTeachers(teachers.filter((t) => t.id !== teacherId))
        if (selectedTeacher.id === teacherId) {
            setSelectedTeacher(teachers.find((t) => t.id !== teacherId) || teachers[0])
        }
        toast({
            title: "Success",
            description: "Teacher deleted successfully",
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="flex">
                {/* Left Sidebar */}
                <div className="w-80 bg-white shadow-lg border-r border-purple-100 h-screen overflow-hidden">
                    <div className="p-6 border-b border-purple-100">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher Management</h1>

                        {/* Class Filter */}
                        <Select value={classFilter} onValueChange={setClassFilter}>
                            <SelectTrigger className="mb-4">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="Class 8">Class 8</SelectItem>
                                <SelectItem value="Class 9">Class 9</SelectItem>
                                <SelectItem value="Class 10">Class 10</SelectItem>
                                <SelectItem value="Class 11">Class 11</SelectItem>
                                <SelectItem value="Class 12">Class 12</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search for teachers or ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-4">
                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Teacher
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Add New Teacher</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={newTeacher.name}
                                                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={newTeacher.email}
                                                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="phone">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    value={newTeacher.phone}
                                                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="gender">Gender</Label>
                                                <Select
                                                    value={newTeacher.gender}
                                                    onValueChange={(value) => setNewTeacher({ ...newTeacher, gender: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea
                                                id="address"
                                                value={newTeacher.address}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, address: e.target.value })}
                                            />
                                        </div>
                                        <Button onClick={handleAddTeacher} disabled={loading}>
                                            {loading ? "Adding..." : "Add Teacher"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Teachers List */}
                    <div className="overflow-y-auto h-[calc(100vh-280px)]">
                        {filteredTeachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                onClick={() => setSelectedTeacher(teacher)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-purple-50 transition-colors ${selectedTeacher.id === teacher.id ? "bg-purple-100 border-l-4 border-l-purple-500" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-purple-100 text-purple-700">
                                            {teacher.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900 truncate">{teacher.name}</h3>
                                            <div
                                                className={`w-3 h-3 rounded-full ${teacher.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">{teacher.id}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {teacher.assignedClasses.slice(0, 2).map((cls) => (
                                                <Badge key={cls} variant="secondary" className="text-xs">
                                                    {cls}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {selectedTeacher && (
                        <>
                            {/* Teacher Header Card */}
                            <Card className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16 border-4 border-white/20">
                                                <AvatarFallback className="bg-white/20 text-white text-xl">
                                                    {selectedTeacher.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h1 className="text-2xl font-bold">{selectedTeacher.name}</h1>
                                                <p className="text-purple-100">
                                                    {selectedTeacher.subjects.join(" | ")} | Teacher ID: {selectedTeacher.id}
                                                </p>
                                                <div
                                                    className={`inline-flex items-center gap-2 mt-2 ${selectedTeacher.status === "active" ? "text-green-300" : "text-gray-300"}`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${selectedTeacher.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                                                    />
                                                    {selectedTeacher.status === "active" ? "Active" : "Inactive"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="relative w-20 h-20 mx-auto mb-2">
                                                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                                    <path
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="rgba(255,255,255,0.2)"
                                                        strokeWidth="2"
                                                    />
                                                    <path
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="#10b981"
                                                        strokeWidth="2"
                                                        strokeDasharray={`${selectedTeacher.performance}, 100`}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold">{selectedTeacher.performance}%</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-purple-100">Teaching Performance</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Basic Details */}
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Basic Details</CardTitle>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTeacher.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date of Birth</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTeacher.dateOfBirth}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTeacher.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTeacher.phone}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</p>
                                        <p className="mt-1 text-sm text-gray-900">{selectedTeacher.address}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Father</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTeacher.emergencyContacts.father.name}</p>
                                            <p className="text-sm text-blue-500">{selectedTeacher.emergencyContacts.father.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-pink-600 uppercase tracking-wide">Mother</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTeacher.emergencyContacts.mother.name}</p>
                                            <p className="text-sm text-pink-500">{selectedTeacher.emergencyContacts.mother.phone}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tabs Section */}
                            <Tabs defaultValue="academic" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="academic">Academic Progress</TabsTrigger>
                                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                                    <TabsTrigger value="history">Teaching History</TabsTrigger>
                                </TabsList>

                                <TabsContent value="academic" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Performance Overview</CardTitle>
                                            <div className="flex gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    <span>Math</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                    <span>Science</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                    <span>English</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <span>History</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={performanceData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="period" />
                                                        <YAxis domain={[0, 100]} />
                                                        <Tooltip />
                                                        <Line type="monotone" dataKey="Math" stroke="#3b82f6" strokeWidth={2} />
                                                        <Line type="monotone" dataKey="Science" stroke="#ef4444" strokeWidth={2} />
                                                        <Line type="monotone" dataKey="English" stroke="#eab308" strokeWidth={2} />
                                                        <Line type="monotone" dataKey="History" stroke="#22c55e" strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="assignments">
                                    <Card>
                                        <CardContent className="p-6">
                                            <p className="text-gray-500">Assignment management features coming soon...</p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="attendance">
                                    <Card>
                                        <CardContent className="p-6">
                                            <p className="text-gray-500">Attendance tracking features coming soon...</p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="history">
                                    <Card>
                                        <CardContent className="p-6">
                                            <p className="text-gray-500">Teaching history features coming soon...</p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}