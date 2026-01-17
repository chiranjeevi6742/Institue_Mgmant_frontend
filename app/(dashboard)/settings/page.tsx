import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch Profile to get School ID
    const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("id", user.id)
        .single();

    if (!profile?.school_id) return <div>No Institute found.</div>;

    // Fetch School Details
    const { data: school } = await supabase
        .from("schools")
        .select("*")
        .eq("id", profile.school_id)
        .single();

    return (
        <div className="space-y-6">


            <Card>
                <CardHeader>
                    <CardTitle>Institute Profile</CardTitle>
                    <CardDescription>
                        Details regarding your educational institute.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Institute Name</Label>
                        <Input value={school?.name} readOnly className="bg-slate-50" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Unique ID (Slug)</Label>
                        <Input value={school?.slug} readOnly className="bg-slate-50" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Institute ID (System)</Label>
                        <Input value={school?.id} readOnly className="bg-slate-50 font-mono text-xs" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
