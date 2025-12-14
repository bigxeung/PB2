import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Genre } from '../types';
import { fetchGenres } from '../utils/tmdb';

interface GenreState {
  genres: Genre[];
  genreMap: Record<number, string>;
  isLoading: boolean;
  error: string | null;
}

const initialState: GenreState = {
  genres: [],
  genreMap: {},
  isLoading: false,
  error: null,
};

// 장르 목록 비동기 로드
export const loadGenres = createAsyncThunk(
  'genre/loadGenres',
  async (_, { rejectWithValue }) => {
    try {
      const genres = await fetchGenres();
      return genres;
    } catch (error) {
      return rejectWithValue('장르 목록을 불러오는데 실패했습니다.');
    }
  }
);

const genreSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadGenres.fulfilled, (state, action) => {
        state.isLoading = false;
        state.genres = action.payload;
        // ID -> 이름 매핑 생성
        state.genreMap = action.payload.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {} as Record<number, string>);
      })
      .addCase(loadGenres.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default genreSlice.reducer;
