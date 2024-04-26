import { configureStore, combineReducers } from "@reduxjs/toolkit";
// ...
import meReducer from "./Slice/meSlice";
import commonModalReducer from "./Slice/commonModalSlice";
import resourcesReducer from "./Slice/resourcesSlice";
import testsReducer from "./Slice/testsSlice";
import stepsReducer from "./Slice/stepsSlice";
import suitesReducer from "./Slice/suitesSlice";
import projectsReducer from "./Slice/projectsSlice";
import dataProfileReducer from "./Slice/dataProfileSlice";
import runsReducer from "./Slice/runsSlice";
import usersReducer from "./Slice/usersSlice";
import foldersReducer from "./Slice/foldersSlice";

export const rootReducer = combineReducers({
  me: meReducer,
  commonModal: commonModalReducer,
  resources: resourcesReducer,
  tests: testsReducer,
  steps: stepsReducer,
  suites: suitesReducer,
  projects: projectsReducer,
  dataProfile: dataProfileReducer,
  runs: runsReducer,
  users: usersReducer,
  folders: foldersReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
