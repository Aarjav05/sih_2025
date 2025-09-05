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

export const description = "An interactive area chart"

const chartData = [
    { date: "2025-08-01", present: 100, absent: 50, total: 150 },
    { date: "2025-08-02", present: 138, absent: 12, total: 150 },
    { date: "2025-08-03", present: 95, absent: 55, total: 150 },
    { date: "2025-08-04", present: 142, absent: 8, total: 150 },
    { date: "2025-08-05", present: 121, absent: 29, total: 150 },
    { date: "2025-08-06", present: 135, absent: 15, total: 150 },
    { date: "2025-08-07", present: 90, absent: 60, total: 150 },
    { date: "2025-08-08", present: 130, absent: 20, total: 150 },
    { date: "2025-08-09", present: 115, absent: 35, total: 150 },
    { date: "2025-08-10", present: 140, absent: 10, total: 150 },
    { date: "2025-08-11", present: 100, absent: 50, total: 150 },
    { date: "2025-08-12", present: 128, absent: 22, total: 150 },
    { date: "2025-08-13", present: 112, absent: 38, total: 150 },
    { date: "2025-08-14", present: 146, absent: 4, total: 150 },
    { date: "2025-08-15", present: 140, absent: 10, total: 150 },
    { date: "2025-08-16", present: 133, absent: 17, total: 150 },
    { date: "2025-08-17", present: 96, absent: 54, total: 150 },
    { date: "2025-08-18", present: 138, absent: 12, total: 150 },
    { date: "2025-08-19", present: 119, absent: 31, total: 150 },
    { date: "2025-08-20", present: 126, absent: 24, total: 150 },
    { date: "2025-08-21", present: 131, absent: 19, total: 150 },
    { date: "2025-08-22", present: 110, absent: 40, total: 150 },
    { date: "2025-08-23", present: 129, absent: 21, total: 150 },
    { date: "2025-08-24", present: 98, absent: 52, total: 150 },
    { date: "2025-08-25", present: 134, absent: 16, total: 150 },
    { date: "2025-08-26", present: 118, absent: 32, total: 150 },
    { date: "2025-08-27", present: 137, absent: 13, total: 150 },
    { date: "2025-08-28", present: 123, absent: 27, total: 150 },
    { date: "2025-08-29", present: 90, absent: 60, total: 150 },
    { date: "2025-08-30", present: 116, absent: 34, total: 150 },
]


const chartConfig = {
    present: {
        label: "Present",
        color: "var(--chart-1)",
    },
    absent: {
        label: "Absent",
        color: "var(--chart-2)",
    },
}

export default function ChartArea() {
    const [timeRange, setTimeRange] = React.useState("7d")

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let daysToSubtract = 30;
        if (timeRange === "7d") {
            daysToSubtract = 7;
        } else if (timeRange === "30d") {
            daysToSubtract = 30;
        }

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - daysToSubtract);

        return date >= startDate && date <= today;
    });

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Area Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing attendance for last 7 days/30days
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={10}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="absent"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="var(--chart-2)"
                        // stackId="a"
                        />
                        <Area
                            dataKey="present"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--chart-1)"
                        // stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}