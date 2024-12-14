import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const discountSlice = createSlice({
  name: "discounts",
  initialState: {
    discount: [],
  },
  reducers: {
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    resetDiscount: (state) => {
      state.discount = [];
    },
  },
});

export const { setDiscount, resetDiscount } = discountSlice.actions;
export default discountSlice.reducer;

export function getDiscount(store_id: string, token: string) {
  return async (dispatch: any) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/discounts/${store_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch(setDiscount(response.data.data));
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
}
