import { captureAttendance, confirmAttendance } from '../api/attendance';
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import UploadCapturePanel from "../components/Attendance/UploadCapturePanel"
import CaptureGallery from "../components/Attendance/CaptureGallery"
import PreviewOverlay from "../components/Attendance/PreviewOverlay"
import MatchResultCard from "../components/Attendance/MatchResultCard"
import StudentRollList from "../components/Attendance/StudentRollList"
import ConfirmSessionModal from "../components/Attendance/ConfirmSessionModal"

// MOCK DATA - Replace with API calls
const MOCK_CLASSES = [
    { id: "class-1", name: "Class 1" },
    { id: "class-2", name: "Class 2" },
    { id: "class-3", name: "Class 3" },
    { id: "class-4", name: "Class 4" },
    // Add more as needed or fetch dynamically from backend
]


// const MOCK_STUDENTS = [
//     {
//         student_id: "s1",
//         name: "Atharva J",
//         avatarUrl: "/student-avatar.png",
//         status: "unmarked",
//         attendance_rate: 0.87,
//     },
//     {
//         student_id: "s2",
//         name: "Riya K",
//         avatarUrl: "/student-avatar.png",
//         status: "unmarked",
//         attendance_rate: 0.91,
//     },
//     {
//         student_id: "s3",
//         name: "Arjun M",
//         avatarUrl: "/student-avatar.png",
//         status: "unmarked",
//         attendance_rate: 0.78,
//     },
//     {
//         student_id: "s4",
//         name: "Priya S",
//         avatarUrl: "/student-avatar.png",
//         status: "unmarked",
//         attendance_rate: 0.94,
//     },
//     {
//         student_id: "s5",
//         name: "Vikram R",
//         avatarUrl: "/student-avatar.png",
//         status: "unmarked",
//         attendance_rate: 0.82,
//     },
//     {
//         student_id: "s6",
//         name: "Ananya P",
//         avatarUrl: "/student-avatar.png",
//         status: "unmarked",
//         attendance_rate: 0.89,
//     },
// ]

// const MOCK_CAPTURE_RESULTS = [
//     {
//         face_id: "f1",
//         photo_id: "p1",
//         bbox: { x: 120, y: 60, w: 80, h: 80 },
//         matched_student_id: "s1",
//         matched_student_name: "Atharva J",
//         confidence: 0.92,
//         suggested_status: "present",
//     },
//     {
//         face_id: "f2",
//         photo_id: "p1",
//         bbox: { x: 260, y: 80, w: 78, h: 78 },
//         matched_student_id: "s2",
//         matched_student_name: "Riya K",
//         confidence: 0.85,
//         suggested_status: "present",
//     },
//     {
//         face_id: "f3",
//         photo_id: "p1",
//         bbox: { x: 400, y: 100, w: 75, h: 75 },
//         matched_student_id: null,
//         matched_student_name: null,
//         confidence: 0.42,
//         suggested_status: "unmatched",
//     },
// ]

export default function AttendancePage() {
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [currentStep, setCurrentStep] = useState("upload") // "upload" | "review"
    const [uploadedPhotos, setUploadedPhotos] = useState([])
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [captureResults, setCaptureResults] = useState([])
    const [students, setStudents] = useState([])
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.75)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (uploadedPhotos.length > 0) {
            setSelectedPhoto(uploadedPhotos[0])
        } else {
            setSelectedPhoto(null)
        }
    }, [uploadedPhotos])


    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Calculate session summary
    const sessionSummary = {
        presentCount: students.filter((s) => s.status === "present").length,
        absentCount: students.filter((s) => s.status === "absent").length,
        unmatchedCount: captureResults.filter((r) => !r.matched_student_id).length,
        total: students.length,
    }

    // Handler for uploading photos and triggering attendance capture API
    const handlePhotosUploaded = async (photos) => {
        setUploadedPhotos(photos)
        if (photos.length === 0) return

        if (!selectedClass) {
            alert("Please select a class before uploading photos.")
            return
        }

        const base64Image = photos[0].base64 // Adjust this based on your UploadCapturePanel output
        console.log("Base64 Image:", base64Image);  // Add this log

        if (!base64Image) {                      // Add this check
            alert("Invalid image data. Please try again.");
            setLoading(false);
            return;
        }

        setLoading(true)
        try {
            const result = await captureAttendance(selectedClass, base64Image)
            console.log("Backend attendance capture response:", result);
            const presentStudents = (result.present_students || []).map((s) => ({
                student_id: s.student_id || s.id,
                name: s.student_name || "",  // <-- Use student_name key here
                status: "present",
                confidence: s.confidence || null,
                attendance_rate: s.attendance_rate || 0,
            }));

            const absentStudents = (result.absent_students || []).map((s) => ({
                student_id: s.student_id || s.id,
                name: s.name,
                status: "absent",
                confidence: null,
                attendance_rate: s.attendance_rate || 0,
            }));

            const combinedStudents = [...presentStudents, ...absentStudents];
            setStudents(combinedStudents);

            setCaptureResults([
                ...(result.present_students || []).map(face => ({
                    ...face,
                    face_id: face.face_index, // ensure key for MatchResultCard
                    matched_student_id: face.student_id,
                    matched_student_name: face.student_name,
                })),
                ...(result.unmatched_faces || []),
            ]);


            setSessionId(result.session_id);
            setCurrentStep("review");
        } catch (error) {
            console.error("Error capturing attendance:", error);
            alert("Failed to process attendance. Please try again.");
        }
        setLoading(false);
    };


    const handleMatchUpdate = (faceId, studentId, status) => {
        // Update capture results
        setCaptureResults((prev) =>
            prev.map((result) =>
                result.face_id === faceId ? { ...result, matched_student_id: studentId, suggested_status: status } : result,
            ),
        )

        // Update student status
        if (studentId) {
            setStudents((prev) =>
                prev.map((student) => (student.student_id === studentId ? { ...student, status } : student)),
            )
        }
    }

    // Update status for individual student on UI
    const handleStudentStatusChange = (studentId, status) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.student_id === studentId ? { ...student, status } : student
            )
        )
    }


    // Bulk mark present/absent/unmark all
    const handleBulkAction = (action) => {
        switch (action) {
            case "mark_all_present":
                setStudents((prev) => prev.map((s) => ({ ...s, status: "present" })))
                break
            case "mark_all_absent":
                setStudents((prev) => prev.map((s) => ({ ...s, status: "absent" })))
                break
            case "clear_all":
                setStudents((prev) => prev.map((s) => ({ ...s, status: "unmarked" })))
                break
        }
    }
    // Confirm attendance session and save attendance to backend
    const handleConfirmSession = async (sessionNote) => {
        if (!sessionId) {
            alert('No active session to confirm.');
            return;
        }
        // Prepare confirmations with student_id and their chosen status
        const confirmations = students
            .filter(s => s.status !== 'unmarked')
            .map(s => ({
                student_id: s.student_id,
                status: s.status
            }));

        setLoading(true);
        try {
            await confirmAttendance(sessionId, confirmations);
            alert('Attendance recorded successfully.');

            // Reset states for next session after success
            setUploadedPhotos([]);
            setCaptureResults([]);
            setStudents([]);
            setSessionId(null);
            setCurrentStep('upload');
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error confirming attendance:', error);
            alert('Failed to confirm attendance. Please try again.');
        }
        setLoading(false);
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">

                    {/* Class and Date Selection */}
                    <Card className="mb-4">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
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
                                </div>

                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <div className="flex items-center gap-2 p-2 border rounded-md bg-white">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{format(selectedDate, "MMM dd, yyyy")}</span>
                                    </div>
                                </div>

                                {/* Session Summary */}
                                {currentStep === "review" && (
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>{sessionSummary.presentCount} Present</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-red-600">
                                            <XCircle className="h-4 w-4" />
                                            <span>{sessionSummary.absentCount} Absent</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-600">
                                            <Clock className="h-4 w-4" />
                                            <span>{sessionSummary.unmatchedCount} Unmatched</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                {currentStep === "upload" ? (
                    <UploadCapturePanel onPhotosUploaded={handlePhotosUploaded} selectedClass={selectedClass} />
                ) : (
                    <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
                        {/* Left Column - Photo Review */}
                        <div className={`${isMobile ? "order-1" : "lg:col-span-2"} space-y-4`}>
                            <CaptureGallery
                                photos={uploadedPhotos}
                                selectedPhoto={selectedPhoto}
                                onPhotoSelect={setSelectedPhoto}
                                onRetakePhoto={(photoId) => {
                                    // Mock retake functionality
                                    console.log("[v0] Retaking photo:", photoId)
                                }}
                                onRemovePhoto={(photoId) => {
                                    setUploadedPhotos((prev) => prev.filter((p) => p.id !== photoId))
                                }}
                            />

                            {selectedPhoto && (
                                <PreviewOverlay
                                    photo={selectedPhoto}
                                    captureResults={captureResults.filter((r) => r.photo_id === selectedPhoto.id)}
                                    onFaceClick={(faceId) => {
                                        console.log("[v0] Face clicked:", faceId)
                                    }}
                                />
                            )}
                        </div>

                        {/* Right Column - Match Results & Controls */}
                        <div className={`${isMobile ? "order-2" : ""} space-y-4`}>
                            {/* Bulk Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full bg-transparent"
                                        onClick={() => handleBulkAction("mark_all_present")}
                                    >
                                        Mark All Present
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full bg-transparent"
                                        onClick={() => handleBulkAction("mark_all_absent")}
                                    >
                                        Mark All Absent
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full bg-transparent"
                                        onClick={() => handleBulkAction("clear_all")}
                                    >
                                        Clear All
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Match Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Detected Faces</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {captureResults.map((result) => (
                                        <MatchResultCard
                                            key={result.face_id}
                                            result={result}
                                            students={students}
                                            onMatchUpdate={handleMatchUpdate}
                                            confidenceThreshold={confidenceThreshold}
                                        />
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Student Roll */}
                            <StudentRollList students={students} onStatusChange={handleStudentStatusChange} />

                            {/* Confirm Button */}
                            <Button
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                size="lg"
                                onClick={() => setShowConfirmModal(true)}
                                disabled={!selectedClass || sessionSummary.presentCount + sessionSummary.absentCount === 0}
                            >
                                Confirm Attendance Session
                            </Button>
                        </div>
                    </div>
                )}

                {/* Confirm Session Modal */}
                <ConfirmSessionModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmSession}
                    sessionSummary={sessionSummary}
                    selectedClass={selectedClass}
                    selectedDate={selectedDate}
                />
            </div>
        </div>
    )
}