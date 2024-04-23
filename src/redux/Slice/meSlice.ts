import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { GenerateAPIKey, GetAPIKeys, GetFiles, GetMe, UploadFile } from "../Services/user";
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
  files: any[]
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
  files:[],
  me: undefined,
  selectedOrgs: undefined,
  error: undefined,
};
export const fetchMe = createAsyncThunk("me/fetchMe", async () => GetMe());
export const fetchFiles = createAsyncThunk("me/fetchApiKeys", async ({projectId}:{projectId:number}) => GetAPIKeys(projectId));
export const uploadFile = createAsyncThunk("me/uploadFile", async ({projectId,file}:{projectId:number,file:File}) => UploadFile(projectId,file));
export const fetchAPIKeys = createAsyncThunk("me/fetchFiles", async ({projectId}:{projectId:number}) => GetFiles(projectId));
export const generateAPIKey = createAsyncThunk("me/generateAPIKey", async ({projectId}:{projectId:number}) => GenerateAPIKey(projectId));
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
        if (action.payload.data == null || action.payload.data==undefined)
          state.apiKeys=[]
        else {
          state.apiKeys = action.payload.data;
        }
      }
    );
    builder.addCase(fetchAPIKeys.rejected, (state, action) => {
      state.loading = false;
      state.apiKeys = [];
      state.error = action.error.message;
    });
    //Files
    builder.addCase(fetchFiles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchFiles.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload.data == null || action.payload.data==undefined)
          state.files=[]
        else {
          state.files = action.payload.data;
        }
      }
    );
    builder.addCase(fetchFiles.rejected, (state, action) => {
      state.loading = false;
      state.files = [];
      state.error = action.error.message;
    });
    //UploadFile
    builder.addCase(uploadFile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      uploadFile.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (!(action.payload.data == null || action.payload.data==undefined)){
          state.files = [...state.files,action.payload.data];
        }
      }
    );
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.loading = false;
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
