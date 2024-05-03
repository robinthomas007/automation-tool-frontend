import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Suites, CreateSuites, UpdateSuite, DeleteSuite } from "../Services/suites";
import { Test } from "./testsSlice";
import { TestsFromFolder } from "../../Lib/helpers";
export interface Suite {
  id: number;
  name: string;
  type: string;
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
  fetchLoading: boolean
}
const initialState: SuitesState = {
  loading: false,
  suites: [],
  selectedSuites: {},
  error: undefined,
  fetchLoading: false
};

export const fetchSuites = createAsyncThunk(
  "suites/fetchSuites",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => {
    return Suites(projectId, searchTerm)
  }
);

export const createSuites = createAsyncThunk(
  "suites/createSuites",
  async ({ projectId, suite }: { projectId: number, suite: Suite }) => {
    return CreateSuites(projectId, suite)
  }
);

export const updateSuite = createAsyncThunk(
  "suites/updateSuite",
  async ({ suite }: { suite: Suite }) => UpdateSuite(suite)
);

export const deleteSuite = createAsyncThunk(
  "suites/deleteSuite",
  async ({ id }: { id: number }) => DeleteSuite(id)
);

const suitesSlice = createSlice({
  name: "suites",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSuites.pending, (state) => {
      state.loading = true;
      state.fetchLoading = true
      state.suites = [];
    });
    builder.addCase(fetchSuites.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fetchLoading = false
      state.suites = payload.data;
      if (payload.data.length) {
        state.selectedSuites = payload.data[0];
      }
    });
    builder.addCase(fetchSuites.rejected, (state, action) => {
      state.loading = false;
      state.fetchLoading = false
      state.suites = [];
      state.error = action.error.message;
    });
    builder.addCase(createSuites.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSuites.fulfilled, (state, { payload }) => {
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
    builder.addCase(updateSuite.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSuite.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedSuites = payload.data;
      const stepIndex = state.suites.findIndex(suite => suite.id === state.selectedSuites.id);
      if (stepIndex !== -1) {
        const updatedSuites = [...state.suites];
        updatedSuites[stepIndex] = {
          ...state.selectedSuites
        }
        state.suites = updatedSuites;
      }

    });
    builder.addCase(updateSuite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteSuite.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSuite.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.suites = state.suites.filter((item) => item.id !== payload.data.id)
    });

    builder.addCase(deleteSuite.rejected, (state, action) => {
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
    },
    addFolderToSuite: (state, action) => {
      const { item } = action.payload;
      const testsToAdd = TestsFromFolder(item)

      const selectedSut = { ...state.selectedSuites }
      const suites = [...state.suites];
      selectedSut.tests = selectedSut.tests ? selectedSut.tests : []

      if (selectedSut) {
        var updatedSuites = suites
        var updatedSelectedSuite = state.selectedSuites
        for(const test of testsToAdd){
          const isItemAlreadyPresent = selectedSut.tests.some((existingItem: any) => existingItem.id === test.id);
          if (updatedSelectedSuite.id === selectedSut.id && !isItemAlreadyPresent) {
            if(updatedSelectedSuite.tests)
            updatedSelectedSuite = {
              ...updatedSelectedSuite,
              tests: [...updatedSelectedSuite.tests,test],
            };
          }
          updatedSuites = suites.map((suite) => {
          if (suite.id === selectedSut.id && !isItemAlreadyPresent) {
            const tests = suite.tests ? suite.tests : []
            return {
              ...suite,
              tests: [...tests,test],
            };
          }
          return suite;
        });
        }
        state.selectedSuites = updatedSelectedSuite
        state.suites = updatedSuites;
      }
    },
    removeTestFromSuite: (state, action) => {
      const { id } = action.payload;

      const updatedTests = state.selectedSuites.tests.filter(
        (t: any) => t.id !== id
      );

      state.selectedSuites = {
        ...state.selectedSuites,
        tests: updatedTests,
      };

      state.suites = state.suites.map(s => {
        if (s.id === state.selectedSuites.id) {
          return { ...state.selectedSuites, tests: updatedTests };
        }
        return s;
      });
    },
  },
});

export const { selectSuites, addTestToSuite,addFolderToSuite, removeTestFromSuite } = suitesSlice.actions;
export const suitesSelector = (state: RootState) => state.suites;
export default suitesSlice.reducer;
