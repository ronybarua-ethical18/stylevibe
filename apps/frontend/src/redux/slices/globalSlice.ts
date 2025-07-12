import { createSlice } from '@reduxjs/toolkit'

interface GlobalState {
  isModalOpen: boolean
}

const initialState: GlobalState = {
  isModalOpen: false,
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    showModal(state, { payload }) {
      state.isModalOpen = payload
    },
    closeModal(state, { payload }) {
      state.isModalOpen = payload
    },
  },
})

export const { showModal, closeModal } = globalSlice.actions
export const globalSelector = (state: any) => state.global
export default globalSlice.reducer
