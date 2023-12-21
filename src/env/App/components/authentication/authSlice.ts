import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export type AuthState = {
    isLoggingIn: boolean;
    isLoggedIn: boolean;
    accessToken?: string;
};

const initialState: AuthState = {
    isLoggingIn: false,
    isLoggedIn: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: state => {
            state.isLoggingIn = true;
        },
        loggedIn: (state, action: PayloadAction<string>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.isLoggingIn = false;
            state.isLoggedIn = true;
            state.accessToken = action.payload;
        },
        logOut: state => {
            state.isLoggedIn = false;
            state.accessToken = undefined;
        },
    },
});

// Action creators are generated for each case reducer function
export const {logIn, loggedIn, logOut} = authSlice.actions;

export default authSlice.reducer;
