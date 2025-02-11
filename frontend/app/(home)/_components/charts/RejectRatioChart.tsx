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

  const dateGroups = day ? null : groupDataByDate(data);

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
          {!day ? (
            <>
              <XAxis
                dataKey="hourDisplay"
                stroke={CHART_COLORS.tertiary}
                interval={0}
                tick={{ fontSize: 12 }}
                xAxisId="hours"
              />
              <XAxis
                dataKey="dateDisplay"
                stroke={CHART_COLORS.tertiary}
                xAxisId="dates"
                orientation="bottom"
                interval={0}
                tick={{ fontSize: 12 }}
                height={50}
                tickFormatter={(value, index) => {
                  if (!dateGroups) return value;
                  const hoursInGroup = dateGroups[value]?.length || 1;
                  const middleIndex = Math.floor(hoursInGroup / 2);
                  return index % hoursInGroup === middleIndex ? value : "";
                }}
              />
            </>
          ) : (
            <XAxis dataKey="displayTime" stroke={CHART_COLORS.tertiary} />
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
