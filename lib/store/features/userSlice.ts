import { nextLocalStorage } from '@/lib/nextLocalStorage'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  userData: any | null
}

const initialState: UserState = {
  userData: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.userData = action.payload
      nextLocalStorage()?.setItem('userData', JSON.stringify(action.payload))
    },
    clearUser: (state) => {
      state.userData = null
      nextLocalStorage()?.removeItem('userData')
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.userData = { ...state.userData, ...action.payload }
      nextLocalStorage()?.setItem('userData', JSON.stringify(state.userData))
    },
  },
})

export const { setUser, clearUser, updateUser } = userSlice.actions

export default userSlice.reducer