import { createClient } from "@/lib/supabase/server";
import { AttendanceSheet } from "./attendance-sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DateSelector } from "./date-selector";

// The Page Component
export default async function AttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get School Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user?.id)
        .single();

    if (!profile?.school_id) return <div>No Access</div>;

    // 2. Fetch Batches (to populate selector)
    const { data: batches } = await supabase
        .from("batches")
        .select("id, name")
        .eq("school_id", profile.school_id)
        .order("name");

    // 3. Current Selection (from URL params)
    const selectedBatchId = typeof resolvedSearchParams?.batch === 'string' ? resolvedSearchParams.batch : batches?.[0]?.id;
    const dateParam = typeof resolvedSearchParams?.date === 'string' ? resolvedSearchParams.date : null;
    const selectedDate = dateParam ? new Date(dateParam) : new Date();
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    // 4. If a batch is selected, fetch students and existing logs
    type Student = {
        id: string;
        full_name: string;
        enrollment_no: string | null;
    };
    let students: Student[] = [];
    let existingLogs = {};

    if (selectedBatchId) {
        // Fetch students in this batch
        const { data: studentData } = await supabase
            .from("students")
            .select("id, full_name, enrollment_no")
            .eq("batch_id", selectedBatchId)
            .order("full_name");

        students = studentData || [];

        // Fetch logs for this date/batch
        const { data: logs } = await supabase
            .from("attendance_logs")
            .select("student_id, status")
            .eq("batch_id", selectedBatchId)
            .eq("date", dateStr);

        // Convert logs array to map { student_id: status }
        (logs || []).forEach((log) => {
            // @ts-ignore
            existingLogs[log.student_id] = log.status;
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
                <p className="text-muted-foreground">Mark daily attendance for your classes.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="grid gap-1.5">
                        <label className="text-sm font-medium">Select Batch</label>
                        {/* We use basic links for navigation to keep it simple server-side */}
                        <div className="flex gap-2">
                            {batches?.map(batch => (
                                <Link key={batch.id} href={`/attendance?batch=${batch.id}&date=${dateStr}`}>
                                    <Button
                                        variant={selectedBatchId === batch.id ? "default" : "outline"}
                                        size="sm"
                                    >
                                        {batch.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2">
                    <DateSelector currentDate={selectedDate} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mark Attendance</CardTitle>
                    <CardDescription>
                        {selectedBatchId
                            ? `Showing students for ${batches?.find(b => b.id === selectedBatchId)?.name} on ${format(selectedDate, "PPP")}`
                            : "Select a batch to start"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!selectedBatchId ? (
                        <div className="text-center py-10 text-muted-foreground">
                            Please select a batch from above.
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No students found in this batch.
                        </div>
                    ) : (
                        <AttendanceSheet
                            key={selectedBatchId + dateStr}
                            students={students}
                            batchId={selectedBatchId}
                            date={selectedDate}
                            // @ts-ignore
                            existingLogs={existingLogs}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
