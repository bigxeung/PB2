// 영화 관련 타입
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface MovieDetails extends Movie {
  belongs_to_collection: Collection | null;
  budget: number;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  credits?: Credits;
  videos?: VideoResults;
  similar?: MovieResponse;
  recommendations?: MovieResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// API 응답 타입
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// 비디오 관련 타입
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface VideoResults {
  id?: number;
  results: Video[];
}

// 출연진 관련 타입
export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  id?: number;
  cast: Cast[];
  crew: Crew[];
}

// 사용자 관련 타입
export interface User {
  id: string;
  password: string;
  createdAt: number;
  updatedAt?: number;
}

export interface AuthResult {
  success: boolean;
  message: string;
}

export interface SessionResult {
  valid: boolean;
  message?: string;
  user?: string;
}

// 위시리스트 아이템 타입
export interface WishlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  overview?: string;
  addedAt: string;
}

// 검색 기록 타입
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  results: number;
}

// 시청 기록 타입
export interface ViewHistoryItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  viewedAt: number;
}

// 사용자 설정 타입
export interface UserSettings {
  theme: 'dark' | 'light';
  language: string;
  autoPlay: boolean;
  quality: 'low' | 'medium' | 'high';
  notifications: boolean;
  adultContent: boolean;
}

// 캐시 데이터 타입
export interface CacheData<T> {
  data: T;
  timestamp: number;
  expiry: number;
  version: string;
}

// 스토리지 정보 타입
export interface StorageInfo {
  total: string;
  used: string;
  percentage: string;
  available: string;
  keyCount: number;
}

// 필터 옵션 타입
export interface MovieFilters {
  genreId?: number;
  minRating?: number;
  year?: number;
  sortBy?: string;
}

// 정렬 옵션 타입
export interface SortOption {
  value: string;
  label: string;
}

// 비밀번호 강도 타입
export interface PasswordStrength {
  level: 'weak' | 'medium' | 'strong';
  message: string;
  color: string;
}

// 입력 검증 결과 타입
export interface ValidationResult {
  valid: boolean;
  message?: string;
  value?: string;
}
