const {createSlice}=require("@reduxjs/toolkit");

const initialState = {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;

            const existingItem = state.items.find(
                (item) => item._id === product._id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    ...product,
                    quantity: 1,
                });
            }

            state.totalQuantity += 1;

            state.totalPrice = state.items.reduce(
                (total, item) =>
                    total + Number(item.discountPrice || item.price) * item.quantity,
                0
            );
        },

        removeFromCart: (state, action) => {
            const item = state.items.find(
                (item) => item._id === action.payload
            );

            if (!item) return;

            state.totalQuantity -= item.quantity;

            state.items = state.items.filter(
                (item) => item._id !== action.payload
            );

            state.totalPrice = state.items.reduce(
                (total, item) =>
                    total + Number(item.discountPrice || item.price) * item.quantity,
                0
            );
        },

        increaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item._id === action.payload
            );

            if (item) {
                item.quantity += 1;
                state.totalQuantity += 1;
            }

            state.totalPrice = state.items.reduce(
                (total, item) =>
                    total + Number(item.discountPrice || item.price) * item.quantity,
                0
            );
        },

        decreaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item._id === action.payload
            );

            if (!item) return;

            if (item.quantity > 1) {
                item.quantity -= 1;
                state.totalQuantity -= 1;
            }

            state.totalPrice = state.items.reduce(
                (total, item) =>
                    total + Number(item.discountPrice || item.price) * item.quantity,
                0
            );
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;