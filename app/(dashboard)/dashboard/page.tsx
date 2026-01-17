import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, UserCheck, Bell, Activity } from "lucide-react";
import { CreateAnnouncementDialog } from "./announcement-dialog";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get School Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user?.id)
        .single();

    if (!profile?.school_id) return <div>No Access</div>;
    const schoolId = profile.school_id;

    // 2. Fetch Stats via Parallel Promises
    const [
        { count: studentCount },
        { count: batchCount },
        { data: announcements },
        { data: batches }
    ] = await Promise.all([
        supabase.from("students").select("*", { count: 'exact', head: true }).eq("school_id", schoolId),
        supabase.from("batches").select("*", { count: 'exact', head: true }).eq("school_id", schoolId),
        supabase.from("announcements").select("*").eq("school_id", schoolId).order('created_at', { ascending: false }).limit(5),
        supabase.from("batches").select("id, name").eq("school_id", schoolId)
    ]);

    // 3. Placeholder for attendance (requires attendance_logs table to be populated)
    // For now we show 0%
    const attendancePercentage = 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back to your institute overview.</p>
                </div>
                <CreateAnnouncementDialog batches={batches || []} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batchCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attendancePercentage}%</div>
                        <p className="text-xs text-muted-foreground">Not tracked yet</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-slate-50 rounded-md border border-dashed">
                            <Activity className="h-8 w-8 mr-2 opacity-50" />
                            <span>Attendance Chart Coming Soon</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Announcements Feed */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" /> Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {!announcements || announcements.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent announcements.</p>
                            ) : (
                                announcements.map((item) => (
                                    <div key={item.id} className="flex flex-col space-y-1 border-b pb-3 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm">{item.title}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {item.message}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
