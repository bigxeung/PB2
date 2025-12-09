import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, tryRegister, getRememberedEmail } from '../utils/auth';
import toast from 'react-hot-toast';

function SignIn() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(getRememberedEmail());
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(!!getRememberedEmail());
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, [isLoginMode]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        login(email, password, rememberMe);
        toast.success('로그인 성공!');
        navigate('/');
      } else {
        if (!agreeTerms) {
          toast.error('이용약관에 동의해주세요.');
          setIsLoading(false);
          return;
        }
        const result = tryRegister(email, password, passwordConfirm);
        if (result.success) {
          toast.success('회원가입 성공! 로그인해주세요.');
          toggleMode();
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (): void => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsLoginMode(!isLoginMode);
      setPassword('');
      setPasswordConfirm('');
      setAgreeTerms(false);
    }, 300);
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f669a234-b392-42f5-b95b-c06fd22e8b76/web/KR-ko-20241125-TRIFECTA-perspective_fc7f6d0c-c297-4b6b-aef5-7c4ae01e839c_large.jpg')`
      }}
    >
      {/* 카드 플립 컨테이너 */}
      <div className="perspective-1000">
        <div
          ref={cardRef}
          className={`relative w-full max-w-md transition-transform duration-600 transform-style-3d ${
            isFlipping ? (isLoginMode ? 'rotate-y-180' : 'rotate-y-0') : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s ease-in-out',
            transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* 앞면 - 로그인 / 뒷면 - 회원가입 */}
          <div
            className="bg-black/75 p-8 sm:p-12 md:p-16 rounded-lg w-full"
            style={{
              backfaceVisibility: 'hidden'
            }}
          >
            <h1 className="text-3xl font-bold text-white mb-8">
              {isLoginMode ? '로그인' : '회원가입'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  className="w-full px-4 py-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder={isLoginMode ? "비밀번호 (TMDB API 키)" : "TMDB API 키 (비밀번호로 사용)"}
                  className="w-full px-4 py-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  required
                />
              </div>

              {!isLoginMode && (
                <>
                  <div className="animate-fadeIn">
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}
                      placeholder="TMDB API 키 확인"
                      className="w-full px-4 py-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                      required
                    />
                  </div>

                  {/* 약관 동의 */}
                  <div className="animate-fadeIn">
                    <label className="flex items-start cursor-pointer text-gray-400 text-sm">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreeTerms(e.target.checked)}
                        className="mt-1 mr-3 w-4 h-4 accent-red-600"
                      />
                      <span>
                        <span className="text-red-500">[필수]</span> 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                        <a href="#" className="text-blue-400 hover:underline ml-1" onClick={(e) => e.preventDefault()}>
                          약관 보기
                        </a>
                      </span>
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading || (!isLoginMode && !agreeTerms)}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading
                  ? (isLoginMode ? '로그인 중...' : '가입 중...')
                  : (isLoginMode ? '로그인' : '회원가입')
                }
              </button>

              {isLoginMode && (
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <label className="flex items-center cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                      className="mr-2 accent-red-600"
                    />
                    로그인 정보 저장
                  </label>
                </div>
              )}
            </form>

            <div className="mt-8 text-gray-500 text-sm">
              {isLoginMode ? (
                <p>
                  Netflix 회원이 아닌가요?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-white hover:underline font-semibold transition-colors"
                  >
                    지금 가입하세요.
                  </button>
                </p>
              ) : (
                <p>
                  이미 회원이신가요?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-white hover:underline font-semibold transition-colors"
                  >
                    로그인하세요.
                  </button>
                </p>
              )}
            </div>

            {!isLoginMode && (
              <div className="mt-4 text-gray-500 text-xs animate-fadeIn">
                <p>※ TMDB API 키가 필요합니다.</p>
                <p>
                  <a
                    href="https://www.themoviedb.org/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    TMDB API 키 발급받기
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 커스텀 CSS */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        .duration-600 {
          transition-duration: 600ms;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default SignIn;
