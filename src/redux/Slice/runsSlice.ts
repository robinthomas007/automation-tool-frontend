import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { CreateRun, Runs, SignalRun, /*CreateRun*/ } from "../Services/runs";
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
  lastRun: any;
  selectedRunId: number | undefined;
  error: string | undefined;
}
const initialState: RunsState = {
  loading: false,
  fetchLoading: false,
  runs: [],
  lastRun: undefined,
  selectedRunId: undefined,
  error: undefined,
};
export const fetchRuns = createAsyncThunk(
  "runs/fetchRuns",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => Runs(projectId, searchTerm)
);
export const createRun = createAsyncThunk(
  "runs/createRun",
  async ({ projectId, body }: { projectId: number, body: any }) => CreateRun(projectId, body)
);
export const signalRun = createAsyncThunk(
  "runs/signalRun",
  async ({ runId,body }: { runId: number, body: any }) => SignalRun(runId, body)
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
    builder.addCase(createRun.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createRun.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.lastRun = payload.data;
      state.selectedRunId = payload?.data ? payload.data.id : undefined;
    });
    builder.addCase(createRun.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(signalRun.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signalRun.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(signalRun.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
  reducers: {
    selectRuns: (state, action) => {
      state.selectedRunId = action.payload;
    },
    updateRun: (state, action) => {
      const runIndex = state.runs.findIndex(run => run.id === action.payload.id);
      if (state.selectedRunId === undefined) {
        state.selectedRunId = action.payload.id
      } else {
        const currentlySelectedRun = state.runs.find(r => r.id === state.selectedRunId)!
        if (currentlySelectedRun?(currentlySelectedRun.result.status === "PASS" || currentlySelectedRun.result.status === "FAIL"):true) {
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
