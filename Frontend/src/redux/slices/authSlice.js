import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const accessToken = localStorage.getItem("accessToken");

let parsedUser = null;

try {
    parsedUser = storedUser
        ? JSON.parse(storedUser)
        : null;
} catch (error) {
    parsedUser = null;
}

const initialState = {
    user: parsedUser,
    accessToken: accessToken || null,
    isLogin: !!(accessToken && parsedUser),
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        // =========================
        // LOGIN
        // =========================
        loginUser: (state, action) => {
            const { user, accessToken } = action.payload;

            state.user = user;
            state.accessToken = accessToken;
            state.isLogin = true;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "accessToken",
                accessToken
            );
        },

        // =========================
        // LOGOUT
        // =========================
        logoutUser: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isLogin = false;

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("username");
        },

        // =========================
        // UPDATE USER
        // =========================
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLogin = !!action.payload;

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload)
            );
        },

    },
});

export const {
    loginUser,
    logoutUser,
    setUser,
} = authSlice.actions;

export default authSlice.reducer;