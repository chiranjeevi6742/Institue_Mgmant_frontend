"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";

export function Header() {
    const pathname = usePathname();
    const { user } = useUser();

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
