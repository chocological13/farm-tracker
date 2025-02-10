import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {CHART_COLORS} from "@/constants/colors";

interface HourlyPackChartProps {
    data: any[];
}

export const HourlyPackTypeChart = ({ data } : HourlyPackChartProps) => (
    <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.background} />
                <XAxis dataKey="hour" stroke={CHART_COLORS.tertiary} />
                <YAxis stroke={CHART_COLORS.tertiary} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                    }}
                />
                <Legend />
                <Line dataKey="pack_a_total" name="Pack A" stroke={CHART_COLORS.primary} opacity={0.8} />
                <Line dataKey="pack_b_total" name="Pack B" stroke={CHART_COLORS.secondary} opacity={0.8} />
                <Line dataKey="pack_c_total" name="Pack C" stroke={CHART_COLORS.tertiary} opacity={0.8} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);