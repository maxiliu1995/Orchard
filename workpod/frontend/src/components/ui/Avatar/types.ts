// src/components/ui/Avatar/types.ts

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
    shape?: 'circle' | 'square';
    fallback?: string | React.ReactNode;
    bordered?: boolean;
    stacked?: boolean;
    notification?: number;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    max?: number;
    size?: AvatarProps['size'];
    spacing?: 'tight' | 'normal' | 'loose';
}
