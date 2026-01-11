"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createInstitute } from "./actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await createInstitute(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Institute created successfully!");
                // Server action usually redirects, but we add a client-fallback just in case
                router.push("/dashboard");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Setup your Institute</CardTitle>
                <CardDescription>
                    Tell us about your school or coaching center to get started.
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Institute Name</Label>
                        <Input id="name" name="name" placeholder="e.g. Springfield High School" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Institute ID (Unique)</Label>
                        <Input id="slug" name="slug" placeholder="e.g. springfield-high" required />
                        <p className="text-xs text-muted-foreground">This will be used for your unique URL.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" type="button" onClick={() => router.push('/')}>Cancel</Button>
                    <Button disabled={isPending}>
                        {isPending ? "Setting up..." : "Complete Setup"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
