import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';

export interface CreateMetadataState {
    customFields: Record<string, string>;
    tags: string[];
}

const initialState: CreateMetadataState = {
    customFields: {},
    tags: [],
};

export const createMetadataSlice = createSlice({
    name: "createMetadata",
    initialState,
    reducers: {
        setCustomField(state, action) {
            const { key, value } = action.payload;
            state.customFields[key] = value;
        },
        removeCustomField(state, action) {
            const { key } = action.payload;
            const newState = { ...state.customFields };
            delete newState[key];
            state.customFields = newState;
        },
        setTags(state, action) {
            state.tags = action.payload;
        },
        resetForm(state) {
            state.tags = [];
            state.customFields = {};
        },
    },
});

export const {
    setCustomField,
    setTags,
    resetForm,
    removeCustomField
} = createMetadataSlice.actions;

export const selectCreateMetadataTags = (state: AppState) => state.createMetadata.tags;

export const selectCreateMetadataCustomFields = (state: AppState) => state.createMetadata.customFields;

export default createMetadataSlice.reducer;
