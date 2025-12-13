# API Documentation

Netflix Clone 프로젝트의 API 문서입니다.

## Table of Contents

- [TMDB API](#tmdb-api)
- [Internal Utilities](#internal-utilities)
- [Store (Redux)](#store-redux)
- [Custom Hooks](#custom-hooks)

---

## TMDB API

### Base Configuration

```typescript
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
```

### Endpoints

#### `getPopularMovies(page?: number)`

인기 영화 목록을 가져옵니다.

```typescript
// 사용 예시
const response = await getPopularMovies(1);
// Response: MovieResponse
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | 페이지 번호 |

**Response Type: `MovieResponse`**

```typescript
interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
```

---

#### `getNowPlayingMovies(page?: number)`

현재 상영 중인 영화 목록을 가져옵니다.

```typescript
const response = await getNowPlayingMovies();
```

---

#### `getTopRatedMovies(page?: number)`

높은 평점의 영화 목록을 가져옵니다.

```typescript
const response = await getTopRatedMovies();
```

---

#### `getUpcomingMovies(page?: number)`

개봉 예정 영화 목록을 가져옵니다.

```typescript
const response = await getUpcomingMovies();
```

---

#### `searchMovies(query: string, page?: number)`

영화 제목으로 검색합니다.

```typescript
const response = await searchMovies('인터스텔라', 1);
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | 검색어 |
| page | number | No | 페이지 번호 |

---

#### `getMovieDetails(movieId: number)`

특정 영화의 상세 정보를 가져옵니다.

```typescript
const movie = await getMovieDetails(550);
// Response: MovieDetails
```

**Response Type: `MovieDetails`**

```typescript
interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  budget: number;
  revenue: number;
  tagline: string;
  credits?: Credits;
  videos?: VideoResults;
}
```

---

#### `getGenres()`

영화 장르 목록을 가져옵니다.

```typescript
const genres = await getGenres();
// Response: Genre[]
```

---

#### `getImageUrl(path: string | null, size?: string)`

이미지 URL을 생성합니다.

```typescript
const posterUrl = getImageUrl('/poster.jpg', 'w500');
// Returns: "https://image.tmdb.org/t/p/w500/poster.jpg"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| path | string \| null | - | 이미지 경로 |
| size | string | 'w500' | 이미지 크기 |

**Available Sizes:**
- `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

---

## Internal Utilities

### Auth (`utils/auth.ts`)

#### `login(email: string, password: string, rememberMe: boolean)`

사용자 로그인을 처리합니다.

```typescript
login('user@email.com', 'api_key_here', true);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| email | string | 사용자 이메일 |
| password | string | TMDB API 키 |
| rememberMe | boolean | 로그인 정보 저장 여부 |

**Throws:** `Error` - 인증 실패 시

---

#### `logout()`

로그아웃하고 세션을 정리합니다.

```typescript
logout();
```

---

#### `tryRegister(email: string, password: string, confirmPassword: string)`

새 사용자를 등록합니다.

```typescript
const result = tryRegister('new@email.com', 'api_key', 'api_key');
// Response: AuthResult
```

**Response Type:**

```typescript
interface AuthResult {
  success: boolean;
  message: string;
}
```

---

#### `isLoggedIn()`

현재 로그인 상태를 확인합니다.

```typescript
const loggedIn = isLoggedIn();
// Returns: boolean
```

---

#### `getCurrentUser()`

현재 로그인한 사용자를 반환합니다.

```typescript
const user = getCurrentUser();
// Returns: string | null
```

---

### Storage (`utils/storage.ts`)

#### `getCache<T>(key: string)`

캐시된 데이터를 가져옵니다.

```typescript
const cachedMovies = getCache<MovieResponse>('popular_movies');
```

---

#### `setCache<T>(key: string, data: T, ttl?: number)`

데이터를 캐시합니다.

```typescript
setCache('popular_movies', response, 3600000); // 1시간 TTL
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| key | string | - | 캐시 키 |
| data | T | - | 저장할 데이터 |
| ttl | number | 3600000 | TTL (밀리초) |

---

#### `clearCache()`

모든 캐시를 삭제합니다.

```typescript
clearCache();
```

---

## Store (Redux)

### Wishlist Slice

#### State

```typescript
interface WishlistState {
  items: WishlistItem[];
}
```

#### Actions

##### `addItem(item: WishlistItem)`

위시리스트에 영화를 추가합니다.

```typescript
dispatch(addItem({
  id: 550,
  title: 'Fight Club',
  poster_path: '/poster.jpg',
  vote_average: 8.4,
  addedAt: new Date().toISOString(),
}));
```

---

##### `removeItem(id: number)`

위시리스트에서 영화를 제거합니다.

```typescript
dispatch(removeItem(550));
```

---

##### `clearWishlist()`

위시리스트를 비웁니다.

```typescript
dispatch(clearWishlist());
```

---

### Auth Slice

#### State

```typescript
interface AuthState {
  isLoggedIn: boolean;
  currentUser: string | null;
}
```

#### Actions

##### `setLoggedIn(payload: { user: string })`

로그인 상태를 설정합니다.

```typescript
dispatch(setLoggedIn({ user: 'user@email.com' }));
```

---

##### `setLoggedOut()`

로그아웃 상태로 변경합니다.

```typescript
dispatch(setLoggedOut());
```

---

## Custom Hooks

### `useAuth()`

인증 상태 관리 훅입니다.

```typescript
const { isLoggedIn, user, login, logout } = useAuth();
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| isLoggedIn | boolean | 로그인 상태 |
| user | string \| null | 현재 사용자 |
| login | function | 로그인 함수 |
| logout | function | 로그아웃 함수 |

---

### `useWishlist()`

위시리스트 관리 훅입니다.

```typescript
const { items, addItem, removeItem, isInWishlist, toggleWishlist } = useWishlist();
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| items | WishlistItem[] | 위시리스트 아이템 |
| addItem | function | 아이템 추가 |
| removeItem | function | 아이템 제거 |
| isInWishlist | function | 포함 여부 확인 |
| toggleWishlist | function | 토글 |

---

### `useReducedMotion()`

사용자의 모션 감소 설정을 확인합니다.

```typescript
const prefersReducedMotion = useReducedMotion();
// Returns: boolean
```

---

## Error Handling

### API Errors

모든 API 함수는 네트워크 오류 시 예외를 발생시킵니다.

```typescript
try {
  const movies = await getPopularMovies();
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.status);
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 401 | Invalid API key |
| 404 | Resource not found |
| 429 | Rate limit exceeded |

---

## Rate Limiting

TMDB API는 초당 50개 요청으로 제한됩니다. 캐싱을 활용하여 API 호출을 최소화하세요.

---

## Related Links

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [TMDB API Reference](https://developer.themoviedb.org/reference/intro/getting-started)
