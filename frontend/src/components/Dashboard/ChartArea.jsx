"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ChartArea({ data, timeRange, onTimeRangeChange }) {
    // Date format for XAxis ticks
    const dateTickFormatter = (value) => {
        const date = new Date(value)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription>Showing attendance for last 7 days/15 days/30 days</CardDescription>
                <Select value={timeRange} onValueChange={onTimeRangeChange} className="w-[100px] ml-auto">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="15d">Last 15 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ present: { label: "Present" }, absent: { label: "Absent" } }}>
                    <AreaChart data={data} width={800} height={400} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={dateTickFormatter} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area type="natural" dataKey="present" name="Present" stroke="#3b82f6" fill="#3b82f6" stackId="a" />
                        <Area type="natural" dataKey="absent" name="Absent" stroke="#ef4444" fill="#ef4444" stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
