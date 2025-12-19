import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={twMerge(
                            "flex w-full rounded-xl border-2 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-4 py-3 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            icon && "pl-10",
                            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500 font-medium ml-1 animate-pulse">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
