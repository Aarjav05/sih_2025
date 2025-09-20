import * as React from "react"
import { ResponsiveContainer, Pie, PieChart, Cell, Label, Tooltip } from "recharts"
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
        color: "#085AE7", // Purple-500
    },
    Absent: {
        label: "Absent",
        color: "#8EC5FF", // Purple-400 (lighter shade)
    },
}

import { useTranslation } from "react-i18next";

export default function ChartPie({ data }) {

    const { t } = useTranslation();

    //console.log("ChartPie data: ", data);
    const totalCount = data ? data.reduce((total, entry) => total + entry.value, 0) : 0;



    return (
        <Card className="flex flex-col rounded-2xl shadow-xl hover:shadow-2xl transition-all ease-in">
            <CardHeader className="items-center pb-0">
                <CardTitle className="font-medium text-lg md:text-xl lg:text-2xl text-center">{t("Today's Attendance: ")}</CardTitle>
            </CardHeader>
            <hr className="mx-auto h-1.5 w-2/3" />
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto w-full max-w-md aspect-square"
                >
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius="50%"    // Use percentage for responsive radii
                                outerRadius="73%"    // Responsive outer radius
                                paddingAngle={4}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartConfig[entry.label]?.color || entry.color} />
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
                                                    className="text-2xl md:text-4xl font-bold fill-foreground"
                                                >
                                                    {totalCount}
                                                    <tspan
                                                        x={viewBox.cx}
                                                        dy="1.5em"
                                                        className="text-lg md:text-xl fill-muted-foreground"
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
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium text-md md:text-lg">
                    {t('Summary of present and absent students')}
                </div>
            </CardFooter>
        </Card>
    )
}