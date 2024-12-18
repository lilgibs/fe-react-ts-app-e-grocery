import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { AppDispatch } from "../app/store";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      cart_count: 0,
      cart_items: [],
      shipping_courier_cart: "",
      shipping_address: "",
      shipping_option: "",
    },
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    setCartItems: (state, action) => {
      state.cart.cart_items = action.payload;
    },

    setShippingAddress: (state, action) => {
      state.cart.shipping_address = action.payload;
    },

    setShippingCourierCart: (state, action) => {
      state.cart.shipping_courier_cart = action.payload;
    },

    setShippingOption: (state, action) => {
      state.cart.shipping_option = action.payload;
    },

    updateCartCount: (state) => {
      state.cart.cart_count = state.cart.cart_items.length;
    },


    resetCartItems: (state) => {
      state.cart.cart_items = [];
    },

    resetCart: (state) => {
      state.cart = {
        cart_count: 0,
        cart_items: [],
        shipping_courier_cart: "",
        shipping_address: "",
        shipping_option: "",
      };
    },
  },
});

export const { setCart, setShippingCourierCart, setShippingOption, setShippingAddress, resetCart, setCartItems, updateCartCount, resetCartItems } = cartSlice.actions;
export default cartSlice.reducer;

export function fetchCart(user: string, store: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart/?userId=${user}&storeId=${store}`);
      let cartItems = response.data.cart;

      dispatch(setCartItems(cartItems));
      dispatch(updateCartCount());
    } catch (error) {
      console.error(error);
    }
  };
}
