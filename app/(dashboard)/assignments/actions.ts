"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadAssignment(formData: FormData) {
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
    const description = formData.get("description") as string;
    const batch_id = formData.get("batch_id") as string;
    const file = formData.get("file") as File;

    if (!file) return { error: "No file provided" };
    if (!batch_id || batch_id === "none") return { error: "Please select a batch" };

    // 1. Upload File to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.school_id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('assignments')
        .upload(fileName, file, {
            upsert: false
        });

    if (uploadError) {
        console.error("Storage Error:", uploadError);
        return { error: "Failed to upload file. Ensure 'assignments' bucket exists." };
    }

    // 2. Get Public URL (or signed)
    const { data: { publicUrl } } = supabase
        .storage
        .from('assignments')
        .getPublicUrl(fileName);

    // 3. Insert Record in DB
    const { error: dbError } = await supabase
        .from("assignments")
        .insert({
            school_id: profile.school_id,
            batch_id,
            title,
            description,
            file_url: publicUrl,
            file_type: fileExt
        });

    if (dbError) return { error: dbError.message };

    revalidatePath("/assignments");
    return { success: true };
}
