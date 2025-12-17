"use client";

import React from "react";
import styles from "./TiltCard.module.css";
import { cn } from "@/lib/utils";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className }) => {
    return (
        <div className={cn(styles.container, styles.noselect, className)}>
            <div className={styles.canvas}>
                {[...Array(25)].map((_, i) => (
                    <div key={i} className={styles[`tr-${i + 1}`]} />
                ))}
            </div>
            <div className={styles.cardWrapper}>
                {children}
            </div>
        </div>
    );
};

export default TiltCard;
