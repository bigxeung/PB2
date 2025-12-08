interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

function LoadingSpinner({ size = 'md', message = '로딩 중...' }: LoadingSpinnerProps) {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-700 border-t-red-600 rounded-full animate-spin`}
      ></div>
      {message && (
        <p className="mt-4 text-gray-400 text-sm">{message}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
