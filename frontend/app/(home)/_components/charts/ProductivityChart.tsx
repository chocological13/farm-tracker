/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
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
import { ProductivityMetric } from "@/types/records";
import { formatDay, formatHour, groupDataByDate } from "@/utils/date";

interface ProductivityChartProps {
  data: ProductivityMetric[];
  hourly: boolean;
}

const generateColorPalette = (pics: string[]) => {
  const baseColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#F59E0B", // Amber
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#14B8A6", // Teal
  ];

  return pics.reduce(
    (acc, pic, index) => {
      acc[pic] = baseColors[index % baseColors.length];
      return acc;
    },
    {} as { [key: string]: string },
  );
};

const ProductivityChart = ({ data, hourly }: ProductivityChartProps) => {
  const dataKey = hourly ? "packs_per_minute" : "daily_average";
  const timeKey = hourly ? "hourDisplay" : "displayTime";
  const processedData = useMemo(() => {
    return data.reduce((acc, item) => {
      const timeKey = item.hour;
      const hourDisplay = hourly
        ? formatHour(item.hour ? item.hour : "")
        : null;
      const dateDisplay = hourly ? formatDay(item.hour ? item.hour : "") : null;
      const displayTime = hourly
        ? `${dateDisplay}, ${hourDisplay}`
        : formatDay(item.hour ? item.hour : "");

      const existingGroup = acc.find((group) => group.timeKey === timeKey);

      if (existingGroup) {
        existingGroup[item.pic] = item[dataKey];
      } else {
        const newGroup = {
          timeKey,
          hourDisplay,
          dateDisplay,
          displayTime,
          [item.pic]: item[dataKey],
        };
        acc.push(newGroup);
      }

      return acc;
    }, [] as any[]);
  }, [data, hourly, dataKey]);

  const pics = useMemo(
    () => [...new Set(data.map((item) => item.pic))],
    [data],
  );
  const picColors = useMemo(() => generateColorPalette(pics), [pics]);
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
          {hourly ? (
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
          <YAxis stroke={CHART_COLORS.tertiary} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
            labelFormatter={(_, payload) => {
              if (payload && payload.length > 0) {
                const dataPoint = payload[0].payload;
                return hourly
                  ? `${dataPoint.dateDisplay}, ${dataPoint.hourDisplay}`
                  : dataPoint.displayTime;
              }
              return "";
            }}
          />
          <Legend />
          {pics.map((pic) => (
            <Line
              key={pic}
              dataKey={pic}
              stroke={picColors[pic]}
              name={pic}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityChart;
