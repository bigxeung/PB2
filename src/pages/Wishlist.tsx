import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { clearWishlist } from '../utils/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faHeart } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearAll } from '../store/wishlistSlice';

function Wishlist() {
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.wishlist.items);

  const handleClearAll = (): void => {
    if (movies.length === 0) return;

    if (window.confirm('정말 모든 항목을 삭제하시겠습니까?')) {
      clearWishlist();
      dispatch(clearAll());
      toast.success('위시리스트가 비워졌습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />

      <div className="pt-24 px-4 md:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-3" />
            내가 찜한 리스트
          </h1>

          {movies.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              전체 삭제
            </button>
          )}
        </div>

        {movies.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">{movies.length}개의 콘텐츠</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    backdrop_path: null,
                    vote_count: 0,
                    popularity: 0,
                    adult: false,
                    original_language: 'ko',
                    original_title: movie.title,
                    video: false,
                    release_date: movie.release_date || '',
                    overview: movie.overview || ''
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faHeart} className="text-gray-600 text-6xl mb-6" />
            <p className="text-gray-400 text-xl">찜한 콘텐츠가 없습니다.</p>
            <p className="text-gray-500 mt-2">마음에 드는 영화를 찜해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
