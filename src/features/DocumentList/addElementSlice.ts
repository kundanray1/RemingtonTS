import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Interfaces for element options
interface ShapeOption {
  type: string; // e.g., "square", "octagon"
  image: string; // URL or path to the shape's image
}

interface FloorType {
  name: string; // e.g., "wood", "tile"
  images: string[]; // URLs or paths to floor images
}

// Interface for an element
interface Element {
  id: string; // Unique identifier for the element (e.g., "pool", "hotTub")
  name: string; // Name of the element
  shapes: ShapeOption[]; // Available shapes for this element
  floorTypes: FloorType[]; // Available floor types for this element
}

export interface AddElementState {
  activeElement: string;
  elements: Element[];
}

const initialState: AddElementState = {
  activeElement: '',
  elements: [
    {
      id: 'pool',
      name: 'Pool',
      shapes: [
        { type: 'square', image: '/images/pool-square.png' },
        { type: 'octagon', image: '/images/pool-octagon.png' },
      ],
      floorTypes: [
        { name: 'tile', images: ['/images/pool-tile1.png', '/images/pool-tile2.png'] },
        { name: 'wood', images: ['/images/pool-wood1.png', '/images/pool-wood2.png'] },
      ],
    },
    {
      id: 'hotTub',
      name: 'Hot Tub',
      shapes: [
        { type: 'square', image: '/images/hotTub-square.png' },
        { type: 'octagon', image: '/images/hotTub-octagon.png' },
      ],
      floorTypes: [
        { name: 'tile', images: ['/images/hotTub-tile1.png', '/images/hotTub-tile2.png'] },
        { name: 'stone', images: ['/images/hotTub-stone1.png', '/images/hotTub-stone2.png'] },
      ],
    },
  ],
};

export const addElementSlice = createSlice({
  name: 'addElement',
  initialState,
  reducers: {
    setActiveElement: (state, action: PayloadAction<string>) => {
      state.activeElement = action.payload;
    },
    resetActiveElement: (state) => {
      state.activeElement = initialState.activeElement;
    },
    addElement: (state, action: PayloadAction<Element>) => {
      state.elements.push(action.payload);
    },
    updateElement: (
      state,
      action: PayloadAction<{ id: string; updatedData: Partial<Element> }>
    ) => {
      const { id, updatedData } = action.payload;
      const elementIndex = state.elements.findIndex((el) => el.id === id);
      if (elementIndex !== -1) {
        state.elements[elementIndex] = { ...state.elements[elementIndex], ...updatedData };
      }
    },
    removeElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter((el) => el.id !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setActiveElement,
  resetActiveElement,
  addElement,
  updateElement,
  removeElement,
} = addElementSlice.actions;

export default addElementSlice.reducer;
