import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import type { Movie } from '../types';
import { getImageUrl } from '../utils/tmdb';
import { type MouseEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addItem, removeItem } from '../store/wishlistSlice';

interface MovieCardProps {
  movie: Movie;
  onWishlistChange?: () => void;
  index?: number;
}

function MovieCard({ movie, onWishlistChange }: MovieCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === movie.id);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

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

  return (
    <div
      className="movie-card relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 포스터 이미지 */}
      <div className="aspect-[2/3] rounded overflow-hidden bg-gray-800">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 호버 오버레이 */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded flex flex-col justify-end p-3 transition-opacity duration-200"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        {/* 찜하기 버튼 */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          aria-label={isWishlisted ? '위시리스트에서 제거' : '위시리스트에 추가'}
        >
          <FontAwesomeIcon
            icon={isWishlisted ? faHeartSolid : faHeartRegular}
            className={`text-sm ${isWishlisted ? 'text-red-500' : 'text-white'}`}
          />
        </button>

        {/* 영화 정보 */}
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex items-center text-xs text-gray-300 mb-1">
          <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
          <span>{movie.vote_average?.toFixed(1)}</span>
          <span className="mx-1.5">•</span>
          <span>{movie.release_date?.split('-')[0]}</span>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
