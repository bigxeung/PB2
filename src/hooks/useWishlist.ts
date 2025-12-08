import { useState, useEffect, useCallback } from 'react';
import type { Movie, WishlistItem } from '../types';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist
} from '../utils/storage';

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  count: number;
  addMovie: (movie: Movie) => boolean;
  removeMovie: (movieId: number) => void;
  toggleMovie: (movie: Movie) => boolean;
  clearAll: () => void;
  isInWishlist: (movieId: number) => boolean;
  refresh: () => void;
}

/**
 * 위시리스트를 관리하는 커스텀 훅
 */
export function useWishlist(): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const loadWishlist = useCallback((): void => {
    const list = getWishlist();
    setWishlist(list);
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const addMovie = useCallback((movie: Movie): boolean => {
    const added = addToWishlist(movie);
    if (added) {
      loadWishlist();
    }
    return added;
  }, [loadWishlist]);

  const removeMovie = useCallback((movieId: number): void => {
    removeFromWishlist(movieId);
    loadWishlist();
  }, [loadWishlist]);

  const toggleMovie = useCallback((movie: Movie): boolean => {
    if (isInWishlist(movie.id)) {
      removeMovie(movie.id);
      return false;
    } else {
      addMovie(movie);
      return true;
    }
  }, [addMovie, removeMovie]);

  const clearAll = useCallback((): void => {
    clearWishlist();
    setWishlist([]);
  }, []);

  const checkInWishlist = useCallback((movieId: number): boolean => {
    return isInWishlist(movieId);
  }, []);

  return {
    wishlist,
    count: wishlist.length,
    addMovie,
    removeMovie,
    toggleMovie,
    clearAll,
    isInWishlist: checkInWishlist,
    refresh: loadWishlist
  };
}

export default useWishlist;
