/**
 * 반응형 웹 관련 커스텀 훅 모음
 * 다크 모드, 폰트 크기 조절, 터치 이벤트, 화면 회전 등 지원
 */
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 다크 모드 관리 훅
 * @returns 현재 테마와 테마 전환 함수
 */
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // localStorage에서 저장된 테마 확인
    const saved = localStorage.getItem('netflix_theme');
    if (saved === 'light' || saved === 'dark') return saved;

    // 시스템 설정 확인
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    // HTML 요소에 테마 속성 적용
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('netflix_theme', theme);
  }, [theme]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('netflix_theme');
      // 사용자가 명시적으로 설정하지 않은 경우에만 시스템 설정 따름
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, setTheme, toggleTheme };
}

/**
 * 폰트 크기 조절 훅
 * @returns 현재 폰트 크기와 조절 함수
 */
export function useFontSize() {
  type FontSize = 'small' | 'normal' | 'large' | 'x-large';

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('netflix_fontSize');
    if (saved === 'small' || saved === 'normal' || saved === 'large' || saved === 'x-large') {
      return saved;
    }
    return 'normal';
  });

  useEffect(() => {
    if (fontSize === 'normal') {
      document.documentElement.removeAttribute('data-font-size');
    } else {
      document.documentElement.setAttribute('data-font-size', fontSize);
    }
    localStorage.setItem('netflix_fontSize', fontSize);
  }, [fontSize]);

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => {
      switch (prev) {
        case 'small': return 'normal';
        case 'normal': return 'large';
        case 'large': return 'x-large';
        default: return prev;
      }
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => {
      switch (prev) {
        case 'x-large': return 'large';
        case 'large': return 'normal';
        case 'normal': return 'small';
        default: return prev;
      }
    });
  }, []);

  return { fontSize, setFontSize, increaseFontSize, decreaseFontSize };
}

/**
 * 화면 방향 감지 훅
 * @returns 현재 화면 방향 정보
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<{
    isPortrait: boolean;
    isLandscape: boolean;
    type: string;
  }>(() => ({
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth > window.innerHeight,
    type: window.screen?.orientation?.type || 'unknown',
  }));

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation({
        isPortrait: window.innerHeight > window.innerWidth,
        isLandscape: window.innerWidth > window.innerHeight,
        type: window.screen?.orientation?.type || 'unknown',
      });
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
}

/**
 * 스와이프 제스처 감지 훅
 * @param onSwipeLeft 왼쪽 스와이프 콜백
 * @param onSwipeRight 오른쪽 스와이프 콜백
 * @param minSwipeDistance 최소 스와이프 거리 (기본 50px)
 */
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  minSwipeDistance = 50
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }
  }, [minSwipeDistance, onSwipeLeft, onSwipeRight]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

/**
 * 미디어 쿼리 감지 훅
 * @param query 미디어 쿼리 문자열
 * @returns 쿼리 매칭 여부
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/**
 * 디바이스 타입 감지 훅
 * @returns 현재 디바이스 타입
 */
export function useDeviceType() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
}

/**
 * 모션 감소 설정 감지 훅
 * @returns 모션 감소 설정 여부
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * 고대비 모드 감지 훅
 * @returns 고대비 모드 여부
 */
export function useHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)');
}
