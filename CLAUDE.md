# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Netflix clone built with React 19, Vite 7, and Tailwind CSS 4. Uses TMDB API for movie data.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Environment Setup

Create a `.env` file with your TMDB API key:
```
VITE_TMDB_API_KEY=your_api_key_here
```

## Architecture

### Routing & Authentication
- `App.jsx` - Main router using react-router-dom with animated route transitions (react-transition-group)
- `ProtectedRoute` component wraps authenticated pages, redirects to `/signin` if not logged in
- Auth state stored in localStorage via `utils/auth.js`

### Data Layer
- `utils/tmdb.js` - Axios-based TMDB API client with Korean locale (`ko-KR`)
- `utils/storage.js` - Comprehensive localStorage management with:
  - Cache system with configurable TTL (1hr/24hr/7d)
  - 5MB storage limit with automatic cleanup
  - All keys prefixed with `netflix_`

### Custom Hooks
- `useAuth` - Authentication state management
- `useWishlist` - Wishlist operations (add/remove/toggle/clear)

### Pages
- `/` - Home with hero banner + movie sections (popular, now playing, top rated)
- `/popular` - Popular movies with filtering
- `/search` - Movie search
- `/wishlist` - User's saved movies
- `/signin` - Login page (public route)

### UI Components
- `Header` - Navigation with logout
- `MovieCard` - Movie poster with wishlist toggle
- `LoadingSpinner` - Loading indicator

### Key Dependencies
- FontAwesome for icons (`@fortawesome/*`)
- react-hot-toast for notifications
- axios for HTTP requests
