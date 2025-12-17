import React from 'react';
import styles from './PremiumButton.module.css';
import { cn } from "@/lib/utils";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const StarIcon = ({ className }: { className: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn(styles.star, className)}
    >
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
);

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(styles.btn, className)}
                {...props}
            >
                {children}
                <StarIcon className={styles.star1} />
                <StarIcon className={styles.star2} />
                <StarIcon className={styles.star3} />
                <StarIcon className={styles.star4} />
                <StarIcon className={styles.star5} />
                <StarIcon className={styles.star6} />
            </button>
        );
    }
);

PremiumButton.displayName = "PremiumButton";

export { PremiumButton };
