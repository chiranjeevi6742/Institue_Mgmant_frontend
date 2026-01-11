import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img src="/Logo/Logo_Institue.png" alt="InstiManager Logo" className="h-10 w-auto" />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Empowering institutes with modern digital tools.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/features">Features</Link></li>
                            <li><Link href="/pricing">Pricing</Link></li>
                            <li><Link href="#">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">About</Link></li>
                            <li><Link href="#">Blog</Link></li>
                            <li><Link href="#">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">Privacy</Link></li>
                            <li><Link href="#">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} InstiManager. All rights reserved.</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {/* Hidden Admin Link */}
                        <Link href="/admin" className="hover:text-primary transition-colors opacity-50 text-xs">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
