import * as React from "react"
import { Pie, PieChart, Cell, Label, Tooltip } from "recharts"
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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    visitors: {
        label: "Attendance",
    },
    Present: {
        label: "Present",
        color: "var(--chart-1)",
    },
    Absent: {
        label: "Absent",
        color: "var(--chart-2)",
    },
}

export default function ChartPie({ data }) {
    console.log("ChartPie data: ", data);
    const totalCount = data ? data.reduce((total, entry) => total + entry.value, 0) : 0;



    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Today's Attendance: </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[280px]"
                >
                    <PieChart width={250} height={250}>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="text-3xl font-bold fill-foreground"
                                            >
                                                {totalCount}
                                                <tspan
                                                    x={viewBox.cx}
                                                    dy="1.5em"
                                                    className="text-sm fill-muted-foreground"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                        <Tooltip
                            content={<ChartTooltipContent />}
                            cursor={false}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Summary of present and absent students
                </div>
            </CardFooter>
        </Card>
    )
}