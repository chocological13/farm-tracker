/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/constants/colors";
import { RejectRatio } from "@/types/records";
import { formatDay, formatHour, groupDataByDate } from "@/utils/date";
import React from "react";

interface RejectRatioChartProps {
  data: RejectRatio[];
  day: boolean;
}

const formatData = (data: any[], day: boolean) => {
  if (day) {
    return data.map((entry) => ({
      timeKey: entry.day,
      displayTime: formatDay(entry.day),
      ...entry,
    }));
  }

  return data.map((entry) => ({
    hourDisplay: formatHour(entry.hour),
    dateDisplay: formatDay(entry.hour),
    ...entry,
  }));
};

export const RejectRatioChart = ({ data, day }: RejectRatioChartProps) => {
  const processedData = formatData(data, day);

  const timeKey = !day ? "hourDisplay" : "displayTime";

  const dateGroups = groupDataByDate(data);
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
          <XAxis
            dataKey={timeKey}
            stroke={CHART_COLORS.tertiary}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          {!day ? (
            <XAxis
              dataKey="dateDisplay"
              orientation="bottom"
              axisLine={false}
              tickLine={false}
              interval={0}
              xAxisId="dates"
              tick={{ fontSize: 12 }}
              tickFormatter={(value, index) => {
                return tickFormat({ value, index });
              }}
            />
          ) : (
            <></>
          )}
          <YAxis
            stroke={CHART_COLORS.tertiary}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
            formatter={(value) => [`${value}%`, "Reject Ratio"]}
            labelFormatter={(_, payload) => {
              if (payload && payload.length > 0) {
                const dataPoint = payload[0].payload;
                return day
                  ? dataPoint.displayTime
                  : `${dataPoint.dateDisplay}, ${dataPoint.hourDisplay}`;
              }
              return "";
            }}
          />
          {day ? (
            <Line
              type="monotone"
              dataKey="daily_reject_ratio"
              name="Reject Ratio"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="hourly_reject_ratio"
              name="Reject Ratio"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
