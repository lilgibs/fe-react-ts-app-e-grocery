import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const adminSlice = createSlice({
  name: "users",
  initialState: {
    admin: {
      admin_id: "",
      name: "",
      email: "",
      role: "",
      store_id: "",
      is_deleted: false,
    },
    isLoaded: false,
  },
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    resetAdmin: (state) => {
      state.admin = {
        admin_id: "",
        name: "",
        email: "",
        role: "",
        store_id: "",
        is_deleted: false,
      };
      localStorage.removeItem("admin_token");
    },
    setLoading: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export function loginAdmin(data) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/adminLogin`, data);
      if (response) {
        dispatch(setAdmin(response.data.data));
        localStorage.setItem("admin_token", response.data.token);
        alert(response.data.message);
      }
    } catch {
      alert("You are not registered as an admin");
    }
  };
}

export function checkLoginAdmin(token) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/check-adminlogin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch(setAdmin(response.data.data));
      }
    } catch (error) {
      // alert("error");
      console.log(error);
    } finally {
      dispatch(setLoading(true));
    }
  };
}

export function createBranchAdmin(data) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const adminToken = localStorage.getItem("admin_token");
    try {
      let response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/auth`, data, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      throw error.response;
    }
  };
}

export const { setAdmin, resetAdmin, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
