/**
 * MovieCard 컴포넌트 테스트
 * @description 영화 카드 UI, 위시리스트 토글, 접근성 테스트
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MovieCard from './MovieCard';
import wishlistReducer from '../store/wishlistSlice';
import genreReducer from '../store/genreSlice';
import type { Movie } from '../types';

// 테스트용 Mock 영화 데이터
const mockMovie: Movie = {
  id: 1,
  title: '테스트 영화',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  overview: '테스트 영화 줄거리입니다.',
  vote_average: 8.5,
  vote_count: 1000,
  release_date: '2024-01-15',
  popularity: 100,
  adult: false,
  original_language: 'ko',
  original_title: 'Test Movie',
  video: false,
};

// 테스트용 스토어 생성 함수
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      wishlist: wishlistReducer,
      genre: genreReducer,
    },
    preloadedState: {
      genre: {
        genres: [
          { id: 28, name: '액션' },
          { id: 12, name: '모험' },
          { id: 35, name: '코미디' },
        ],
        genreMap: { 28: '액션', 12: '모험', 35: '코미디' },
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
  });
};

// 테스트 래퍼 컴포넌트
const renderWithProvider = (
  component: React.ReactNode,
  store = createTestStore()
) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('MovieCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('렌더링', () => {
    it('영화 제목을 렌더링한다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      expect(screen.getByText('테스트 영화')).toBeInTheDocument();
    });

    it('영화 평점을 표시한다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      expect(screen.getByText('8.5')).toBeInTheDocument();
    });

    it('개봉년도를 표시한다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('포스터 이미지를 렌더링한다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      const img = screen.getByAltText('테스트 영화');
      expect(img).toBeInTheDocument();
    });

    it('줄거리를 표시한다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      expect(screen.getByText('테스트 영화 줄거리입니다.')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('적절한 aria-label을 가진다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      const card = screen.getByRole('button', { name: /테스트 영화 상세 정보 보기/i });
      expect(card).toBeInTheDocument();
    });

    it('키보드로 포커스 가능하다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      const card = screen.getByRole('button', { name: /테스트 영화 상세 정보 보기/i });
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('Enter 키로 모달을 열 수 있다', async () => {
      const user = userEvent.setup();
      renderWithProvider(<MovieCard movie={mockMovie} />);

      const card = screen.getByRole('button', { name: /테스트 영화 상세 정보 보기/i });
      await user.tab();
      await user.keyboard('{Enter}');

      // 모달이 열리면 닫기 버튼이 나타남
      expect(screen.getByRole('button', { name: /닫기|close/i })).toBeInTheDocument();
    });

    it('Space 키로 모달을 열 수 있다', async () => {
      const user = userEvent.setup();
      renderWithProvider(<MovieCard movie={mockMovie} />);

      const card = screen.getByRole('button', { name: /테스트 영화 상세 정보 보기/i });
      card.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('button', { name: /닫기|close/i })).toBeInTheDocument();
    });

    it('위시리스트 버튼에 적절한 aria-label이 있다', () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);
      const wishlistBtn = screen.getByLabelText(/위시리스트에 추가/i);
      expect(wishlistBtn).toBeInTheDocument();
    });
  });

  describe('위시리스트 기능', () => {
    it('위시리스트 버튼 클릭 시 영화가 추가된다', async () => {
      const store = createTestStore({ wishlist: { items: [] } });
      renderWithProvider(<MovieCard movie={mockMovie} />, store);

      const wishlistBtn = screen.getByLabelText(/위시리스트에 추가/i);
      fireEvent.click(wishlistBtn);

      expect(store.getState().wishlist.items).toHaveLength(1);
      expect(store.getState().wishlist.items[0].id).toBe(mockMovie.id);
    });

    it('이미 위시리스트에 있으면 제거된다', async () => {
      const store = createTestStore({
        wishlist: {
          items: [{
            id: mockMovie.id,
            title: mockMovie.title,
            poster_path: mockMovie.poster_path,
            vote_average: mockMovie.vote_average,
            addedAt: new Date().toISOString(),
          }],
        },
      });
      renderWithProvider(<MovieCard movie={mockMovie} />, store);

      const wishlistBtn = screen.getByLabelText(/위시리스트에서 제거/i);
      fireEvent.click(wishlistBtn);

      expect(store.getState().wishlist.items).toHaveLength(0);
    });

    it('onWishlistChange 콜백이 호출된다', async () => {
      const onWishlistChange = vi.fn();
      renderWithProvider(
        <MovieCard movie={mockMovie} onWishlistChange={onWishlistChange} />
      );

      const wishlistBtn = screen.getByLabelText(/위시리스트에 추가/i);
      fireEvent.click(wishlistBtn);

      expect(onWishlistChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('모달 기능', () => {
    it('카드 클릭 시 상세 모달이 열린다', async () => {
      renderWithProvider(<MovieCard movie={mockMovie} />);

      const card = screen.getByRole('button', { name: /테스트 영화 상세 정보 보기/i });
      fireEvent.click(card);

      // 모달 내의 영화 제목 확인 (h2 태그)
      expect(screen.getByRole('heading', { level: 2, name: '테스트 영화' })).toBeInTheDocument();
    });
  });

  describe('엣지 케이스', () => {
    it('줄거리가 없으면 기본 메시지를 표시한다', () => {
      const movieWithoutOverview = { ...mockMovie, overview: '' };
      renderWithProvider(<MovieCard movie={movieWithoutOverview} />);
      expect(screen.getByText('줄거리 정보가 없습니다.')).toBeInTheDocument();
    });

    it('평점이 없어도 에러 없이 렌더링된다', () => {
      const movieWithoutRating = { ...mockMovie, vote_average: 0 };
      renderWithProvider(<MovieCard movie={movieWithoutRating} />);
      expect(screen.getByText('0.0')).toBeInTheDocument();
    });

    it('개봉일이 없어도 에러 없이 렌더링된다', () => {
      const movieWithoutDate = { ...mockMovie, release_date: '' };
      renderWithProvider(<MovieCard movie={movieWithoutDate} />);
      // 빈 문자열의 split 결과가 표시됨
      expect(screen.getByText('테스트 영화')).toBeInTheDocument();
    });
  });
});
