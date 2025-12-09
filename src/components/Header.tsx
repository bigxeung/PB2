import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../utils/auth';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setLoggedOut } from '../store/authSlice';
import toast from 'react-hot-toast';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux에서 사용자 정보 가져오기
  const user = useAppSelector((state) => state.auth.currentUser);

  // 스크롤 관련 상태
  const [scrollY, setScrollY] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const lastScrollY = useRef<number>(0);
  const headerRef = useRef<HTMLElement>(null);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;

      // 스크롤 위치 저장
      setScrollY(currentScrollY);

      // 스크롤 방향에 따른 헤더 표시/숨김
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // 아래로 스크롤 - 헤더 숨김
        setIsVisible(false);
      } else {
        // 위로 스크롤 - 헤더 표시
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (): void => {
    logout();
    dispatch(setLoggedOut());
    toast.success('로그아웃되었습니다.');
    navigate('/signin');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  // 스크롤에 따른 배경 투명도 계산 (0~100 스크롤에서 0~1로 변환)
  const backgroundOpacity = Math.min(scrollY / 100, 1);

  // 헤더 변환 스타일
  const headerStyle = {
    backgroundColor: `rgba(20, 20, 20, ${backgroundOpacity})`,
    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
    backdropFilter: backgroundOpacity > 0.5 ? 'blur(10px)' : 'none',
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={headerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* 로고 */}
        <Link
          to="/"
          className="text-red-600 text-2xl font-bold hover:text-red-500 transition-colors"
        >
          NETFLIX
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm transition-colors duration-200 ${
              isActive('/') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            홈
          </Link>
          <Link
            to="/popular"
            className={`text-sm transition-colors duration-200 ${
              isActive('/popular') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            대세 콘텐츠
          </Link>
          <Link
            to="/search"
            className={`text-sm transition-colors duration-200 ${
              isActive('/search') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faSearch} className="mr-1" />
            검색
          </Link>
          <Link
            to="/wishlist"
            className={`text-sm transition-colors duration-200 ${
              isActive('/wishlist') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-1" />
            내가 찜한 리스트
          </Link>
        </nav>

        {/* 사용자 메뉴 + 모바일 메뉴 버튼 */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 hidden sm:block">
            {user}
          </span>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white transition-colors"
            title="로그아웃"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>

          {/* 모바일 메뉴 토글 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-black/95 backdrop-blur-md animate-slideDown"
          style={{ animation: 'slideDown 0.3s ease-out' }}
        >
          <nav className="flex flex-col px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-2 transition-colors ${
                isActive('/') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              홈
            </Link>
            <Link
              to="/popular"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-2 transition-colors ${
                isActive('/popular') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              대세 콘텐츠
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-2 transition-colors ${
                isActive('/search') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              검색
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-2 transition-colors ${
                isActive('/wishlist') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              내가 찜한 리스트
            </Link>
          </nav>
        </div>
      )}

      {/* 애니메이션 CSS */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
