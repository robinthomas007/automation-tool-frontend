import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { GenerateAPIKey, GetAPIKeys, GetMe } from "../Services/user";
export interface Org {
  org: {
    id: number,
    name: string,
    domain: string,
  },
  role: string
}
export interface UserState {
  loading: boolean;
  apiKeys: any[];
  me: {
    id: number,
    name: string,
    email: string,
    picture: string,
    orgs:{
      org:{
        id: number,
        name: string,
        domain: string
      },
      role:string,
    }[],
    project:{
      project:{
        id: number,
        name: string,
      },
      role:string,
    }[]
  }|undefined;
  selectedOrgs: Org | undefined;
  error: string | undefined;
}
const initialState: UserState = {
  loading: false,
  apiKeys:[],
  me: undefined,
  selectedOrgs: undefined,
  error: undefined,
};
export const fetchMe = createAsyncThunk("me/fetchMe", async () => GetMe());
export const fetchAPIKeys = createAsyncThunk("me/fetchApiKeys", async () => GetAPIKeys());
export const generateAPIKey = createAsyncThunk("me/generateAPIKey", async () => GenerateAPIKey());
const meSlice = createSlice({
  name: "me",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMe.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMe.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.me = action.payload.data.user;
        state.selectedOrgs = action.payload.data.user.orgs[0]
      }
    );
    builder.addCase(fetchMe.rejected, (state, action) => {
      state.loading = false;
      state.me = undefined;
      state.error = action.error.message;
    });
    builder.addCase(fetchAPIKeys.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchAPIKeys.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.apiKeys = action.payload.data;
      }
    );
    builder.addCase(fetchAPIKeys.rejected, (state, action) => {
      state.loading = false;
      state.apiKeys = [];
      state.error = action.error.message;
    });

    //Generate
    builder.addCase(generateAPIKey.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      generateAPIKey.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.apiKeys = [...state.apiKeys,action.payload.data];
      }
    );
    builder.addCase(generateAPIKey.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    
  },
  reducers: {
    selectOrgs: (state, action) => {
      state.selectedOrgs = action.payload;
    },
  },
});

export const { selectOrgs } = meSlice.actions;
export const meSelector = (state: RootState) => state.me;
export default meSlice.reducer;
