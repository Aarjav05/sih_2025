import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, UserPlus, Edit3, AlertTriangle } from "lucide-react"

import { useTranslation } from 'react-i18next';


export default function MatchResultCard({ result, students, onMatchUpdate, confidenceThreshold = 0.75 }) {

    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState(result.matched_student_id || "")

    const matchedStudent = students.find((s) => s.student_id === result.matched_student_id)
    const isUnmatched = !result.matched_student_id
    const isLowConfidence = result.confidence < confidenceThreshold && !isUnmatched;

    const getConfidenceBadge = () => {
        if (result.confidence >= 0.8) {
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    High ({Math.round(result.confidence * 100)}%)
                </Badge>
            )
        }
        if (result.confidence >= 0.5) {
            return (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Medium ({Math.round(result.confidence * 100)}%)
                </Badge>
            )
        }
        return (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low ({Math.round(result.confidence * 100)}%)</Badge>
        )
    }

    const handleStatusUpdate = (status) => {
        if (result.matched_student_id) {
            onMatchUpdate(result.face_id, result.matched_student_id, status)
        }
    }

    const handleStudentAssignment = () => {
        if (selectedStudentId) {
            onMatchUpdate(result.face_id, selectedStudentId, "present")
            setIsEditing(false)
        }
    }

    const handleUnassign = () => {
        onMatchUpdate(result.face_id, null, "unmatched")
        setSelectedStudentId("")
    }

    return (
        <Card className={`transition-all ${isLowConfidence || isUnmatched ? "border-amber-200 bg-amber-50" : ""}`}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={matchedStudent?.avatarUrl || "/placeholder.svg"} alt={matchedStudent?.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                            {isUnmatched ? "?" : matchedStudent?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h4 className="font-medium text-gray-900 truncate">
                                    {isUnmatched ? "Unmatched Face" : matchedStudent?.name || "Unknown"}
                                </h4>
                                {matchedStudent && (
                                    <p className="text-sm text-gray-600">
                                        Attendance Rate: {Math.round(matchedStudent.attendance_rate * 100)}%
                                    </p>
                                )}
                            </div>
                            {getConfidenceBadge()}
                        </div>

                        {/* Warning for low confidence */}
                        {isLowConfidence && !isUnmatched && (
                            <div className="flex items-center gap-2 mb-3 p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <span className="text-sm text-amber-800">Low confidence match - please verify</span>
                            </div>
                        )}

                        {/* Student Assignment for Unmatched */}
                        {(isUnmatched || isEditing) && (
                            <div className="mb-3 space-y-2">
                                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Assign to student..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students
                                            .filter((s) => s.status === "unmarked")
                                            .map((student) => (
                                                <SelectItem key={student.student_id} value={student.student_id}>
                                                    {student.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleStudentAssignment} disabled={!selectedStudentId}>
                                        Assign
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                            {!isUnmatched && !isEditing && (
                                <>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleStatusUpdate("present")}
                                        disabled={matchedStudent?.status === "present"}
                                    >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Present
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleStatusUpdate("absent")}
                                        disabled={matchedStudent?.status === "absent"}
                                    >
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Absent
                                    </Button>

                                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                                        <Edit3 className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>

                                    <Button size="sm" variant="outline" onClick={handleUnassign}>
                                        Unassign
                                    </Button>
                                </>
                            )}

                            {isUnmatched && !isEditing && (
                                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Assign Student
                                </Button>
                            )}
                        </div>

                        {/* Current Status */}
                        {matchedStudent && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm text-gray-600">Status:</span>
                                <Badge
                                    variant={
                                        matchedStudent.status === "present"
                                            ? "default"
                                            : matchedStudent.status === "absent"
                                                ? "destructive"
                                                : "secondary"
                                    }
                                    className={
                                        matchedStudent.status === "present"
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : matchedStudent.status === "absent"
                                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                    }
                                >
                                    {matchedStudent.status.charAt(0).toUpperCase() + matchedStudent.status.slice(1)}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}