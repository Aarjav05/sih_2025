"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ChartBar({ data }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Attendance by Class</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <YAxis type="category" dataKey="class" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                                formatter={(value) => [`${value}%`, "Attendance"]}
                            />
                            <Bar dataKey="attendance" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}