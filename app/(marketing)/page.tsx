import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LayoutDashboard, Users, BarChart3 } from "lucide-react";
import Testimonials from "@/components/sections/Testimonials";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-6">
                        ✨ Now in Beta
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
                        Manage Your Institute <br className="hidden md:block" /> with Digital Precision
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        The all-in-one platform for schools, coaching centers, and training institutes. Track attendance, manage batches, and grow your business.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-lg" asChild>
                            <Link href="/signup">
                                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                            View Demo
                        </Button>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
            </section>

            {/* Value Proposition */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything you need to run your school</h2>
                        <p className="text-muted-foreground">Stop using spreadsheets. Upgrade to a professional operating system.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="h-10 w-10 text-primary" />}
                            title="Student Management"
                            description="Keep detailed records of students, assign batches, and track their journey from enrollment to graduation."
                        />
                        <FeatureCard
                            icon={<LayoutDashboard className="h-10 w-10 text-primary" />}
                            title="Daily Operations"
                            description="Mark attendance, create announcements, and manage daily schedules with a few clicks."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-10 w-10 text-primary" />}
                            title="Actionable Insights"
                            description="Visualize growth, attendance trends, and fee collection status with beautiful reports."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <Testimonials />

            {/* How It Works */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">Get started in 3 steps</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <Step number="1" title="Create Account" desc="Sign up and set up your institute profile in seconds." />
                        <Step number="2" title="Add Students" desc="Bulk upload your student list or add them individually." />
                        <Step number="3" title="Start Managing" desc="Begin tracking attendance and sharing updates instantly." />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary text-primary-foreground">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to modernize your institute?</h2>
                    <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                        Join hundreds of forward-thinking educators using InstiManager today.
                    </p>
                    <Button size="lg" variant="secondary" className="h-12 px-8" asChild>
                        <Link href="/signup">Start Your Free Trial</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-primary shadow-sm mb-6 text-xl">
                {number}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{desc}</p>
        </div>
    );
}
