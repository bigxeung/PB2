import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { Movie } from '../types';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchMovies } from '../utils/tmdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

function Search(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (query.trim().length < 2) {
      toast.error('검색어는 2자 이상 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await searchMovies(query.trim());
      setMovies(data.results);

      if (data.results.length === 0) {
        toast('검색 결과가 없습니다.', { icon: '' });
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      toast.error('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />

      <div className="pt-24 px-4 md:px-8 pb-20">
        <h1 className="text-3xl font-bold text-white mb-8">검색</h1>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="영화 제목을 검색하세요..."
              className="flex-1 px-6 py-4 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-r-lg transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </form>

        {/* 검색 결과 */}
        {isLoading ? (
          <LoadingSpinner message="검색 중..." />
        ) : hasSearched ? (
          movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">검색 결과가 없습니다.</p>
              <p className="text-gray-500 mt-2">다른 검색어를 입력해보세요.</p>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">영화를 검색해보세요!</p>
            <p className="text-gray-500 mt-2">원하는 영화의 제목을 입력하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
