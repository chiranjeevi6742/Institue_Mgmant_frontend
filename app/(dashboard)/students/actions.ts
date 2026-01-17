"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createStudent(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // Get User's School ID
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user.id)
        .single();

    if (!profile?.school_id) return { error: "No school found for user" };

    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    // Handle batch_id. If "none" or empty, store as null
    const batch_id_raw = formData.get("batch_id") as string;
    const batch_id = batch_id_raw && batch_id_raw !== "none" ? batch_id_raw : null;

    const { error } = await supabase
        .from("students")
        .insert({
            school_id: profile.school_id,
            full_name,
            email,
            phone,
            batch_id,
            // enrollment_no can be auto-generated or manual. For now, we'll skip or let it be null.
        });

    if (error) return { error: error.message };

    revalidatePath("/students");
    return { success: true };
}
