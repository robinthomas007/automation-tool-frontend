import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { CreateFolder, DeleteFolder, Folders, UpdateFolder } from "../Services/folders";
export interface Folder {
  id: number;
  name: string;
  parent_id: number;
  CreatedAt: string;
  UpdatedAt: string;
}
export interface FoldersState {
  loading: boolean;
  fetchLoading: boolean;
  folders: Array<Folder>;
  selectedFolders: Folder | any;
  error: string | undefined;
}
const initialState: FoldersState = {
  loading: false,
  folders: [],
  selectedFolders: {},
  error: undefined,
  fetchLoading: false
};
export const fetchFolders = createAsyncThunk(
  "tests/fetchFolders",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => {
    return Folders(projectId, searchTerm)
  }
);
export const createFolder = createAsyncThunk(
  "tests/createFolder",
  async ({ projectId, folder }: { projectId: number, folder: Folder }) => {
    return CreateFolder(projectId, folder)
  }
);


export const updateFolder = createAsyncThunk(
  "tests/updateFolder",
  async ({ folder }: { folder: Folder }) => UpdateFolder(folder)
);

export const deleteFolder = createAsyncThunk(
  "tests/deleteFolder",
  async ({ id }: { id: number }) => DeleteFolder(id)
);

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchFolders.pending, (state) => {
      state.loading = true;
      state.fetchLoading = true;
      state.folders = []
      state.selectedFolders = {}
    });
    builder.addCase(fetchFolders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fetchLoading = false;
      state.folders = payload.data;
      if (payload.data.length) {
        state.selectedFolders = payload.data[0];
      }
    });
    builder.addCase(fetchFolders.rejected, (state, action) => {
      state.loading = false;
      state.fetchLoading = false;
      state.folders = [];
      state.error = action.error.message;
    });

    builder.addCase(createFolder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createFolder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.folders = [...state.folders, payload.data];
      if (payload.data.length) {
        state.selectedFolders = payload.data[0];
      }
    });
    builder.addCase(createFolder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    
    builder.addCase(updateFolder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateFolder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedFolders = payload.data;
      const stepIndex = state.folders.findIndex(test => test.id === state.selectedFolders.id);
      if (stepIndex !== -1) {
        const updatedTests = [...state.folders];
        updatedTests[stepIndex] = {
          ...state.selectedFolders
        }
        state.folders = updatedTests;
      }

    });
    builder.addCase(updateFolder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteFolder.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteFolder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.folders = state.folders.filter((item) => item.id !== payload.data.id)
    });

    builder.addCase(deleteFolder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  },
  reducers: {
    removeUserFromList: (state, action) => { },
    selectFolders: (state, action) => {
      state.selectedFolders = action.payload;
    },
  },
});

export const { selectFolders } = foldersSlice.actions;
export const foldersSelector = (state: RootState) => state.folders;
export default foldersSlice.reducer;
