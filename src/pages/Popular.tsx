import { useState, useEffect } from 'react';
import type { Movie } from '../types';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies } from '../utils/tmdb';

function Popular(): JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const fetchMovies = async (pageNum: number): Promise<void> => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const data = await getPopularMovies(pageNum);

      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }

      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('인기 영화를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = (): void => {
    if (page < totalPages && !isLoadingMore) {
      fetchMovies(page + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="인기 영화를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />

      <div className="pt-24 px-4 md:px-8 pb-20">
        <h1 className="text-3xl font-bold text-white mb-8">대세 콘텐츠</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
        </div>

        {/* 더보기 버튼 */}
        {page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors disabled:opacity-50"
            >
              {isLoadingMore ? '불러오는 중...' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Popular;
