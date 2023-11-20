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
  selectedResources: Resources | any;
  error: string | undefined;
}
const initialState: ResourcesState = {
  loading: false,
  resources: [],
  selectedResources: {},
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
    builder.addCase(fetchResources.fulfilled, (state, { payload }) => {
      const data: PayloadAction<Array<Resources>> = payload.data;
      state.loading = false;
      state.resources = payload.data;
      console.log("payload.data[0]", payload.data[0]);
      if (payload.data.length) {
        state.selectedResources = payload.data[0];
      }
    });
    builder.addCase(fetchResources.rejected, (state, action) => {
      state.loading = false;
      state.resources = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    removeUserFromList: (state, action) => {},
    selectResources: (state, action) => {
      state.selectedResources = action.payload;
    },
  },
});

export const { selectResources } = resourcesSlice.actions;
export const resourcesSelector = (state: RootState) => state.resources;
export default resourcesSlice.reducer;
