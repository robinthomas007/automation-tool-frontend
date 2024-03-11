import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { me } from "../Services/user";
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
  me: undefined,
  selectedOrgs: undefined,
  error: undefined,
};
export const fetchMe = createAsyncThunk("me/fetchMe", async () => me());
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
