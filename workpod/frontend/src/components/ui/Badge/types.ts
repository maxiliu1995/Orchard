// src/components/ui/Badge/types.ts

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    rounded?: 'full' | 'md';
    withDot?: boolean;
    dotColor?: 'gray' | 'green' | 'yellow' | 'red' | 'blue';
    isOutlined?: boolean;
}

export type BadgeVariant = BadgeProps['variant'];
export type BadgeSize = BadgeProps['size'];
