import { sendAbsenceSMS } from "../../api/attendance";
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Calendar, Users, FileText, MessageSquare, Download } from "lucide-react"
import { format } from "date-fns"


export default function ConfirmSessionModal({
    isOpen,
    onClose,
    onConfirm,
    sessionSummary,
    selectedClass,
    selectedDate,
    students,
    onReset
}) {
    const [sessionNote, setSessionNote] = useState("")
    const [isConfirming, setIsConfirming] = useState(false)
    const [showExportOptions, setShowExportOptions] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)

    const handleConfirm = async () => {
        setIsConfirming(true)
        try {
            await onConfirm(sessionNote)
            setIsConfirmed(true)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save attendance session. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsConfirming(false)
        }
    }

    // Inside ConfirmSessionModal.jsx
    const handleExportCSV = () => {
        // Compose columns and rows
        const headers = ["Student Name", "Student ID", "Status", "Date", "Class"];
        // If you pass `students` as a prop or have it available in context/props:
        const rows = (students || []).map((student) => [
            student.name,           // Student Name
            student.student_id,     // Student ID
            student.status,         // Status (present/absent/unmarked)
            format(selectedDate, "yyyy-MM-dd"), // Date (date-fns formatting)
            selectedClass           // Class
        ]);

        // Build CSV string
        let csvContent = headers.join(",") + "\n";
        rows.forEach(row => {
            csvContent += row.join(",") + "\n";
        });

        // Download trigger
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance-${selectedClass}-${format(selectedDate, "yyyy-MM-dd")}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    if (!isOpen) return null

    if (isConfirmed) {
        return (
            <SuccessModal
                isOpen={isOpen}
                onClose={onClose}
                sessionSummary={sessionSummary}
                selectedClass={selectedClass}
                selectedDate={selectedDate}
                onExportCSV={handleExportCSV}
                onReset={onReset}
            />
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Confirm Attendance Session
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Session Details */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Class:</span>
                                    <span>{selectedClass}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Date:</span>
                                    <span>{format(selectedDate, "MMM dd, yyyy")}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-gray-900">{sessionSummary.total}</div>
                                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Total Students
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{sessionSummary.presentCount}</div>
                                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Present
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">{sessionSummary.absentCount}</div>
                                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    Absent
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-amber-600">{sessionSummary.unmatchedCount}</div>
                                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Unmatched
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance Rate */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Attendance Rate:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${sessionSummary.total > 0 ? (sessionSummary.presentCount / sessionSummary.total) * 100 : 0}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                        {sessionSummary.total > 0
                                            ? Math.round((sessionSummary.presentCount / sessionSummary.total) * 100)
                                            : 0}
                                        %
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Session Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Session Notes (Optional)
                        </label>
                        <Textarea
                            placeholder="Add any notes about this attendance session..."
                            value={sessionNote}
                            onChange={(e) => setSessionNote(e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Export Options */}
                    {showExportOptions && (
                        <Card className="border-purple-200 bg-purple-50">
                            <CardContent className="p-4">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Export Options
                                </h4>
                                <div className="space-y-3">
                                    <Button onClick={handleExportCSV} className="w-full justify-start bg-transparent" variant="outline">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Export as CSV
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}



                    {/* Warnings */}
                    {sessionSummary.unmatchedCount > 0 && (
                        <Card className="border-amber-200 bg-amber-50">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-2">
                                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-amber-800">Unmatched Faces</h4>
                                        <p className="text-sm text-amber-700">
                                            {sessionSummary.unmatchedCount} faces could not be matched to students. You can assign them
                                            manually or proceed without them.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {/* Secondary Actions */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex-1 sm:flex-none bg-transparent"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>

                    {/* Primary Actions */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isConfirming}
                            className="flex-1 sm:flex-none bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isConfirming}
                            className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-700"
                        >
                            {isConfirming ? "Confirming..." : "Confirm Session"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// NEW: Success Modal Component
function SuccessModal({ isOpen, onClose, sessionSummary, selectedClass, selectedDate, onExportCSV, onReset }) {
    const [showSMSOptions, setShowSMSOptions] = useState(false)
    const [isSendingSMS, setIsSendingSMS] = useState(false)

    const handleSendSMS = async () => {
        setIsSendingSMS(true)
        try {
            await sendAbsenceSMS({
                message: "Your child was absent from class today. Please contact the school if this is an error.",
                targetClass: selectedClass
            });
            toast.success(`Absence notifications sent to ${sessionSummary.absentCount} parents.`, {
                duration: 3000,
            });
            setShowSMSOptions(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send absence notifications.",
                variant: "destructive",
            });
        } finally {
            setIsSendingSMS(false)
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Attendance Session Confirmed!
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 text-center">
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                            <h3 className="font-medium text-green-800">Session Saved Successfully</h3>
                            <p className="text-sm text-green-700">
                                Attendance for {selectedClass} on {format(selectedDate, "MMM dd, yyyy")} has been recorded.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="text-lg font-bold text-green-600">{sessionSummary.presentCount}</div>
                            <div className="text-xs text-gray-600">Present</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-red-600">{sessionSummary.absentCount}</div>
                            <div className="text-xs text-gray-600">Absent</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-orange-600">{sessionSummary.unmatchedCount}</div>
                            <div className="text-xs text-gray-600">Unmatched</div>
                        </div>
                    </div>

                    {/* SMS Options - Only show if there are absent students */}
                    {sessionSummary.absentCount > 0 && (
                        <>
                            {!showSMSOptions ? (
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-blue-800">Send Absence Notifications</h4>
                                                <p className="text-sm text-blue-700">
                                                    Notify parents of {sessionSummary.absentCount} absent students via SMS
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => setShowSMSOptions(true)}
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                Send SMS
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardContent className="p-4">
                                        <h4 className="font-medium text-blue-800 mb-2">SMS Notifications</h4>
                                        <p className="text-sm text-blue-700 mb-4">
                                            Send absence notifications to parents of {sessionSummary.absentCount} absent students.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleSendSMS}
                                                disabled={isSendingSMS}
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                {isSendingSMS ? "Sending..." : "Send SMS"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowSMSOptions(false)}
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onExportCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button onClick={() => {
                        onReset();
                    }} className="bg-green-600 hover:bg-green-700">
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}