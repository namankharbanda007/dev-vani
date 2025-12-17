"use client";

import React from "react";
import styles from "./RetroButton.module.css";
import { cn } from "@/lib/utils";

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const RetroButton = React.forwardRef<HTMLButtonElement, RetroButtonProps>(
    ({ className, children, icon, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(styles.button, className)}
                {...props}
            >
                <div className={styles.inner}>
                    <span className={styles.content}>
                        {icon && <span className="mr-1">{icon}</span>}
                        {children}
                    </span>
                </div>
            </button>
        );
    }
);
RetroButton.displayName = "RetroButton";

export default RetroButton;
