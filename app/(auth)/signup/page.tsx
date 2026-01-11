"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signup } from "@/app/auth/actions";
import { toast } from "sonner";
import { useState, useTransition } from "react";

export default function SignupPage() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await signup(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Account created successfully!");
            }
        });
    };

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your institute account.
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="admin@school.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" name="confirmPassword" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" disabled={isPending}>
                        {isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-primary">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
