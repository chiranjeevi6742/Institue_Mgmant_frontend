"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, MinusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { submitAttendance } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Student = {
    id: string;
    full_name: string;
    enrollment_no: string | null;
};

export function AttendanceSheet({
    students,
    batchId,
    date,
    existingLogs
}: {
    students: Student[],
    batchId: string,
    date: Date,
    existingLogs: Record<string, string>
}) {
    // Local state to track changes before saving
    const [attendance, setAttendance] = useState<Record<string, string>>(() => {
        // Initialize with 'present' for everyone if no existing log, else use existing
        const initialStates: Record<string, string> = {};
        students.forEach(s => {
            initialStates[s.id] = existingLogs[s.id] || "present";
        });
        return initialStates;
    });

    const [isPending, startTransition] = useTransition();

    const toggleStatus = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = () => {
        startTransition(async () => {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                student_id: studentId,
                status,
                batch_id: batchId,
                date: format(date, "yyyy-MM-dd"), // ISO Date
            }));

            const result = await submitAttendance(batchId, format(date, "yyyy-MM-dd"), records);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Attendance saved successfully!");
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">Student Name</TableHead>
                            <TableHead className="text-center">Present</TableHead>
                            <TableHead className="text-center">Absent</TableHead>
                            <TableHead className="text-center">Late</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map(student => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.full_name}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <StatusButton
                                            active={attendance[student.id] === 'present'}
                                            onClick={() => toggleStatus(student.id, 'present')}
                                            type="present"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <StatusButton
                                            active={attendance[student.id] === 'absent'}
                                            onClick={() => toggleStatus(student.id, 'absent')}
                                            type="absent"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <StatusButton
                                            active={attendance[student.id] === 'late'}
                                            onClick={() => toggleStatus(student.id, 'late')}
                                            type="late"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending} className="w-full md:w-auto">
                    {isPending ? "Saving..." : "Save Attendance"}
                </Button>
            </div>
        </div>
    );
}

function StatusButton({ active, onClick, type }: { active: boolean, onClick: () => void, type: 'present' | 'absent' | 'late' }) {
    const config = {
        present: { color: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200", icon: Check },
        absent: { color: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200", icon: X },
        late: { color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200", icon: Clock },
    };

    const { color, icon: Icon } = config[type];

    return (
        <button
            onClick={onClick}
            className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border transition-all",
                active ? color + " ring-2 ring-offset-1 ring-slate-400" : "bg-white border-slate-200 text-slate-300 hover:border-slate-300"
            )}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}
