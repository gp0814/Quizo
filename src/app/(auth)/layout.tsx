export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-outfit">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/30 rounded-full blur-[100px] animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-500/30 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] z-[1]" />

            {/* Back to Home */}
            <a href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                <span className="font-medium text-sm">Back to Home</span>
            </a>

            <div className="w-full max-w-md p-6 relative z-10 animate-fade-in-up">
                {children}
            </div>
        </div>
    );
}
