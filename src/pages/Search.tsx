import { useState, useEffect, useRef, useCallback, type FormEvent, type ChangeEvent } from 'react';
import type { Movie, Genre } from '../types';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchMovies, fetchGenres, fetchMoviesWithFilters, SORT_OPTIONS } from '../utils/tmdb';
import { addSearchHistory, getSearchHistory, removeSearchHistoryItem, clearSearchHistory } from '../utils/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faRedo, faTimes, faHistory } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  results: number;
}

function Search() {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // 필터 상태
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity.desc');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 장르 목록 로드
  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const genreList = await fetchGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('장르 로드 실패:', error);
      }
    };
    loadGenres();
    setSearchHistory(getSearchHistory());
    searchInputRef.current?.focus();

    // cleanup debounce timer
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 실제 검색 실행 함수
  const executeSearch = useCallback(async (searchQuery: string): Promise<void> => {
    if (searchQuery.trim().length < 2) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await searchMovies(searchQuery.trim());
      let results = data.results;

      // 클라이언트 필터링
      if (selectedGenre) {
        results = results.filter((movie) => movie.genre_ids?.includes(selectedGenre));
      }
      if (minRating > 0) {
        results = results.filter((movie) => movie.vote_average >= minRating);
      }

      // 정렬
      results = sortMovies(results, sortBy);

      setMovies(results);

      // 검색 기록 저장
      addSearchHistory(searchQuery.trim(), results.length);
      setSearchHistory(getSearchHistory());

      if (results.length === 0) {
        toast('검색 결과가 없습니다.', { icon: '🔍' });
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      toast.error('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre, minRating, sortBy]);

  // Debounced 검색 (입력 시 자동 검색)
  const debouncedSearch = useCallback((searchQuery: string): void => {
    // 기존 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 500ms 후 검색 실행
    debounceTimerRef.current = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        executeSearch(searchQuery);
      }
    }, 500);
  }, [executeSearch]);

  // 입력 변경 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  // 폼 제출 핸들러 (Enter 키)
  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // 기존 debounce 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      toast.error('검색어는 2자 이상 입력해주세요.');
      return;
    }

    await executeSearch(query);
  };

  // 필터로 검색 (검색어 없이)
  const handleFilterSearch = async (): Promise<void> => {
    if (!selectedGenre && minRating === 0) {
      toast.error('최소 하나의 필터를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await fetchMoviesWithFilters({
        genreId: selectedGenre || undefined,
        minRating: minRating > 0 ? minRating : undefined,
        sortBy: sortBy
      });

      setMovies(data.results);

      if (data.results.length === 0) {
        toast('검색 결과가 없습니다.', { icon: '🔍' });
      }
    } catch (error) {
      console.error('필터 검색 중 오류 발생:', error);
      toast.error('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 정렬 함수
  const sortMovies = (movieList: Movie[], sortOption: string): Movie[] => {
    const sorted = [...movieList];
    switch (sortOption) {
      case 'popularity.desc':
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case 'popularity.asc':
        return sorted.sort((a, b) => a.popularity - b.popularity);
      case 'vote_average.desc':
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case 'vote_average.asc':
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      case 'release_date.desc':
        return sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
      case 'release_date.asc':
        return sorted.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
      case 'title.asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
      case 'title.desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title, 'ko'));
      default:
        return sorted;
    }
  };

  // 필터 초기화
  const resetFilters = (): void => {
    setSelectedGenre(null);
    setMinRating(0);
    setSortBy('popularity.desc');
    setQuery('');
    setMovies([]);
    setHasSearched(false);
    toast.success('필터가 초기화되었습니다.');
  };

  // 검색 기록에서 검색
  const searchFromHistory = (historyQuery: string): void => {
    setQuery(historyQuery);
    searchInputRef.current?.focus();
  };

  // 검색 기록 삭제
  const handleRemoveHistory = (historyQuery: string): void => {
    removeSearchHistoryItem(historyQuery);
    setSearchHistory(getSearchHistory());
  };

  // 검색 기록 전체 삭제
  const handleClearHistory = (): void => {
    clearSearchHistory();
    setSearchHistory([]);
    toast.success('검색 기록이 삭제되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />

      <div className="pt-24 px-4 md:px-8 pb-20">
        <h1 className="text-3xl font-bold text-white mb-8">검색</h1>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex max-w-2xl">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="영화 제목을 검색하세요..."
              className="flex-1 px-6 py-4 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
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

        {/* 필터 토글 버튼 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            필터 {showFilters ? '닫기' : '열기'}
          </button>

          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            초기화
          </button>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 장르 필터 */}
              <div>
                <label className="block text-white mb-2 font-semibold">장르</label>
                <select
                  value={selectedGenre || ''}
                  onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">전체 장르</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 평점 필터 */}
              <div>
                <label className="block text-white mb-2 font-semibold">
                  최소 평점: {minRating > 0 ? minRating.toFixed(1) : '전체'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
                <div className="flex justify-between text-gray-400 text-xs mt-1">
                  <span>전체</span>
                  <span>5.0</span>
                  <span>10.0</span>
                </div>
              </div>

              {/* 정렬 */}
              <div>
                <label className="block text-white mb-2 font-semibold">정렬</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 필터로 검색 버튼 */}
            <button
              onClick={handleFilterSearch}
              className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              필터로 검색
            </button>
          </div>
        )}

        {/* 최근 검색어 */}
        {!hasSearched && searchHistory.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                최근 검색어
              </h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                전체 삭제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item) => (
                <div
                  key={item.timestamp}
                  className="flex items-center bg-gray-800 rounded-full px-4 py-2 group"
                >
                  <button
                    onClick={() => searchFromHistory(item.query)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.query}
                  </button>
                  <button
                    onClick={() => handleRemoveHistory(item.query)}
                    className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        {isLoading ? (
          <LoadingSpinner message="검색 중..." />
        ) : hasSearched ? (
          movies.length > 0 ? (
            <>
              <p className="text-gray-400 mb-4">{movies.length}개의 검색 결과</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">검색 결과가 없습니다.</p>
              <p className="text-gray-500 mt-2">다른 검색어 또는 필터를 사용해보세요.</p>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faSearch} className="text-gray-600 text-6xl mb-6" />
            <p className="text-gray-400 text-xl">영화를 검색해보세요!</p>
            <p className="text-gray-500 mt-2">제목 검색 또는 필터를 사용하세요.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Search;
