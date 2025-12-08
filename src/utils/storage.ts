// 로컬 스토리지 유틸리티 함수들 (12개 키 완전 관리 시스템)

import type {
  WishlistItem,
  SearchHistoryItem,
  ViewHistoryItem,
  UserSettings,
  CacheData,
  StorageInfo,
  Movie
} from '../types';

// 스토리지 용량 제한
const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB

// 캐시 유효기간
export const CACHE_DURATION = {
  short: 60 * 60 * 1000,           // 1시간
  medium: 24 * 60 * 60 * 1000,     // 24시간
  long: 7 * 24 * 60 * 60 * 1000    // 7일
} as const;

// 모든 키 정의 (12개!)
export const STORAGE_KEYS = {
  // 필수 (5개)
  USERS: 'netflix_users',
  API_KEY: 'netflix_apiKey',
  IS_LOGGED_IN: 'netflix_isLoggedIn',
  CURRENT_USER: 'netflix_currentUser',
  WISHLIST: 'netflix_wishlist',

  // 추가 점수 (7개)
  SEARCH_HISTORY: 'netflix_searchHistory',
  VIEW_HISTORY: 'netflix_viewHistory',
  SETTINGS: 'netflix_settings',
  GENRES_CACHE: 'netflix_genresCache',
  REMEMBER_ME: 'netflix_rememberMe',
  POPULAR_CACHE: 'netflix_popularCache',
  NOW_PLAYING_CACHE: 'netflix_nowPlayingCache'
  // + popularCache_1, nowPlayingCache_1 등은 동적 생성
} as const;

// 안전한 저장 (에러 핸들링 + 용량 체크)
export const safeSetItem = <T>(key: string, value: T): boolean => {
  try {
    const stringValue = JSON.stringify(value);

    // 용량 체크
    const currentSize = new Blob([JSON.stringify(localStorage)]).size;
    const newSize = new Blob([stringValue]).size;

    if (currentSize + newSize > STORAGE_LIMIT) {
      console.warn('LocalStorage 용량 초과, 오래된 캐시 삭제 중...');
      clearOldCache();
    }

    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('LocalStorage 용량 초과');
      clearOldCache();
      // 재시도
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
    console.error('LocalStorage 저장 실패:', error);
    return false;
  }
};

// 안전한 읽기 (손상된 데이터 복구)
export const safeGetItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`LocalStorage 읽기 실패 (${key}):`, error);
    localStorage.removeItem(key); // 손상된 데이터 제거
    return defaultValue;
  }
};

// 기본 get/set 함수 (호환성)
export const getItem = safeGetItem;
export const setItem = safeSetItem;

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

// 캐시 저장 (유효기간 포함)
export const setCacheItem = <T>(key: string, data: T, duration: number = CACHE_DURATION.medium): boolean => {
  const cacheData: CacheData<T> = {
    data: data,
    timestamp: Date.now(),
    expiry: Date.now() + duration,
    version: '1.0'
  };
  return safeSetItem(key, cacheData);
};

// 캐시 읽기 (유효기간 자동 체크)
export const getCacheItem = <T>(key: string, duration: number = CACHE_DURATION.medium): T | null => {
  try {
    const cached = safeGetItem<CacheData<T> | null>(key, null);
    if (!cached) return null;

    const { data, timestamp, version } = cached;

    // 버전 체크
    if (version !== '1.0') {
      localStorage.removeItem(key);
      return null;
    }

    // 유효기간 체크
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('캐시 읽기 실패:', error);
    return null;
  }
};

// 오래된 캐시 정리
export const clearOldCache = (): number => {
  const keys = Object.keys(localStorage);
  const cacheKeys = keys.filter(key => key.includes('Cache') || key.includes('cache'));

  let clearedCount = 0;
  cacheKeys.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item) as CacheData<unknown>;
        if (data.timestamp && Date.now() - data.timestamp > CACHE_DURATION.long) {
          localStorage.removeItem(key);
          clearedCount++;
        }
      }
    } catch {
      localStorage.removeItem(key);
      clearedCount++;
    }
  });

  console.log(`${clearedCount}개의 오래된 캐시 삭제됨`);
  return clearedCount;
};

// ========== 위시리스트 관리 ==========
export const getWishlist = (): WishlistItem[] => {
  return safeGetItem<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
};

export const addToWishlist = (movie: Movie): boolean => {
  const wishlist = getWishlist();
  const exists = wishlist.find(item => item.id === movie.id);

  if (!exists) {
    const wishlistItem: WishlistItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview,
      addedAt: new Date().toISOString()
    };
    wishlist.push(wishlistItem);
    safeSetItem(STORAGE_KEYS.WISHLIST, wishlist);
    return true;
  }
  return false;
};

export const removeFromWishlist = (movieId: number): void => {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.id !== movieId);
  safeSetItem(STORAGE_KEYS.WISHLIST, filtered);
};

export const isInWishlist = (movieId: number): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === movieId);
};

export const clearWishlist = (): void => {
  removeItem(STORAGE_KEYS.WISHLIST);
};

// ========== 최근 검색어 관리 ==========
export const addSearchHistory = (query: string, resultsCount: number = 0): boolean => {
  const history = safeGetItem<SearchHistoryItem[]>(STORAGE_KEYS.SEARCH_HISTORY, []);

  // 중복 제거
  const filtered = history.filter(item => item.query !== query);

  // 새 검색어를 맨 앞에 추가 (최대 10개)
  const newHistory: SearchHistoryItem[] = [
    {
      query,
      timestamp: Date.now(),
      results: resultsCount
    },
    ...filtered
  ].slice(0, 10);

  return safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
};

export const getSearchHistory = (): SearchHistoryItem[] => {
  return safeGetItem<SearchHistoryItem[]>(STORAGE_KEYS.SEARCH_HISTORY, []);
};

export const clearSearchHistory = (): void => {
  removeItem(STORAGE_KEYS.SEARCH_HISTORY);
};

export const removeSearchHistoryItem = (query: string): void => {
  const history = getSearchHistory();
  const filtered = history.filter(item => item.query !== query);
  safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, filtered);
};

// ========== 시청 기록 관리 ==========
export const addToViewHistory = (movie: Movie): boolean => {
  const history = safeGetItem<ViewHistoryItem[]>(STORAGE_KEYS.VIEW_HISTORY, []);

  // 중복 제거 (같은 영화는 가장 최근 기록만)
  const filtered = history.filter(item => item.id !== movie.id);

  // 새 기록을 맨 앞에 추가 (최대 50개)
  const newHistory: ViewHistoryItem[] = [
    {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      viewedAt: Date.now()
    },
    ...filtered
  ].slice(0, 50);

  return safeSetItem(STORAGE_KEYS.VIEW_HISTORY, newHistory);
};

export const getViewHistory = (): ViewHistoryItem[] => {
  return safeGetItem<ViewHistoryItem[]>(STORAGE_KEYS.VIEW_HISTORY, []);
};

export const clearViewHistory = (): void => {
  removeItem(STORAGE_KEYS.VIEW_HISTORY);
};

// ========== 사용자 설정 관리 ==========
const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  language: 'ko-KR',
  autoPlay: true,
  quality: 'high',
  notifications: true,
  adultContent: false
};

export const getUserSettings = (): UserSettings => {
  const settings = safeGetItem<UserSettings | null>(STORAGE_KEYS.SETTINGS, null);
  return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
};

export const updateUserSettings = (newSettings: Partial<UserSettings>): UserSettings => {
  const current = getUserSettings();
  const updated = { ...current, ...newSettings };
  safeSetItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

export const resetUserSettings = (): UserSettings => {
  safeSetItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};

// ========== Remember Me 관리 ==========
export const setRememberMe = (email: string): void => {
  safeSetItem(STORAGE_KEYS.REMEMBER_ME, { email, timestamp: Date.now() });
};

export const getRememberMe = (): { email: string; timestamp: number } | null => {
  return safeGetItem<{ email: string; timestamp: number } | null>(STORAGE_KEYS.REMEMBER_ME, null);
};

export const clearRememberMe = (): void => {
  removeItem(STORAGE_KEYS.REMEMBER_ME);
};

// ========== 장르 캐시 관리 ==========
import type { Genre } from '../types';

export const setGenresCache = (genres: Genre[]): void => {
  setCacheItem(STORAGE_KEYS.GENRES_CACHE, genres, CACHE_DURATION.long);
};

export const getGenresCache = (): Genre[] | null => {
  return getCacheItem<Genre[]>(STORAGE_KEYS.GENRES_CACHE, CACHE_DURATION.long);
};

// ========== 영화 캐시 관리 (페이지별) ==========
import type { MovieResponse } from '../types';

export const setMoviesCache = (type: string, page: number, data: MovieResponse): void => {
  const key = `netflix_${type}Cache_${page}`;
  setCacheItem(key, data, CACHE_DURATION.short);
};

export const getMoviesCache = (type: string, page: number): MovieResponse | null => {
  const key = `netflix_${type}Cache_${page}`;
  return getCacheItem<MovieResponse>(key, CACHE_DURATION.short);
};

// ========== 스토리지 정보 조회 ==========
export const getStorageInfo = (): StorageInfo => {
  let totalSize = 0;
  const keys = Object.keys(localStorage);

  keys.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      totalSize += new Blob([item]).size;
    }
  });

  const total = STORAGE_LIMIT;
  const used = totalSize;
  const percentage = ((used / total) * 100).toFixed(2);

  return {
    total: `${(total / 1024 / 1024).toFixed(2)} MB`,
    used: `${(used / 1024).toFixed(2)} KB`,
    percentage: `${percentage}%`,
    available: `${((total - used) / 1024 / 1024).toFixed(2)} MB`,
    keyCount: keys.length
  };
};

// ========== 스토리지 키별 사용량 ==========
export const getStorageByKey = (): Record<string, { size: string; bytes: number }> => {
  const result: Record<string, { size: string; bytes: number }> = {};
  Object.keys(localStorage).forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      const bytes = new Blob([item]).size;
      result[key] = {
        size: `${(bytes / 1024).toFixed(2)} KB`,
        bytes
      };
    }
  });
  return result;
};

// ========== 전체 스토리지 초기화 ==========
export const clearAllStorage = (): boolean => {
  localStorage.clear();
  console.log('LocalStorage 전체 초기화 완료');
  return true;
};

// Netflix 관련 키만 초기화
export const clearNetflixStorage = (): number => {
  const keys = Object.keys(localStorage);
  let clearedCount = 0;

  keys.forEach(key => {
    if (key.startsWith('netflix_')) {
      localStorage.removeItem(key);
      clearedCount++;
    }
  });

  console.log(`${clearedCount}개의 Netflix 관련 데이터 삭제됨`);
  return clearedCount;
};

// ========== 데이터 내보내기/가져오기 ==========
export const exportStorageData = (): string => {
  const data: Record<string, unknown> = {};
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('netflix_')) {
      data[key] = safeGetItem(key, null);
    }
  });
  return JSON.stringify(data, null, 2);
};

export const importStorageData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;
    Object.keys(data).forEach(key => {
      if (key.startsWith('netflix_')) {
        safeSetItem(key, data[key]);
      }
    });
    return true;
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
    return false;
  }
};
