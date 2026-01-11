import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Link href="/" className="flex items-center gap-2 mb-8">
                <img src="/Logo/Logo_Institue.png" alt="InstiManager Logo" className="h-12 w-auto" />
            </Link>
            <div className="w-full max-w-lg">
                {children}
            </div>
        </div>
    );
}
