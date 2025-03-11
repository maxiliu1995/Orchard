// src/components/ui/Dropdown/Dropdown.tsx

'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/utils/cn';
import { 
    DropdownProps, 
    DropdownItemProps, 
    DropdownSeparatorProps, 
    DropdownLabelProps 
} from './types';

export function Dropdown({
    children,
    trigger,
    align = 'end',
    sideOffset = 4,
    className,
    isOpen,
    onOpenChange,
}: DropdownProps) {
    return (
        <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
            <DropdownMenuPrimitive.Trigger asChild>
                {trigger}
            </DropdownMenuPrimitive.Trigger>

            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    align={align}
                    sideOffset={sideOffset}
                    className={cn(
                        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                        className
                    )}
                >
                    {children}
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    );
}

export function DropdownItem({
    children,
    icon,
    shortcut,
    destructive = false,
    disabled = false,
    className,
    ...props
}: DropdownItemProps) {
    return (
        <DropdownMenuPrimitive.Item
            disabled={disabled}
            className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                'focus:bg-gray-100 focus:text-gray-900',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                destructive && 'text-red-600 focus:bg-red-50',
                className
            )}
            {...props}
        >
            {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
            <span className="flex-grow">{children}</span>
            {shortcut && (
                <span className="ml-auto text-xs tracking-widest text-gray-400">
                    {shortcut}
                </span>
            )}
        </DropdownMenuPrimitive.Item>
    );
}

export function DropdownSeparator({ className, ...props }: DropdownSeparatorProps) {
    return (
        <DropdownMenuPrimitive.Separator
            className={cn('-mx-1 my-1 h-px bg-gray-200', className)}
            {...props}
        />
    );
}

export function DropdownLabel({ children, className, ...props }: DropdownLabelProps) {
    return (
        <DropdownMenuPrimitive.Label
            className={cn('px-2 py-1.5 text-sm font-semibold text-gray-900', className)}
            {...props}
        >
            {children}
        </DropdownMenuPrimitive.Label>
    );
}
