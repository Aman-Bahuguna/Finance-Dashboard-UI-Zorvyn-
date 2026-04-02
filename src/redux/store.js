import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import transactionsReducer from './transactionsSlice';

// Load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('arthsense_state_v3');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to local storage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('arthsense_state_v3', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    transactions: transactionsReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    transactions: store.getState().transactions,
    theme: store.getState().theme
  });
});
