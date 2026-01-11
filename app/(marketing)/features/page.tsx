import { BadgeCheck, Calendar, Users, FileText } from "lucide-react";

export default function FeaturesPage() {
    return (
        <div className="py-20">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl font-bold mb-6">Features designed for growth</h1>
                    <p className="text-xl text-muted-foreground">
                        A complete suite of tools to manage your educational institution effectively.
                    </p>
                </div>

                <div className="space-y-20">
                    {/* Feature 1 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-slate-100 rounded-2xl h-80 flex items-center justify-center">
                            <span className="text-muted-foreground">Student List UI Screenshot</span>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
                                <Users className="h-5 w-5" /> Student Management
                            </div>
                            <h2 className="text-3xl font-bold mb-4">A Centralized Database</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                Say goodbye to scattered files. Maintain a digital directory of all your students with profile details, batch assignments, and history.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-emerald-500" /> Bulk Import Students</li>
                                <li className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-emerald-500" /> Advanced Search & Filtering</li>
                                <li className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-emerald-500" /> Profile Management</li>
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-col-dense">
                        <div className="md:col-start-2 bg-slate-100 rounded-2xl h-80 flex items-center justify-center">
                            <span className="text-muted-foreground">Attendance Calendar UI Screenshot</span>
                        </div>
                        <div className="md:col-start-1">
                            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
                                <Calendar className="h-5 w-5" /> Smart Attendance
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Track Daily Activity</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                Mark attendance in seconds. View monthly reports and identify irregular students instantly.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-emerald-500" /> One-Click Present/Absent</li>
                                <li className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-emerald-500" /> Monthly Grid View</li>
                                <li className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-emerald-500" /> Export Reports</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
