import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, type MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, tryRegister, getRememberedEmail } from '../utils/auth';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store/hooks';
import { setLoggedIn } from '../store/authSlice';

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 폼 상태
  const [isSignupMode, setIsSignupMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(getRememberedEmail());
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(!!getRememberedEmail());
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 애니메이션 상태
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationsPaused, setAnimationsPaused] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const signupEmailRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 초기 포커스
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSignupMode) {
        signupEmailRef.current?.focus();
      } else {
        loginEmailRef.current?.focus();
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [isSignupMode]);

  // 마우스 패럴랙스 효과
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 50;
    const y = (e.clientY - rect.top - rect.height / 2) / 50;
    setMousePosition({ x, y });
  }, []);

  // 로그인 처리
  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isAnimating) return;

    setIsLoading(true);
    try {
      login(email, password, rememberMe);
      dispatch(setLoggedIn({ user: email }));
      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 처리
  const handleSignup = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isAnimating) return;

    if (!agreeTerms) {
      toast.error('이용약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = tryRegister(email, password, passwordConfirm);
      if (result.success) {
        toast.success('회원가입 성공! 로그인해주세요.');
        toggleMode();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 모드 전환 (로그인 <-> 회원가입)
  const toggleMode = (): void => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsSignupMode(prev => !prev);

    // 폼 초기화
    setPassword('');
    setPasswordConfirm('');
    setAgreeTerms(false);

    // 애니메이션 완료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  // 애니메이션 일시정지/재생 토글
  const toggleAnimations = (): void => {
    setAnimationsPaused(prev => !prev);
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape로 애니메이션 토글
      if (e.key === 'Escape') {
        toggleAnimations();
      }
      // Tab + Shift로 모드 전환 (폼 외부에서만)
      if (e.key === 'Tab' && e.shiftKey && !e.target) {
        toggleMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // reduced motion 체크
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f669a234-b392-42f5-b95b-c06fd22e8b76/web/KR-ko-20241125-TRIFECTA-perspective_fc7f6d0c-c297-4b6b-aef5-7c4ae01e839c_large.jpg')`
      }}
      onMouseMove={handleMouseMove}
    >
      {/* 배경 파티클 효과 */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${animationsPaused ? 'animation-paused' : ''}`}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-500/20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: prefersReducedMotion ? 'none' : `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 메인 컨테이너 */}
      <div
        ref={containerRef}
        className={`auth-container relative ${isSignupMode ? 'signup-mode' : ''} ${animationsPaused ? 'animation-paused' : ''}`}
        style={{
          transform: prefersReducedMotion ? 'none' : `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${-mousePosition.x}deg)`,
        }}
      >
        {/* 폼 컨테이너들 */}
        <div className="auth-forms">
          {/* 로그인 폼 */}
          <div className="auth-form-container login-form-container">
            <h1 className="text-3xl font-bold text-white mb-2 fade-in-down">
              다시 오신 것을 환영합니다
            </h1>
            <p className="text-gray-400 mb-8 fade-in-down stagger-1">
              계정에 로그인하여 시작하세요
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="form-group fade-in-up stagger-2">
                <input
                  ref={loginEmailRef}
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder=" "
                  className="form-input"
                  required
                  disabled={isAnimating}
                />
                <label>이메일 주소</label>
              </div>

              <div className="form-group fade-in-up stagger-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder=" "
                  className="form-input"
                  required
                  disabled={isAnimating}
                />
                <label>비밀번호 (TMDB API 키)</label>
              </div>

              <div className="flex items-center justify-between text-sm fade-in-up stagger-4">
                <label className="checkbox-custom">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                    disabled={isAnimating}
                  />
                  <span className="checkmark"></span>
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    로그인 정보 저장
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || isAnimating}
                className="w-full btn-netflix btn-ripple py-4 rounded-lg text-lg font-bold fade-in-up stagger-5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </span>
                ) : (
                  '로그인'
                )}
              </button>
            </form>

            {/* 모바일용 모드 전환 버튼 */}
            <div className="mt-6 text-center md:hidden fade-in-up stagger-6">
              <p className="text-gray-500 text-sm">
                계정이 없으신가요?{' '}
                <button
                  onClick={toggleMode}
                  disabled={isAnimating}
                  className="text-red-500 hover:text-red-400 font-semibold transition-colors"
                >
                  회원가입
                </button>
              </p>
            </div>
          </div>

          {/* 회원가입 폼 */}
          <div className="auth-form-container signup-form-container">
            <h1 className="text-3xl font-bold text-white mb-2">
              새로운 여정을 시작하세요
            </h1>
            <p className="text-gray-400 mb-6">
              간단한 가입으로 무제한 콘텐츠를 즐기세요
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="form-group">
                <input
                  ref={signupEmailRef}
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder=" "
                  className="form-input"
                  required
                  disabled={isAnimating}
                />
                <label>이메일 주소</label>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder=" "
                  className="form-input"
                  required
                  disabled={isAnimating}
                />
                <label>TMDB API 키</label>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}
                  placeholder=" "
                  className="form-input"
                  required
                  disabled={isAnimating}
                />
                <label>API 키 확인</label>
              </div>

              <div className="py-2">
                <label className="checkbox-custom">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreeTerms(e.target.checked)}
                    disabled={isAnimating}
                  />
                  <span className="checkmark"></span>
                  <span className="text-gray-400 text-sm">
                    <span className="text-red-500">[필수]</span> 서비스 이용약관 및 개인정보 처리방침에 동의합니다
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !agreeTerms || isAnimating}
                className="w-full btn-netflix btn-ripple py-4 rounded-lg text-lg font-bold"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </span>
                ) : (
                  '회원가입'
                )}
              </button>
            </form>

            <div className="mt-4 text-gray-500 text-xs">
              <p>※ TMDB API 키가 필요합니다.</p>
              <p>
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline transition-colors"
                >
                  TMDB API 키 발급받기
                </a>
              </p>
            </div>

            {/* 모바일용 모드 전환 버튼 */}
            <div className="mt-4 text-center md:hidden">
              <p className="text-gray-500 text-sm">
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={toggleMode}
                  disabled={isAnimating}
                  className="text-red-500 hover:text-red-400 font-semibold transition-colors"
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* 슬라이딩 오버레이 패널 */}
        <div className="auth-overlay hidden md:block">
          <div className="auth-overlay-panels">
            {/* 왼쪽 패널 - 회원가입 모드일 때 보임 */}
            <div className="auth-overlay-panel">
              <h2>이미 회원이신가요?</h2>
              <p>계정이 있다면 로그인하여 멋진 콘텐츠를 계속 즐기세요</p>
              <button
                onClick={toggleMode}
                disabled={isAnimating}
                className="auth-overlay-btn"
              >
                로그인
              </button>
            </div>

            {/* 오른쪽 패널 - 로그인 모드일 때 보임 */}
            <div className="auth-overlay-panel">
              <h2>처음이신가요?</h2>
              <p>지금 가입하고 무제한 영화와 TV 시리즈를 감상하세요</p>
              <button
                onClick={toggleMode}
                disabled={isAnimating}
                className="auth-overlay-btn"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>

        {/* 애니메이션 컨트롤 버튼 */}
        <button
          onClick={toggleAnimations}
          className="absolute top-4 right-4 text-gray-500 hover:text-white text-xs transition-colors z-20"
          title={animationsPaused ? '애니메이션 재생 (ESC)' : '애니메이션 일시정지 (ESC)'}
        >
          {animationsPaused ? '▶ 재생' : '⏸ 일시정지'}
        </button>
      </div>

      {/* 하단 정보 */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600 text-xs">
        <p>© 2024 Netflix Clone. Educational Project Only.</p>
      </div>
    </div>
  );
}

export default SignIn;
