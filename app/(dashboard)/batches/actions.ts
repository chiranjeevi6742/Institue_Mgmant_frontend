"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBatch(formData: FormData) {
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

    const name = formData.get("name") as string;
    const year = formData.get("year") as string;

    const { error } = await supabase
        .from("batches")
        .insert({
            school_id: profile.school_id,
            name,
            academic_year: year
        });

    if (error) return { error: error.message };

    revalidatePath("/batches");
    return { success: true };
}

export async function deleteBatch(batchId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("batches").delete().eq("id", batchId);
    if (error) return { error: error.message };
    revalidatePath("/batches");
    return { success: true };
}
