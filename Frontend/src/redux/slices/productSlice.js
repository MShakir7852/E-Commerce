import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    products: [],
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: "products",

    initialState,

    reducers: {
        fetchProductsStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        fetchProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload;
        },

        fetchProductsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearProducts: (state) => {
            state.products = [];
        },
    },
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    clearProducts,
} = productSlice.actions;

export default productSlice.reducer;