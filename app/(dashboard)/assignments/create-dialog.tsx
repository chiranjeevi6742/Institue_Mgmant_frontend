"use client";

import { useTransition, useState } from "react";
import { uploadAssignment } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export function UploadAssignmentDialog({ batches }: { batches: { id: string, name: string }[] }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await uploadAssignment(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Assignment uploaded!");
                setOpen(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Material
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Study Material</DialogTitle>
                    <DialogDescription>
                        Share PDFs, images, or documents with a specific batch.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="e.g. Physics Chapter 1 Notes" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="batch_id">Select Batch</Label>
                            <Select name="batch_id" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {batches.map(batch => (
                                        <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea id="description" name="description" placeholder="Brief details about this file..." />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="file">File Attachment</Label>
                            <Input id="file" name="file" type="file" required className="cursor-pointer" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isPending} type="submit">
                            {isPending ? "Uploading..." : "Upload"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
