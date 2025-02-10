import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/constants/colors";

interface HourlyPerformanceProps {
  data: any[];
}

const HourlyPerformanceChart = ({ data }: HourlyPerformanceProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.background}
          />
          <XAxis
            dataKey="pic"
            stroke={CHART_COLORS.tertiary}
            interval={0}
            hide
          />
          <XAxis dataKey="hour" stroke={CHART_COLORS.tertiary} xAxisId="hour" />
          <YAxis stroke={CHART_COLORS.tertiary} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
          <Legend />
          <Bar
            dataKey="total_packs"
            fill={CHART_COLORS.primary}
            name="Total Packs"
            opacity={0.8}
            stackId="a"
          />
          <Bar
            dataKey="gross_weight"
            fill={CHART_COLORS.secondary}
            name="Gross Weight (kg)"
            opacity={0.8}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyPerformanceChart;
