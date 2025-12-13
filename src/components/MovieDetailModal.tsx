import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlay, faStar, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import type { Movie } from '../types';
import { getImageUrl } from '../utils/tmdb';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addItem, removeItem } from '../store/wishlistSlice';
import toast from 'react-hot-toast';

interface MovieDetailModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

function MovieDetailModal({ movie, isOpen, onClose }: MovieDetailModalProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === movie.id);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleWishlistToggle = () => {
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
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#181818] rounded-lg overflow-hidden shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#181818] rounded-full flex items-center justify-center text-white hover:bg-[#282828] transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* 배경 이미지 */}
        <div className="relative h-[300px] md:h-[400px]">
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="h-full object-contain"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

          {/* 제목 및 버튼 */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {movie.title}
            </h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-2.5 bg-white text-black font-bold rounded flex items-center gap-2 hover:bg-gray-200 transition-colors">
                <FontAwesomeIcon icon={faPlay} />
                재생
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-2.5 rounded font-bold flex items-center gap-2 transition-colors ${
                  isWishlisted
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-600/70 text-white hover:bg-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={isWishlisted ? faHeartSolid : faHeartRegular} />
                {isWishlisted ? '찜 해제' : '내가 찜한 리스트'}
              </button>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-400px)]">
          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <span className="text-green-500 font-semibold">
              {Math.round(movie.vote_average * 10)}% 일치
            </span>
            <span className="text-gray-400">
              {movie.release_date?.split('-')[0]}
            </span>
            <span className="flex items-center gap-1 text-yellow-500">
              <FontAwesomeIcon icon={faStar} />
              {movie.vote_average?.toFixed(1)}
            </span>
          </div>

          {/* 줄거리 */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">줄거리</h3>
            <p className="text-gray-300 leading-relaxed">
              {movie.overview || '줄거리 정보가 없습니다.'}
            </p>
          </div>

          {/* 추가 정보 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">원제: </span>
              <span className="text-gray-300">{movie.original_title}</span>
            </div>
            <div>
              <span className="text-gray-500">원어: </span>
              <span className="text-gray-300">{movie.original_language?.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-500">인기도: </span>
              <span className="text-gray-300">{movie.popularity?.toFixed(0)}</span>
            </div>
            <div>
              <span className="text-gray-500">투표 수: </span>
              <span className="text-gray-300">{movie.vote_count?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailModal;
