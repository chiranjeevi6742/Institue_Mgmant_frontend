"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, BookOpen, CalendarCheck, BarChart3, Settings, LogOut } from "lucide-react";

const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/batches", label: "Batches", icon: BookOpen },
    { href: "/students", label: "Students", icon: Users },
    { href: "/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
];

import { useUser } from "@/components/providers/UserProvider";

export function Sidebar() {
    const pathname = usePathname();
    const { signOut } = useUser();

    return (
        <div className="hidden border-r bg-slate-900 text-slate-50 md:block w-64 flex-col h-screen sticky top-0">
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    <img src="/Logo/Logo_Institue.png" alt="Logo" className="h-10 w-auto" />
                    <span>InstiManager</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium gap-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                                    isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto border-t border-slate-800 p-4">
                <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
