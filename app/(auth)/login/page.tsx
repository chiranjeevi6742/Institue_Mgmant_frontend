"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { login } from "@/app/auth/actions";
import { toast } from "sonner";
import { useState, useTransition } from "react";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await login(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Logged in successfully!");
            }
        });
    };

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>
                    Enter your email to access your institute dashboard.
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
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" disabled={isPending}>
                        {isPending ? "Signing in..." : "Sign In"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline text-primary">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
