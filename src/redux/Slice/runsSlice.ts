import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Runs, CreateRun } from "../Services/runs";
export interface Run {
  id: number;
  result: RunDataItem
  CreatedAt: string;
  UpdatedAt: string;
}
export interface RunDataItem{
  id: number,
  type: string,
  items: RunDataItem[],
  status: string,
  error: string,
  name: string,
  screenshot: string,
}
export interface CreateRunData{
  type: string,
  id: number,
  profileId: number
}
export interface RunsState {
  loading: boolean;
  runs: Array<Run>;
  selectedRuns: Run | any;
  error: string | undefined;
}
const initialState: RunsState = {
  loading: false,
  runs: [],
  selectedRuns: undefined,
  error: undefined,
};
export const fetchRuns = createAsyncThunk(
  "runs/fetchRuns",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => Runs(projectId, searchTerm)
);
export const createRun = createAsyncThunk(
  "runs/createRun",
  async ({data,callback}:{data:CreateRunData,callback:(run:Run)=>void}) => CreateRun(data,callback)
);
const runsSlice = createSlice({
  name: "runs",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRuns.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRuns.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.runs = payload.data;
      console.log("payload.data[0]", payload.data[0]);
      if (payload.data.length) {
        state.selectedRuns = payload.data[0];
      }
    });
    builder.addCase(fetchRuns.rejected, (state, action) => {
      state.loading = false;
      state.runs = [];
      state.error = action.error.message;
    });

    builder.addCase(createRun.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createRun.fulfilled, (state, { payload }) => {
      // const data: PayloadAction<Array<Step>> = payload.data;
      state.loading = false;
    });
    builder.addCase(createRun.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  },
  reducers: {
    selectRuns: (state, action) => {
      state.selectedRuns = action.payload;
    },
    updateRun: (state,action) =>{
      const runIndex = state.runs.findIndex(run => run.id === action.payload.id);
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

export const { selectRuns,updateRun } = runsSlice.actions;
export const runsSelector = (state: RootState) => state.runs;
export default runsSlice.reducer;
