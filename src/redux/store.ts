import { configureStore, combineReducers } from "@reduxjs/toolkit";
// ...
import userReducer from "./Slice/userSlice";
import commonModalReducer from "./Slice/commonModalSlice";
import resourcesReducer from "./Slice/resourcesSlice";

export const rootReducer = combineReducers({
  users: userReducer,
  commonModal: commonModalReducer,
  resources: resourcesReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
