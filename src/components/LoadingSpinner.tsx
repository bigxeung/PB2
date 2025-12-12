import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'spinner' | 'dots' | 'netflix' | 'pulse';
}

function LoadingSpinner({
  size = 'md',
  message = '로딩 중...',
  variant = 'netflix'
}: LoadingSpinnerProps) {
  const [dotIndex, setDotIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // reduced motion 체크
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 로딩 메시지 점 애니메이션
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setDotIndex(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const sizeClasses: Record<'sm' | 'md' | 'lg', { container: string; text: string }> = {
    sm: { container: 'w-6 h-6', text: 'text-xs' },
    md: { container: 'w-10 h-10', text: 'text-sm' },
    lg: { container: 'w-16 h-16', text: 'text-base' }
  };

  const dots = '.'.repeat(dotIndex);

  // Netflix 스타일 로고 애니메이션
  const NetflixLoader = () => (
    <div className="relative">
      <div
        className={`${sizeClasses[size].container} relative`}
        style={{
          animation: prefersReducedMotion ? 'none' : 'netflixPulse 1.5s ease-in-out infinite',
        }}
      >
        {/* N 로고 */}
        <svg viewBox="0 0 111 30" className="w-full h-full fill-red-600">
          <path d="M105.06 14.28L111 30c-1.75-.25-3.5-.41-5.25-.57l-3.18-8.64-3.18 8.29c-1.75-.16-3.5-.32-5.25-.41l5.92-14.22-5.58-14.05c1.75.16 3.5.32 5.25.41l2.85 7.96 2.85-7.61c1.75.16 3.5.32 5.25.41l-5.67 13.71zM90.52 0c1.66 0 3 .34 4.03 1.02 1.03.68 1.54 1.65 1.54 2.9v23.58c-.5.16-1.13.29-1.87.39-.74.1-1.57.15-2.5.15H89.5c-1.13 0-2.12-.19-2.98-.57-.86-.38-1.54-.94-2.04-1.68-.5-.74-.75-1.64-.75-2.7V0h6.79zm-9.79 4.5c0 2.52-2.04 4.57-4.55 4.57s-4.55-2.04-4.55-4.57c0-2.52 2.04-4.5 4.55-4.5s4.55 2.04 4.55 4.5zm-31.5 25.5c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm-24.87 0c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zM0 0h6.5v30H0V0zm14.5 0h6.5v30h-6.5V0z" />
        </svg>
      </div>

      {/* 글로우 효과 */}
      <div
        className="absolute inset-0 bg-red-600/30 blur-xl rounded-full"
        style={{
          animation: prefersReducedMotion ? 'none' : 'pulseGlow 2s ease-in-out infinite',
        }}
      />
    </div>
  );

  // 기본 스피너
  const Spinner = () => (
    <div
      className={`${sizeClasses[size].container} spinner gpu-accelerated`}
      style={{
        animationPlayState: prefersReducedMotion ? 'paused' : 'running',
      }}
    />
  );

  // 점 로더
  const DotsLoader = () => (
    <div className="spinner-dots">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            animation: prefersReducedMotion ? 'none' : `bounce 0.6s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  // 펄스 로더
  const PulseLoader = () => (
    <div className="relative flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-red-600 ${sizeClasses[size].container}`}
          style={{
            animation: prefersReducedMotion ? 'none' : `pulse 1.5s ease-out infinite`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.3 - i * 0.1,
          }}
        />
      ))}
      <div className={`${sizeClasses[size].container} rounded-full bg-red-600 z-10`} />
    </div>
  );

  const loaders: Record<string, React.ReactNode> = {
    spinner: <Spinner />,
    dots: <DotsLoader />,
    netflix: <NetflixLoader />,
    pulse: <PulseLoader />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 fade-in">
      {loaders[variant]}

      {message && (
        <p
          className={`mt-6 text-gray-400 ${sizeClasses[size].text} font-medium`}
          style={{
            minWidth: '100px',
            textAlign: 'center',
          }}
        >
          {message}{dots}
        </p>
      )}

      {/* 스켈레톤 힌트 */}
      {variant === 'netflix' && (
        <div className="mt-8 flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-24 h-36 skeleton rounded-lg"
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LoadingSpinner;
