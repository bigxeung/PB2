import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { logout, getCurrentUser } from '../utils/auth';
import toast from 'react-hot-toast';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = (): void => {
    logout();
    toast.success('로그아웃되었습니다.');
    navigate('/signin');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="text-red-600 text-2xl font-bold">
          NETFLIX
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm transition-colors ${
              isActive('/') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            홈
          </Link>
          <Link
            to="/popular"
            className={`text-sm transition-colors ${
              isActive('/popular') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            대세 콘텐츠
          </Link>
          <Link
            to="/search"
            className={`text-sm transition-colors ${
              isActive('/search') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faSearch} className="mr-1" />
            검색
          </Link>
          <Link
            to="/wishlist"
            className={`text-sm transition-colors ${
              isActive('/wishlist') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-1" />
            내가 찜한 리스트
          </Link>
        </nav>

        {/* 사용자 메뉴 */}
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
        </div>
      </div>
    </header>
  );
}

export default Header;
