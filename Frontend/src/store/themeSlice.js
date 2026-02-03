import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import i18n from '../i18n.js';

// Async thunk to sync with backend
export const syncThemeWithBackend = createAsyncThunk(
  'theme/syncWithBackend',
  async (preferences, { rejectWithValue }) => {
    try {
      await api.put('/user/preferences/appearance', preferences);
      return preferences;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to sync');
    }
  }
);

// Async thunk to load preferences from backend
export const loadThemeFromBackend = createAsyncThunk(
  'theme/loadFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      // Check for token before making request
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No auth token');
      }
      const { data } = await api.get('/user/preferences');
      return data.appearancePreferences || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load');
    }
  }
);

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  fontSize: localStorage.getItem('fontSize') || 'medium',
  language: localStorage.getItem('language') || 'en',
  compactMode: localStorage.getItem('compactMode') === 'true',
  isInitialized: false,
  loading: false,
  error: null,
};

// Helper function to apply theme to DOM
const applyThemeToDOM = (theme) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  let effectiveTheme = theme;
  if (theme === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  root.classList.add(effectiveTheme);
  root.setAttribute('data-theme', effectiveTheme);
};

// Helper function to apply font size to DOM
const applyFontSizeToDOM = (fontSize) => {
  const root = document.documentElement;
  root.classList.remove('font-small', 'font-medium', 'font-large');
  root.classList.add(`font-${fontSize}`);
};

// Helper function to apply compact mode to DOM
const applyCompactModeToDOM = (compactMode) => {
  const root = document.documentElement;
  if (compactMode) {
    root.classList.add('compact');
  } else {
    root.classList.remove('compact');
  }
};

// Helper function to apply language to DOM
const applyLanguageToDOM = (language) => {
  document.documentElement.setAttribute('lang', language);
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      applyThemeToDOM(action.payload);
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      localStorage.setItem('fontSize', action.payload);
      applyFontSizeToDOM(action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
      applyLanguageToDOM(action.payload);
    },
    setCompactMode: (state, action) => {
      state.compactMode = action.payload;
      localStorage.setItem('compactMode', action.payload.toString());
      applyCompactModeToDOM(action.payload);
    },
    initializeTheme: (state) => {
      // Apply initial values from state to DOM
      applyThemeToDOM(state.theme);
      applyFontSizeToDOM(state.fontSize);
      applyCompactModeToDOM(state.compactMode);
      applyLanguageToDOM(state.language);
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThemeFromBackend.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadThemeFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.theme) {
          state.theme = action.payload.theme;
          localStorage.setItem('theme', action.payload.theme);
          applyThemeToDOM(action.payload.theme);
        }
        if (action.payload.fontSize) {
          state.fontSize = action.payload.fontSize;
          localStorage.setItem('fontSize', action.payload.fontSize);
          applyFontSizeToDOM(action.payload.fontSize);
        }
        if (action.payload.language) {
          state.language = action.payload.language;
          localStorage.setItem('language', action.payload.language);
          applyLanguageToDOM(action.payload.language);
        }
        if (action.payload.compactMode !== undefined) {
          state.compactMode = action.payload.compactMode;
          localStorage.setItem('compactMode', action.payload.compactMode.toString());
          applyCompactModeToDOM(action.payload.compactMode);
        }
        state.isInitialized = true;
      })
      .addCase(loadThemeFromBackend.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(syncThemeWithBackend.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const changeLanguage = (language) => (dispatch) => {
  i18n.changeLanguage(language);
  dispatch(setLanguage(language));
};

export const { setTheme, setFontSize, setLanguage, setCompactMode, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
