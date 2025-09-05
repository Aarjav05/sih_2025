"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Watchlist({ students }) {
    // Handle watchlist update - replace with actual API call
    const handleUpdateWatchlist = () => {
        console.log("Updating watchlist...")
        // TODO: Implement API call to recalculate watchlist
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Low Attendance Watchlist
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={handleUpdateWatchlist}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {students.map((student, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                                <p className="font-medium text-foreground">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.class}</p>
                            </div>
                            <Badge variant={student.attendance < 60 ? "destructive" : "secondary"} className="ml-2">
                                {student.attendance}%
                            </Badge>
                        </div>
                    ))}
                </div>

                {students.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No students below attendance threshold</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}