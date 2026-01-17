import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ProUpgradeButton } from "./pro-upgrade-button";


export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get School Profile & Subscription
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user?.id)
        .single();

    // Default mock subscription state if table not populated
    let subscription = { plan: "free", status: "active" };

    if (profile?.school_id) {
        const { data: subData } = await supabase
            .from("school_subscriptions")
            .select("*")
            .eq("school_id", profile.school_id)
            .single();

        if (subData) {
            subscription = { plan: subData.plan_type, status: subData.status };
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>
                        You are currently on the <span className="font-bold uppercase">{subscription.plan}</span> plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        Status: <span className="capitalize text-foreground font-medium">{subscription.status}</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Free Plan */}
                <Card className={subscription.plan === 'free' ? "border-primary shadow-lg" : ""}>
                    <CardHeader>
                        <CardTitle>Free Forever</CardTitle>
                        <CardDescription>Essential features for small schools.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                        <ul className="grid gap-2 text-sm">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Up to 50 Students</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic Attendance</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 1 Admin User</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" disabled={subscription.plan === 'free'}>
                            {subscription.plan === 'free' ? "Current Plan" : "Downgrade"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className={subscription.plan === 'pro' ? "border-primary shadow-lg" : "bg-slate-50 dark:bg-slate-900"}>
                    <CardHeader>
                        <CardTitle>Pro Institute</CardTitle>
                        <CardDescription>For growing schools needing power.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="text-3xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                        <ul className="grid gap-2 text-sm">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Unlimited Students</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Advanced Reports</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> File Uploads (10GB)</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Priority Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {subscription.plan === 'pro' ? (
                            <Button className="w-full" disabled>Current Plan</Button>
                        ) : (
                            <ProUpgradeButton userId={user?.id || ""} />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
