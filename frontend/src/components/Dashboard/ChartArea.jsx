import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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

const chartConfig = {
    present: {
        label: "Present",
        color: "#085AE7",
    },
    absent: {
        label: "Absent",
        color: "#8EC5FF",
    },
}


export default function ChartArea({ data, timeRange, onTimeRangeChange }) {
    // console.log("data in area chart: ", data);
    // console.log("Time range: ", timeRange);
    // Date format for XAxis ticks
    const dateTickFormatter = (value) => {
        const date = new Date(value)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    const filteredData = React.useMemo(() => {
        if (!data) return []
        // timeRange expected as number of days - e.g. 7, 15, 30
        return data.slice(-timeRange)
    }, [data, timeRange])

    return (
        <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all ease-in">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="font-medium text-lg md:text-xl lg:text-2xl">Attendance</CardTitle>
                        <CardDescription className="text-xs md:text-lg">Attendance for last 7 days/15 days</CardDescription>
                    </div>
                    <Select value={String(timeRange)} onValueChange={val => onTimeRangeChange(Number(val))} className="w-[120px]">
                        <SelectTrigger>
                            <SelectValue placeholder={`Last ${timeRange} days`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="15">Last 15 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {/* Responsive container ensures full width on any device */}
                <ChartContainer config={chartConfig} className="w-full">
                    <div className="w-full h-full" >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                accessibilityLayer
                                data={filteredData}
                                margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                            >
                                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={8}
                                    axisLine={false}
                                    tickFormatter={dateTickFormatter}
                                    fontSize={12}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar
                                    dataKey="present"
                                    stackId="a"
                                    fill="#085AE7"
                                    radius={[0, 0, 8, 8]}
                                    name="Present"
                                />
                                <Bar
                                    dataKey="absent"
                                    stackId="a"
                                    fill="#8EC5FF"
                                    radius={[8, 8, 0, 0]}
                                    name="Absent"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}