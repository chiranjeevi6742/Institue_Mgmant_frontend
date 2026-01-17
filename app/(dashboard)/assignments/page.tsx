import { createClient } from "@/lib/supabase/server";
import { UploadAssignmentDialog } from "./create-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AssignmentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get School Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user?.id)
        .single();

    if (!profile?.school_id) return <div>No Access</div>;

    // 2. Fetch Batches (for Dropdown)
    const { data: batches } = await supabase
        .from("batches")
        .select("id, name")
        .eq("school_id", profile.school_id)
        .order("name");

    // 3. Fetch Assignments
    const { data: assignments } = await supabase
        .from("assignments")
        .select(`
        *,
        batches ( name )
    `)
        .eq("school_id", profile.school_id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
                    <p className="text-muted-foreground">Manage study materials and file uploads.</p>
                </div>
                <UploadAssignmentDialog batches={batches || []} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Library</CardTitle>
                    <CardDescription>
                        All uploaded files and specific batch assignments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!assignments || assignments.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <FileText className="mx-auto h-10 w-10 mb-4 opacity-50" />
                            <p>No assignments uploaded yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Target Batch</TableHead>
                                    <TableHead>Uploaded</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                    {item.title}
                                                </span>
                                                {item.description && (
                                                    <span className="text-xs text-muted-foreground ml-6">{item.description}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.batches?.name ? (
                                                <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800">
                                                    {item.batches.name}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Unknown</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {item.created_at ? format(new Date(item.created_at), "PPP p") : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" size="sm">
                                                        <Download className="h-4 w-4 mr-1" /> Open
                                                    </Button>
                                                </a>
                                            </div>
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
