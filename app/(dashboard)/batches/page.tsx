import { createClient } from "@/lib/supabase/server";
import { CreateBatchDialog } from "./create-dialog";
import { EditBatchDialog } from "./edit-dialog";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Users } from "lucide-react";

export default async function BatchesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get User's School
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user?.id)
        .single();

    if (!profile?.school_id) return <div>No Access</div>;

    // 2. Fetch Batches for that School
    const { data: batches } = await supabase
        .from("batches")
        .select("*")
        .eq("school_id", profile.school_id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Batches</h2>
                    <p className="text-muted-foreground">Manage your classes and academic groups.</p>
                </div>
                <CreateBatchDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Batches</CardTitle>
                    <CardDescription>
                        A list of all active batches in your institute.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!batches || batches.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Users className="mx-auto h-10 w-10 mb-4 opacity-50" />
                            <p>No batches found. Create your first batch to get started.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch Name</TableHead>
                                    <TableHead>Academic Year</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches.map((batch) => (
                                    <TableRow key={batch.id}>
                                        <TableCell className="font-medium">{batch.name}</TableCell>
                                        <TableCell>{batch.academic_year || "-"}</TableCell>
                                        <TableCell>{format(new Date(batch.created_at), "PPP")}</TableCell>
                                        <TableCell className="text-right">
                                            <EditBatchDialog batch={batch} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
