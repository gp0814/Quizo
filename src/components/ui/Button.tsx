import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const sizeStyles = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-5 py-2.5 text-base",
            lg: "px-7 py-3.5 text-lg"
        };

        const variants = {
            primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 border-transparent",
            secondary: "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md",
            outline: "bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400",
            danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/30",
            ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        };

        return (
            <button
                ref={ref}
                className={twMerge(
                    "relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]",
                    sizeStyles[size],
                    variants[variant],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
