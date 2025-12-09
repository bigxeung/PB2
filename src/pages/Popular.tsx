import { useState, useEffect, useRef, useCallback } from 'react';
import type { Movie } from '../types';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies } from '../utils/tmdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faList, faArrowUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

type ViewMode = 'infinite' | 'table';

function Popular() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('infinite');
  const [showTopButton, setShowTopButton] = useState<boolean>(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 무한스크롤용 데이터 로드
  const fetchMoviesInfinite = useCallback(async (pageNum: number): Promise<void> => {
    if (isLoadingMore) return;

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
  }, [isLoadingMore]);

  // Table View용 데이터 로드
  const fetchMoviesTable = async (pageNum: number): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await getPopularMovies(pageNum);
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('인기 영화를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    if (viewMode === 'infinite') {
      fetchMoviesInfinite(1);
    } else {
      fetchMoviesTable(1);
    }
  }, [viewMode]);

  // 무한스크롤 Intersection Observer
  useEffect(() => {
    if (viewMode !== 'infinite') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && page < totalPages) {
          fetchMoviesInfinite(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [viewMode, page, totalPages, isLoadingMore, fetchMoviesInfinite]);

  // 스크롤 감지 (Top 버튼)
  useEffect(() => {
    const handleScroll = (): void => {
      setShowTopButton(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Top 버튼 클릭
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 뷰 모드 변경
  const handleViewModeChange = (mode: ViewMode): void => {
    setViewMode(mode);
    setPage(1);
    setMovies([]);
    window.scrollTo({ top: 0 });
  };

  // 페이지네이션
  const goToPage = (pageNum: number): void => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchMoviesTable(pageNum);
      window.scrollTo({ top: 0 });
    }
  };

  // 페이지 번호 생성
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (isLoading && movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="인기 영화를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#141414] ${viewMode === 'table' ? 'overflow-hidden' : ''}`}
    >
      <Header />

      <div className="pt-24 px-4 md:px-8 pb-20">
        {/* 헤더 영역 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">대세 콘텐츠</h1>

          {/* 뷰 모드 토글 */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('infinite')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'infinite'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faThLarge} className="mr-2" />
              무한 스크롤
            </button>
            <button
              onClick={() => handleViewModeChange('table')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faList} className="mr-2" />
              테이블 뷰
            </button>
          </div>
        </div>

        {/* 영화 그리드 */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${
            viewMode === 'table' ? 'max-h-[calc(100vh-280px)] overflow-hidden' : ''
          }`}
        >
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
        </div>

        {/* 무한스크롤 로딩 인디케이터 */}
        {viewMode === 'infinite' && (
          <>
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
              {isLoadingMore && (
                <LoadingSpinner size="md" message="더 불러오는 중..." />
              )}
            </div>

            {page >= totalPages && movies.length > 0 && (
              <p className="text-center text-gray-500 py-8">
                모든 콘텐츠를 불러왔습니다.
              </p>
            )}
          </>
        )}

        {/* 테이블 뷰 페이지네이션 */}
        {viewMode === 'table' && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-4 py-2 rounded transition-colors ${
                  page === pageNum
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>

            <span className="text-gray-400 ml-4">
              {page} / {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Top 버튼 */}
      {viewMode === 'infinite' && showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
          title="맨 위로"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </div>
  );
}

export default Popular;
