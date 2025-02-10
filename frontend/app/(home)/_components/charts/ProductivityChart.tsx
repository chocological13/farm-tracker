import React, { useMemo } from "react";
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
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/constants/colors";
import { ProductivityMetric } from "@/types/records";

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
  const processedData = useMemo(() => {
    return data.reduce((acc, item) => {
      const existingGroup = acc.find(
        (group) => group.time === (hourly ? item.hour : item.day),
      );

      if (existingGroup) {
        existingGroup[item.pic] = item[dataKey];
      } else {
        const newGroup = {
          time: hourly ? item.hour : item.day,
          [item.pic]: item[dataKey],
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
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.background}
          />
          <XAxis dataKey="time" stroke={CHART_COLORS.tertiary} />
          <YAxis stroke={CHART_COLORS.tertiary} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
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
