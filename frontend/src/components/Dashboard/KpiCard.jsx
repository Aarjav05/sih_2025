import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function KpiCard({ title, value, icon: Icon, trend }) {
    const isPositive = trend?.startsWith("+")

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-1 mt-2">
                                {isPositive ? (
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>{trend}</span>
                            </div>
                        )}
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
