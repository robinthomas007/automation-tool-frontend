import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Steps, CreateSteps, UpdateStep, DeleteStep, SaveStepActionData } from "../Services/steps";
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
  fetchLoading: boolean;
  steps: Array<Step>;
  selectedSteps: Step | any;
  selectedResourceAction: any | any;
  error: string | undefined;
}
const initialState: StepsState = {
  loading: false,
  steps: [],
  selectedSteps: {},
  selectedResourceAction: {},
  error: undefined,
  fetchLoading: false
};
export const fetchSteps = createAsyncThunk(
  "steps/fetchSteps",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => Steps(projectId, searchTerm)
);
export const createStep = createAsyncThunk(
  "steps/createStep",
  async ({ projectId, step }: { projectId: number, step: Step }) => CreateSteps(projectId, step)
);
export const updateStep = createAsyncThunk(
  "steps/updateStep",
  async ({ step }: { step: Step }) => UpdateStep(step)
);
export const saveStepActionData = createAsyncThunk(
  "steps/saveStepActionData",
  async ({ actions, stepId }: { actions: Array<any>, stepId: number }) => {
    return SaveStepActionData(actions, stepId)
  }
)
export const deleteStep = createAsyncThunk(
  "steps/deleteStep",
  async ({ id }: { id: number }) => DeleteStep(id)
);

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSteps.pending, (state) => {
      state.loading = true;
      state.fetchLoading = true
      state.steps = []
      state.selectedSteps = {}
    });
    builder.addCase(fetchSteps.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fetchLoading = false
      state.steps = payload.data;
      if (payload.data.length) {
        state.selectedSteps = payload.data[0];
      }
    });
    builder.addCase(fetchSteps.rejected, (state, action) => {
      state.loading = false;
      state.fetchLoading = false
      state.steps = [];
      state.error = action.error.message;
    });
    builder.addCase(updateStep.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateStep.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedSteps = payload.data;
      state.steps = state.steps.map(step => {
        if (step.id === payload.data.id) {
          return payload.data
        }
        return step
      })
    });
    builder.addCase(updateStep.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(createStep.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createStep.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.steps = [...state.steps, payload.data];
      if (payload.data.length) {
        state.selectedSteps = payload.data[0];
      }
    });
    builder.addCase(createStep.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteStep.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteStep.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.steps = state.steps.filter((item) => item.id !== payload.data.id)
    });

    builder.addCase(deleteStep.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(saveStepActionData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedSteps = payload.data
      const stepIndex = state.steps.findIndex(step => step.id === state.selectedSteps.id);
      if (stepIndex !== -1) {
        const updatedSteps = [...state.steps];
        updatedSteps[stepIndex] = {
          ...state.selectedSteps
        }
        state.steps = updatedSteps;
      }
      state.selectedResourceAction = state.selectedSteps.resource_actions.find((step: any) => step.sequence_number === state.selectedResourceAction.sequence_number)
    });

    builder.addCase(saveStepActionData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  },
  reducers: {
    removeUserFromList: (state, action) => { },
    selectSteps: (state, action) => {
      state.selectedSteps = action.payload;
    },
    selectResourceAction: (state, action) => {
      state.selectedResourceAction = action.payload;
    },
    addActionDataToStep: (state, action) => {
      const { item } = action.payload;
      state.selectedResourceAction = item
    },
    addResActToStep: (state, action) => {
      const { item } = action.payload

      state.selectedSteps = {
        ...state.selectedSteps,
        resource_actions: [
          ...state.selectedSteps.resource_actions,
          { resource_action: item, sequence_number: state.selectedSteps.resource_actions.length + 1, data: item.required_variables.map((rv: string) => ({ name: rv, expression: '' })) }
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
    },

    removeActionFromResource: (state, action) => {
      const { id, sequence_number } = action.payload;
      const updatedActions = state.selectedSteps.resource_actions.filter(
        (element: any) => element.resource_action.id !== id && element.sequence_number !== sequence_number
      );

      state.selectedSteps = {
        ...state.selectedSteps,
        resource_actions: updatedActions,
      };
      state.steps = state.steps.map(step => {
        if (step.id === state.selectedSteps.id) {
          return { ...state.selectedSteps, resource_actions: updatedActions };
        }
        return step;
      });
    },

    reOrderStepsActions: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      let { resource_actions } = state.selectedSteps
      if (!resource_actions) {
        resource_actions = [];
      }
      const [movedItem] = resource_actions.splice(fromIndex, 1);
      resource_actions.splice(toIndex, 0, movedItem);
      resource_actions = resource_actions.map((item: any, index: number) => {
        return { ...item, sequence_number: index + 1 }
      })

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
    },
    updateSelectedStepAction: (state, action) => {
      state.selectedSteps = {
        ...state.selectedSteps,
        resource_actions: action.payload
      }
      const stepIndex = state.steps.findIndex(step => step.id === state.selectedSteps.id);
      if (stepIndex !== -1) {
        const updatedSteps = [...state.steps];
        updatedSteps[stepIndex] = {
          ...state.selectedSteps,
          resource_actions: action.payload
        }
        state.steps = updatedSteps;
      }

    }
  },
});

export const { selectSteps, addResActToStep, reOrderStepsActions, updateSelectedStepAction, removeActionFromResource, selectResourceAction, addActionDataToStep } = stepsSlice.actions;
export const stepsSelector = (state: RootState) => state.steps;
export default stepsSlice.reducer;
