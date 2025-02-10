import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {CHART_COLORS} from "@/constants/colors";

interface RejectRatioChart {
    data: any[]
    day: boolean
}

export const RejectRatioChart = ({ data, day } : RejectRatioChart) => (
    <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.background} />
                <XAxis dataKey={day ? 'day' : 'hour'} stroke={CHART_COLORS.tertiary} />
                <YAxis stroke={CHART_COLORS.tertiary} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="hourly_reject_ratio"
                    name="Reject Ratio"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);