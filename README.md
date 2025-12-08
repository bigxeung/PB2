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

## Git Branch Strategy

```
main (production)
└── develop (development)
     ├── feature/project-setup
     ├── feature/auth-system
     ├── feature/components
     └── feature/pages
```

## Deployment

GitHub Actions를 통한 자동 배포 (GitHub Pages)

1. Repository Settings > Secrets에 `VITE_TMDB_API_KEY` 추가
2. Settings > Pages > Source를 "GitHub Actions"로 설정
3. main 브랜치에 push하면 자동 배포

## License

MIT License

## Author

- GitHub: [@bigxeung](https://github.com/bigxeung)
