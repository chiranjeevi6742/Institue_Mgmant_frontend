"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user.id)
        .single();

    if (!profile?.school_id) return { error: "No school found" };

    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const target_batch = formData.get("target_batch") as string;

    const target_batch_id = target_batch && target_batch !== "all" ? target_batch : null;

    const { error } = await supabase
        .from("announcements")
        .insert({
            school_id: profile.school_id,
            title,
            message,
            target_batch_id,
            author_id: user.id
        });

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    return { success: true };
}
