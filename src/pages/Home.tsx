import { useState, useEffect } from 'react';
import type { Movie } from '../types';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies, getNowPlayingMovies, getTopRatedMovies } from '../utils/tmdb';

function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchMovies(): Promise<void> {
      try {
        const [popular, nowPlaying, topRated] = await Promise.all([
          getPopularMovies(),
          getNowPlayingMovies(),
          getTopRatedMovies()
        ]);

        setPopularMovies(popular.results);
        setNowPlayingMovies(nowPlaying.results);
        setTopRatedMovies(topRated.results);

        // 랜덤 피처드 영화 선택
        if (popular.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, popular.results.length));
          setFeaturedMovie(popular.results[randomIndex]);
        }
      } catch (error) {
        console.error('영화 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          className="relative h-[80vh] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.9) 0%, rgba(20,20,20,0.5) 50%, rgba(20,20,20,0.9) 100%),
              url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 bg-gradient-to-t from-[#141414]">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {featuredMovie.title}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl line-clamp-3 mb-6">
              {featuredMovie.overview}
            </p>
            <div className="flex space-x-4">
              <button className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                재생
              </button>
              <button className="px-8 py-3 bg-gray-600/70 text-white font-bold rounded hover:bg-gray-600 transition-colors">
                상세 정보
              </button>
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
      </div>
    </div>
  );
}

export default Home;
