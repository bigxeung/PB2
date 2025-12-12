import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faSignOutAlt, faBars, faTimes, faHome, faFire } from '@fortawesome/free-solid-svg-icons';
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
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  // 스크롤 관련 상태
  const [scrollY, setScrollY] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const lastScrollY = useRef<number>(0);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((): void => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);

    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleLogout = (): void => {
    logout();
    dispatch(setLoggedOut());
    toast.success('로그아웃되었습니다.');
    navigate('/signin');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  // 스크롤에 따른 배경 투명도 계산
  const backgroundOpacity = Math.min(scrollY / 100, 1);

  // 네비게이션 링크 데이터
  const navLinks = [
    { path: '/', label: '홈', icon: faHome },
    { path: '/popular', label: '대세 콘텐츠', icon: faFire },
    { path: '/search', label: '검색', icon: faSearch },
    { path: '/wishlist', label: '내가 찜한 리스트', icon: faHeart, badge: wishlistCount },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `rgba(20, 20, 20, ${backgroundOpacity})`,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        backdropFilter: backgroundOpacity > 0.3 ? 'blur(10px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="text-red-600 text-2xl font-bold hover:text-red-500 transition-colors">
          NETFLIX
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-sm rounded transition-colors ${
                isActive(link.path)
                  ? 'text-white font-semibold bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={link.icon}
                  className={isActive(link.path) ? 'text-red-500' : ''}
                />
                <span>{link.label}</span>
              </span>
              {/* 위시리스트 배지 */}
              {link.badge && link.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* 사용자 메뉴 */}
        <div className="flex items-center gap-3">
          {/* 사용자 프로필 */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-sm">
              {user?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-400 max-w-[100px] truncate">
              {user}
            </span>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-9 h-9 text-gray-300 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            title="로그아웃"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>

          {/* 모바일 메뉴 토글 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-lg" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 text-sm py-3 px-4 rounded-lg my-0.5 transition-colors ${
                  isActive(link.path)
                    ? 'text-white font-semibold bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FontAwesomeIcon
                  icon={link.icon}
                  className={`w-5 ${isActive(link.path) ? 'text-red-500' : ''}`}
                />
                <span>{link.label}</span>
                {link.badge && link.badge > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* 모바일 사용자 정보 */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold">
                  {user?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-300">{user}</span>
              </div>
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="text-red-500 text-sm font-semibold hover:text-red-400 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
