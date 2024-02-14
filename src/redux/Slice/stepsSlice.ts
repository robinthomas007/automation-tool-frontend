import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Steps, CreateSteps } from "../Services/steps";
export interface Step {
  id: string;
  name: string;
  desciption: string;
  CreatedAt: string;
  UpdatedAt: string;
  resource_actions?: Array<any>
}
export interface StepsState {
  loading: boolean;
  steps: Array<Step>;
  selectedSteps: Step | any;
  error: string | undefined;
}
const initialState: StepsState = {
  loading: false,
  steps: [],
  selectedSteps: {},
  error: undefined,
};
export const fetchSteps = createAsyncThunk(
  "steps/fetchSteps",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => Steps(projectId, searchTerm)
);
export const createStep = createAsyncThunk(
  "steps/createStep",
  async ({projectId,step}:{projectId:number,step: Step}) => CreateSteps(projectId,step)
);

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSteps.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSteps.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.steps = payload.data;
      console.log("payload.data[0]", payload.data[0]);
      if (payload.data.length) {
        state.selectedSteps = payload.data[0];
      }
    });
    builder.addCase(fetchSteps.rejected, (state, action) => {
      state.loading = false;
      state.steps = [];
      state.error = action.error.message;
    });

    builder.addCase(createStep.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createStep.fulfilled, (state, { payload }) => {
      // const data: PayloadAction<Array<Step>> = payload.data;
      state.loading = false;
      state.steps = [...state.steps, payload.data];
      console.log("payload.data[0] steps", payload.data[0]);
      if (payload.data.length) {
        state.selectedSteps = payload.data[0];
      }
    });
    builder.addCase(createStep.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  },
  reducers: {
    removeUserFromList: (state, action) => { },
    selectSteps: (state, action) => {
      state.selectedSteps = action.payload;
    },

    addResActToStep: (state, action) => {
      const { item } = action.payload
      // const isItemAlreadyPresent = state.selectedSteps.resource_actions.some((existingItem: any) => existingItem?.ResourceAction.id === item.id);

      // if (!isItemAlreadyPresent) {
        state.selectedSteps = {
          ...state.selectedSteps,
          resource_actions: [
            ...state.selectedSteps.resource_actions,
            { resource_action: item , sequence_number: state.selectedSteps.resource_actions.length }
          ]
        }

        const stepIndex = state.steps.findIndex(step => step.id === state.selectedSteps.id);
        if (stepIndex !== -1) {
          const updatedSteps = [...state.steps];
          updatedSteps[stepIndex] = {
            ...state.selectedSteps,
          }
          state.steps = updatedSteps;
        }
      // }

    },

    reOrderStepsActions: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const { resource_actions } = state.selectedSteps
      const [movedItem] = resource_actions.splice(fromIndex, 1);
      resource_actions.splice(toIndex, 0, movedItem);
      state.selectedSteps = {
        ...state.selectedSteps,
        resource_actions: resource_actions
      }
      const stepIndex = state.steps.findIndex(step => step.id === state.selectedSteps.id);
      if (stepIndex !== -1) {
        const updatedSteps = [...state.steps];
        updatedSteps[stepIndex] = {
          ...state.selectedSteps,
          resource_actions: resource_actions
        }
        state.steps = updatedSteps;
      }
    }
  },
});

export const { selectSteps, addResActToStep, reOrderStepsActions } = stepsSlice.actions;
export const stepsSelector = (state: RootState) => state.steps;
export default stepsSlice.reducer;
