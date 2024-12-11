import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import { AppState } from './store';
import { LoadingState } from '../utils/loading-state';
import axios from 'axios';

export interface MyCollectionsState {
    collections: any[];
    state: LoadingState;
}

const initialState: MyCollectionsState = {
    collections: [],
    state: LoadingState.INITIAL,
};

export const myCollectionsSlice = createSlice({
    name: 'myCollections',
    initialState,
    reducers: {
        setState(state, action) {
            state.state = action.payload;
        },
        setCollections(state, action) {
            state.collections = action.payload;
        },
    },
});

export const {
    setState,
    setCollections,
} = myCollectionsSlice.actions;

export const getMyCollectionsState = (state: AppState) => state.myCollections;

export const selectMyCollections = (state: AppState) => state.myCollections.collections;

export const selectMyCollectionById = (id, ...args) => {
    return createSelector(
        getMyCollectionsState,
        (state) => state.collections.find(collection => collection.id === id)
    );
}

export const selectMyCollectionsState = (state: AppState) => state.myCollections.state;

export const loadMyCollections = createAsyncThunk(
    'loadMyCollections',
    async (userId, thunkAPI) => {
        try {
            thunkAPI.dispatch(setState(LoadingState.PENDING));
            const response = await axios.get('/api/collections/read',  { params: { userId } });
            thunkAPI.dispatch(setCollections(response.data));
            thunkAPI.dispatch(setState(LoadingState.DONE));
            return response;
        } catch (e) {
            thunkAPI.dispatch(setState(LoadingState.ERROR));
            throw e;
        }
    });

export default myCollectionsSlice.reducer;
