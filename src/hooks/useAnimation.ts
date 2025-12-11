import { useState, useEffect, useCallback, useRef, type RefObject } from 'react';

// ============================================
// 타입 정의
// ============================================

interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  iteration: number;
}

interface UseAnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onIteration?: () => void;
}

interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

// ============================================
// useAnimation - 애니메이션 제어 훅
// ============================================

export function useAnimation(
  ref: RefObject<HTMLElement | null>,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: UseAnimationOptions = {}
) {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    iterations = 1,
    direction = 'normal',
    fillMode = 'forwards',
    autoPlay = false,
    onStart,
    onEnd,
    onIteration,
  } = options;

  const animationRef = useRef<Animation | null>(null);
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    progress: 0,
    iteration: 0,
  });

  // 애니메이션 시작
  const play = useCallback(() => {
    if (!ref.current) return;

    const animation = ref.current.animate(keyframes, {
      duration,
      delay,
      easing,
      iterations: iterations === 'infinite' ? Infinity : iterations,
      direction,
      fill: fillMode,
    });

    animationRef.current = animation;
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));

    animation.addEventListener('finish', () => {
      setState(prev => ({ ...prev, isPlaying: false, progress: 1 }));
      onEnd?.();
    });

    animation.addEventListener('cancel', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });

    onStart?.();
  }, [ref, keyframes, duration, delay, easing, iterations, direction, fillMode, onStart, onEnd]);

  // 애니메이션 일시정지
  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
    }
  }, []);

  // 애니메이션 재개
  const resume = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.play();
      setState(prev => ({ ...prev, isPaused: false }));
    }
  }, []);

  // 애니메이션 취소
  const cancel = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      setState({
        isPlaying: false,
        isPaused: false,
        progress: 0,
        iteration: 0,
      });
    }
  }, []);

  // 애니메이션 리버스
  const reverse = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.reverse();
    }
  }, []);

  // 진행률 업데이트
  useEffect(() => {
    if (!animationRef.current || state.isPaused) return;

    const updateProgress = () => {
      if (animationRef.current) {
        const currentTime = animationRef.current.currentTime || 0;
        const totalDuration = duration * (iterations === 'infinite' ? 1 : iterations as number);
        setState(prev => ({
          ...prev,
          progress: Math.min((currentTime as number) / totalDuration, 1),
        }));
      }
    };

    const intervalId = setInterval(updateProgress, 16);
    return () => clearInterval(intervalId);
  }, [state.isPlaying, state.isPaused, duration, iterations]);

  // 자동 재생
  useEffect(() => {
    if (autoPlay) {
      play();
    }
  }, [autoPlay, play]);

  // 정리
  useEffect(() => {
    return () => {
      animationRef.current?.cancel();
    };
  }, []);

  return {
    ...state,
    play,
    pause,
    resume,
    cancel,
    reverse,
    animation: animationRef.current,
  };
}

// ============================================
// useIntersectionAnimation - 스크롤 애니메이션 훅
// ============================================

export function useIntersectionAnimation(
  options: UseIntersectionOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    if (!hasTriggered || !triggerOnce) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, isInView, hasTriggered };
}

// ============================================
// useReducedMotion - 접근성 훅
// ============================================

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// ============================================
// useStaggerAnimation - 순차 애니메이션 훅
// ============================================

export function useStaggerAnimation(
  itemCount: number,
  staggerDelay: number = 50
) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const startStagger = useCallback(() => {
    setVisibleItems([]);
    setIsComplete(false);

    const showItem = (index: number) => {
      if (index < itemCount) {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
          showItem(index + 1);
        }, staggerDelay);
      } else {
        setIsComplete(true);
      }
    };

    showItem(0);
  }, [itemCount, staggerDelay]);

  const reset = useCallback(() => {
    setVisibleItems([]);
    setIsComplete(false);
  }, []);

  const isVisible = useCallback(
    (index: number) => visibleItems.includes(index),
    [visibleItems]
  );

  const getDelay = useCallback(
    (index: number) => index * staggerDelay,
    [staggerDelay]
  );

  return {
    visibleItems,
    isComplete,
    startStagger,
    reset,
    isVisible,
    getDelay,
  };
}

// ============================================
// useSpring - 스프링 물리 애니메이션 훅
// ============================================

interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export function useSpring(
  targetValue: number,
  config: SpringConfig = {}
) {
  const { stiffness = 170, damping = 26, mass = 1 } = config;

  const [value, setValue] = useState(targetValue);
  const velocity = useRef(0);
  const animationFrame = useRef<number>();

  useEffect(() => {
    let currentValue = value;
    let currentVelocity = velocity.current;

    const animate = () => {
      const springForce = stiffness * (targetValue - currentValue);
      const dampingForce = damping * currentVelocity;
      const acceleration = (springForce - dampingForce) / mass;

      currentVelocity += acceleration * 0.016; // ~60fps
      currentValue += currentVelocity * 0.016;

      if (
        Math.abs(targetValue - currentValue) < 0.01 &&
        Math.abs(currentVelocity) < 0.01
      ) {
        setValue(targetValue);
        velocity.current = 0;
        return;
      }

      setValue(currentValue);
      velocity.current = currentVelocity;
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [targetValue, stiffness, damping, mass]);

  return value;
}

// ============================================
// useParallax - 패럴랙스 스크롤 훅
// ============================================

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const parallaxOffset = (scrollProgress - 0.5) * 100 * speed;

      setOffset(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
}

// ============================================
// useTilt - 3D 틸트 효과 훅
// ============================================

export function useTilt(maxTilt: number = 15) {
  const ref = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setTilt({
        x: y * maxTilt * -1,
        y: x * maxTilt,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return {
    ref,
    tilt,
    style: {
      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      transition: 'transform 0.1s ease-out',
    },
  };
}

// ============================================
// 프리셋 애니메이션 키프레임
// ============================================

export const animationPresets = {
  fadeIn: [
    { opacity: 0 },
    { opacity: 1 },
  ],
  fadeInUp: [
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ],
  fadeInDown: [
    { opacity: 0, transform: 'translateY(-20px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ],
  fadeInLeft: [
    { opacity: 0, transform: 'translateX(-20px)' },
    { opacity: 1, transform: 'translateX(0)' },
  ],
  fadeInRight: [
    { opacity: 0, transform: 'translateX(20px)' },
    { opacity: 1, transform: 'translateX(0)' },
  ],
  scaleIn: [
    { opacity: 0, transform: 'scale(0.8)' },
    { opacity: 1, transform: 'scale(1)' },
  ],
  slideUp: [
    { transform: 'translateY(100%)' },
    { transform: 'translateY(0)' },
  ],
  bounce: [
    { transform: 'translateY(0)' },
    { transform: 'translateY(-30px)' },
    { transform: 'translateY(0)' },
    { transform: 'translateY(-15px)' },
    { transform: 'translateY(0)' },
  ],
  shake: [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)' },
  ],
  pulse: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.05)' },
    { transform: 'scale(1)' },
  ],
  heartbeat: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.3)' },
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' },
  ],
};

export default {
  useAnimation,
  useIntersectionAnimation,
  useReducedMotion,
  useStaggerAnimation,
  useSpring,
  useParallax,
  useTilt,
  animationPresets,
};
