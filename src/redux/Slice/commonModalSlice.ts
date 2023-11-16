import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
export interface ModalState {
  open: boolean;
  key: string;
}
const initialState: ModalState = {
  key: "",
  open: false,
};

const commonModalSlice = createSlice({
  name: "commonModal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.open = action.payload.open;
      state.key = action.payload.key;
    },
    closeModal: (state, action) => {
      state.open = false;
      state.key = "";
    },
  },
});

export const { openModal, closeModal } = commonModalSlice.actions;
export const modalSelector = (state: RootState) => state.commonModal;
export default commonModalSlice.reducer;
