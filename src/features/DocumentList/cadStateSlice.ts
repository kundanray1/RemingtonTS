import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Interfaces for materials, features, and pool dimensionsinterface PoolState {

interface PoolState {
    id: string;
    length: number;
    width: number;
    depth: number;
    perimeter: number;
    material: MaterialOption;
    features: Feature[];
    price: number;
  }

interface CADState {
  pools: PoolState[];
  totalPrice: number;
  selectedPoolId: string | null;
  is3DViewEnabled: boolean;
}

const initialState: CADState = {
  pools: [],
  totalPrice: 0,
  selectedPoolId: null,
  is3DViewEnabled: false,
};

export const cadStateSlice = createSlice({
  name: 'cadStateSlice',
  initialState,
  reducers: {
    addPool: (state, action: PayloadAction<PoolState>) => {
      state.pools.push(action.payload);
      state.totalPrice += action.payload.price;
    },
    updatePool: (
        state,
        action: PayloadAction<{ id: string; updates: Partial<PoolState> }>
      ) => {
        const { id, updates } = action.payload;
        const pool = state.pools.find((p) => p.id === id);
        if (pool) {
          Object.assign(pool, updates);
      
          // Recalculate price based on updated dimensions
          const perimeter = 2 * (pool.length + pool.width);
          pool.price =
            100 * perimeter +
            pool.features.reduce((sum, feature) => sum + 100, 0);
      
          // Update total price
          state.totalPrice = state.pools.reduce((sum, p) => sum + p.price, 0);
        }
      },
    removePool: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.pools = state.pools.filter((p) => p.id !== id);

      // Recalculate total price
      state.totalPrice = state.pools.reduce((sum, p) => sum + p.price, 0);
    },
    toggle3DView: (state) => {
      state.is3DViewEnabled = !state.is3DViewEnabled;
    },
    selectPool: (state, action: PayloadAction<string | null>) => {
      state.selectedPoolId = action.payload;
    },
  },
});

export const { addPool, updatePool, removePool, toggle3DView, selectPool } = cadStateSlice.actions;
export default cadStateSlice.reducer;
