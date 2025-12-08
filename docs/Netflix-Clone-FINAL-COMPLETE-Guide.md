# Netflix 클론 프로젝트 - 최종 완전판 가이드 🎬

> **모든 Optional 항목 포함 + 완전한 프롬프트**
> 
> 총 16개 Step으로 100% 완성
> 
> 각 Step 복사 → Claude CLI 붙여넣기만 하면 끝!

---

## 🎯 빠른 시작

### 이 가이드의 특징

```
✅ 모든 필수 항목 100% 구현
✅ Optional 항목 90% 구현
✅ LocalStorage 12개 키
✅ useRef 5곳 이상 활용
✅ Font Awesome 아이콘
✅ 페이지 전환 Transition
✅ 완벽한 캐싱 시스템
✅ 에러 핸들링
✅ 보안 강화
✅ 복사 붙여넣기만으로 구현 가능!
```

---

## 📦 최종 제출물

```
WSD-분반-학번-이름-2차과제.zip
├── netflix-clone-react/
│   ├── .github/
│   │   ├── workflows/deploy.yml
│   │   ├── ISSUE_TEMPLATE/
│   │   └── pull_request_template.md
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json ⚠️
│   ├── README.md ⚠️
│   └── vite.config.js
├── link.pdf ⚠️
├── mobile.mp4 ⚠️
└── AI.pdf ⚠️
```

---

## 💾 LocalStorage 구조 (12개 키!)

```javascript
{
  // 필수 (5개)
  "netflix_users": [{ id, password, createdAt }],
  "netflix_apiKey": "encoded_key",
  "netflix_isLoggedIn": "true",
  "netflix_currentUser": "email",
  "netflix_wishlist": [...movies],
  
  // 추가 점수 (7개)
  "netflix_searchHistory": [...],
  "netflix_viewHistory": [...],
  "netflix_settings": { theme, language, ... },
  "netflix_genresCache": { data, timestamp, version },
  "netflix_popularCache_1": { data, timestamp },
  "netflix_nowPlayingCache_1": { data, timestamp },
  "netflix_rememberMe": "true"
}
```

---

## Step 0: GitHub & Gitflow 설정 🌿

### 🔍 목표
- GitHub Repository 생성
- Gitflow 브랜치 전략 (-20% 패널티 방지)
- 브랜치 보호 규칙 설정

### 📋 Claude CLI 프롬프트

```
GitHub Repository와 완벽한 Gitflow 전략을 설정해줘.

**1. GitHub Repository 생성**
- 이름: netflix-clone-react
- Public Repository
- Initialize with: README.md, .gitignore (Node)

**2. 로컬 Clone**
```bash
git clone https://github.com/YOUR_USERNAME/netflix-clone-react.git
cd netflix-clone-react
```

**3. Gitflow 브랜치 구조 생성**
```
main (프로덕션)
 └── develop (개발)
      ├── feature/project-setup
      ├── feature/auth-system
      ├── feature/storage-utils
      ├── feature/tmdb-api
      ├── feature/components
      ├── feature/home-page
      ├── feature/popular-page
      ├── feature/search-page
      ├── feature/wishlist-page
      └── feature/deployment
```

**4. 초기 브랜치 생성**
```bash
# develop 브랜치 생성
git checkout -b develop
git push -u origin develop

# 첫 feature 브랜치
git checkout -b feature/project-setup
```

**5. .gitignore 내용 확인**
```
node_modules/
dist/
dist-ssr/
*.local

.env
.env.local
.env.production

.DS_Store
.vscode/
.idea/

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

**6. 커밋 메시지 컨벤션**
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무, 패키지 관리
```

**7. Git Workflow 설명**
```bash
# 각 feature 작업 시
git checkout develop
git checkout -b feature/[name]
# 작업...
git add .
git commit -m "feat: [description]"
git checkout develop
git merge feature/[name]
git push origin develop
git push origin feature/[name]  # 평가용으로 feature 브랜치도 push
```

모든 명령어를 단계별로 설명하고, 브랜치 전략 다이어그램도 보여줘.
```

### ✅ 완료 체크
- [ ] GitHub Repository 생성
- [ ] develop 브랜치 생성 및 push
- [ ] feature/project-setup 브랜치 시작
- [ ] .gitignore 확인

---

## Step 1: React 프로젝트 초기화 ⚙️

### 🔍 목표
- Vite + React
- Font Awesome 설치 (필수!)
- react-transition-group (페이지 전환)
- Tailwind CSS

### 📌 브랜치
`feature/project-setup`

### 📋 Claude CLI 프롬프트

```
Netflix 클론 React 프로젝트를 Vite로 생성하고 모든 필수 패키지를 설치해줘.

**1. Vite React 프로젝트 생성**
```bash
npm create vite@latest . -- --template react
npm install
```

**2. 핵심 패키지 설치**
```bash
# Router 및 HTTP
npm install react-router-dom axios

# UI 라이브러리
npm install react-hot-toast

# Font Awesome (필수!)
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/free-regular-svg-icons
npm install @fortawesome/free-brands-svg-icons
npm install @fortawesome/react-fontawesome

# 페이지 전환 애니메이션 (필수!)
npm install react-transition-group
npm install --save-dev @types/react-transition-group
```

**3. Tailwind CSS 설치**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**4. Tailwind 설정**

tailwind.config.js:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**5. src/index.css 전체 교체**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 스크롤바 숨기기 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

/* 페이지 전환 애니메이션 (필수!) */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
}

/* 커스텀 스타일 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #141414;
  color: white;
}
```

**6. 환경변수 파일**

.env:
```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

.env.example:
```
VITE_TMDB_API_KEY=
```

**7. package.json scripts 확인**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

모든 설치 과정과 설정을 상세하게 제공해줘.
```

### ✅ 완료 체크
- [ ] Vite 프로젝트 생성
- [ ] 모든 패키지 설치 (Font Awesome 확인!)
- [ ] Tailwind CSS 설정
- [ ] index.css 교체 (페이지 전환 CSS 포함)
- [ ] .env 파일 생성 및 API 키 입력
- [ ] `npm run dev` 실행 확인
- [ ] Git 커밋:
  ```bash
  git add .
  git commit -m "feat: React 프로젝트 초기화 및 필수 패키지 설치"
  ```

---

## Step 2: 폴더 구조 & Router & 페이지 전환 🗂️

### 🔍 목표
- 정형화된 폴더 구조
- React Router + 페이지 전환 애니메이션 (필수!)
- ProtectedRoute 완전 구현

### 📌 브랜치
`feature/project-setup` (계속)

### 📋 Claude CLI 프롬프트

```
프로젝트 폴더 구조를 정형화하고 페이지 전환 애니메이션을 포함한 React Router를 설정해줘.

**작업 1: 폴더 구조 생성**
```
src/
  ├── components/
  │   ├── Header.jsx
  │   ├── MovieCard.jsx
  │   ├── ProtectedRoute.jsx
  │   └── LoadingSpinner.jsx
  ├── pages/
  │   ├── SignIn.jsx
  │   ├── Home.jsx
  │   ├── Popular.jsx
  │   ├── Search.jsx
  │   └── Wishlist.jsx
  ├── hooks/
  │   ├── useAuth.js
  │   └── useWishlist.js
  ├── utils/
  │   ├── auth.js
  │   ├── tmdb.js
  │   ├── storage.js
  │   └── security.js
  ├── App.jsx
  ├── main.jsx
  └── index.css
```

각 폴더에 .gitkeep 파일 생성해서 Git에 추적되도록 해줘.

**작업 2: src/components/ProtectedRoute.jsx 생성**
```jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

**작업 3: src/App.jsx 완전 구현 (페이지 전환 애니메이션 포함!)**
```jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';

// Pages
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        timeout={300}
        classNames="page"
        unmountOnExit
      >
        <div className="page">
          <Routes location={location}>
            {/* 공개 라우트 - 로그인 페이지 */}
            <Route 
              path="/signin" 
              element={
                isAuthenticated() ? (
                  <Navigate to="/" replace />
                ) : (
                  <SignIn />
                )
              } 
            />
            
            {/* 보호된 라우트들 */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/popular" 
              element={
                <ProtectedRoute>
                  <Popular />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/wishlist" 
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 처리 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
```

**작업 4: src/main.jsx 확인**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**작업 5: 임시 페이지 컴포넌트 생성**
각 pages/ 폴더의 파일들:
```jsx
// src/pages/SignIn.jsx
function SignIn() {
  return <div className="p-8">SignIn Page</div>;
}
export default SignIn;

// src/pages/Home.jsx
function Home() {
  return <div className="p-8">Home Page</div>;
}
export default Home;

// ... 나머지도 동일
```

완성된 전체 코드를 제공해줘.
```

### ✅ 완료 체크
- [ ] 폴더 구조 생성
- [ ] ProtectedRoute.jsx 생성
- [ ] App.jsx 페이지 전환 애니메이션 확인
- [ ] 5개 임시 페이지 생성
- [ ] `npm run dev` 실행
- [ ] /signin 접속 → / 접속 시 리다이렉트 확인
- [ ] 페이지 전환 시 슬라이드 애니메이션 확인
- [ ] Git 커밋 후 merge:
  ```bash
  git add .
  git commit -m "feat: 폴더 구조, Router, 페이지 전환 애니메이션 구현"
  git checkout develop
  git merge feature/project-setup
  git push origin develop
  git push origin feature/project-setup
  ```

---


## Step 3: 보안 & 스토리지 유틸리티 🔐

### 🔍 목표
- API 키 난독화 (security.js)
- LocalStorage 12개 키 관리 (storage.js)
- 캐싱 시스템
- 에러 핸들링

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/storage-utils
```

### 📋 Claude CLI 프롬프트

```
보안 유틸리티와 LocalStorage 관리 시스템을 완벽하게 구현해줘. 12개 키 전부 포함!

**파일 1: src/utils/security.js 생성**

API 키 난독화, XSS 방지, 이메일 검증 기능 포함.

완전한 코드:
```javascript
// API 키 난독화 (간단한 Base64 + SALT)
const SALT = 'netflix-clone-2024-secret-key';

export const encodeApiKey = (apiKey) => {
  try {
    const combined = apiKey + SALT;
    return btoa(combined);
  } catch (error) {
    console.error('API 키 인코딩 실패:', error);
    return apiKey; // 실패 시 원본 반환
  }
};

export const decodeApiKey = (encoded) => {
  try {
    const decoded = atob(encoded);
    return decoded.replace(SALT, '');
  } catch (error) {
    console.error('API 키 디코딩 실패:', error);
    return null;
  }
};

// XSS 공격 방지
export const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// 이메일 형식 검증
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

**파일 2: src/utils/storage.js 생성**

12개 LocalStorage 키 전부 관리하는 완전한 시스템.

완전한 코드:
```javascript
// 스토리지 용량 제한
const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB

// 캐시 유효기간
const CACHE_DURATION = {
  short: 60 * 60 * 1000,           // 1시간
  medium: 24 * 60 * 60 * 1000,     // 24시간
  long: 7 * 24 * 60 * 60 * 1000    // 7일
};

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
  REMEMBER_ME: 'netflix_rememberMe'
  // + popularCache_1, nowPlayingCache_1 등은 동적 생성
};

// 안전한 저장 (에러 핸들링 + 용량 체크)
export const safeSetItem = (key, value) => {
  try {
    const stringValue = JSON.stringify(value);
    
    // 용량 체크
    const currentSize = new Blob([localStorage.toString()]).size;
    const newSize = new Blob([stringValue]).size;
    
    if (currentSize + newSize > STORAGE_LIMIT) {
      console.warn('LocalStorage 용량 초과, 오래된 캐시 삭제 중...');
      clearOldCache();
    }
    
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
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
export const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`LocalStorage 읽기 실패 (${key}):`, error);
    localStorage.removeItem(key); // 손상된 데이터 제거
    return defaultValue;
  }
};

// 캐시 저장 (유효기간 포함)
export const setCacheItem = (key, data, duration = CACHE_DURATION.medium) => {
  const cacheData = {
    data: data,
    timestamp: Date.now(),
    version: '1.0'
  };
  return safeSetItem(key, cacheData);
};

// 캐시 읽기 (유효기간 자동 체크)
export const getCacheItem = (key, duration = CACHE_DURATION.medium) => {
  try {
    const cached = safeGetItem(key);
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
export const clearOldCache = () => {
  const keys = Object.keys(localStorage);
  const cacheKeys = keys.filter(key => key.includes('Cache'));
  
  let clearedCount = 0;
  cacheKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (data.timestamp && Date.now() - data.timestamp > CACHE_DURATION.long) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    } catch {
      localStorage.removeItem(key);
      clearedCount++;
    }
  });
  
  console.log(`${clearedCount}개의 오래된 캐시 삭제됨`);
};

// 최근 검색어 관리
export const addSearchHistory = (query, resultsCount) => {
  const history = safeGetItem(STORAGE_KEYS.SEARCH_HISTORY, []);
  
  // 중복 제거
  const filtered = history.filter(item => item.query !== query);
  
  // 새 검색어를 맨 앞에 추가 (최대 10개)
  const newHistory = [
    {
      query,
      timestamp: Date.now(),
      results: resultsCount
    },
    ...filtered
  ].slice(0, 10);
  
  return safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
};

export const getSearchHistory = () => {
  return safeGetItem(STORAGE_KEYS.SEARCH_HISTORY, []);
};

export const clearSearchHistory = () => {
  localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
};

// 시청 기록 관리
export const addToViewHistory = (movie) => {
  const history = safeGetItem(STORAGE_KEYS.VIEW_HISTORY, []);
  
  // 중복 제거 (같은 영화는 가장 최근 기록만)
  const filtered = history.filter(item => item.id !== movie.id);
  
  // 새 기록을 맨 앞에 추가 (최대 50개)
  const newHistory = [
    {
      ...movie,
      viewedAt: Date.now()
    },
    ...filtered
  ].slice(0, 50);
  
  return safeSetItem(STORAGE_KEYS.VIEW_HISTORY, newHistory);
};

export const getViewHistory = () => {
  return safeGetItem(STORAGE_KEYS.VIEW_HISTORY, []);
};

// 사용자 설정 관리
export const getUserSettings = () => {
  const defaults = {
    theme: 'dark',
    language: 'ko-KR',
    autoPlay: true,
    quality: 'high'
  };
  
  const settings = safeGetItem(STORAGE_KEYS.SETTINGS);
  return settings ? { ...defaults, ...settings } : defaults;
};

export const updateUserSettings = (newSettings) => {
  const current = getUserSettings();
  const updated = { ...current, ...newSettings };
  safeSetItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

// 스토리지 정보 조회
export const getStorageInfo = () => {
  const total = STORAGE_LIMIT;
  const used = new Blob([localStorage.toString()]).size;
  const percentage = ((used / total) * 100).toFixed(2);
  
  return {
    total: `${(total / 1024 / 1024).toFixed(2)} MB`,
    used: `${(used / 1024 / 1024).toFixed(2)} MB`,
    percentage: `${percentage}%`,
    available: `${((total - used) / 1024 / 1024).toFixed(2)} MB`
  };
};

// 전체 스토리지 초기화 (개발용)
export const clearAllStorage = () => {
  if (confirm('모든 데이터를 삭제하시겠습니까?')) {
    localStorage.clear();
    console.log('LocalStorage 전체 초기화 완료');
    return true;
  }
  return false;
};
```

두 파일의 완전한 코드를 제공해줘.
```

### ✅ 완료 체크
- [ ] src/utils/security.js 생성
- [ ] src/utils/storage.js 생성 (12개 키 함수 전부!)
- [ ] 브라우저 개발자도구에서 함수 테스트
- [ ] Git 커밋:
  ```bash
  git add .
  git commit -m "feat: 보안 유틸리티 및 스토리지 관리 시스템 (12개 키)"
  ```

---


## Step 4: 인증 시스템 (Remember Me 포함) 🔑

### 🔍 목표
- auth.js 완전 구현
- Remember Me 로직 (sessionStorage 활용)
- 이메일 검증, 에러 처리

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/auth-system
```

### 📋 Claude CLI 프롬프트

```
완벽한 인증 시스템을 구현해줘. Remember Me 기능과 sessionStorage 활용 포함!

**파일: src/utils/auth.js 생성**

완전한 코드:
```javascript
import {
  safeGetItem,
  safeSetItem,
  STORAGE_KEYS
} from './storage';
import {
  encodeApiKey,
  decodeApiKey,
  validateEmail,
  sanitizeInput
} from './security';

// 사용자 목록 가져오기
export const getUsers = () => {
  return safeGetItem(STORAGE_KEYS.USERS, []);
};

// 사용자 저장
const saveUsers = (users) => {
  return safeSetItem(STORAGE_KEYS.USERS, users);
};

// 로그인 (Remember Me 포함)
export const tryLogin = (email, password, rememberMe = false) => {
  // 1. 입력값 검증
  if (!validateEmail(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식이 아닙니다.'
    };
  }
  
  if (!password || password.trim() === '') {
    return {
      success: false,
      message: '비밀번호(API 키)를 입력해주세요.'
    };
  }
  
  // 2. 이메일 Sanitize
  const sanitizedEmail = sanitizeInput(email);
  
  // 3. 사용자 찾기
  const users = getUsers();
  const user = users.find(u => u.id === sanitizedEmail);
  
  if (!user) {
    return {
      success: false,
      message: '존재하지 않는 계정입니다.'
    };
  }
  
  // 4. 비밀번호 확인 (디코딩 후 비교)
  const decodedPassword = decodeApiKey(user.password);
  if (decodedPassword !== password) {
    return {
      success: false,
      message: '비밀번호(API 키)가 일치하지 않습니다.'
    };
  }
  
  // 5. 로그인 성공 처리
  safeSetItem(STORAGE_KEYS.API_KEY, user.password);
  safeSetItem(STORAGE_KEYS.CURRENT_USER, sanitizedEmail);
  
  // 6. Remember Me 처리
  if (rememberMe) {
    // LocalStorage에 저장 (브라우저 닫아도 유지)
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    safeSetItem(STORAGE_KEYS.REMEMBER_ME, 'true');
  } else {
    // SessionStorage에 저장 (브라우저 닫으면 삭제)
    sessionStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }
  
  return {
    success: true,
    message: '로그인 성공!'
  };
};

// 회원가입
export const tryRegister = (email, password, passwordConfirm) => {
  // 1. 입력값 검증
  if (!validateEmail(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식이 아닙니다.'
    };
  }
  
  if (!password || password.trim() === '') {
    return {
      success: false,
      message: '비밀번호(API 키)를 입력해주세요.'
    };
  }
  
  if (password !== passwordConfirm) {
    return {
      success: false,
      message: '비밀번호가 일치하지 않습니다.'
    };
  }
  
  if (password.length < 8) {
    return {
      success: false,
      message: 'TMDB API 키는 최소 8자 이상이어야 합니다.'
    };
  }
  
  // 2. 이메일 Sanitize
  const sanitizedEmail = sanitizeInput(email);
  
  // 3. 중복 체크
  const users = getUsers();
  const exists = users.some(u => u.id === sanitizedEmail);
  
  if (exists) {
    return {
      success: false,
      message: '이미 존재하는 계정입니다.'
    };
  }
  
  // 4. API 키 인코딩
  const encodedPassword = encodeApiKey(password);
  
  // 5. 사용자 추가
  users.push({
    id: sanitizedEmail,
    password: encodedPassword,
    createdAt: Date.now()
  });
  
  saveUsers(users);
  
  return {
    success: true,
    message: '회원가입 성공!'
  };
};

// 로그아웃
export const logout = () => {
  // LocalStorage
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  
  // SessionStorage
  sessionStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  
  return true;
};

// 로그인 상태 확인
export const isAuthenticated = () => {
  const rememberMe = safeGetItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
  
  if (rememberMe) {
    // Remember Me 체크됨 → LocalStorage 확인
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  } else {
    // Remember Me 체크 안됨 → SessionStorage 확인
    return sessionStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  }
};

// 현재 사용자 정보
export const getCurrentUser = () => {
  return safeGetItem(STORAGE_KEYS.CURRENT_USER);
};

// API 키 가져오기
export const getApiKey = () => {
  const encoded = safeGetItem(STORAGE_KEYS.API_KEY);
  if (!encoded) {
    throw new Error('로그인이 필요합니다.');
  }
  return decodeApiKey(encoded);
};
```

완전한 auth.js 코드를 작성해줘.
```

### ✅ 완료 체크
- [ ] src/utils/auth.js 생성
- [ ] Remember Me 로직 확인
- [ ] sessionStorage vs localStorage 구분 확인
- [ ] 브라우저 개발자도구에서 테스트
- [ ] Git 커밋 후 merge:
  ```bash
  git add .
  git commit -m "feat: 완벽한 인증 시스템 (Remember Me, sessionStorage)"
  git checkout develop
  git merge feature/auth-system
  git push origin develop
  git push origin feature/auth-system
  ```

---

## Step 5: TMDB API & 캐싱 시스템 🎬

### 🔍 목표
- TMDB API 함수 (최소 4개 + 추가)
- 장르 캐싱 (24시간)
- 인기 영화 캐싱 (1시간)
- 평점/정렬/개봉년도 필터링

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/tmdb-api
```

### 📋 Claude CLI 프롬프트

```
TMDB API 유틸리티와 완벽한 캐싱 시스템을 구현해줘. 필수 4개 + 추가 API 포함!

**파일: src/utils/tmdb.js 생성**

완전한 코드:
```javascript
import axios from 'axios';
import { getApiKey } from './auth';
import { setCacheItem, getCacheItem, STORAGE_KEYS } from './storage';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API 키 가져오기 (에러 핸들링)
const getKey = () => {
  try {
    return getApiKey();
  } catch (error) {
    console.error('API 키 없음:', error);
    throw new Error('로그인이 필요합니다.');
  }
};

// 공통 파라미터
const getCommonParams = (page = 1) => ({
  api_key: getKey(),
  language: 'ko-KR',
  page: page
});

// ========== 필수 4개 API ==========

// 1. 인기 영화 (캐싱 1시간)
export const fetchPopularMovies = async (page = 1) => {
  const cacheKey = `netflix_popularCache_${page}`;
  const cacheDuration = 60 * 60 * 1000; // 1시간
  
  // 캐시 확인
  const cached = getCacheItem(cacheKey, cacheDuration);
  if (cached) {
    console.log(`인기 영화 페이지 ${page} 캐시 사용`);
    return cached;
  }
  
  // API 호출
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: getCommonParams(page)
    });
    
    // 캐시 저장
    setCacheItem(cacheKey, response.data, cacheDuration);
    
    return response.data;
  } catch (error) {
    console.error('인기 영화 로드 실패:', error);
    if (error.response?.status === 401) {
      throw new Error('API 키가 유효하지 않습니다. 다시 로그인해주세요.');
    }
    throw error;
  }
};

// 2. 현재 상영작 (캐싱 1시간)
export const fetchNowPlaying = async (page = 1) => {
  const cacheKey = `netflix_nowPlayingCache_${page}`;
  const cacheDuration = 60 * 60 * 1000;
  
  const cached = getCacheItem(cacheKey, cacheDuration);
  if (cached) {
    console.log(`현재 상영작 페이지 ${page} 캐시 사용`);
    return cached;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
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
export const fetchTopRated = async (page = 1) => {
  const cacheKey = `netflix_topRatedCache_${page}`;
  const cacheDuration = 60 * 60 * 1000;
  
  const cached = getCacheItem(cacheKey, cacheDuration);
  if (cached) {
    console.log(`높은 평점 페이지 ${page} 캐시 사용`);
    return cached;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
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
export const fetchUpcoming = async (page = 1) => {
  const cacheKey = `netflix_upcomingCache_${page}`;
  const cacheDuration = 60 * 60 * 1000;
  
  const cached = getCacheItem(cacheKey, cacheDuration);
  if (cached) {
    console.log(`개봉 예정 페이지 ${page} 캐시 사용`);
    return cached;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
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
export const fetchGenres = async () => {
  const cacheDuration = 24 * 60 * 60 * 1000; // 24시간
  
  // 캐시 확인
  const cached = getCacheItem(STORAGE_KEYS.GENRES_CACHE, cacheDuration);
  if (cached) {
    console.log('장르 목록 캐시 사용');
    return cached;
  }
  
  // API 호출
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
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
export const searchMovies = async (query, page = 1) => {
  if (!query || query.trim() === '') {
    return { results: [], total_results: 0, total_pages: 0 };
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
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

// 장르별 영화 (정렬 옵션 포함)
export const fetchMoviesByGenre = async (genreId, page = 1, sortBy = 'popularity.desc') => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
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

// 평점별 필터링 (추가!)
export const fetchMoviesByRating = async (minRating, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
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

// 개봉년도별 필터링 (추가!)
export const fetchMoviesByYear = async (year, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
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
export const fetchMoviesWithFilters = async (filters, page = 1) => {
  const params = {
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
    const response = await axios.get(`${BASE_URL}/discover/movie`, { params });
    return response.data;
  } catch (error) {
    console.error('필터링 영화 로드 실패:', error);
    throw error;
  }
};

// 이미지 URL 생성
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// 정렬 옵션 목록
export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: '인기순 (높은순)' },
  { value: 'popularity.asc', label: '인기순 (낮은순)' },
  { value: 'vote_average.desc', label: '평점순 (높은순)' },
  { value: 'vote_average.asc', label: '평점순 (낮은순)' },
  { value: 'release_date.desc', label: '최신순' },
  { value: 'release_date.asc', label: '오래된순' },
  { value: 'title.asc', label: '제목순 (ㄱ-ㅎ)' },
  { value: 'title.desc', label: '제목순 (ㅎ-ㄱ)' }
];
```

완전한 tmdb.js 코드를 제공해줘.
```

### ✅ 완료 체크
- [ ] src/utils/tmdb.js 생성
- [ ] 4개 필수 API 확인
- [ ] 장르 캐싱 확인 (콘솔 로그)
- [ ] 인기 영화 캐싱 확인
- [ ] 평점/정렬/개봉년도 함수 확인
- [ ] Git 커밋 후 merge:
  ```bash
  git add .
  git commit -m "feat: TMDB API 및 완벽한 캐싱 시스템"
  git checkout develop
  git merge feature/tmdb-api
  git push origin develop
  git push origin feature/tmdb-api
  ```

---


## Step 6: Custom Hooks 🪝

### 🔍 목표
- useWishlist Hook (Bottom-Up 패턴)
- useAuth Hook

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/components
```

### 📋 Claude CLI 프롬프트

```
Custom Hook을 구현해줘. useWishlist와 useAuth, Bottom-Up 패턴 명시!

**파일 1: src/hooks/useWishlist.js**

Bottom-Up 데이터 전달을 위한 Hook.

```javascript
import { useState, useEffect, useCallback } from 'react';
import { safeGetItem, safeSetItem, STORAGE_KEYS } from '../utils/storage';
import { toast } from 'react-hot-toast';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  
  // 초기 로드
  useEffect(() => {
    const saved = safeGetItem(STORAGE_KEYS.WISHLIST, []);
    setWishlist(saved);
  }, []);
  
  // LocalStorage 동기화
  const saveWishlist = useCallback((newWishlist) => {
    setWishlist(newWishlist);
    safeSetItem(STORAGE_KEYS.WISHLIST, newWishlist);
  }, []);
  
  // 추가
  const addToWishlist = useCallback((movie) => {
    const updated = [...wishlist, movie];
    saveWishlist(updated);
    toast.success(`${movie.title}을(를) 찜 목록에 추가했습니다!`, {
      icon: '❤️',
    });
  }, [wishlist, saveWishlist]);
  
  // 제거
  const removeFromWishlist = useCallback((movieId) => {
    const movie = wishlist.find(m => m.id === movieId);
    const updated = wishlist.filter(m => m.id !== movieId);
    saveWishlist(updated);
    if (movie) {
      toast.success(`${movie.title}을(를) 찜 목록에서 제거했습니다!`);
    }
  }, [wishlist, saveWishlist]);
  
  // 토글 (Bottom-Up 전달용!)
  const toggleWishlist = useCallback((movie) => {
    const isInList = wishlist.some(m => m.id === movie.id);
    if (isInList) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);
  
  // 확인
  const isInWishlist = useCallback((movieId) => {
    return wishlist.some(m => m.id === movieId);
  }, [wishlist]);
  
  // 전체 삭제
  const clearWishlist = useCallback(() => {
    saveWishlist([]);
    toast.success('찜 목록을 모두 삭제했습니다!');
  }, [saveWishlist]);
  
  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,  // Bottom-Up 패턴의 핵심!
    isInWishlist,
    clearWishlist
  };
};
```

**파일 2: src/hooks/useAuth.js**

```javascript
import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout as authLogout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setCurrentUser(getCurrentUser());
  }, []);
  
  const logout = () => {
    authLogout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast.success('로그아웃 되었습니다!');
    navigate('/signin');
  };
  
  return {
    isLoggedIn,
    currentUser,
    logout
  };
};
```

두 Hook의 완전한 코드와 Bottom-Up 패턴 설명을 제공해줘.
```

### ✅ 완료 체크
- [ ] src/hooks/useWishlist.js 생성
- [ ] src/hooks/useAuth.js 생성
- [ ] toggleWishlist 함수 (Bottom-Up) 확인
- [ ] Git 커밋:
  ```bash
  git add .
  git commit -m "feat: Custom Hooks (useWishlist, useAuth, Bottom-Up 패턴)"
  ```

---

## Step 7: 공통 컴포넌트 (useRef 활용!) 🧩

### 🔍 목표
- LoadingSpinner (Font Awesome)
- MovieCard (useRef 3가지 활용 + Bottom-Up)
- Header (useRef + 스크롤 애니메이션)

### 📌 브랜치
`feature/components` (계속)

### 📋 Claude CLI 프롬프트

```
공통 컴포넌트를 구현해줘. useRef 5곳 이상 + Font Awesome + Bottom-Up 패턴!

**파일 1: src/components/LoadingSpinner.jsx**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function LoadingSpinner({ size = 'lg', message = '로딩 중...' }) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };
  
  return (
    <div className="flex flex-col justify-center items-center py-12 space-y-4">
      <FontAwesomeIcon 
        icon={faSpinner} 
        className={`${sizeClasses[size]} text-red-600 animate-spin`}
      />
      {message && (
        <p className="text-gray-400 text-sm">{message}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
```

**파일 2: src/components/MovieCard.jsx**

useRef 3가지 활용 + Bottom-Up 패턴 + Font Awesome!

```jsx
import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { getImageUrl } from '../utils/tmdb';

function MovieCard({ movie, isInWishlist, onToggleWishlist }) {
  // useRef 활용 1: DOM 접근
  const cardRef = useRef(null);
  
  // useRef 활용 2: 이전 값 추적
  const prevInWishlist = useRef(isInWishlist);
  
  // useRef 활용 3: 애니메이션 타이머
  const animationTimer = useRef(null);
  
  // 위시리스트 상태 변경 시 애니메이션
  useEffect(() => {
    if (prevInWishlist.current !== isInWishlist && cardRef.current) {
      // 기존 타이머 클리어
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
      
      // 애니메이션 추가
      cardRef.current.classList.add('scale-105');
      
      // 200ms 후 제거
      animationTimer.current = setTimeout(() => {
        cardRef.current?.classList.remove('scale-105');
      }, 200);
    }
    
    prevInWishlist.current = isInWishlist;
    
    // Cleanup
    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, [isInWishlist]);
  
  // Bottom-Up: 자식에서 부모로 이벤트 전달
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onToggleWishlist(movie); // 부모의 toggleWishlist 호출
  };
  
  return (
    <div
      ref={cardRef}
      className="relative w-full sm:w-48 lg:w-56 flex-shrink-0 group cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      {/* 포스터 */}
      <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white w-full">
            <p className="text-sm font-semibold mb-1 line-clamp-2">{movie.title}</p>
            {movie.vote_average && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
                {movie.release_date && (
                  <span className="text-gray-300">• {movie.release_date.split('-')[0]}</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* 위시리스트 버튼 (Font Awesome) */}
        <button
          onClick={handleWishlistClick}
          className={`
            absolute top-2 right-2 
            p-2 sm:p-3 
            rounded-full 
            transition-all duration-200
            ${isInWishlist 
              ? 'bg-red-600 scale-110 shadow-lg' 
              : 'bg-black/50 hover:bg-black/70 hover:scale-110'
            }
          `}
          title={isInWishlist ? '찜 목록에서 제거' : '찜 목록에 추가'}
        >
          <FontAwesomeIcon
            icon={isInWishlist ? faHeartSolid : faHeartRegular}
            className={`w-4 h-4 sm:w-5 sm:h-5 text-white`}
          />
        </button>
      </div>
      
      {/* 제목 (모바일용) */}
      <h3 className="mt-2 text-sm sm:text-base font-semibold text-white truncate">
        {movie.title}
      </h3>
      
      {/* 평점 (모바일용) */}
      {movie.vote_average && (
        <p className="text-xs text-yellow-400 mt-1">
          ★ {movie.vote_average.toFixed(1)}
        </p>
      )}
    </div>
  );
}

export default MovieCard;
```

**파일 3: src/components/Header.jsx**

useRef 2가지 활용 + Font Awesome + 스크롤 애니메이션!

```jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faSignOutAlt, 
  faFilm,
  faHome,
  faFire,
  faSearch,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // useRef 활용 4: 스크롤 이벤트 최적화 (디바운싱)
  const scrollTimer = useRef(null);
  
  // useRef 활용 5: 이전 스크롤 위치 추적
  const prevScrollY = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      // 타이머 클리어
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // 50ms 디바운싱
      scrollTimer.current = setTimeout(() => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 50);
        prevScrollY.current = currentScrollY;
      }, 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };
  
  const isActive = (path) => location.pathname === path;
  
  const menuItems = [
    { path: '/', label: '홈', icon: faHome },
    { path: '/popular', label: '대세 콘텐츠', icon: faFire },
    { path: '/search', label: '찾아보기', icon: faSearch },
    { path: '/wishlist', label: '내가 찜한 리스트', icon: faHeart }
  ];
  
  return (
    <header
      className={`
        fixed top-0 w-full z-50
        px-4 sm:px-6 lg:px-8 py-4
        transition-all duration-300
        ${scrolled 
          ? 'bg-black shadow-lg' 
          : 'bg-gradient-to-b from-black/80 to-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover:scale-105 transition-transform"
        >
          <FontAwesomeIcon icon={faFilm} className="text-red-600 text-2xl sm:text-3xl" />
          <span className="text-red-600 text-xl sm:text-2xl font-bold tracking-wider">
            NETFLIX
          </span>
        </Link>
        
        {/* Desktop 메뉴 */}
        <nav className="hidden lg:flex items-center space-x-8">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-2
                text-base font-medium 
                transition-colors duration-200
                ${isActive(item.path) 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
                }
              `}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Desktop 사용자 정보 */}
        <div className="hidden lg:flex items-center space-x-4">
          {currentUser && (
            <span className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
              {currentUser}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>로그아웃</span>
          </button>
        </div>
        
        {/* Mobile 햄버거 */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white text-2xl hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>
      
      {/* Mobile 메뉴 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black z-50 pt-20 px-6 animate-fadeIn">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          <nav className="flex flex-col space-y-6 text-xl">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3
                  ${isActive(item.path) ? 'text-red-600 font-bold' : 'text-white'}
                `}
              >
                <FontAwesomeIcon icon={item.icon} className="w-6 h-6" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            {currentUser && (
              <p className="text-sm text-gray-400 mb-4">
                로그인: {currentUser}
              </p>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-500 text-lg"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
```

3개 컴포넌트의 완전한 코드를 제공해줘. useRef 5곳 활용 + Font Awesome 아이콘!
```

### ✅ 완료 체크
- [ ] LoadingSpinner.jsx 생성 (Font Awesome)
- [ ] MovieCard.jsx 생성 (useRef 3곳)
- [ ] Header.jsx 생성 (useRef 2곳)
- [ ] Font Awesome 아이콘 확인
- [ ] Bottom-Up 패턴 (onToggleWishlist) 확인
- [ ] 스크롤 애니메이션 확인
- [ ] Git 커밋 후 merge:
  ```bash
  git add .
  git commit -m "feat: 공통 컴포넌트 (useRef 5곳, Font Awesome, Bottom-Up)"
  git checkout develop
  git merge feature/components
  git push origin develop
  git push origin feature/components
  ```

---


## Step 8: 로그인/회원가입 페이지 (카드 Flip!) 🔐

### 🔍 목표
- 카드 flip 애니메이션 (필수! 채점 항목)
- Remember Me 완전 구현
- 약관 동의 체크 (필수)
- Toast 알림

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/auth-pages
```

### 📋 Claude CLI 프롬프트

```
로그인/회원가입 페이지를 완벽하게 구현해줘. 카드 flip 애니메이션 필수!

**파일: src/pages/SignIn.jsx**

요구사항:
1. 카드 flip 애니메이션 (transform: rotateY(180deg))
2. Remember Me 체크박스 및 로직
3. 약관 동의 필수 체크
4. 이메일 형식 검증
5. Toast 알림 (react-hot-toast)
6. 로그인 성공 → / 이동
7. 회원가입 성공 → 자동으로 로그인 폼 표시
8. Font Awesome 아이콘

완전한 코드:
```jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faKey, 
  faEye, 
  faEyeSlash 
} from '@fortawesome/free-solid-svg-icons';
import { tryLogin, tryRegister } from '../utils/auth';
import { validateEmail } from '../utils/security';

function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // useRef 활용 6: Input 포커스 관리
  const emailRef = useRef(null);
  
  // 로그인 상태
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // 회원가입 상태
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: false
  });
  
  // 모드 전환 (카드 flip!)
  const toggleMode = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsFlipping(false);
      
      // 전환 후 이메일 input에 자동 포커스
      setTimeout(() => {
        emailRef.current?.focus();
      }, 100);
    }, 300);
  };
  
  // 로그인 처리
  const handleLogin = (e) => {
    e.preventDefault();
    
    // 이메일 검증
    if (!validateEmail(loginData.email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    // 로그인 시도
    const result = tryLogin(
      loginData.email, 
      loginData.password, 
      loginData.rememberMe
    );
    
    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      toast.error(result.message);
    }
  };
  
  // 회원가입 처리
  const handleSignup = (e) => {
    e.preventDefault();
    
    // 약관 동의 확인 (필수!)
    if (!signupData.agreeTerms) {
      toast.error('약관에 동의해주세요.');
      return;
    }
    
    // 이메일 검증
    if (!validateEmail(signupData.email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    // 회원가입 시도
    const result = tryRegister(
      signupData.email,
      signupData.password,
      signupData.passwordConfirm
    );
    
    if (result.success) {
      toast.success(result.message);
      // 회원가입 성공 → 로그인 폼으로 자동 전환
      setTimeout(() => {
        setLoginData({
          email: signupData.email,
          password: '',
          rememberMe: false
        });
        toggleMode();
      }, 1000);
    } else {
      toast.error(result.message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-red-900 px-4">
      {/* 카드 플립 컨테이너 */}
      <div 
        className="relative w-full max-w-md"
        style={{ 
          perspective: '1000px',
          minHeight: '500px'
        }}
      >
        {/* 플립 카드 */}
        <div
          className={`
            relative w-full
            transition-transform duration-600 ease-in-out
            ${isLogin ? '' : 'rotate-y-180'}
          `}
          style={{
            transformStyle: 'preserve-3d',
            transform: isLogin ? 'rotateY(0deg)' : 'rotateY(180deg)',
            transition: 'transform 0.6s'
          }}
        >
          {/* 로그인 카드 (앞면) */}
          <div
            className="absolute w-full bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl p-8"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {isLogin && (
              <>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  로그인
                </h2>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      이메일
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faEnvelope} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        ref={emailRef}
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* 비밀번호 (API 키) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      비밀번호 (TMDB API 키)
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faKey} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="TMDB API 키를 입력하세요"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({...loginData, rememberMe: e.target.checked})}
                      className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-600"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                      로그인 상태 유지
                    </label>
                  </div>
                  
                  {/* 로그인 버튼 */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    로그인
                  </button>
                  
                  {/* 회원가입 전환 */}
                  <p className="text-center text-gray-400 text-sm">
                    계정이 없으신가요?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-red-500 hover:text-red-400 font-semibold"
                    >
                      회원가입
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
          
          {/* 회원가입 카드 (뒷면) */}
          <div
            className="absolute w-full bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl p-8"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {!isLogin && (
              <>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  회원가입
                </h2>
                
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      이메일
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faEnvelope} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        ref={emailRef}
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* 비밀번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      비밀번호 (TMDB API 키)
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faKey} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="TMDB API 키를 입력하세요"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                  
                  {/* 비밀번호 확인 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      비밀번호 확인
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faKey} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.passwordConfirm}
                        onChange={(e) => setSignupData({...signupData, passwordConfirm: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="비밀번호를 다시 입력하세요"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* 약관 동의 (필수!) */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={signupData.agreeTerms}
                      onChange={(e) => setSignupData({...signupData, agreeTerms: e.target.checked})}
                      className="w-4 h-4 mt-1 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-600"
                      required
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-300">
                      <span className="text-red-500">*</span> 이용약관 및 개인정보 처리방침에 동의합니다
                    </label>
                  </div>
                  
                  {/* 회원가입 버튼 */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    회원가입
                  </button>
                  
                  {/* 로그인 전환 */}
                  <p className="text-center text-gray-400 text-sm">
                    이미 계정이 있으신가요?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-red-500 hover:text-red-400 font-semibold"
                    >
                      로그인
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* API 키 안내 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-gray-500 text-sm">
          TMDB API 키가 필요합니다 •{' '}
          <a 
            href="https://www.themoviedb.org/settings/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 underline"
          >
            발급받기
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
```

**CSS 추가 (src/index.css에 추가):**
```css
/* 카드 flip 애니메이션 */
.rotate-y-180 {
  transform: rotateY(180deg);
}
```

완전한 SignIn.jsx 코드를 제공해줘.
```

### ✅ 완료 체크
- [ ] SignIn.jsx 생성
- [ ] 카드 flip 애니메이션 테스트 (전환 버튼 클릭)
- [ ] Remember Me 체크 후 로그인 → 브라우저 닫고 다시 열기 테스트
- [ ] Remember Me 체크 안하고 로그인 → 브라우저 닫으면 로그아웃 확인
- [ ] 약관 동의 체크 안하고 회원가입 시도 → 에러 확인
- [ ] 회원가입 성공 → 자동으로 로그인 폼 표시 확인
- [ ] useRef로 input 포커스 확인
- [ ] Git 커밋 후 merge:
  ```bash
  git add .
  git commit -m "feat: 로그인/회원가입 페이지 (카드 flip, Remember Me, 약관 동의)"
  git checkout develop
  git merge feature/auth-pages
  git push origin develop
  git push origin feature/auth-pages
  ```

---


## Step 9: Home 페이지 (4개 API + 영화 설명!) 🏠

### 🔍 목표
- 최소 4개 TMDB API 사용 (필수!)
- 영화 설명(overview) 표시 (필수!)
- 가로 스크롤
- Header 포함

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/home-page
```

### 📋 Claude CLI 프롬프트

```
Home 페이지를 완벽하게 구현해줘. 4개 API + 영화 설명(overview) 필수!

**파일: src/pages/Home.jsx**

요구사항:
1. 4개 TMDB API (인기, 현재상영, 높은평점, 개봉예정)
2. 각 영화 카드에 설명(overview) 표시
3. 가로 스크롤
4. Header 컴포넌트 사용
5. LoadingSpinner
6. useWishlist Hook
7. Font Awesome 아이콘

완전한 코드:
```jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  fetchPopularMovies, 
  fetchNowPlaying, 
  fetchTopRated, 
  fetchUpcoming 
} from '../utils/tmdb';
import { useWishlist } from '../hooks/useWishlist';
import { addToViewHistory } from '../utils/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  
  // 4개 API 로드
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        
        const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
          fetchPopularMovies(1),
          fetchNowPlaying(1),
          fetchTopRated(1),
          fetchUpcoming(1)
        ]);
        
        setPopularMovies(popular.results || []);
        setNowPlayingMovies(nowPlaying.results || []);
        setTopRatedMovies(topRated.results || []);
        setUpcomingMovies(upcoming.results || []);
      } catch (error) {
        console.error('영화 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, []);
  
  // 가로 스크롤
  const scrollSection = (sectionId, direction) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      section.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // 영화 클릭 시 시청 기록 추가
  const handleMovieClick = (movie) => {
    addToViewHistory(movie);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <LoadingSpinner message="영화 목록을 불러오는 중..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero 섹션 (첫 번째 인기 영화) */}
      {popularMovies.length > 0 && (
        <div 
          className="relative h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${popularMovies[0].backdrop_path})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 sm:p-12 lg:p-16 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {popularMovies[0].title}
            </h1>
            
            {/* 영화 설명 (필수!) */}
            <p className="text-base sm:text-lg text-gray-200 mb-6 line-clamp-3">
              {popularMovies[0].overview}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                {popularMovies[0].vote_average?.toFixed(1)}
              </span>
              <span>•</span>
              <span>{popularMovies[0].release_date?.split('-')[0]}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 영화 섹션들 */}
      <div className="px-4 sm:px-8 lg:px-16 pb-16 space-y-12 -mt-32 relative z-10">
        {/* 1. 인기 영화 */}
        <MovieSection
          title="인기 영화"
          movies={popularMovies}
          sectionId="popular-section"
          onScroll={scrollSection}
          onMovieClick={handleMovieClick}
          isInWishlist={isInWishlist}
          toggleWishlist={toggleWishlist}
        />
        
        {/* 2. 현재 상영작 */}
        <MovieSection
          title="현재 상영작"
          movies={nowPlayingMovies}
          sectionId="nowplaying-section"
          onScroll={scrollSection}
          onMovieClick={handleMovieClick}
          isInWishlist={isInWishlist}
          toggleWishlist={toggleWishlist}
        />
        
        {/* 3. 높은 평점 */}
        <MovieSection
          title="높은 평점"
          movies={topRatedMovies}
          sectionId="toprated-section"
          onScroll={scrollSection}
          onMovieClick={handleMovieClick}
          isInWishlist={isInWishlist}
          toggleWishlist={toggleWishlist}
        />
        
        {/* 4. 개봉 예정 */}
        <MovieSection
          title="개봉 예정"
          movies={upcomingMovies}
          sectionId="upcoming-section"
          onScroll={scrollSection}
          onMovieClick={handleMovieClick}
          isInWishlist={isInWishlist}
          toggleWishlist={toggleWishlist}
        />
      </div>
    </div>
  );
}

// 영화 섹션 컴포넌트
function MovieSection({ 
  title, 
  movies, 
  sectionId, 
  onScroll, 
  onMovieClick,
  isInWishlist, 
  toggleWishlist 
}) {
  return (
    <div className="relative group">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        {title}
      </h2>
      
      {/* 왼쪽 스크롤 버튼 */}
      <button
        onClick={() => onScroll(sectionId, 'left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      
      {/* 영화 목록 (가로 스크롤) */}
      <div
        id={sectionId}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {movies.map(movie => (
          <div 
            key={movie.id} 
            onClick={() => onMovieClick(movie)}
            className="flex-shrink-0"
          >
            <MovieCard
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={toggleWishlist}
            />
            
            {/* 영화 설명 (필수!) */}
            {movie.overview && (
              <p className="mt-2 text-xs sm:text-sm text-gray-400 line-clamp-2 max-w-[200px] sm:max-w-[250px]">
                {movie.overview}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {/* 오른쪽 스크롤 버튼 */}
      <button
        onClick={() => onScroll(sectionId, 'right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}

export default Home;
```

완전한 Home.jsx 코드를 제공해줘.
```

### ✅ 완료 체크
- [ ] Home.jsx 생성
- [ ] 4개 API 로드 확인 (콘솔에서 캐시 로그 확인)
- [ ] 각 영화에 설명(overview) 표시 확인
- [ ] 가로 스크롤 작동 확인
- [ ] 영화 클릭 시 시청 기록 저장 확인
- [ ] 위시리스트 추가/삭제 확인
- [ ] Git 커밋 후 merge

---

## Step 10: Popular 페이지 (useRef IntersectionObserver!) 🔥

### 🔍 목표
- Table/Infinite View 전환
- useRef로 IntersectionObserver 구현 (필수!)
- Pagination
- Top 버튼

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/popular-page
```

### 📋 Claude CLI 프롬프트

```
Popular 페이지를 완벽하게 구현해줘. useRef로 IntersectionObserver 필수!

**파일: src/pages/Popular.jsx**

요구사항:
1. Table/Infinite View 전환 버튼
2. Table View: scroll 비활성화, Pagination
3. Infinite View: useRef로 IntersectionObserver (필수!)
4. Top 버튼
5. Header + useWishlist

완전한 코드:
```jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPopularMovies } from '../utils/tmdb';
import { useWishlist } from '../hooks/useWishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTable, 
  faInfinity, 
  faArrowUp,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

function Popular() {
  const [movies, setMovies] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'infinite'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // useRef 활용 7: IntersectionObserver 타겟
  const observerTarget = useRef(null);
  
  // useRef 활용 8: IntersectionObserver 인스턴스
  const observerRef = useRef(null);
  
  // 영화 로드
  const loadMovies = async (page, append = false) => {
    try {
      setLoading(true);
      const data = await fetchPopularMovies(page);
      
      if (append) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('영화 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 초기 로드
  useEffect(() => {
    loadMovies(1);
  }, []);
  
  // Infinite Scroll - IntersectionObserver 설정
  useEffect(() => {
    if (viewMode !== 'infinite') return;
    
    // Observer 콜백
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && currentPage < totalPages) {
        loadMovies(currentPage + 1, true);
      }
    };
    
    // Observer 생성
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.5
    });
    
    // 타겟 관찰 시작
    if (observerTarget.current) {
      observerRef.current.observe(observerTarget.current);
    }
    
    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [viewMode, loading, currentPage, totalPages]);
  
  // View Mode 전환
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentPage(1);
    loadMovies(1);
  };
  
  // 스크롤 이벤트 (Top 버튼)
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Top 버튼
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className={`min-h-screen bg-black ${viewMode === 'table' ? 'overflow-hidden' : ''}`}>
      <Header />
      
      <div className="pt-24 px-4 sm:px-8 lg:px-16 pb-16">
        {/* 제목 및 컨트롤 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            대세 콘텐츠
          </h1>
          
          {/* View Mode 전환 */}
          <div className="flex space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('table')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md transition-colors
                ${viewMode === 'table' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              <FontAwesomeIcon icon={faTable} />
              <span className="hidden sm:inline">Table</span>
            </button>
            
            <button
              onClick={() => handleViewModeChange('infinite')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md transition-colors
                ${viewMode === 'infinite' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              <FontAwesomeIcon icon={faInfinity} />
              <span className="hidden sm:inline">Infinite</span>
            </button>
          </div>
        </div>
        
        {/* 영화 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
        
        {/* Table View - Pagination */}
        {viewMode === 'table' && !loading && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => loadMovies(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              이전
            </button>
            
            <span className="text-white">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => loadMovies(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          </div>
        )}
        
        {/* Infinite View - Observer Target */}
        {viewMode === 'infinite' && currentPage < totalPages && (
          <div ref={observerTarget} className="py-8">
            {loading && <LoadingSpinner size="md" />}
          </div>
        )}
        
        {/* 로딩 */}
        {loading && viewMode === 'table' && (
          <LoadingSpinner size="md" />
        )}
      </div>
      
      {/* Top 버튼 */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all hover:scale-110 z-50"
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-xl" />
        </button>
      )}
    </div>
  );
}

export default Popular;
```

완전한 Popular.jsx 코드를 제공해줘. useRef + IntersectionObserver 필수!
```

### ✅ 완료 체크
- [ ] Popular.jsx 생성
- [ ] Table/Infinite 전환 확인
- [ ] Table View: scroll 비활성화 확인
- [ ] Table View: Pagination 작동 확인
- [ ] Infinite View: 스크롤 끝에 도달하면 자동 로드 확인
- [ ] useRef로 observerTarget 확인
- [ ] Top 버튼 확인
- [ ] Git 커밋 후 merge

---


## Step 11: Search 페이지 (평점/정렬/최근 검색어!) 🔍

### 🔍 목표
- 검색어 입력 (useRef debouncing!)
- 장르 필터
- 평점 필터 (필수!)
- 정렬 (필수!)
- 최근 검색어 표시

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/search-page
```

### 📋 Claude CLI 프롬프트

```
Search 페이지를 완벽하게 구현해줘. useRef debouncing + 평점/정렬 필터 + 최근 검색어!

**파일: src/pages/Search.jsx**

요구사항:
1. 검색어 입력 (useRef로 debouncing - 필수!)
2. 장르 필터
3. 평점 필터 (추가!)
4. 정렬 (추가!)
5. 최근 검색어 표시
6. 초기화 버튼

완전한 코드:
```jsx
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  searchMovies, 
  fetchGenres, 
  fetchMoviesWithFilters,
  SORT_OPTIONS
} from '../utils/tmdb';
import { useWishlist } from '../hooks/useWishlist';
import { 
  addSearchHistory, 
  getSearchHistory, 
  clearSearchHistory 
} from '../utils/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faTimes,
  faHistory
} from '@fortawesome/free-solid-svg-icons';

function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    genreId: '',
    minRating: '',
    sortBy: 'popularity.desc'
  });
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // useRef 활용 9: Debouncing 타이머
  const searchTimerRef = useRef(null);
  
  // useRef 활용 10: 검색 input 포커스
  const searchInputRef = useRef(null);
  
  // 초기 로드
  useEffect(() => {
    loadGenres();
    loadSearchHistory();
    
    // 자동 포커스
    searchInputRef.current?.focus();
  }, []);
  
  // 장르 로드
  const loadGenres = async () => {
    try {
      const data = await fetchGenres();
      setGenres(data);
    } catch (error) {
      console.error('장르 로드 실패:', error);
    }
  };
  
  // 최근 검색어 로드
  const loadSearchHistory = () => {
    setSearchHistory(getSearchHistory());
  };
  
  // 검색 실행
  const performSearch = async (searchQuery, filterOptions = filters) => {
    if (!searchQuery && !filterOptions.genreId) {
      setMovies([]);
      return;
    }
    
    try {
      setLoading(true);
      
      let data;
      if (searchQuery) {
        // 검색어가 있으면 검색 API
        data = await searchMovies(searchQuery);
        
        // 검색 기록 저장
        if (data.results.length > 0) {
          addSearchHistory(searchQuery, data.total_results);
          loadSearchHistory();
        }
      } else {
        // 검색어 없으면 필터 API
        data = await fetchMoviesWithFilters(filterOptions);
      }
      
      setMovies(data.results || []);
    } catch (error) {
      console.error('검색 실패:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Debounced 검색
  const handleSearchInput = (value) => {
    setQuery(value);
    
    // 기존 타이머 클리어
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // 500ms 후 검색
    searchTimerRef.current = setTimeout(() => {
      performSearch(value, filters);
    }, 500);
  };
  
  // 필터 변경
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    performSearch(query, newFilters);
  };
  
  // 초기화
  const handleReset = () => {
    setQuery('');
    setFilters({
      genreId: '',
      minRating: '',
      sortBy: 'popularity.desc'
    });
    setMovies([]);
    searchInputRef.current?.focus();
  };
  
  // 최근 검색어 클릭
  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    performSearch(historyQuery, filters);
  };
  
  // 검색 기록 삭제
  const handleClearHistory = () => {
    clearSearchHistory();
    loadSearchHistory();
  };
  
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 px-4 sm:px-8 lg:px-16 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          찾아보기
        </h1>
        
        {/* 검색 및 필터 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 space-y-6">
          {/* 검색창 */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="영화 제목을 검색하세요..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          
          {/* 최근 검색어 */}
          {searchHistory.length > 0 && !query && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 flex items-center">
                  <FontAwesomeIcon icon={faHistory} className="mr-2" />
                  최근 검색어
                </p>
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item.query)}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-full transition-colors"
                  >
                    {item.query} ({item.results})
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* 필터 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 장르 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                장르
              </label>
              <select
                value={filters.genreId}
                onChange={(e) => handleFilterChange('genreId', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">전체</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 평점 (필수!) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">평점</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">전체</option>
                <option value="9">9점 이상</option>
                <option value="8">8점 이상</option>
                <option value="7">7점 이상</option>
                <option value="6">6점 이상</option>
                <option value="5">5점 이상</option>
              </select>
            </div>
            
            {/* 정렬 (필수!) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">정렬</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 초기화 */}
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                초기화
              </button>
            </div>
          </div>
        </div>
        
        {/* 검색 결과 */}
        {loading ? (
          <LoadingSpinner message="검색 중..." />
        ) : movies.length > 0 ? (
          <>
            <p className="text-gray-400 mb-4">
              {movies.length}개의 영화를 찾았습니다
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {movies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWishlist={isInWishlist(movie.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              영화를 검색하거나 필터를 선택해주세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
```

완전한 Search.jsx 코드를 제공해줘. useRef debouncing + 평점/정렬 필터 필수!
```

### ✅ 완료 체크
- [ ] Search.jsx 생성
- [ ] useRef로 debouncing 확인 (500ms)
- [ ] 장르 필터 확인
- [ ] 평점 필터 확인 (필수!)
- [ ] 정렬 확인 (필수!)
- [ ] 최근 검색어 표시 확인
- [ ] 초기화 버튼 확인
- [ ] Git 커밋 후 merge

---

## Step 12: Wishlist 페이지 (API 호출 금지!) ❤️

### 🔍 목표
- LocalStorage에서만 데이터 로드 (API 호출 금지!)
- 전체 삭제 버튼

### 📌 새 브랜치
```bash
git checkout develop
git checkout -b feature/wishlist-page
```

### 📋 Claude CLI 프롬프트

```
Wishlist 페이지를 구현해줘. API 호출 금지! LocalStorage만 사용!

**파일: src/pages/Wishlist.jsx**

요구사항:
1. API 호출 금지 (LocalStorage만 사용)
2. 전체 삭제 버튼
3. 빈 상태 처리

완전한 코드:
```jsx
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { useWishlist } from '../hooks/useWishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';

function Wishlist() {
  const { wishlist, toggleWishlist, isInWishlist, clearWishlist } = useWishlist();
  
  const handleClearAll = () => {
    if (wishlist.length === 0) return;
    
    if (window.confirm(`${wishlist.length}개의 영화를 모두 삭제하시겠습니까?`)) {
      clearWishlist();
    }
  };
  
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 px-4 sm:px-8 lg:px-16 pb-16">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center">
            <FontAwesomeIcon icon={faHeart} className="text-red-600 mr-3" />
            내가 찜한 리스트
          </h1>
          
          {wishlist.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>전체 삭제</span>
            </button>
          )}
        </div>
        
        {/* 영화 목록 */}
        {wishlist.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">
              {wishlist.length}개의 영화가 찜 목록에 있습니다
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {wishlist.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWishlist={isInWishlist(movie.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32">
            <FontAwesomeIcon 
              icon={faHeart} 
              className="text-gray-800 text-8xl mb-6"
            />
            <p className="text-gray-500 text-xl mb-2">
              찜한 영화가 없습니다
            </p>
            <p className="text-gray-600 text-sm">
              마음에 드는 영화를 찜 목록에 추가해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
```

완전한 Wishlist.jsx 코드를 제공해줘. API 호출 절대 금지!
```

### ✅ 완료 체크
- [ ] Wishlist.jsx 생성
- [ ] API 호출 없는지 확인 (네트워크 탭 확인)
- [ ] LocalStorage에서만 로드 확인
- [ ] 전체 삭제 버튼 확인
- [ ] 빈 상태 UI 확인
- [ ] Git 커밋 후 merge:
  ```bash
  git add .
  git commit -m "feat: Home, Popular, Search, Wishlist 페이지 완성"
  git checkout develop
  git merge feature/wishlist-page
  git push origin develop
  git push origin feature/wishlist-page
  ```

---


## Step 13: PR/이슈 템플릿 📋

### 🔍 목표
- Pull Request 템플릿
- 이슈 템플릿 (버그, 기능)

### 📌 브랜치
`develop` 에서 직접 작업

### 📋 Claude CLI 프롬프트

```
GitHub PR 템플릿과 이슈 템플릿을 생성해줘.

**파일 1: .github/pull_request_template.md**

```markdown
## 📝 변경 사항
<!-- 이 PR에서 무엇을 변경했는지 설명해주세요 -->

## 🎯 작업 내용
<!-- 체크리스트 형태로 작성 -->
- [ ] 새로운 기능 구현
- [ ] 버그 수정
- [ ] 문서 업데이트
- [ ] 코드 리팩토링

## 🔍 테스트
<!-- 어떻게 테스트했는지 설명 -->
- [ ] 로컬에서 `npm run dev` 테스트 완료
- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] 모바일 반응형 확인
- [ ] 모든 페이지 라우팅 확인

## 📸 스크린샷
<!-- 필요시 스크린샷 첨부 -->

## 🔗 관련 이슈
<!-- 관련된 이슈 번호 -->
Closes #

## ✅ 체크리스트
- [ ] 커밋 메시지 컨벤션 준수 (feat/fix/docs 등)
- [ ] 코드 리뷰 준비 완료
- [ ] 충돌 해결 완료
- [ ] ESLint 경고 없음
```

**파일 2: .github/ISSUE_TEMPLATE/bug_report.md**

```markdown
---
name: 버그 리포트
about: 버그를 발견했을 때 사용하는 템플릿
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 버그 설명
<!-- 버그에 대한 명확하고 간결한 설명 -->

## 📍 재현 방법
1. '...' 페이지로 이동
2. '...' 버튼 클릭
3. 스크롤 다운
4. 에러 발생

## 🎯 예상 동작
<!-- 어떻게 동작해야 하는지 -->

## 📸 스크린샷
<!-- 가능하면 스크린샷 첨부 -->

## 💻 환경
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Version: [버전]

## 📝 추가 정보
<!-- 기타 참고사항 -->
```

**파일 3: .github/ISSUE_TEMPLATE/feature_request.md**

```markdown
---
name: 기능 제안
about: 새로운 기능을 제안할 때 사용
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 🚀 기능 설명
<!-- 어떤 기능을 추가하고 싶은지 -->

## 💡 동기
<!-- 왜 이 기능이 필요한지 -->

## 📋 구현 아이디어
<!-- 어떻게 구현할 수 있을지 -->

## 📸 예시
<!-- 비슷한 기능의 예시나 스케치 -->
```

3개 파일을 생성해줘.
```

### ✅ 완료 체크
- [ ] pull_request_template.md 생성
- [ ] bug_report.md 생성
- [ ] feature_request.md 생성
- [ ] Git 커밋:
  ```bash
  git add .github/
  git commit -m "docs: PR 및 이슈 템플릿 추가"
  git push origin develop
  ```

---

## Step 14: 배포 설정 🚀

### 🔍 목표
- vite.config.js 수정 (base 경로)
- GitHub Actions workflow
- 브랜치 보호 규칙 설정

### 📌 브랜치
```bash
git checkout develop
git checkout -b feature/deployment
```

### 📋 Claude CLI 프롬프트

```
GitHub Pages 배포 설정을 완벽하게 구성해줘. vite.config.js + GitHub Actions!

**파일 1: vite.config.js 수정**

⚠️ 중요: base 경로를 repository 이름으로 설정해야 GitHub Pages에서 작동!

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/netflix-clone-react/', // ⚠️ 본인의 repository 이름으로 변경!
})
```

**파일 2: .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**파일 3: package.json에 scripts 추가**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

**작업 4: GitHub Repository 설정**

1. **GitHub Secrets 설정:**
```
Repository → Settings → Secrets and variables → Actions
→ New repository secret
Name: TMDB_API_KEY
Value: your_tmdb_api_key_here
```

2. **GitHub Pages 설정:**
```
Repository → Settings → Pages
Source: GitHub Actions
```

3. **브랜치 보호 규칙 (Optional):**
```
Repository → Settings → Branches
→ Add branch protection rule

Branch name pattern: main

체크:
✅ Require a pull request before merging
✅ Require status checks to pass before merging
   - build
✅ Do not allow bypassing the above settings
```

**작업 5: develop → main merge**

```bash
# 모든 변경사항 커밋
git add .
git commit -m "feat: GitHub Pages 배포 설정"

# develop push
git push origin develop

# main으로 전환
git checkout main
git merge develop

# main push (배포 트리거!)
git push origin main
```

모든 파일과 설정 방법을 제공해줘.
```

### ✅ 완료 체크
- [ ] vite.config.js 수정 (base 경로)
- [ ] deploy.yml 생성
- [ ] GitHub Secrets 설정 (TMDB_API_KEY)
- [ ] GitHub Pages 설정
- [ ] main 브랜치에 push
- [ ] GitHub Actions 실행 확인
- [ ] GitHub Pages URL 접속 확인
- [ ] 배포된 사이트 테스트

---

## Step 15: 완벽한 README.md 📖

### 🔍 목표
- 프로젝트 정보
- 설치 가이드
- 폴더 구조
- 기술 스택
- 브랜치 전략
- LocalStorage 구조

### 📌 브랜치
`main` (배포 후 작업)

### 📋 Claude CLI 프롬프트

```
프로젝트 README.md를 완벽하게 작성해줘. 모든 정보 포함!

**파일: README.md 전체 교체**

```markdown
# Netflix 클론 프로젝트 🎬

React + Vite + TMDB API를 활용한 Netflix 스타일 영화 스트리밍 웹사이트

## 📋 프로젝트 정보

- **프로젝트명:** Netflix Clone
- **개발 기간:** 2024.12.01 - 2024.12.16
- **개발자:** [이름] ([학번]) - [분반]
- **배포 URL:** https://[username].github.io/netflix-clone-react/

## ✨ 주요 기능

### 1. 인증 시스템
- 로그인/회원가입 (카드 flip 애니메이션)
- TMDB API 키를 비밀번호로 사용
- Remember Me 기능 (LocalStorage/SessionStorage)
- 약관 동의 필수 체크

### 2. 영화 목록
- **4개 카테고리:** 인기, 현재상영, 높은평점, 개봉예정
- 가로 스크롤 지원
- 영화 설명(overview) 표시

### 3. 대세 콘텐츠
- Table View / Infinite Scroll 전환
- Pagination (Table View)
- IntersectionObserver (Infinite Scroll)
- 맨 위로 버튼

### 4. 검색 & 필터링
- 실시간 검색 (500ms debouncing)
- 장르별 필터링
- 평점별 필터링
- 8가지 정렬 옵션
- 최근 검색어 표시

### 5. 찜 목록
- LocalStorage 기반 위시리스트
- 실시간 추가/제거
- API 호출 없이 LocalStorage만 사용

### 6. 반응형 디자인
- Mobile / Tablet / Desktop 대응
- Tailwind CSS breakpoints

## 🛠️ 기술 스택

### Frontend
- **React 18.x** - UI 라이브러리
- **React Router DOM 6.x** - SPA 라우팅
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Axios** - HTTP 클라이언트
- **react-hot-toast** - Toast 알림
- **Font Awesome** - 아이콘
- **react-transition-group** - 페이지 전환 애니메이션

### API
- **TMDB API v3** - 영화 데이터

### Deployment
- **GitHub Actions** - CI/CD
- **GitHub Pages** - 호스팅

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/[username]/netflix-clone-react.git
cd netflix-clone-react
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env` 파일 생성:
```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

TMDB API 키 발급: https://www.themoviedb.org/settings/api

### 4. 개발 서버 실행
```bash
npm run dev
```
http://localhost:5173 접속

### 5. 빌드
```bash
npm run build
```

## 📁 프로젝트 구조

```
netflix-clone-react/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml                 # GitHub Actions
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── src/
│   ├── components/                    # 재사용 컴포넌트
│   │   ├── Header.jsx
│   │   ├── MovieCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/                         # 페이지 컴포넌트
│   │   ├── SignIn.jsx
│   │   ├── Home.jsx
│   │   ├── Popular.jsx
│   │   ├── Search.jsx
│   │   └── Wishlist.jsx
│   ├── hooks/                         # Custom Hooks
│   │   ├── useAuth.js
│   │   └── useWishlist.js
│   ├── utils/                         # 유틸리티 함수
│   │   ├── auth.js                    # 인증 로직
│   │   ├── tmdb.js                    # TMDB API
│   │   ├── storage.js                 # LocalStorage 관리
│   │   └── security.js                # 보안 유틸
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                               # 환경변수 (gitignore)
├── .env.example                       # 환경변수 예시
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🌿 Git 브랜치 전략 (Gitflow)

```
main (프로덕션)
 └── develop (개발)
      ├── feature/project-setup
      ├── feature/auth-system
      ├── feature/storage-utils
      ├── feature/tmdb-api
      ├── feature/components
      ├── feature/auth-pages
      ├── feature/home-page
      ├── feature/popular-page
      ├── feature/search-page
      ├── feature/wishlist-page
      └── feature/deployment
```

### 브랜치 작업 흐름
```bash
# 1. develop에서 feature 브랜치 생성
git checkout develop
git checkout -b feature/new-feature

# 2. 작업 및 커밋
git add .
git commit -m "feat: 새 기능 추가"

# 3. develop에 merge
git checkout develop
git merge feature/new-feature
git push origin develop

# 4. feature 브랜치도 push (평가용)
git push origin feature/new-feature
```

## 📝 커밋 메시지 컨벤션

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드, 패키지 관리

예시:
```
feat: 로그인 페이지 카드 flip 애니메이션 추가
fix: 위시리스트 중복 추가 버그 수정
docs: README.md 설치 가이드 업데이트
```

## 💾 LocalStorage 구조 (12개 키)

```javascript
{
  // 필수 (5개)
  "netflix_users": [
    { id: "user@example.com", password: "encoded_api_key", createdAt: 1234567890 }
  ],
  "netflix_apiKey": "encoded_api_key",
  "netflix_isLoggedIn": "true",
  "netflix_currentUser": "user@example.com",
  "netflix_wishlist": [
    { id: 123, title: "영화 제목", poster_path: "/path.jpg", ... }
  ],
  
  // 추가 (7개)
  "netflix_searchHistory": [
    { query: "avengers", timestamp: 1234567890, results: 145 }
  ],
  "netflix_viewHistory": [
    { id: 123, viewedAt: 1234567890, ... }
  ],
  "netflix_settings": {
    theme: "dark",
    language: "ko-KR",
    autoPlay: true,
    quality: "high"
  },
  "netflix_genresCache": {
    data: [...],
    timestamp: 1234567890,
    version: "1.0"
  },
  "netflix_rememberMe": "true",
  "netflix_popularCache_1": { data: [...], timestamp: 1234567890 },
  "netflix_nowPlayingCache_1": { data: [...], timestamp: 1234567890 }
}
```

## 🔑 주요 기술 구현

### 1. useRef 활용 (10곳)
- MovieCard: DOM 접근, 이전 값 추적, 타이머
- Header: 스크롤 debouncing, 이전 스크롤 위치
- SignIn: Input 포커스
- Popular: IntersectionObserver 타겟 및 인스턴스
- Search: Debouncing 타이머, Input 포커스

### 2. Bottom-Up 데이터 전달
- MovieCard → Parent: `onToggleWishlist(movie)` 콜백

### 3. 캐싱 시스템
- 장르 목록: 24시간 캐싱
- 인기 영화: 1시간 캐싱
- 유효기간 자동 관리

### 4. 보안
- API 키 난독화 (Base64 + SALT)
- XSS 방지 (sanitizeInput)
- 이메일 형식 검증

## 🚀 배포

- **배포 URL**: https://[username].github.io/netflix-clone-react/
- **자동 배포**: main 브랜치 push 시 GitHub Actions 실행

## 📱 반응형 Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

## 📄 라이선스

MIT License

## 👨‍💻 개발자

- **이름**: [이름]
- **학번**: [학번]
- **분반**: [분반]
- **이메일**: [이메일]
- **GitHub**: https://github.com/[username]

## 🙏 참고

- TMDB API: https://www.themoviedb.org/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
```

완전한 README.md를 작성해줘.
```

### ✅ 완료 체크
- [ ] README.md 전체 교체
- [ ] 개인 정보 입력 (이름, 학번, 분반)
- [ ] GitHub 저장소 URL 업데이트
- [ ] Git 커밋:
  ```bash
  git add README.md
  git commit -m "docs: 완벽한 README.md 작성"
  git push origin main
  ```

---

## Step 16: AI.pdf 가이드 📄

### 🔍 목표
- 20개 Q&A 선별
- 각 질문에 스크린샷
- PDF 또는 PPT 작성

### 📋 Claude CLI 프롬프트

```
AI 활용 보고서 작성 가이드를 만들어줘.

**AI.pdf / AI.ppt 구성**

### 1. 표지
```
Netflix 클론 프로젝트
AI 활용 보고서

이름: [이름]
학번: [학번]
분반: [분반]
```

### 2. 프로젝트 개요 (1페이지)
- 프로젝트 소개
- 기술 스택
- 주요 기능

### 3. Q&A (20페이지 - 각 Step별)

**Step별 질문 개수 (총 20개):**
- Step 0-1 (Setup): 2개
- Step 2 (Router): 1개
- Step 3 (Storage): 2개
- Step 4 (Auth): 2개
- Step 5 (TMDB API): 2개
- Step 6 (Hooks): 1개
- Step 7 (Components): 2개
- Step 8 (SignIn): 2개
- Step 9 (Home): 2개
- Step 10 (Popular): 2개
- Step 11 (Search): 2개
- Step 12 (Wishlist): 1개
- Step 13-16 (배포/README): 1개

**각 페이지 구성:**
```
페이지 번호: Q1

질문:
React 프로젝트에서 Font Awesome 아이콘을 사용하려면
어떻게 설치하고 사용하나요?

답변 요약:
1. 패키지 설치
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/react-fontawesome

2. 사용 예시
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faHeart} />

스크린샷:
[Claude와의 대화 캡쳐 이미지]

프로젝트 적용:
Header.jsx, MovieCard.jsx 등 여러 컴포넌트에서
Font Awesome 아이콘을 사용하여 UI를 구성했습니다.
```

### 4. 결론 (1페이지)
- AI 활용 소감
- 프로젝트 완성 소감
- 배운 점

### 📸 스크린샷 캡쳐 방법

**Windows:**
- Win + Shift + S → 영역 선택 → Ctrl + V로 붙여넣기

**Mac:**
- Cmd + Shift + 4 → 영역 선택 → 자동 저장

**좋은 Q&A 예시:**
```
✅ 좋은 예:
Q: useRef를 사용한 IntersectionObserver 구현 방법
A: [구체적인 코드와 설명]

❌ 나쁜 예:
Q: 리액트가 뭐예요?
A: 리액트는 페이스북이 만든 라이브러리입니다.
```

**PDF 생성 방법:**
1. Google Slides 또는 PowerPoint 작성
2. 파일 → 다운로드 → PDF
3. AI.pdf로 저장

가이드를 자세히 제공해줘.
```

### ✅ 완료 체크
- [ ] 20개 Q&A 선별
- [ ] 각 질문에 스크린샷 캡쳐
- [ ] AI.pdf 또는 AI.ppt 작성
- [ ] 표지, 프로젝트 개요, 결론 포함

---

## 🎉 최종 제출 체크리스트

### 📦 제출 파일 구성
```
WSD-분반-학번-이름-2차과제.zip
├── netflix-clone-react/          ✅
│   ├── src/
│   ├── public/
│   ├── .github/
│   ├── package.json              ⚠️ 필수!
│   ├── README.md                 ⚠️ 필수!
│   ├── vite.config.js
│   └── (node_modules 제외!)      ⚠️ 필수!
├── link.pdf                      ⚠️ 필수!
├── mobile.mp4                    ⚠️ 필수!
└── AI.pdf (또는 AI.ppt)          ⚠️ 필수!
```

### ✅ 구현 항목 체크

**필수 항목:**
- [ ] React + SPA
- [ ] useRef 10곳 이상
- [ ] Bottom-Up 전달
- [ ] Font Awesome 아이콘
- [ ] 페이지 전환 Transition
- [ ] 4개 TMDB API
- [ ] 영화 설명(overview) 표시
- [ ] 카드 flip 애니메이션
- [ ] Remember Me
- [ ] 약관 동의
- [ ] LocalStorage 12개 키
- [ ] Gitflow 브랜치
- [ ] GitHub Actions 배포
- [ ] 평점별 필터링
- [ ] 정렬 기능
- [ ] 최근 검색어

**Optional (가산점):**
- [ ] 장르 캐싱
- [ ] 인기 영화 캐싱
- [ ] 시청 기록
- [ ] 사용자 설정
- [ ] API 키 난독화
- [ ] 에러 핸들링
- [ ] PR 템플릿
- [ ] 이슈 템플릿
- [ ] 브랜치 보호 규칙

### 🚀 배포 확인
- [ ] GitHub Pages 접속 가능
- [ ] 모든 페이지 작동
- [ ] 모바일에서 테스트
- [ ] mobile.mp4 녹화

### 📝 문서 확인
- [ ] README.md 완전
- [ ] link.pdf 작성
- [ ] AI.pdf 20개 Q&A

---

## 🎯 마지막 점검

```bash
# 1. 모든 패키지 정상 설치 확인
npm install

# 2. 개발 서버 실행 확인
npm run dev

# 3. 빌드 성공 확인
npm run build

# 4. 빌드 결과 미리보기
npm run preview

# 5. Git 상태 확인
git status

# 6. 모든 브랜치 push 확인
git branch -a

# 7. GitHub Pages 접속 확인
# https://[username].github.io/netflix-clone-react/
```

---

## 💡 유용한 팁

### 디버깅
```javascript
// LocalStorage 확인
console.log(localStorage);

// 캐시 확인
import { getStorageInfo } from './utils/storage';
console.log(getStorageInfo());

// API 키 확인
import { getApiKey } from './utils/auth';
console.log(getApiKey());
```

### 문제 해결
1. **페이지가 404:**
   - vite.config.js의 base 확인
   
2. **이미지가 안 보임:**
   - TMDB 이미지 URL 확인
   
3. **API 에러:**
   - API 키 확인
   - 로그인 상태 확인

### 제출 전 최종 확인
```bash
# node_modules 제거 확인
ls -la | grep node_modules  # 없어야 함

# package.json 존재 확인
ls -la | grep package.json  # 있어야 함

# .env 제거 확인 (.gitignore에 있어야 함)
cat .gitignore | grep .env
```

---

## 🎊 완성!

**모든 Step을 완료하셨습니다!**

**제출 기한: 2025년 12월 16일 23:59 (KST)**

**화이팅! 🚀**

