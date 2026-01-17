"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function Header() {
    const pathname = usePathname();
    const { user } = useUser();
    const [isPro, setIsPro] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function checkProStatus() {
            if (!user) return;

            // Use RPC for robust checking
            const { data, error } = await supabase.rpc('get_my_subscription');

            if (error) {
                console.error("RPC Error:", error);
                return;
            }

            // data is JSON: { plan: 'pro', status: '...' }
            // need to cast or just check property
            const plan = (data as any)?.plan;

            if (plan === "pro") {
                setIsPro(true);
            } else {
                setIsPro(false); // Ensure it's set to false if not pro
            }
        }
        checkProStatus();
    }, [user]);

    // Simple breadcrumb logic
    const pageName = pathname.split("/").filter(Boolean).pop();
    const title = pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : "Dashboard";

    const initials = user?.email?.substring(0, 2).toUpperCase() || "AD";

    return (
        <header className="flex h-16 items-center border-b bg-white px-6 w-full sticky top-0 z-30">
            <h1 className="text-lg font-semibold md:text-xl text-slate-800">
                {title === "Dashboard" ? "Overview" : title}
            </h1>
            <div className="ml-auto flex items-center gap-4">
                {isPro && (
                    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 gap-1">
                        <Sparkles className="h-3 w-3 fill-white" /> PRO
                    </span>
                )}
                <div className="flex flex-col items-end mr-2 hidden md:flex">
                    <span className="text-sm font-medium">{user?.email}</span>
                    <span className="text-xs text-muted-foreground uppercase">{user?.role || "Admin"}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {initials}
                </div>
            </div>
        </header>
    );
}
