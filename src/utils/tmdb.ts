// TMDB API 유틸리티 + 완벽한 캐싱 시스템

import axios, { AxiosError } from 'axios';
import type { MovieResponse, MovieDetails, Genre, VideoResults, Credits, MovieFilters, SortOption } from '../types';
import { getApiKey } from './auth';
import { setCacheItem, getCacheItem, STORAGE_KEYS } from './storage';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API 키 가져오기 (에러 핸들링)
const getKey = (): string => {
  try {
    return getApiKey();
  } catch (error) {
    console.error('API 키 없음:', error);
    throw new Error('로그인이 필요합니다.');
  }
};

// 공통 파라미터
const getCommonParams = (page: number = 1): Record<string, string | number> => ({
  api_key: getKey(),
  language: 'ko-KR',
  page: page
});

// ========== 필수 4개 API ==========

// 1. 인기 영화 (캐싱 1시간)
export const fetchPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  const cacheKey = `netflix_popularCache_${page}`;
  const cacheDuration = 60 * 60 * 1000; // 1시간

  // 캐시 확인
  const cached = getCacheItem<MovieResponse>(cacheKey, cacheDuration);
  if (cached) {
    console.log(`인기 영화 페이지 ${page} 캐시 사용`);
    return cached;
  }

  // API 호출
  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/movie/popular`, {
      params: getCommonParams(page)
    });

    // 캐시 저장
    setCacheItem(cacheKey, response.data, cacheDuration);

    return response.data;
  } catch (error) {
    console.error('인기 영화 로드 실패:', error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error('API 키가 유효하지 않습니다. 다시 로그인해주세요.');
    }
    throw error;
  }
};

// 2. 현재 상영작 (캐싱 1시간)
export const fetchNowPlaying = async (page: number = 1): Promise<MovieResponse> => {
  const cacheKey = `netflix_nowPlayingCache_${page}`;
  const cacheDuration = 60 * 60 * 1000;

  const cached = getCacheItem<MovieResponse>(cacheKey, cacheDuration);
  if (cached) {
    console.log(`현재 상영작 페이지 ${page} 캐시 사용`);
    return cached;
  }

  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/movie/now_playing`, {
      params: getCommonParams(page)
    });
    setCacheItem(cacheKey, response.data, cacheDuration);
    return response.data;
  } catch (error) {
    console.error('현재 상영작 로드 실패:', error);
    throw error;
  }
};

// 3. 높은 평점 (캐싱 1시간)
export const fetchTopRated = async (page: number = 1): Promise<MovieResponse> => {
  const cacheKey = `netflix_topRatedCache_${page}`;
  const cacheDuration = 60 * 60 * 1000;

  const cached = getCacheItem<MovieResponse>(cacheKey, cacheDuration);
  if (cached) {
    console.log(`높은 평점 페이지 ${page} 캐시 사용`);
    return cached;
  }

  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/movie/top_rated`, {
      params: getCommonParams(page)
    });
    setCacheItem(cacheKey, response.data, cacheDuration);
    return response.data;
  } catch (error) {
    console.error('높은 평점 영화 로드 실패:', error);
    throw error;
  }
};

// 4. 개봉 예정 (캐싱 1시간)
export const fetchUpcoming = async (page: number = 1): Promise<MovieResponse> => {
  const cacheKey = `netflix_upcomingCache_${page}`;
  const cacheDuration = 60 * 60 * 1000;

  const cached = getCacheItem<MovieResponse>(cacheKey, cacheDuration);
  if (cached) {
    console.log(`개봉 예정 페이지 ${page} 캐시 사용`);
    return cached;
  }

  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/movie/upcoming`, {
      params: getCommonParams(page)
    });
    setCacheItem(cacheKey, response.data, cacheDuration);
    return response.data;
  } catch (error) {
    console.error('개봉 예정 영화 로드 실패:', error);
    throw error;
  }
};

// ========== 추가 API ==========

// 장르 목록 (캐싱 24시간)
export const fetchGenres = async (): Promise<Genre[]> => {
  const cacheDuration = 24 * 60 * 60 * 1000; // 24시간

  // 캐시 확인
  const cached = getCacheItem<Genre[]>(STORAGE_KEYS.GENRES_CACHE, cacheDuration);
  if (cached) {
    console.log('장르 목록 캐시 사용');
    return cached;
  }

  // API 호출
  try {
    const response = await axios.get<{ genres: Genre[] }>(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: getKey(),
        language: 'ko-KR'
      }
    });

    // 캐시 저장
    setCacheItem(STORAGE_KEYS.GENRES_CACHE, response.data.genres, cacheDuration);

    return response.data.genres;
  } catch (error) {
    console.error('장르 목록 로드 실패:', error);
    throw error;
  }
};

// 영화 검색
export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  if (!query || query.trim() === '') {
    return { results: [], total_results: 0, total_pages: 0, page: 1 };
  }

  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/search/movie`, {
      params: {
        ...getCommonParams(page),
        query: query.trim()
      }
    });
    return response.data;
  } catch (error) {
    console.error('영화 검색 실패:', error);
    throw error;
  }
};

// 영화 상세 정보
export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const cacheKey = `netflix_movieDetail_${movieId}`;
  const cacheDuration = 24 * 60 * 60 * 1000; // 24시간

  const cached = getCacheItem<MovieDetails>(cacheKey, cacheDuration);
  if (cached) {
    console.log(`영화 상세 ${movieId} 캐시 사용`);
    return cached;
  }

  try {
    const response = await axios.get<MovieDetails>(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: getKey(),
        language: 'ko-KR',
        append_to_response: 'credits,videos,similar,recommendations'
      }
    });
    setCacheItem(cacheKey, response.data, cacheDuration);
    return response.data;
  } catch (error) {
    console.error('영화 상세 로드 실패:', error);
    throw error;
  }
};

// 장르별 영화 (정렬 옵션 포함)
export const fetchMoviesByGenre = async (genreId: number, page: number = 1, sortBy: string = 'popularity.desc'): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/discover/movie`, {
      params: {
        ...getCommonParams(page),
        with_genres: genreId,
        sort_by: sortBy
      }
    });
    return response.data;
  } catch (error) {
    console.error('장르별 영화 로드 실패:', error);
    throw error;
  }
};

// 평점별 필터링
export const fetchMoviesByRating = async (minRating: number, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/discover/movie`, {
      params: {
        ...getCommonParams(page),
        'vote_average.gte': minRating,
        'vote_count.gte': 100, // 최소 투표 수
        sort_by: 'vote_average.desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('평점별 영화 로드 실패:', error);
    throw error;
  }
};

// 개봉년도별 필터링
export const fetchMoviesByYear = async (year: number, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/discover/movie`, {
      params: {
        ...getCommonParams(page),
        primary_release_year: year,
        sort_by: 'popularity.desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('개봉년도별 영화 로드 실패:', error);
    throw error;
  }
};

// 복합 필터링 (장르 + 평점 + 정렬)
export const fetchMoviesWithFilters = async (filters: MovieFilters, page: number = 1): Promise<MovieResponse> => {
  const params: Record<string, string | number> = {
    ...getCommonParams(page)
  };

  if (filters.genreId) {
    params.with_genres = filters.genreId;
  }

  if (filters.minRating) {
    params['vote_average.gte'] = filters.minRating;
    params['vote_count.gte'] = 100;
  }

  if (filters.year) {
    params.primary_release_year = filters.year;
  }

  if (filters.sortBy) {
    params.sort_by = filters.sortBy;
  }

  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/discover/movie`, { params });
    return response.data;
  } catch (error) {
    console.error('필터링 영화 로드 실패:', error);
    throw error;
  }
};

// 추천 영화
export const fetchRecommendations = async (movieId: number, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/movie/${movieId}/recommendations`, {
      params: getCommonParams(page)
    });
    return response.data;
  } catch (error) {
    console.error('추천 영화 로드 실패:', error);
    throw error;
  }
};

// 비슷한 영화
export const fetchSimilarMovies = async (movieId: number, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/movie/${movieId}/similar`, {
      params: getCommonParams(page)
    });
    return response.data;
  } catch (error) {
    console.error('비슷한 영화 로드 실패:', error);
    throw error;
  }
};

// 영화 비디오 (트레일러 등)
export const fetchMovieVideos = async (movieId: number): Promise<VideoResults> => {
  try {
    const response = await axios.get<VideoResults>(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: getKey(),
        language: 'ko-KR'
      }
    });

    // 한국어 영상이 없으면 영어로 재시도
    if (response.data.results.length === 0) {
      const enResponse = await axios.get<VideoResults>(`${BASE_URL}/movie/${movieId}/videos`, {
        params: {
          api_key: getKey(),
          language: 'en-US'
        }
      });
      return enResponse.data;
    }

    return response.data;
  } catch (error) {
    console.error('영화 비디오 로드 실패:', error);
    throw error;
  }
};

// 영화 출연진
export const fetchMovieCredits = async (movieId: number): Promise<Credits> => {
  try {
    const response = await axios.get<Credits>(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: getKey(),
        language: 'ko-KR'
      }
    });
    return response.data;
  } catch (error) {
    console.error('영화 출연진 로드 실패:', error);
    throw error;
  }
};

// 트렌딩 영화 (일간/주간)
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse> => {
  const cacheKey = `netflix_trendingCache_${timeWindow}`;
  const cacheDuration = 60 * 60 * 1000; // 1시간

  const cached = getCacheItem<MovieResponse>(cacheKey, cacheDuration);
  if (cached) {
    console.log(`트렌딩 ${timeWindow} 캐시 사용`);
    return cached;
  }

  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/trending/movie/${timeWindow}`, {
      params: {
        api_key: getKey(),
        language: 'ko-KR'
      }
    });
    setCacheItem(cacheKey, response.data, cacheDuration);
    return response.data;
  } catch (error) {
    console.error('트렌딩 영화 로드 실패:', error);
    throw error;
  }
};

// ========== 이미지 URL 헬퍼 ==========

// 포스터 이미지 URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// 배경 이미지 URL
export const getBackdropUrl = (path: string | null, size: string = 'w1280'): string => {
  if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// 프로필 이미지 URL (배우 등)
export const getProfileUrl = (path: string | null, size: string = 'w185'): string => {
  if (!path) return 'https://via.placeholder.com/185x278?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// YouTube 썸네일 URL
export const getYouTubeThumbnail = (key: string): string => {
  return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
};

// YouTube 영상 URL
export const getYouTubeUrl = (key: string): string => {
  return `https://www.youtube.com/watch?v=${key}`;
};

// YouTube 임베드 URL
export const getYouTubeEmbedUrl = (key: string): string => {
  return `https://www.youtube.com/embed/${key}`;
};

// ========== 상수 ==========

// 정렬 옵션 목록
export const SORT_OPTIONS: SortOption[] = [
  { value: 'popularity.desc', label: '인기순 (높은순)' },
  { value: 'popularity.asc', label: '인기순 (낮은순)' },
  { value: 'vote_average.desc', label: '평점순 (높은순)' },
  { value: 'vote_average.asc', label: '평점순 (낮은순)' },
  { value: 'release_date.desc', label: '최신순' },
  { value: 'release_date.asc', label: '오래된순' },
  { value: 'title.asc', label: '제목순 (ㄱ-ㅎ)' },
  { value: 'title.desc', label: '제목순 (ㅎ-ㄱ)' }
];

// 이미지 사이즈 옵션
export const IMAGE_SIZES = {
  poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'] as const,
  backdrop: ['w300', 'w780', 'w1280', 'original'] as const,
  profile: ['w45', 'w185', 'h632', 'original'] as const
};

// 호환성을 위한 별칭
export const getPopularMovies = fetchPopularMovies;
export const getNowPlayingMovies = fetchNowPlaying;
export const getTopRatedMovies = fetchTopRated;
export const getUpcomingMovies = fetchUpcoming;
export const getGenres = fetchGenres;
export const getMovieDetails = fetchMovieDetails;
export const getMoviesByGenre = fetchMoviesByGenre;
