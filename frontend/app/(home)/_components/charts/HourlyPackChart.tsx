import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/constants/colors";
import { formatDay, formatHour, groupDataByDate } from "@/utils/date";
import { HourlyPackData } from "@/types/records";
import { labelFormat } from "@/utils/chart";

interface HourlyPackChartProps {
  data: HourlyPackData[];
}

export const HourlyPackTypeChart = ({ data }: HourlyPackChartProps) => {
  const processedData = data.map((item) => ({
    ...item,
    hourDisplay: formatHour(item.hour),
    dateDisplay: formatDay(item.hour),
  }));

  const dateGroups = groupDataByDate(data);
  const dates = Object.keys(dateGroups);

  const tickFormat = ({ value, index }: { value: any; index: any }) => {
    const hoursInGroup = dateGroups[value]?.length || 1;
    const middleIndex = Math.floor(hoursInGroup / 2);
    return index % hoursInGroup === middleIndex ? value : "";
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.background}
          />

          {/* Date X-Axis */}
          <XAxis
            dataKey="dateDisplay"
            stroke={CHART_COLORS.tertiary}
            orientation="bottom"
            axisLine={false}
            tickLine={false}
            interval={0}
            xAxisId="day"
            tick={{ fontSize: 12 }}
            tickFormatter={(value, index) => {
              return tickFormat({ value, index });
            }}
          />

          {/* Hour X-Axis */}
          <XAxis
            dataKey="hourDisplay"
            stroke={CHART_COLORS.tertiary}
            interval={0}
            tick={{ fontSize: 12 }}
          />

          <YAxis stroke={CHART_COLORS.tertiary} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
            labelFormatter={(_, payload) => {
              return labelFormat({ _, payload });
            }}
          />
          <Legend />
          <Line
            dataKey="pack_a_total"
            name="Pack A"
            stroke={CHART_COLORS.primary}
            opacity={0.8}
          />
          <Line
            dataKey="pack_b_total"
            name="Pack B"
            stroke={CHART_COLORS.secondary}
            opacity={0.8}
          />
          <Line
            dataKey="pack_c_total"
            name="Pack C"
            stroke={CHART_COLORS.tertiary}
            opacity={0.8}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
