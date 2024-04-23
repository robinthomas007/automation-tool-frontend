import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { DataProfile, DataProfileVariables, CreateProfile, CreateVariable, CreateProfileVariable, DeleteProfile } from "../Services/dataProfile";

export interface DataProfileState {
  profle: Array<any>;
  variables: Array<any>;
  loading: boolean,
  selectedProfile: any,
  error: string
}

const initialState: DataProfileState = {
  profle: [],
  variables: [],
  loading: false,
  selectedProfile: {},
  error: ''
}

export const fetchProfiles = createAsyncThunk('dataProfile/fetchProfiles', async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => DataProfile(projectId, searchTerm))
export const fetchVariables = createAsyncThunk('dataProfile/fetchVariables', async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => DataProfileVariables(projectId, searchTerm))
export const createProfile = createAsyncThunk('dataProfile/createProfile', async ({ values, project_id }: { values: any, project_id: any }) => CreateProfile(values, project_id))
export const createVariable = createAsyncThunk('dataProfile/createVariable', async ({ values, project_id }: { values: any, project_id: any }) => CreateVariable(values, project_id))
export const createProfileVariable = createAsyncThunk('dataProfile/createProfileVariable', async ({ variables, profileId }: { variables: any, profileId: number }) => CreateProfileVariable(variables, profileId))
export const deleteProfile = createAsyncThunk(
  "dataProfile/deleteProfile",
  async ({ id }: { id: number }) => DeleteProfile(id)
);
const dataProfileSlice = createSlice({
  name: 'dataProfile',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProfiles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProfiles.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.profle = payload.data;
      if (payload.data.length) {
        state.selectedProfile = payload.data[0];
      }
    });
    builder.addCase(fetchProfiles.rejected, (state, action) => {
      state.loading = false;
      state.profle = [];
      state.error = action.error.message || '';
    });
    builder.addCase(fetchVariables.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchVariables.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.variables = payload.data;
    });
    builder.addCase(fetchVariables.rejected, (state, action) => {
      state.loading = false;
      state.variables = [];
      state.error = action.error.message || '';
    });
    builder.addCase(createProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProfile.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.profle = [...state.profle, payload.data];
      if (payload.data.length) {
        state.selectedProfile = payload.data;
      }
    });
    builder.addCase(createProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '';
    });
    builder.addCase(createVariable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createVariable.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.variables = [...state.variables, payload.data];
    });
    builder.addCase(createVariable.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '';
    });
    builder.addCase(createProfileVariable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProfileVariable.fulfilled, (state, { payload }) => {
      state.loading = false;
      const profileIndex = state.profle.findIndex(profile => profile.id === payload.data.id);
      if (profileIndex !== -1) {
        const updaateProfile = [...state.profle]
        updaateProfile[profileIndex] = {
          ...updaateProfile[profileIndex],
          variables: payload.data.variables
        }
        state.profle = updaateProfile
      }
    });
    builder.addCase(createProfileVariable.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '';
    });
    //Delete Profile
    builder.addCase(deleteProfile.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteProfile.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.profle = state.profle.filter((item) => item.id !== payload.data.id)
    });

    builder.addCase(deleteProfile.rejected, (state, action) => {
      state.loading = false;
    });
  },
  reducers: {
    setSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload;
    },

    addVariableToProfile: (state, action) => {

      const { item } = action.payload
      const isItemExist = state.selectedProfile.variables?.some((variable: any) => variable.id === item.id);
      if (!isItemExist) {
        state.selectedProfile = {
          ...state.selectedProfile,
          variables: [...state.selectedProfile.variables, { variable: item, value: "" }]
        }

        const profileIndex = state.profle.findIndex(profile => profile.id === state.selectedProfile.id);

        if (profileIndex !== -1) {
          const updatedProfile = [...state.profle];
          updatedProfile[profileIndex] = {
            ...state.selectedProfile,
            varibles: [...state.selectedProfile.variables, { variable: item, value: "" }]
          }
          state.profle = updatedProfile
        }
      }
    },
    RemoveVariable: (state, action) => {
      const { id } = action.payload;
      const variableIndex = state.selectedProfile.variables.findIndex((variable: any) => variable.id === id);

      if (variableIndex !== -1) {
        const updatedVariables = state.selectedProfile.variables.filter((_: any, index: any) => index !== variableIndex);

        state.selectedProfile = {
          ...state.selectedProfile,
          variables: updatedVariables
        };

        const profileIndex = state.profle.findIndex(profile => profile.id === state.selectedProfile.id);
        if (profileIndex !== -1) {
          const updatedProfile = [...state.profle];
          updatedProfile[profileIndex] = {
            ...state.selectedProfile,
            variables: updatedVariables
          };
          state.profle = updatedProfile;
        }
      }
    }
  }
})

export const { setSelectedProfile, addVariableToProfile, RemoveVariable } = dataProfileSlice.actions
export const dataProfileSelector = (state: RootState) => state.dataProfile;
export default dataProfileSlice.reducer;
