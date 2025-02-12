/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HourlyPICMetric } from "@/types/records";
import { formatDay, formatHour, groupDataByDate } from "@/utils/date";
import { labelFormat } from "@/utils/chart";

interface HourlyPerformanceProps {
  data: HourlyPICMetric[];
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

const HourlyPerformanceChart = ({ data }: HourlyPerformanceProps) => {
  const processedData = useMemo(() => {
    return data.reduce((acc, item) => {
      const hourDisplay = formatHour(item.hour);
      const dateDisplay = formatDay(item.hour);

      const existingTime = acc.find((group) => group.hour === item.hour);

      if (existingTime) {
        existingTime[item.pic] = item.total_packs;
      } else {
        const newGroup = {
          hour: item.hour,
          hourDisplay,
          dateDisplay,
          [item.pic]: item.total_packs,
        };
        acc.push(newGroup);
      }

      return acc;
    }, [] as any[]);
  }, [data]);

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
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* Hour X-Axis */}
          <XAxis dataKey="hourDisplay" interval={0} tick={{ fontSize: 12 }} />

          {/* Date X-Axis */}
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

          <YAxis />
          <Tooltip
            labelFormatter={(_, payload) => {
              return labelFormat({ _, payload });
            }}
          />
          <Legend />

          {pics.map((pic) => (
            <Bar
              key={pic}
              dataKey={pic}
              fill={picColors[pic]}
              name={pic}
              opacity={0.8}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyPerformanceChart;
