"use client";

import { useTransition, useState } from "react";
import { createAnnouncement } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BellPlus } from "lucide-react";

export function CreateAnnouncementDialog({ batches }: { batches: { id: string, name: string }[] }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await createAnnouncement(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Announcement posted!");
                setOpen(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <BellPlus className="mr-2 h-4 w-4" /> New Announcement
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Post Announcement</DialogTitle>
                    <DialogDescription>
                        Share updates with students or specific batches.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="e.g. Exam Schedule Released" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="target_batch">Target Audience</Label>
                            <Select name="target_batch" defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Students</SelectItem>
                                    {batches.map(batch => (
                                        <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Type your announcement here..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isPending} type="submit">
                            {isPending ? "Posting..." : "Post Now"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
