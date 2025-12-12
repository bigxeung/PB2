import { useState, useEffect, useRef, useCallback } from 'react';
import type { Movie } from '../types';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies, getNowPlayingMovies, getTopRatedMovies, getUpcomingMovies } from '../utils/tmdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faInfoCircle, faChevronLeft, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useReducedMotion } from '../hooks/useAnimation';

// 섹션 컴포넌트 (스크롤 애니메이션 포함)
interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isVisible: boolean;
  index: number;
}

function MovieSection({ title, movies, isVisible, index }: MovieSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : prefersReducedMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{
        transitionDelay: prefersReducedMotion ? '0ms' : `${index * 100}ms`,
      }}
    >
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3 group">
        <span className="hover-underline cursor-pointer">{title}</span>
        <span className="text-red-600 text-sm font-normal opacity-0 group-hover:opacity-100 transition-opacity">
          모두 보기 &rarr;
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.slice(0, 12).map((movie, movieIndex) => (
          <div
            key={movie.id}
            className={`transition-all duration-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : prefersReducedMotion
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5'
            }`}
            style={{
              transitionDelay: prefersReducedMotion ? '0ms' : `${index * 100 + movieIndex * 50}ms`,
            }}
          >
            <MovieCard movie={movie} index={movieIndex} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);

  // 스크롤 관련 상태
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [heroScrollProgress, setHeroScrollProgress] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  // Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 히어로 후보 영화들 (배경 이미지가 있는 인기 영화 5개)
  const heroMovies = popularMovies.filter(m => m.backdrop_path).slice(0, 5);

  useEffect(() => {
    async function fetchMovies(): Promise<void> {
      try {
        // 4개 API 동시 호출
        const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
          getPopularMovies(),
          getNowPlayingMovies(),
          getTopRatedMovies(),
          getUpcomingMovies()
        ]);

        setPopularMovies(popular.results);
        setNowPlayingMovies(nowPlaying.results);
        setTopRatedMovies(topRated.results);
        setUpcomingMovies(upcoming.results);

        // 랜덤 피처드 영화 선택
        if (popular.results.length > 0) {
          const validMovies = popular.results.filter(m => m.backdrop_path);
          const randomIndex = Math.floor(Math.random() * Math.min(5, validMovies.length));
          setFeaturedMovie(validMovies[randomIndex]);
          setFeaturedIndex(randomIndex);
        }
      } catch (error) {
        console.error('영화 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // 히어로 배너 자동 전환 (8초마다)
  useEffect(() => {
    if (heroMovies.length === 0) return;

    const interval = setInterval(() => {
      setFeaturedIndex((prev) => {
        const nextIndex = (prev + 1) % heroMovies.length;
        setFeaturedMovie(heroMovies[nextIndex]);
        return nextIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [heroMovies.length]);

  // 히어로 배너 수동 전환
  const goToPrevHero = (): void => {
    const prevIndex = featuredIndex === 0 ? heroMovies.length - 1 : featuredIndex - 1;
    setFeaturedIndex(prevIndex);
    setFeaturedMovie(heroMovies[prevIndex]);
  };

  const goToNextHero = (): void => {
    const nextIndex = (featuredIndex + 1) % heroMovies.length;
    setFeaturedIndex(nextIndex);
    setFeaturedMovie(heroMovies[nextIndex]);
  };

  const goToHeroIndex = (index: number): void => {
    setFeaturedIndex(index);
    setFeaturedMovie(heroMovies[index]);
  };

  // 스크롤 기반 패럴랙스 및 섹션 가시성
  const handleScroll = useCallback(() => {
    if (!heroRef.current) return;

    const scrollY = window.scrollY;
    const heroHeight = heroRef.current.offsetHeight;

    // 히어로 패럴랙스 진행도 (0 ~ 1)
    const progress = Math.min(scrollY / heroHeight, 1);
    setHeroScrollProgress(progress);

    // 섹션 가시성 체크
    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;

      if (isVisible) {
        setVisibleSections(prev => new Set([...prev, index]));
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // 초기 로드 시 한번 실행
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isLoading]);

  // 스크롤 다운 핸들러
  const scrollToContent = () => {
    const contentTop = heroRef.current?.offsetHeight || 0;
    window.scrollTo({
      top: contentTop - 100,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <LoadingSpinner size="lg" message="콘텐츠를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />

      {/* 히어로 섹션 */}
      {featuredMovie && (
        <div
          ref={heroRef}
          className="relative h-[85vh] bg-cover bg-center overflow-hidden gpu-accelerated"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.4) 50%, rgba(20,20,20,0.95) 100%),
              url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
            backgroundPositionY: prefersReducedMotion ? 'center' : `${heroScrollProgress * 30}%`,
            transform: prefersReducedMotion ? 'none' : `scale(${1 + heroScrollProgress * 0.1})`,
            transition: 'background-image 1s ease-in-out',
          }}
        >
          {/* 좌우 네비게이션 버튼 */}
          <button
            onClick={goToPrevHero}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all z-20 opacity-0 hover:opacity-100 group-hover:opacity-100"
            style={{ opacity: 0.7 }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={goToNextHero}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all z-20 opacity-0 hover:opacity-100"
            style={{ opacity: 0.7 }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          {/* 히어로 콘텐츠 */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fadeIn">
              {featuredMovie.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-300 mb-4">
              <span className="text-green-500 font-semibold">
                {Math.round(featuredMovie.vote_average * 10)}% 일치
              </span>
              <span>{featuredMovie.release_date?.split('-')[0]}</span>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl line-clamp-3 mb-6 animate-fadeIn">
              {featuredMovie.overview || '줄거리 정보가 없습니다.'}
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faPlay} />
                재생
              </button>
              <button className="px-8 py-3 bg-gray-600/70 text-white font-bold rounded hover:bg-gray-600 transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} />
                상세 정보
              </button>
            </div>

            {/* 인디케이터 점 */}
            <div className="flex gap-2">
              {heroMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToHeroIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === featuredIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/80 w-3'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 스크롤 다운 인디케이터 */}
          <button
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-all scroll-indicator z-20"
            aria-label="콘텐츠로 스크롤"
          >
            <FontAwesomeIcon icon={faChevronDown} className="text-3xl" />
          </button>

          {/* 히어로 오버레이 (스크롤 시 페이드) */}
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: prefersReducedMotion ? 0 : heroScrollProgress * 0.5 }}
          />
        </div>
      )}

      {/* 영화 목록 섹션 */}
      <div className="px-4 md:px-8 -mt-20 relative z-10 space-y-12 pb-20">
        {/* 섹션들 - 스크롤 애니메이션 적용 */}
        {[
          { title: '인기 영화', movies: popularMovies },
          { title: '현재 상영중', movies: nowPlayingMovies },
          { title: '높은 평점', movies: topRatedMovies },
          { title: '개봉 예정', movies: upcomingMovies },
        ].map((section, index) => (
          <div
            key={section.title}
            ref={(el) => { sectionsRef.current[index] = el; }}
          >
            <MovieSection
              title={section.title}
              movies={section.movies}
              isVisible={visibleSections.has(index)}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* 맨 위로 스크롤 버튼 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg
          flex items-center justify-center transition-all duration-300 hover:bg-red-700 hover:scale-110 z-50
          ${heroScrollProgress > 0.3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="맨 위로"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}

export default Home;
