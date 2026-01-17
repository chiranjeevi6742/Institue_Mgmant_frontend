"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type AttendanceRecord = {
    student_id: string;
    status: string;
    batch_id: string;
    date: string;
};

export async function submitAttendance(batchId: string, date: string, records: AttendanceRecord[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // Get School ID
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user.id)
        .single();

    if (!profile?.school_id) return { error: "No school found" };

    // Prepare huge upsert payload
    const payload = records.map(r => ({
        school_id: profile.school_id,
        student_id: r.student_id,
        batch_id: batchId,
        date: date,
        status: r.status
    }));

    // Perform Upsert (Insert or Update if exists)
    const { error } = await supabase
        .from("attendance_logs")
        .upsert(payload, { onConflict: 'student_id, date' });

    if (error) return { error: error.message };

    revalidatePath("/attendance");
    return { success: true };
}
