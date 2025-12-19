import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Zap, Layout, MonitorPlay } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-outfit overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed w-full z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                            Q
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
                            Quizo
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden md:block font-medium text-slate-600 hover:text-blue-600 transition-colors">Sign In</Link>
                        <Link href="/register">
                            <Button className="rounded-full px-6">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute top-40 right-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />

                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium text-sm animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New: Camera Proctoring Enabled
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                        The Future of <span className="text-gradient">Secure Online Testing</span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Empower your institution with Quizo. A secure, modern, and intelligent platform for seamless online examinations and instant results.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/register">
                            <Button size="lg" className="rounded-full shadow-xl shadow-blue-500/20 h-14 px-8 text-lg">
                                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg bg-white/50 backdrop-blur-sm">
                                Live Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose Quizo?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Everything you need to conduct professional exams, packed into one beautiful interface.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-blue-600" />}
                            title="Anti-Cheat System"
                            description="Advanced proctoring with tab-switch detection, fullscreen enforcement, and camera monitoring."
                        />
                        <FeatureCard
                            icon={<Layout className="w-8 h-8 text-purple-600" />}
                            title="Intuitive Dashboard"
                            description="Clean, role-based dashboards for Teachers and Students to manage tests effortlessly."
                        />
                        <FeatureCard
                            icon={<MonitorPlay className="w-8 h-8 text-pink-600" />}
                            title="Real-time Results"
                            description="Instant grading and detailed analytics. Export results to CSV with a single click."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-bold text-xl flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">Q</div>
                        Quizo
                    </div>
                    <p className="text-slate-500 text-sm">© 2025 Quizo Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
