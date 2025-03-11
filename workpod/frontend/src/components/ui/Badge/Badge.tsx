// src/components/ui/Badge/Badge.tsx

'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { BadgeProps } from './types';

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
    className,
    variant = 'default',
    size = 'sm',
    rounded = 'full',
    withDot = false,
    dotColor = 'gray',
    isOutlined = false,
    children,
    ...props
}, ref) => {
    const baseStyles = cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        {
            // Size variants
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-0.5 text-sm': size === 'md',
            'px-3 py-1 text-sm': size === 'lg',

            // Rounded variants
            'rounded-full': rounded === 'full',
            'rounded-md': rounded === 'md',

            // Solid variants (default)
            'bg-gray-100 text-gray-700': variant === 'default' && !isOutlined,
            'bg-primary-100 text-primary-700': variant === 'primary' && !isOutlined,
            'bg-green-100 text-green-700': variant === 'success' && !isOutlined,
            'bg-yellow-100 text-yellow-700': variant === 'warning' && !isOutlined,
            'bg-red-100 text-red-700': variant === 'danger' && !isOutlined,
            'bg-blue-100 text-blue-700': variant === 'info' && !isOutlined,

            // Outlined variants
            'border bg-transparent': isOutlined,
            'border-gray-300 text-gray-700': variant === 'default' && isOutlined,
            'border-primary-300 text-primary-700': variant === 'primary' && isOutlined,
            'border-green-300 text-green-700': variant === 'success' && isOutlined,
            'border-yellow-300 text-yellow-700': variant === 'warning' && isOutlined,
            'border-red-300 text-red-700': variant === 'danger' && isOutlined,
            'border-blue-300 text-blue-700': variant === 'info' && isOutlined,
        },
        className
    );

    const dotStyles = cn(
        'h-2 w-2 rounded-full mr-1.5',
        {
            'bg-gray-400': dotColor === 'gray',
            'bg-green-400': dotColor === 'green',
            'bg-yellow-400': dotColor === 'yellow',
            'bg-red-400': dotColor === 'red',
            'bg-blue-400': dotColor === 'blue',
        }
    );

    return (
        <span
            ref={ref}
            className={baseStyles}
            {...props}
        >
            {withDot && <span className={dotStyles} />}
            {children}
        </span>
    );
});

Badge.displayName = 'Badge';
