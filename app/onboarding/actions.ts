"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createInstitute(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to create an institute." };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
        return { error: "Name and ID are required." };
    }

    // 1. Create School
    const { data: school, error: schoolError } = await supabase
        .from("schools")
        .insert({
            name,
            slug,
            active: true, // Auto-activate for now, Phase 5 adds payment check
        })
        .select()
        .single();

    if (schoolError) {
        if (schoolError.code === "23505") { // Unique violation
            return { error: "This Institute ID is already taken." };
        }
        return { error: schoolError.message };
    }

    // 2. Create Profile (Link User to School)
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            school_id: school.id,
            role: "school_admin",
            full_name: user.email?.split("@")[0] || "Admin",
            email: user.email,
        });

    if (profileError) {
        return { error: "Failed to create user profile: " + profileError.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}
