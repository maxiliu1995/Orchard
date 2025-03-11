// src/components/ui/Avatar/Avatar.tsx

'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { AvatarProps, AvatarGroupProps } from './types';

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
    className,
    src,
    alt = '',
    size = 'md',
    status,
    shape = 'circle',
    fallback,
    bordered = false,
    stacked = false,
    notification,
    ...props
}, ref) => {
    const [imageError, setImageError] = useState(false);

    const sizeStyles = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-14 w-14 text-xl',
    };

    const statusStyles = {
        online: 'bg-green-400',
        offline: 'bg-gray-400',
        away: 'bg-yellow-400',
        busy: 'bg-red-400',
    };

    const baseStyles = cn(
        'relative inline-flex items-center justify-center bg-gray-200 text-gray-600 overflow-hidden',
        {
            'rounded-full': shape === 'circle',
            'rounded-lg': shape === 'square',
            'border-2 border-white': bordered,
            '-ml-2': stacked,
        },
        sizeStyles[size],
        className
    );

    // Generate fallback initials from alt text
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div ref={ref} className={baseStyles} {...props}>
            {/* Image */}
            {src && !imageError ? (
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                // Fallback
                <div className="flex items-center justify-center h-full w-full">
                    {fallback || getInitials(alt)}
                </div>
            )}

            {/* Status Indicator */}
            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white',
                        statusStyles[status]
                    )}
                />
            )}

            {/* Notification Badge */}
            {notification !== undefined && notification > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-xs">
                    {notification > 99 ? '99+' : notification}
                </span>
            )}
        </div>
    );
});

Avatar.displayName = 'Avatar';

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(({
    children,
    max = 4,
    size = 'md',
    spacing = 'normal',
    className,
    ...props
}, ref) => {
    const childrenArray = React.Children.toArray(children);
    const excess = childrenArray.length - max;

    const spacingStyles = {
        tight: '-ml-1',
        normal: '-ml-2',
        loose: '-ml-3',
    };

    return (
        <div
            ref={ref}
            className={cn('flex items-center', className)}
            {...props}
        >
            {childrenArray.slice(0, max).map((child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        key: index,
                        size,
                        stacked: true,
                        className: cn(spacingStyles[spacing], child.props.className),
                    });
                }
                return child;
            })}
            {excess > 0 && (
                <Avatar
                    size={size}
                    stacked
                    className={spacingStyles[spacing]}
                    fallback={`+${excess}`}
                />
            )}
        </div>
    );
});

AvatarGroup.displayName = 'AvatarGroup';
