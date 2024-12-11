import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';

export interface ThemeState {
    colorMode: 'dark' | 'light';
}

const initialState: ThemeState = {
    colorMode: 'dark',
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {

        setThemeColor(state, action) {
            state.colorMode = action.payload;
        },
    },
});

export const { setThemeColor } = themeSlice.actions;

export const selectThemeColor = (state: AppState) => state.theme.colorMode;

export default themeSlice.reducer;