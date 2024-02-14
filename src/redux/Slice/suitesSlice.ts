import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Suites, CreateSuites } from "../Services/suites";
import { Test } from "./testsSlice";
export interface Suite {
  id: string;
  name: string;
  desciption: string;
  CreatedAt: string;
  UpdatedAt: string;
  tests: Array<Test>;
}
export interface SuitesState {
  loading: boolean;
  suites: Array<Suite>;
  selectedSuites: Suite | any;
  error: string | undefined;
}
const initialState: SuitesState = {
  loading: false,
  suites: [],
  selectedSuites: {},
  error: undefined,
};
export const fetchSuites = createAsyncThunk(
  "suites/fetchSuites",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => {
    return Suites(projectId, searchTerm)
  }
);
export const createSuites = createAsyncThunk(
  "suites/createSuites",
  async ({projectId,suite}:{projectId:number,suite: Suite}) => {
    return CreateSuites(projectId,suite)
  }
);
const suitesSlice = createSlice({
  name: "suites",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSuites.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSuites.fulfilled, (state, { payload }) => {
      // const data: PayloadAction<Array<Suite>> = payload.data;
      state.loading = false;
      state.suites = payload.data;
      console.log("payload.data[0]", payload.data[0]);
      if (payload.data.length) {
        state.selectedSuites = payload.data[0];
      }
    });
    builder.addCase(fetchSuites.rejected, (state, action) => {
      state.loading = false;
      state.suites = [];
      state.error = action.error.message;
    });
    builder.addCase(createSuites.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSuites.fulfilled, (state, { payload }) => {
      // const data: PayloadAction<Array<Suite>> = payload.data;
      state.loading = false;
      state.suites = [...state.suites, payload.data];
      if (payload.data.length) {
        state.selectedSuites = payload.data[0];
      }
    });
    builder.addCase(createSuites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
  reducers: {
    removeUserFromList: (state, action) => { },
    selectSuites: (state, action) => {
      state.selectedSuites = action.payload;
    },
    addTestToSuite: (state, action) => {
      const { item } = action.payload;

      const selectedSut = { ...state.selectedSuites }
      const suites = [...state.suites];
      selectedSut.tests = selectedSut.tests ? selectedSut.tests : []

      if (selectedSut) {
        const isItemAlreadyPresent = selectedSut.tests.some((existingItem: any) => existingItem.id === item.id);
        const updatedSuites = suites.map((suite) => {
          if (suite.id === selectedSut.id && !isItemAlreadyPresent) {
            const tests = suite.tests ? suite.tests : []
            state.selectedSuites = {
              ...selectedSut,
              tests: [...tests, item],
            };
            return {
              ...suite,
              tests: [...tests, item],
            };
          }
          return suite;
        });
        state.suites = updatedSuites;
      }
    }
  },
});

export const { selectSuites, addTestToSuite } = suitesSlice.actions;
export const suitesSelector = (state: RootState) => state.suites;
export default suitesSlice.reducer;
