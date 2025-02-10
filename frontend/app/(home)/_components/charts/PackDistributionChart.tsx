import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/constants/colors";

interface PackDistributionChartProps {
  data: any[];
  day: boolean;
}

const formatData = (data: any[], day: boolean) => {
  return data.map((entry) => ({
    time: !day ? entry.hour : entry.day,
    a: entry.pack_a_ratio / 100,
    b: entry.pack_b_ratio / 100,
    c: entry.pack_c_ratio / 100,
  }));
};
const renderTooltipContent = (o: any) => {
  const { payload, label } = o;
  if (!payload || payload.length === 0) return null;

  return (
    <div className="bg-white p-2 border rounded shadow">
      <p className="font-bold">{label}</p>
      <ul>
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${(entry.value * 100).toFixed(1)}%`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const PackDistributionChart = ({
  data,
  day,
}: PackDistributionChartProps) => {
  const formattedData = formatData(data, day);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          stackOffset="expand"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            hide
          />
          <Tooltip content={renderTooltipContent} />
          <Area
            type="monotone"
            dataKey="a"
            name="Pack A"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="b"
            name="Pack B"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="monotone"
            dataKey="c"
            name="Pack C"
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
