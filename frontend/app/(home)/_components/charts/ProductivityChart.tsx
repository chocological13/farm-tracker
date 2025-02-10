import React from 'react';
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

interface ProductivityChartProps {
    data: any[];
}

export const ProductivityChart = ({ data } : ProductivityChartProps) => (
    <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.background} />
                <XAxis dataKey="pic" stroke={CHART_COLORS.tertiary} />
                <YAxis stroke={CHART_COLORS.tertiary} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                    }}
                />
                <Legend />
                <Bar dataKey="packs_per_minute" name="Packs/Minute" fill={CHART_COLORS.primary} opacity={0.8} />
                <Bar dataKey="daily_average" name="Daily Average" fill={CHART_COLORS.secondary} opacity={0.8} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);
