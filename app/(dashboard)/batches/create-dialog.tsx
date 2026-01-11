"use client";

import { useTransition } from "react";
import { createBatch } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useState } from "react";

export function CreateBatchDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await createBatch(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Batch created successfully");
                setOpen(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Batch
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Batch</DialogTitle>
                    <DialogDescription>
                        Add a new class or batch to your institute (e.g., "Class 10 A").
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Batch Name</Label>
                            <Input id="name" name="name" placeholder="Class 10 - Section A" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Academic Year</Label>
                            <Input id="year" name="year" placeholder="2025-2026" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isPending} type="submit">
                            {isPending ? "Creating..." : "Create Batch"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
