import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { GetOrgUsers, GetProjectUsers, UpsertOrgUser, UpsertProjectUser, UserRole } from "../Services/user";
export interface UserState {
  loading: boolean;
  projectUsers: UserRole[];
  orgUsers: UserRole[];
  error: string | undefined
}
const initialState: UserState = {
  loading: false,
  projectUsers: [],
  orgUsers: [],
  error: undefined,
};
export const fetchOrgUsers = createAsyncThunk(
  "users/fetchOrgUsers",
  async ({ orgId }: { orgId: number }) => {
    return GetOrgUsers(orgId)
  }
);
export const upsertOrgUser = createAsyncThunk(
  "users/upsertOrgUser",
  async ({ orgId, data }: { orgId: number, data: UserRole }) => {
    return UpsertOrgUser(orgId, data)
  }
);
export const fetchProjectUsers = createAsyncThunk(
  "users/fetchProjectUsers",
  async ({ projectId }: { projectId: number }) => {
    return GetProjectUsers(projectId)
  }
);
export const upsertProjectUser = createAsyncThunk(
  "users/upsertProjectUser",
  async ({ projectId, data }: { projectId: number, data: UserRole }) => {
    return UpsertProjectUser(projectId, data)
  }
);
const usersSlice = createSlice({
  name: "me",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOrgUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchOrgUsers.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.orgUsers = action.payload.data;
      }
    );
    builder.addCase(fetchOrgUsers.rejected, (state, action) => {
      state.loading = false;
      state.orgUsers = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchProjectUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchProjectUsers.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.projectUsers = action.payload.data;
      }
    );
    builder.addCase(fetchProjectUsers.rejected, (state, action) => {
      state.loading = false;
      state.projectUsers = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertProjectUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      upsertProjectUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        const index = state.projectUsers.findIndex(pu => pu.email === action.payload.data.email)
        if (index > -1) {
          state.projectUsers = state.projectUsers.map(pu => {
            if (pu.email === action.payload.data.email)
              return action.payload.data
            else
              return pu
          })
        } else {
          state.projectUsers = [...state.projectUsers, action.payload.data]
        }
      }
    );
    builder.addCase(upsertProjectUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    //
    builder.addCase(upsertOrgUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      upsertOrgUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        const index = state.orgUsers.findIndex(pu => pu.email === action.payload.data.email)
        if (index > -1) {
          state.orgUsers = state.orgUsers.map(ou => {
            if (ou.email === action.payload.data.email)
              return action.payload.data
            else
              return ou
          })
        } else {
          state.orgUsers = [...state.orgUsers, action.payload.data]
        }
      }
    );
    builder.addCase(upsertOrgUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
  reducers: {
  },
});

export const usersSelector = (state: RootState) => state.users;
export default usersSlice.reducer;
