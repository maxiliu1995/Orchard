// src/components/ui/Dropdown/types.ts

export interface DropdownProps {
    children: React.ReactNode;
    trigger: React.ReactNode;
    align?: 'start' | 'end' | 'center';
    sideOffset?: number;
    className?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
    shortcut?: string;
    destructive?: boolean;
    disabled?: boolean;
}

export interface DropdownSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DropdownLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
