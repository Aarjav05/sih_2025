"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export default function ChartBar({ data }) {
    const chartConfig = {
        attendance: {
            label: "Attendance (%)",
            color: "#3b82f6", // blue
        },
    };

    return (
        <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all ease-in">
            <CardHeader>
                <CardTitle className="font-medium text-lg md:text-xl lg:text-2xl">Attendance by Class</CardTitle>
                <CardDescription>
                    Percentage attendance across all classes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full">
                    <BarChart data={data} height={350}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="class_name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            dataKey="attendance"
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            tickFormatter={value => `${value}%`}
                            label={{
                                value: 'Attendance (%)',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                fontSize: 13,
                            }}
                        />
                        <Bar dataKey="attendance" fill="#3b82f6" radius={8} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}