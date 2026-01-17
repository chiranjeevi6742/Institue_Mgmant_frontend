"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

type DataPoint = {
    name: string; // Date
    present: number;
    absent: number;
    late: number;
};

export function AttendanceChart({ data }: { data: DataPoint[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[350px] items-center justify-center text-muted-foreground bg-slate-50 rounded-lg">
                No recent attendance data available.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: any) => `${value}`}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    cursor={{ fill: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="present" fill="#4ade80" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" />
                <Bar dataKey="late" fill="#facc15" radius={[4, 4, 0, 0]} name="Late" />
            </BarChart>
        </ResponsiveContainer>
    );
}
