import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProUpgradeButton } from "@/app/(dashboard)/settings/billing/pro-upgrade-button";

export default async function PricingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-muted-foreground">
                        Start for free, upgrade as you grow. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <h3 className="text-xl font-medium mb-2">Free Starter</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">Perfect for small coaching centers starting out.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-emerald-500" /> Up to 50 Students</li>
                            <li className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-emerald-500" /> Basic Attendance</li>
                            <li className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-emerald-500" /> 1 Admin User</li>
                        </ul>

                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/signup">Get Started Free</Link>
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border-2 border-primary shadow-lg flex flex-col relative">
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            POPULAR
                        </div>
                        <h3 className="text-xl font-medium mb-2">Pro Institute</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">$49</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">For serious institutes scaling up operations.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-primary" /> Unlimited Students</li>
                            <li className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-primary" /> Advanced Reports & Insights</li>
                            <li className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                            <li className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-primary" /> File Uploads (Assignments)</li>
                        </ul>

                        {user ? (
                            <ProUpgradeButton userId={user.id} />
                        ) : (
                            <Button className="w-full" asChild>
                                <Link href="/login?redirect=/pricing">Login to Upgrade</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
