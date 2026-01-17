"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdminStats() {
    const supabase = await createClient();

    // Check Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase.from("profiles").select("is_super_admin").eq("id", user.id).single();
    if (!profile?.is_super_admin) return { error: "Unauthorized" };

    // Fetch Stats (Parallel)
    const [schools, students, profiles, batches] = await Promise.all([
        supabase.from("schools").select("*", { count: 'exact', head: true }),
        supabase.from("students").select("*", { count: 'exact', head: true }),
        supabase.from("profiles").select("*", { count: 'exact', head: true }),
        supabase.from("batches").select("*", { count: 'exact', head: true })
    ]);

    return {
        schoolsCount: schools.count || 0,
        studentsCount: students.count || 0,
        usersCount: profiles.count || 0,
        batchesCount: batches.count || 0
    };
}

export async function getAllSchools() {
    const supabase = await createClient();

    // Check Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase.from("profiles").select("is_super_admin").eq("id", user.id).single();
    if (!profile?.is_super_admin) return [];

    // Fetch Schools
    const { data: schools } = await supabase.from("schools").select("*").order("created_at", { ascending: false });
    return schools || [];
}
