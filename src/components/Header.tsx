import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faSignOutAlt, faBars, faTimes, faHome, faFire, faBell } from '@fortawesome/free-solid-svg-icons';
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
  const [mobileMenuClosing, setMobileMenuClosing] = useState<boolean>(false);

  // 호버 상태
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [logoutHovered, setLogoutHovered] = useState<boolean>(false);

  const lastScrollY = useRef<number>(0);
  const headerRef = useRef<HTMLElement>(null);

  // 스크롤 이벤트 핸들러 (throttle 적용)
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
    let ticking = false;

    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [handleScroll]);

  // 모바일 메뉴 닫기 (애니메이션 포함)
  const closeMobileMenu = useCallback(() => {
    setMobileMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 200);
  }, []);

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      setMobileMenuOpen(true);
    }
  };

  const handleLogout = (): void => {
    logout();
    dispatch(setLoggedOut());
    toast.success('로그아웃되었습니다.');
    navigate('/signin');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  // 스크롤에 따른 배경 투명도 계산
  const backgroundOpacity = Math.min(scrollY / 100, 1);

  // 헤더 변환 스타일
  const headerStyle = {
    backgroundColor: `rgba(20, 20, 20, ${backgroundOpacity})`,
    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.3s ease-in-out, backdrop-filter 0.3s ease',
    backdropFilter: backgroundOpacity > 0.3 ? `blur(${backgroundOpacity * 10}px)` : 'none',
    boxShadow: backgroundOpacity > 0.5 ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
  };

  // 네비게이션 링크 데이터
  const navLinks = [
    { path: '/', label: '홈', icon: faHome },
    { path: '/popular', label: '대세 콘텐츠', icon: faFire },
    { path: '/search', label: '검색', icon: faSearch },
    { path: '/wishlist', label: '내가 찜한 리스트', icon: faHeart, badge: wishlistCount },
  ];

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 gpu-accelerated"
      style={headerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* 로고 - 애니메이션 추가 */}
        <Link
          to="/"
          className="text-red-600 text-2xl font-bold relative group"
        >
          <span className="relative z-10 transition-all duration-300 group-hover:text-red-500">
            NETFLIX
          </span>
          <span
            className="absolute inset-0 bg-red-600/20 rounded blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ transform: 'scale(1.5)' }}
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link relative px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-white font-semibold bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              onMouseEnter={() => setHoveredLink(link.path)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                transform: hoveredLink === link.path && !isActive(link.path)
                  ? 'translateY(-2px)'
                  : 'translateY(0)',
                transitionDelay: `${index * 30}ms`,
              }}
            >
              <span className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={link.icon}
                  className={`nav-icon transition-all duration-300 ${
                    isActive(link.path) ? 'text-red-500' : ''
                  }`}
                  style={{
                    transform: hoveredLink === link.path ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)',
                  }}
                />
                <span>{link.label}</span>
                {/* 위시리스트 배지 */}
                {link.badge && link.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {link.badge > 99 ? '99+' : link.badge}
                  </span>
                )}
              </span>

              {/* 활성 표시 언더라인 */}
              <span
                className={`absolute bottom-0 left-1/2 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${
                  isActive(link.path) ? 'w-8 -translate-x-1/2' : 'w-0 -translate-x-1/2'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* 사용자 메뉴 + 모바일 메뉴 버튼 */}
        <div className="flex items-center space-x-3">
          {/* 알림 버튼 */}
          <button
            className="hidden sm:flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-full"
            title="알림"
          >
            <FontAwesomeIcon icon={faBell} className="nav-icon" />
          </button>

          {/* 사용자 프로필 */}
          <div className="hidden sm:flex items-center gap-3">
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
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
            className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-red-500 transition-all duration-300 hover:bg-red-500/10 rounded-full"
            title="로그아웃"
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="transition-transform duration-300"
              style={{
                transform: logoutHovered ? 'translateX(3px)' : 'translateX(0)',
              }}
            />
          </button>

          {/* 모바일 메뉴 토글 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-full"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faTimes : faBars}
              className="text-xl transition-transform duration-300"
              style={{
                transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 ${
            mobileMenuClosing ? 'mobile-menu-exit' : 'mobile-menu-enter'
          }`}
        >
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 text-sm py-3 px-4 rounded-lg my-1 transition-all duration-300 fade-in-right ${
                  isActive(link.path)
                    ? 'text-white font-semibold bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both',
                }}
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
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between px-4 fade-in-up stagger-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold">
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
