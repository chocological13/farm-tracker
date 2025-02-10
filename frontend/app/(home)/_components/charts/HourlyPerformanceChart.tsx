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
      const existingHour = acc.find((group) => group.hour === item.hour);

      if (existingHour) {
        existingHour[item.pic] = item.total_packs;
      } else {
        const newGroup = {
          hour: item.hour,
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

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip labelFormatter={(label) => `Hour: ${label}`} />
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
