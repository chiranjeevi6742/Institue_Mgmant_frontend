import { createClient } from "@/lib/supabase/server";
import { CreateStudentDialog } from "./create-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap } from "lucide-react";

export default async function StudentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get School ID
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

    // 3. Fetch Students (with Batch Name)
    // We explicitly specify the relationship if possible, but 'batches' usually works if FK exists
    const { data: students, error } = await supabase
        .from("students")
        .select(`
        *,
        batches (
            name
        )
    `)
        .eq("school_id", profile.school_id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching students:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Students</h2>
                    <p className="text-muted-foreground">Manage your student directory and enrollments.</p>
                </div>
                <CreateStudentDialog batches={batches || []} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>
                        A list of all students registered in your institute.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!students || students.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <GraduationCap className="mx-auto h-10 w-10 mb-4 opacity-50" />
                            <p>No students found. Add your first student to get started.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Batch / Class</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{student.full_name}</span>
                                                <span className="text-xs text-muted-foreground md:hidden">{student.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.batches?.name ? (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-100 text-indigo-800">
                                                    {student.batches.name}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Unassigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{student.email || "-"}</span>
                                                <span className="text-muted-foreground text-xs">{student.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {student.created_at ? format(new Date(student.created_at), "PPP") : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Edit</Button>
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
