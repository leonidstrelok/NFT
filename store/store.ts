import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import { createWrapper } from 'next-redux-wrapper';
import { createMetadataSlice } from './create-metadata';
import { themeSlice } from './theme';
import { myCollectionsSlice } from './my-collections';

const makeStore = () =>
    configureStore({
        reducer: {
            [authSlice.name]: authSlice.reducer,
            [createMetadataSlice.name]: createMetadataSlice.reducer,
            [themeSlice.name]: themeSlice.reducer,
            [myCollectionsSlice.name]: myCollectionsSlice.reducer,
        },
        devTools: true,
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);