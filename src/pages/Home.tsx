import { useState, useEffect, useRef } from 'react';
import type { Movie } from '../types';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies, getNowPlayingMovies, getTopRatedMovies, getUpcomingMovies } from '../utils/tmdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faInfoCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);

  // 히어로 배너용 ref
  const heroRef = useRef<HTMLDivElement>(null);

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
          className="relative h-[85vh] bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.4) 50%, rgba(20,20,20,0.95) 100%),
              url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
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
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === featuredIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 영화 목록 섹션 */}
      <div className="px-4 md:px-8 -mt-20 relative z-10 space-y-12 pb-20">
        {/* 인기 영화 */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">인기 영화</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* 현재 상영중 */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">현재 상영중</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {nowPlayingMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* 높은 평점 */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">높은 평점</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topRatedMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* 개봉 예정 (4번째 API) */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">개봉 예정</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {upcomingMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>

      {/* 애니메이션 CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
