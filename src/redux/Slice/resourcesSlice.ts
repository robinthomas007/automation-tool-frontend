import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Resources } from "../Services/resources";
export interface Resources {
  ID: string;
  name: string;
  type: string;
  CreatedAt: string;
  UpdatedAt: string;
  actions: Array<any>;
  elements: Array<any>;
}
export interface ResourcesState {
  loading: boolean;
  resources: Array<Resources>;
  error: string | undefined;
}
const initialState: ResourcesState = {
  loading: false,
  resources: [],
  error: undefined,
};
export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async () => Resources()
);
const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchResources.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchResources.fulfilled,
      (state, action: PayloadAction<Array<Resources>>) => {
        state.loading = false;
        state.resources = action.payload;
      }
    );
    builder.addCase(fetchResources.rejected, (state, action) => {
      state.loading = false;
      state.resources = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    removeUserFromList: (state, action) => {},
  },
});

export const { removeUserFromList } = resourcesSlice.actions;
export const userSelector = (state: RootState) => state.resources;
export default resourcesSlice.reducer;
