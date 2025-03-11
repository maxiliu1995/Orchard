// src/components/ui/Card/Card.tsx

'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { CardProps, CardHeaderProps, CardFooterProps } from './types';

export const Card = forwardRef<HTMLDivElement, CardProps>(({
    className,
    children,
    variant = 'default',
    padding = 'normal',
    isHoverable = false,
    isClickable = false,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'rounded-xl bg-white overflow-hidden',
                {
                    'shadow-sm border border-gray-200': variant === 'default',
                    'border border-gray-200': variant === 'bordered',
                    'bg-transparent': variant === 'ghost',
                    'p-0': padding === 'none',
                    'p-3': padding === 'small',
                    'p-6': padding === 'normal',
                    'p-8': padding === 'large',
                    'transition-shadow hover:shadow-md': isHoverable,
                    'cursor-pointer': isClickable,
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
    className,
    children,
    action,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-between px-6 py-4 border-b border-gray-200',
                className
            )}
            {...props}
        >
            <div>{children}</div>
            {action && <div>{action}</div>}
        </div>
    );
});

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
    className,
    children,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn('px-6 py-4', className)}
            {...props}
        >
            {children}
        </div>
    );
});

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
    className,
    children,
    bordered = true,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'px-6 py-4',
                bordered && 'border-t border-gray-200',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

CardFooter.displayName = 'CardFooter';
