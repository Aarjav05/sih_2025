import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

import { useTranslation } from "react-i18next";

export default function KpiCard({ title, value, icon: Icon, trend }) {
    const isPositive = trend?.startsWith("+")
    const { t } = useTranslation();

    return (
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all ease-in bg-gradient-to-t from-blue-100 to-white">
            <CardContent className="py-1 px-3">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-md lg:text-xl font-medium text-foreground mb-1">{title}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
