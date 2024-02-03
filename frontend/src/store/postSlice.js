import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postData: null
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPost: (state, action) => {
            state.postData = action.payload
        }
    }
})

export const { setPost } = postSlice.actions
export default postSlice.reducer