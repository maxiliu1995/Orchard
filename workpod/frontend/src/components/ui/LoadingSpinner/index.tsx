interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    return (
        <div role="status" className={`flex items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`} />
        </div>
    );
}; 