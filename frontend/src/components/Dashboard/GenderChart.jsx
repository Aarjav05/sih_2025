"use client"

import { Pie, PieChart, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

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
    Male: "#085AE7",      // Blue
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

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index, viewBox }) => {
    if (percent < 0.05) return null; // Hide labels for very small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7; // Position inside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const percentage = (percent * 100).toFixed(0);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            style={{
                fontSize: '20px',
                fontWeight: '600',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
            }}
        >
            <tspan x={x} dy="-0.3em">{name}</tspan>
            <tspan x={x} dy="1.2em">{percentage}%</tspan>
        </text>
    );
};


export default function GenderChart({ data = [] }) {
    if (!data.length) {
        return (
            <Card>
                <CardHeader><CardTitle className="font-medium text-lg md:text-xl lg:text-2xl">Students by Gender</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                        No data available
                    </div>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card className="flex flex-col w-full">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="45%"
                                outerRadius="80%"
                                innerRadius="0%"
                                labelLine={false}
                                label={CustomLabel}
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
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}