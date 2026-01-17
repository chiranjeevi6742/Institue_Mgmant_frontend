import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account and institute preferences.</p>
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <Link href="/settings">
                            <Button variant="ghost" className="w-full justify-start">Profile</Button>
                        </Link>
                        <Link href="/settings/billing">
                            <Button variant="ghost" className="w-full justify-start">Billing & Plans</Button>
                        </Link>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    );
}
