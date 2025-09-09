"use client"

import { Pie, PieChart, Cell, Legend, Tooltip } from "recharts"

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
} from "@/components/ui/chart"

export const description = "A pie chart with a legend"

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

// Color mapping for genders
const genderColors = {
    Male: "#3b82f6",      // Blue
    Female: "#f472b6",    // Pink
    Other: "#a3a3a3"      // Gray for other/unknown
};

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
}

export default function GenderChart({ data = [] }) {
    if (!data.length) {
        return (
            <Card>
                <CardHeader><CardTitle>Students by Gender</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                        No data available
                    </div>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[400px]"
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {data.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={genderColors[entry.label] || "#cbd5e1"} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value}`, `${name}`]}
                            cursor={{ fill: '#f1f5f9' }}
                        />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}