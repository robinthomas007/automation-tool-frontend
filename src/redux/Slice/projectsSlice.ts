import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Projects, CreateProject } from "../Services/projects";
import type { Test } from './testsSlice'
import type { Step } from './stepsSlice'
import { Suite } from "./suitesSlice";
import { Resource } from "./resourcesSlice";
export interface Project {
  id: number;
  name: string;
  desciption: string;
  CreatedAt: string;
  UpdatedAt: string;
  tests: Array<Test>
  steps: Array<Step>
  suites: Array<Suite>
  category_stats: Array<CategoryStat>
  items_stats: Array<ItemStat>
  resources: Array<Resource>
}
export type CategoryStat = { name: string, items: StatItem[] }
export type ItemStat = { name: string, items: CategoryStat[] }
export type StatItem = { name: string, value: number, color: string }
export interface ProjectsState {
  loading: boolean;
  projects: Array<Project>;
  selectedProjects: Project | undefined;
  error: string | undefined;
}
const initialState: ProjectsState = {
  loading: false,
  projects: [],
  selectedProjects: undefined,
  error: undefined,
};
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ orgId, searchTerm }: { orgId: number, searchTerm: string }) => Projects(orgId, searchTerm)
);

export const createProjects = createAsyncThunk(
  "projects/createProjects",
  async ({ orgId, data }: { orgId: number, data: object }) => CreateProject(orgId, data)
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projects = payload.data;
      // if (payload.data.length) {
      //   state.selectedProjects = payload.data[0];
      // }
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false;
      state.projects = [];
      state.error = action.error.message;
    });

    builder.addCase(createProjects.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projects = [...state.projects, payload.data];
      if (payload.data) {
        state.selectedProjects = payload.data;
      }
    });
    builder.addCase(createProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
  reducers: {
    removeUserFromList: (state, action) => { },
    selectProjects: (state, action) => {
      state.selectedProjects = action.payload;
    },
  },
});

export const { selectProjects } = projectsSlice.actions;
export const projectsSelector = (state: RootState) => state.projects;
export default projectsSlice.reducer;
