"use client";

import { useTransition, useState } from "react";
import { updateBatch } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

type Batch = {
    id: string;
    name: string;
    academic_year: string | null;
};

export function EditBatchDialog({ batch }: { batch: Batch }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateBatch(batch.id, formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Batch updated successfully");
                setOpen(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Batch</DialogTitle>
                    <DialogDescription>
                        Update details for {batch.name}.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Batch Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={batch.name}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Academic Year</Label>
                            <Input
                                id="year"
                                name="year"
                                defaultValue={batch.academic_year || ""}
                                placeholder="2025-2026"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isPending} type="submit">
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
