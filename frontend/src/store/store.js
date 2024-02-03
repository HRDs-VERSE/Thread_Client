import {configureStore} from '@reduxjs/toolkit';
import modeSlice from './modeSlice';
import postSlice from './postSlice';

const store = configureStore({
    reducer: {
        mode : modeSlice,
        post : postSlice

    }
});


export default store;