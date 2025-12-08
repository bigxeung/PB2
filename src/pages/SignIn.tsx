import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getRememberedEmail } from '../utils/auth';
import toast from 'react-hot-toast';

function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(getRememberedEmail());
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(!!getRememberedEmail());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      login(email, password, rememberMe);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f669a234-b392-42f5-b95b-c06fd22e8b76/web/KR-ko-20241125-TRIFECTA-perspective_fc7f6d0c-c297-4b6b-aef5-7c4ae01e839c_large.jpg')`
      }}
    >
      <div className="bg-black/75 p-16 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-8">로그인</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="w-full px-4 py-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-4 py-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <div className="flex items-center justify-between text-gray-400 text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              로그인 정보 저장
            </label>
          </div>
        </form>

        <div className="mt-8 text-gray-500 text-sm">
          <p>Netflix 회원이 아닌가요? <span className="text-white cursor-pointer hover:underline">지금 가입하세요.</span></p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
