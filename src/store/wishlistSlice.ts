import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WishlistItem } from '../types';
import { getWishlist, removeFromWishlist as removeFromStorage, safeSetItem, STORAGE_KEYS } from '../utils/storage';

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: getWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        // 직접 저장 (WishlistItem 타입 그대로)
        safeSetItem(STORAGE_KEYS.WISHLIST, state.items);
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      removeFromStorage(action.payload);
    },
    clearAll: (state) => {
      state.items = [];
    },
    syncWithStorage: (state) => {
      state.items = getWishlist();
    },
  },
});

export const { addItem, removeItem, clearAll, syncWithStorage } = wishlistSlice.actions;
export default wishlistSlice.reducer;
