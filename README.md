# Netflix Clone React

React + TypeScript + Vite + Tailwind CSS 4로 구현한 Netflix 클론 프로젝트

## Demo

- **Live Demo**: [https://bigxeung.github.io/PB2/](https://bigxeung.github.io/PB2/)

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Font Awesome |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Animation | React Transition Group |
| Notifications | React Hot Toast |
| API | TMDB API |

## Features

### Core Features
- TMDB API 연동 영화 데이터
- 사용자 인증 (로그인/로그아웃)
- 위시리스트 관리
- 영화 검색 (제목, 장르, 평점)
- 반응형 디자인

### Advanced Features
- LocalStorage 기반 캐싱 시스템 (12개 키)
- Remember Me 기능
- 검색 기록 저장
- 시청 기록 관리
- 무한 스크롤 (Intersection Observer)
- 페이지 전환 애니메이션
- 테이블/카드 뷰 전환

## Project Structure

```
src/
├── components/       # 재사용 컴포넌트
│   ├── Header.tsx
│   ├── MovieCard.tsx
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── pages/           # 페이지 컴포넌트
│   ├── Home.tsx
│   ├── Popular.tsx
│   ├── Search.tsx
│   ├── Wishlist.tsx
│   └── SignIn.tsx
├── hooks/           # Custom Hooks
│   ├── useAuth.ts
│   └── useWishlist.ts
├── utils/           # 유틸리티 함수
│   ├── auth.ts
│   ├── tmdb.ts
│   ├── storage.ts
│   └── security.ts
├── types/           # TypeScript 타입 정의
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- TMDB API Key ([https://www.themoviedb.org/](https://www.themoviedb.org/))

### Installation

```bash
# Clone repository
git clone https://github.com/bigxeung/PB2.git
cd PB2

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your TMDB API key to .env

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Development Guide

### Coding Conventions

#### TypeScript
- 모든 컴포넌트는 `.tsx` 확장자 사용
- 명시적 타입 정의 권장 (any 사용 지양)
- interface 우선 사용 (type alias는 유니온 타입에만)

#### React
- 함수형 컴포넌트 + Hooks 사용
- 컴포넌트명은 PascalCase
- Props interface는 `ComponentNameProps` 형식

#### CSS
- Tailwind CSS 유틸리티 클래스 사용
- 커스텀 스타일은 `<style>` 태그 또는 index.css

#### 파일 명명 규칙
- 컴포넌트: PascalCase (예: `MovieCard.tsx`)
- 유틸리티: camelCase (예: `storage.ts`)
- 타입 정의: `index.ts` 또는 `types.ts`

### Git Commit Message Convention

```
<type>: <subject>

[optional body]

[optional footer]
```

#### Type
| Type | Description |
|------|-------------|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| docs | 문서 수정 |
| style | 코드 포맷팅 (기능 변경 없음) |
| refactor | 코드 리팩토링 |
| test | 테스트 코드 추가/수정 |
| chore | 빌드, 설정 파일 수정 |

#### Examples
```
feat: add movie search filter by genre
fix: resolve infinite scroll not triggering
docs: update README with installation guide
```

### Git Branch Strategy (Git Flow)

```
main (production)
├── hotfix/*           # 긴급 수정
└── develop (development)
     ├── release/*     # 출시 준비
     └── feature/*     # 기능 개발
          ├── feature/auth-system
          ├── feature/components
          └── feature/pages
```

#### Branch Naming
- feature/기능명: `feature/user-authentication`
- hotfix/이슈: `hotfix/login-bug`
- release/버전: `release/v1.0.0`

### Pull Request Guide

1. feature 브랜치에서 작업
2. develop 브랜치로 PR 생성
3. PR 템플릿 작성 (`.github/pull_request_template.md`)
4. 코드 리뷰 후 머지

#### PR Checklist
- [ ] 빌드 성공 확인 (`npm run build`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 관련 이슈 연결
- [ ] 스크린샷 첨부 (UI 변경 시)

### Issue Guide

이슈 템플릿을 사용하여 등록:
- **Bug Report**: `.github/ISSUE_TEMPLATE/bug_report.md`
- **Feature Request**: `.github/ISSUE_TEMPLATE/feature_request.md`

#### Issue Labels
| Label | Description |
|-------|-------------|
| bug | 버그 리포트 |
| enhancement | 기능 개선/추가 |
| documentation | 문서 관련 |
| help wanted | 도움 필요 |

## LocalStorage Structure

```javascript
{
  // Required (5)
  "netflix_users": [...],
  "netflix_apiKey": "encoded_key",
  "netflix_isLoggedIn": "true",
  "netflix_currentUser": "email",
  "netflix_wishlist": [...],

  // Additional (7)
  "netflix_searchHistory": [...],
  "netflix_viewHistory": [...],
  "netflix_settings": {...},
  "netflix_genresCache": {...},
  "netflix_popularCache_1": {...},
  "netflix_nowPlayingCache_1": {...},
  "netflix_rememberMe": {...}
}
```

## API Documentation

### TMDB API Endpoints Used

| Endpoint | Description |
|----------|-------------|
| `/movie/popular` | 인기 영화 목록 |
| `/movie/now_playing` | 현재 상영작 |
| `/movie/top_rated` | 높은 평점 영화 |
| `/movie/upcoming` | 개봉 예정작 |
| `/search/movie` | 영화 검색 |
| `/genre/movie/list` | 장르 목록 |
| `/discover/movie` | 필터링 검색 |

자세한 내용: [TMDB API Documentation](https://developer.themoviedb.org/docs)

## Deployment

GitHub Actions를 통한 자동 배포 (GitHub Pages)

1. Repository Settings > Secrets에 `VITE_TMDB_API_KEY` 추가
2. Settings > Pages > Source를 "GitHub Actions"로 설정
3. main 브랜치에 push하면 자동 배포

## Related Links

- [TMDB API](https://www.themoviedb.org/documentation/api)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## License

MIT License

## Author

- GitHub: [@bigxeung](https://github.com/bigxeung)
