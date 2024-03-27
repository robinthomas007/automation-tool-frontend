import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Runs, /*CreateRun*/ } from "../Services/runs";
export interface Run {
  id: number;
  result: RunDataItem
  created_at: string;
  updated_at: string;
}
export interface RunDataItem {
  id: number,
  type: string,
  items: RunDataItem[],
  status: string,
  error: string,
  name: string,
  screenshot: string,
  video: string[],
  time: string
}
export interface CreateRunData {
  type: string,
  id: number,
  profileId: number
}
export interface RunsState {
  loading: boolean;
  fetchLoading: boolean;
  runs: Array<Run>;
  selectedRunId: number | undefined;
  error: string | undefined;
}
const initialState: RunsState = {
  loading: false,
  fetchLoading: false,
  runs: [],
  selectedRunId: undefined,
  error: undefined,
};
export const fetchRuns = createAsyncThunk(
  "runs/fetchRuns",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => Runs(projectId, searchTerm)
);
// export const createRun = createAsyncThunk(
//   "runs/createRun",
//   async ({ projectId,data, callback }: { projectId:number,data: CreateRunData, callback: (run: Run) => void }) => CreateRun(projectId,data, callback)
// );
const runsSlice = createSlice({
  name: "runs",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRuns.pending, (state) => {
      state.loading = true;
      state.fetchLoading = true
    });
    builder.addCase(fetchRuns.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fetchLoading = false
      state.runs = payload.data;
      state.selectedRunId = payload?.data.length ? payload.data[0].id : undefined;
    });
    builder.addCase(fetchRuns.rejected, (state, action) => {
      state.loading = false;
      state.fetchLoading = false
      state.runs = [];
      state.error = action.error.message;
    });

    // builder.addCase(createRun.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(createRun.fulfilled, (state, { payload }) => {
    //   // const data: PayloadAction<Array<Step>> = payload.data;
    //   state.loading = false;
    // });
    // builder.addCase(createRun.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // });

  },
  reducers: {
    selectRuns: (state, action) => {
      state.selectedRunId = action.payload;
    },
    updateRun: (state, action) => {
      const runIndex = state.runs.findIndex(run => run.id === action.payload.id);
      if (state.selectedRunId == undefined) {
        state.selectedRunId = action.payload.id
      } else {
        const currentlySelectedRun = state.runs.find(r => r.id == state.selectedRunId)!
        if (currentlySelectedRun.result.status == "PASS" || currentlySelectedRun.result.status == "FAIL") {
          state.selectedRunId = action.payload.id
        }
      }
      if (runIndex !== -1) {
        const updatedRuns = [...state.runs];
        updatedRuns[runIndex] = {
          ...action.payload,
        }
        state.runs = updatedRuns;
      } else {
        state.runs.push(action.payload)
      }
    }
  },
});

export const { selectRuns, updateRun } = runsSlice.actions;
export const runsSelector = (state: RootState) => state.runs;
export default runsSlice.reducer;
