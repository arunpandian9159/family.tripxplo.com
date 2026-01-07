
import { createSlice , PayloadAction } from "@reduxjs/toolkit"


const initialState = {
  isLoggedIn : false,
  googleAccessToken  : "",
  userId : ""

}

export const authSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        setLoggedIn: (state) => {
            state.isLoggedIn = !state.isLoggedIn
        },
        setAccessToken: (state,action : PayloadAction<string>) => {
            state.googleAccessToken = action.payload
        },
        setUserId : (state,action : PayloadAction<string>) => {
            state.userId = action.payload
        }
    
    },
})

export const { setLoggedIn,setAccessToken,setUserId} = authSlice.actions
export default authSlice.reducer