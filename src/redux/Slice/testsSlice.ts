import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Tests, CreateTest, SaveTestStepData, UpdateTest, DeleteTest } from "../Services/tests";
import { Step } from "./stepsSlice";
import { Project } from "./projectsSlice";
import { stat } from "fs";
export interface Test {
  id: string;
  name: string;
  desciption: string;
  lock: string;
  CreatedAt: string;
  UpdatedAt: string;
  steps: Array<TestStep>;
}
export interface TestStep {
  step_id: number
  step: Step
  sequence_number: number,
  CreatedAt: string;
  UpdatedAt: string;
}
export interface TestsState {
  loading: boolean;
  fetchLoading: boolean;
  tests: Array<Test>;
  selectedTests: Test | any;
  error: string | undefined;
  selectedStep: Step | any
}
const initialState: TestsState = {
  loading: false,
  tests: [],
  selectedTests: {},
  selectedStep: {},
  error: undefined,
  fetchLoading: false
};
export const fetchTests = createAsyncThunk(
  "tests/fetchTests",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => {
    return Tests(projectId, searchTerm)
  }
);
export const createTest = createAsyncThunk(
  "tests/createTest",
  async ({ projectId, test }: { projectId: number, test: Test }) => {
    return CreateTest(projectId, test)
  }
);

export const saveTestStepData = createAsyncThunk(
  "tests/saveTestStepData",
  async ({ steps, testId }: { steps: Array<Step>, testId: number }) => {
    return SaveTestStepData(steps, testId)
  }
)

export const updateTest = createAsyncThunk(
  "tests/updateTest",
  async ({ test }: { test: Test }) => UpdateTest(test)
);

export const deleteTest = createAsyncThunk(
  "tests/deleteTest",
  async ({ id }: { id: number }) => DeleteTest(id)
);

const testsSlice = createSlice({
  name: "tests",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTests.pending, (state) => {
      state.loading = true;
      state.fetchLoading = true;
      state.tests = []
      state.selectedTests = {}
    });
    builder.addCase(fetchTests.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fetchLoading = false;
      state.tests = payload.data;
      if (payload.data.length) {
        state.selectedTests = payload.data[0];
      }
    });
    builder.addCase(fetchTests.rejected, (state, action) => {
      state.loading = false;
      state.fetchLoading = false;
      state.tests = [];
      state.error = action.error.message;
    });

    builder.addCase(createTest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTest.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tests = [...state.tests, payload.data];
      if (payload.data.length) {
        state.selectedTests = payload.data[0];
      }
    });
    builder.addCase(createTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(saveTestStepData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(saveTestStepData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedTests = payload.data
      const stepIndex = state.tests.findIndex(test => test.id === state.selectedTests.id);

      if (stepIndex !== -1) {
        const updatedTests = [...state.tests];
        updatedTests[stepIndex] = {
          ...state.selectedTests
        }
        state.tests = updatedTests;
      }

      state.selectedStep = state.selectedTests.steps.find((step: any) => step.sequence_number === state.selectedStep.sequence_number)

    });

    builder.addCase(saveTestStepData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateTest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTest.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedTests = payload.data;
      const stepIndex = state.tests.findIndex(test => test.id === state.selectedTests.id);
      if (stepIndex !== -1) {
        const updatedTests = [...state.tests];
        updatedTests[stepIndex] = {
          ...state.selectedTests
        }
        state.tests = updatedTests;
      }

    });
    builder.addCase(updateTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteTest.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteTest.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tests = state.tests.filter((item) => item.id !== payload.data.id)
    });

    builder.addCase(deleteTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  },
  reducers: {
    removeUserFromList: (state, action) => { },
    selectTests: (state, action) => {
      state.selectedTests = action.payload;
    },
    addStepToTest: (state, action) => {
      const { item } = action.payload
      const { steps } = state.selectedTests
      const stepData = steps ? steps : []
      state.selectedTests = {
        ...state.selectedTests,
        steps: [...stepData, { sequence_number: stepData.length + 1, step: item, data: item.required_variables ? item.required_variables.map((rv: string) => { return { name: rv, expression: '' } }) : [] }]
      }
      const stepIndex = state.tests.findIndex(test => test.id === state.selectedTests.id);
      if (stepIndex !== -1) {
        const updatedTests = [...state.tests];
        updatedTests[stepIndex] = {
          ...state.selectedTests,
          steps: [...stepData, { sequence_number: stepData.length + 1, step: item, data: item.required_variables ? item.required_variables.map((rv: string) => { return { name: rv, expression: '' } }) : [] }]
        }
        state.tests = updatedTests;
      }
    },
    reOrderTestSteps: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      let { steps } = state.selectedTests
      const [movedItem] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, movedItem);
      steps = steps.map((step: any, index: number) => {
        return { ...step, sequence_number: index + 1 }
      })
      state.selectedTests = {
        ...state.selectedTests,
        steps: steps
      }
      const stepIndex = state.tests.findIndex(test => test.id === state.selectedTests.id);
      if (stepIndex !== -1) {
        const updatedTests = [...state.tests];
        updatedTests[stepIndex] = {
          ...state.selectedTests,
          steps: steps
        }
        state.tests = updatedTests;
      }
    },
    addStepDataToTest: (state, action) => {
      const { item } = action.payload;
      state.selectedStep = item
    },

    removeStepFromTest: (state, action) => {
      const { id, sequence_number } = action.payload;

      const updatedSteps = state.selectedTests.steps.filter(
        (t: any) => t.step.id !== id && t.sequence_number !== sequence_number
      );

      state.selectedTests = {
        ...state.selectedTests,
        steps: updatedSteps,
      };

      state.tests = state.tests.map(tes => {
        if (tes.id === state.selectedTests.id) {
          return { ...state.selectedTests, steps: updatedSteps };
        }
        return tes;
      });
    },
  },
});

export const { selectTests, addStepToTest, reOrderTestSteps, addStepDataToTest, removeStepFromTest } = testsSlice.actions;
export const testsSelector = (state: RootState) => state.tests;
export default testsSlice.reducer;
