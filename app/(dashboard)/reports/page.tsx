import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays } from "date-fns";
import { AttendanceChart } from "./attendance-chart"; // Client Component for Recharts
import { BarChart3, Users, ClipboardCheck, TrendingUp } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reports - Institute Manager',
    description: 'View analytics and attendance trends.',
};

export default async function ReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user?.id)
        .single();

    if (!profile?.school_id) return <div>No Access</div>;

    // 1. Fetch Summary Stats
    const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: 'exact', head: true })
        .eq("school_id", profile.school_id);

    const { count: batchCount } = await supabase
        .from("batches")
        .select("*", { count: 'exact', head: true })
        .eq("school_id", profile.school_id);

    // 2. Fetch Last 7 Days Attendance for Chart
    const sevenDaysAgo = subDays(new Date(), 7).toISOString();
    const { data: attendanceLogs } = await supabase
        .from("attendance_logs")
        .select("date, status")
        .eq("school_id", profile.school_id)
        .gte("date", sevenDaysAgo)
        .order("date", { ascending: true });

    // 3. Process Data for Chart
    // Group by Date -> Count Present vs Absent
    const chartDataMap = new Map();
    attendanceLogs?.forEach(log => {
        const dateKey = format(new Date(log.date), "MMM dd");
        if (!chartDataMap.has(dateKey)) {
            chartDataMap.set(dateKey, { name: dateKey, present: 0, absent: 0, late: 0 });
        }
        const entry = chartDataMap.get(dateKey);
        if (log.status === 'present') entry.present++;
        else if (log.status === 'absent') entry.absent++;
        else if (log.status === 'late') entry.late++;
    });

    const chartData = Array.from(chartDataMap.values());

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Reports & Insights</h2>
                <p className="text-muted-foreground">Analytics for your institute's performance.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentCount || 0}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batchCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Mock calc for now */}
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">Average over 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">New enrollments this week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <Card className="col-span-4 pl-2">
                    <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                        <CardDescription>
                            Daily attendance summary for the last 7 days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2">
                        <AttendanceChart data={chartData} />
                    </CardContent>
                </Card>

                {/* Sidebar / Recent Activity */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest actions in the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <span className="relative flex h-2 w-2 mr-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Attendance Marked</p>
                                    <p className="text-sm text-muted-foreground">Class 10 - Today</p>
                                </div>
                                <div className="ml-auto font-medium text-xs">Just now</div>
                            </div>
                            {/* Static items for mock feeling of aliveness */}
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">New Notice Posted</p>
                                    <p className="text-sm text-muted-foreground">Holiday Update</p>
                                </div>
                                <div className="ml-auto font-medium text-xs">2h ago</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
