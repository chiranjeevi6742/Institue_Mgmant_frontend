import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check Super Admin Status
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_super_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_super_admin) {
        redirect("/dashboard"); // Kick out non-admins
    }

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Admin Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col fixed h-full inset-y-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-lg gap-2">
                    <ShieldCheck className="text-red-500" />
                    Super Admin
                </div>
                <div className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-md text-white">
                        <LayoutDashboard className="h-4 w-4" />
                        Overview
                    </Link>
                </div>
                <div className="p-4 border-t border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors">
                        <LogOut className="h-4 w-4" />
                        Exit to App
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 ml-64 p-8">
                {children}
            </div>
        </div>
    );
}
