import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import { nextLocalStorage } from '../nextLocalStorage'

export const makeStore = () => {
    const persistedUserData = nextLocalStorage()?.getItem('userData')
    const preloadedState = {
        user: {
            userData: persistedUserData ? JSON.parse(persistedUserData) : null
        }
    }
    return configureStore({
        reducer: {
            user: userReducer,
        },
        preloadedState,
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']