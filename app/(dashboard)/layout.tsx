import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user has a profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user?.id)
        .single();

    if (!profile) {
        redirect("/onboarding");
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
