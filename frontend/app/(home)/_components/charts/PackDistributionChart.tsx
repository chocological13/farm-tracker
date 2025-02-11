/* eslint-disable  @typescript-eslint/no-explicit-any */
import { formatDay, formatHour, groupDataByDate } from "@/utils/date";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";
import { PackDistribution } from "@/types/records";

interface PackDistributionChartProps {
  data: PackDistribution[];
  day: boolean;
}

const formatData = (data: any[], day: boolean) => {
  if (day) {
    return data.map((entry) => ({
      timeKey: entry.day,
      displayTime: formatDay(entry.day),
      a: entry.pack_a_ratio / 100,
      b: entry.pack_b_ratio / 100,
      c: entry.pack_c_ratio / 100,
    }));
  }

  return data.map((entry) => ({
    hourDisplay: formatHour(entry.hour),
    dateDisplay: formatDay(entry.hour),
    a: entry.pack_a_ratio / 100,
    b: entry.pack_b_ratio / 100,
    c: entry.pack_c_ratio / 100,
  }));
};

const renderTooltipContent = (props: any) => {
  const { payload } = props;
  if (!payload || payload.length === 0) return null;

  const dataPoint = payload[0].payload;
  const timeDisplay = dataPoint.dateDisplay
    ? `${dataPoint.dateDisplay}, ${dataPoint.hourDisplay}`
    : dataPoint.displayTime;

  return (
    <div className="bg-white p-2 border rounded shadow">
      <p className="font-bold">{timeDisplay}</p>
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
  const dateGroups = day ? null : groupDataByDate(data);

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          stackOffset="expand"
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {!day ? (
            <>
              <XAxis
                dataKey="hourDisplay"
                interval={0}
                xAxisId="1"
                tick={{ fontSize: 12 }}
              />
              <XAxis
                dataKey="dateDisplay"
                orientation="bottom"
                axisLine={false}
                tickLine={false}
                interval={0}
                xAxisId="2"
                height={50}
                tick={{ fontSize: 12 }}
                tickFormatter={(value, index) => {
                  if (!dateGroups) return value;
                  const hoursInGroup = dateGroups[value]?.length || 1;
                  const middleIndex = Math.floor(hoursInGroup / 2);
                  return index % hoursInGroup === middleIndex ? value : "";
                }}
              />
            </>
          ) : (
            <XAxis dataKey="displayTime" />
          )}
          <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
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
