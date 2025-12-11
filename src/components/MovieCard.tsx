import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar, faPlay, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import type { Movie } from '../types';
import { getImageUrl } from '../utils/tmdb';
import { type MouseEvent, useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addItem, removeItem } from '../store/wishlistSlice';

interface MovieCardProps {
  movie: Movie;
  onWishlistChange?: () => void;
  index?: number;
}

function MovieCard({ movie, onWishlistChange, index = 0 }: MovieCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === movie.id);

  // 애니메이션 상태
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 마우스 위치 추적 (틸트 효과용)
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x: x * 10, y: y * -10 });
  }, []);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    // 하트 애니메이션 트리거
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 500);

    if (isWishlisted) {
      dispatch(removeItem(movie.id));
      toast.success('위시리스트에서 제거되었습니다.');
    } else {
      dispatch(addItem({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
        addedAt: new Date().toISOString(),
      }));
      toast.success('위시리스트에 추가되었습니다.');
    }

    if (onWishlistChange) {
      onWishlistChange();
    }
  };

  // 평점에 따른 색상
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div
      ref={cardRef}
      className="movie-card relative group gpu-accelerated"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale(1.05)`
          : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* 포스터 이미지 */}
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 relative">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          loading="lazy"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />

        {/* 그라데이션 오버레이 */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        />
      </div>

      {/* 호버 오버레이 */}
      <div
        className="absolute inset-0 rounded-lg flex flex-col justify-end p-4 transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        {/* 상단 버튼 영역 */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* 찜하기 버튼 */}
          <button
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center
              transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95
              ${heartAnimating ? 'heart-icon active' : 'heart-icon'}`}
            aria-label={isWishlisted ? '위시리스트에서 제거' : '위시리스트에 추가'}
          >
            <FontAwesomeIcon
              icon={isWishlisted ? faHeartSolid : faHeartRegular}
              className={`text-lg transition-all duration-300 ${
                isWishlisted ? 'text-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* 하단 정보 영역 */}
        <div
          className="card-info"
          style={{
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease',
          }}
        >
          {/* 액션 버튼들 */}
          <div className="flex gap-2 mb-3">
            <button
              className="flex-1 py-2 bg-white text-black rounded-md font-semibold text-sm
                flex items-center justify-center gap-2 transition-all duration-200
                hover:bg-gray-200 active:scale-95"
            >
              <FontAwesomeIcon icon={faPlay} />
              <span>재생</span>
            </button>
            <button
              className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center
                transition-all duration-200 hover:border-white hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faInfoCircle} className="text-white" />
            </button>
          </div>

          {/* 영화 제목 */}
          <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 drop-shadow-lg">
            {movie.title}
          </h3>

          {/* 메타 정보 */}
          <div className="flex items-center flex-wrap gap-2 text-xs mb-2">
            <span className={`font-bold ${getRatingColor(movie.vote_average)}`}>
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300 font-medium">
              {movie.release_date?.split('-')[0]}
            </span>
          </div>

          {/* 줄거리 */}
          <p
            className="text-xs text-gray-300 line-clamp-2 leading-relaxed"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease 0.1s',
            }}
          >
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>
      </div>

      {/* 호버 시 글로우 효과 */}
      <div
        className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 blur-xl transition-opacity duration-500 -z-10"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </div>
  );
}

export default MovieCard;
