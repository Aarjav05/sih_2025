"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, RefreshCw } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useTranslation } from "react-i18next";

export default function Watchlist({ students, onUpdate, selectedWatchClass = "class-1", setSelectedWatchClass }) {

    const { t } = useTranslation();
    return (
        <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all ease-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2  font-medium text-lg md:text-xl lg:text-2xl">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        {t("Low Attendance Watchlist")}
                    </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedWatchClass} onValueChange={setSelectedWatchClass}>
                        <SelectTrigger className="w-[140px]" aria-label="Filter by class">
                            <SelectValue placeholder={t("All Classes")} />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Hardcoded classes for dropdown */}
                            <SelectItem value="class-1">{t("class-1")}</SelectItem>
                            <SelectItem value="class-2">{t("class-2")}</SelectItem>
                            <SelectItem value="class-3">{t("class-3")}</SelectItem>
                        </SelectContent>

                    </Select>
                    {/* <Button variant="outline" size="sm" onClick={onUpdate}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Update
                    </Button> */}
                </div>
            </CardHeader>
            <CardContent className="max-h-64 overflow-y-auto">
                {students.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">No students with low attendance.</p>
                ) : (
                    students.map((student, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-md bg-background mb-3 shadow-sm"
                        >
                            <div>
                                <p className="font-medium truncate max-w-xs">{student.name}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">{student.class}</p>
                            </div>
                            <Badge
                                variant={student.attendance < 60 ? "destructive" : "default"}
                                className={`mt-2 sm:mt-0 ${student.attendance < 60 ? "bg-red-200 text-red-700" : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {student.attendance}%
                            </Badge>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}