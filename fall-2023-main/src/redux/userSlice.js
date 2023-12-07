// userSlice.js

import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    QrCode: null,
    q_code: null,
    tfa: false,
    tempUser: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setTempUser: (state, action) => {
      state.tempUser = action.payload
    },
    logout: (state) => {
      state.user = null
      state.tfa = false
    },
    setQr: (state, action) => {
      state.QrCode = action.payload.QrCode
      state.q_code = action.payload.code
    },
    clearQr: (state) => {
      state.QrCode = null
      state.q_code = null
    },
    enableTFA: (state) => {
      state.tfa = true
    },
  },
})

export const {
  setUser,
  logout,
  setQr,
  clearQr,
  enableTFA,
  setTempUser,
} = userSlice.actions

export const selectUser = (state) => state.user
export const selectTempUser = (state) => state.tempUser
export const getQr = (state) => state.QrCode
export const getCode = (state) => state.q_code
export const getTFA = (state) => state.tfa

export default userSlice.reducer
