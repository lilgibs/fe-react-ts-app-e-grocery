import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "../app/store";
function getConfig(isMultipart = false) {
  const adminToken = localStorage.getItem("admin_token");

  return {
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    },
  };
}

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: {
      product_id: "",
      product_category_id: "",
      product_name: "",
      product_description: "",
      product_price: 0,
      product_images: [{ image_url: "" }],
      quantity_in_stock: 0,
      discounted_price: 0,
      discount_value_type: "",
      promo_info: "",
      discount_value: 0,
    },
    isLoading: false,
  },
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    resetProduct: (state) => {
      state.product = {
        product_id: "",
        product_category_id: "",
        product_name: "",
        product_description: "",
        product_price: 0,
        product_images: [{ image_url: "" }],
        quantity_in_stock: 0,
        discounted_price: 0,
        discount_value_type: "",
        promo_info: "",
        discount_value: 0,
      };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setProduct, resetProduct, setLoading } = productSlice.actions;
export default productSlice.reducer;

export function fetchProduct(productId: string) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/products/${productId}`,
        getConfig()
      );
      dispatch(setProduct(response.data.product));
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      if (error.response) {
        return { status: error.response.status };
      } else {
        return null;
      }
    }
  };
}

export function fetchProductUser(productName: string, storeId: string) {
  return async (dispatch: AppDispatch) => {
    if (!productName) return;

    productName = productName.replace(/-/g, " ");
    let url = `${process.env.REACT_APP_API_BASE_URL}/products/${productName}?`;
    if (storeId) {
      url += `storeId=${storeId}`;
    }

    try {
      const response = await axios.get(url);
      console.log(response.data.product);
      dispatch(setProduct(response.data.product));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export function addProduct(product: {
  store_id: string;
  product_category_id: string;
  product_name: string;
  product_description: string;
  product_price: string;
  product_weight: string;
  quantity_in_stock: string;
  product_images: FileList | null;
}) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      let formData = new FormData();
      formData.append("store_id", product.store_id);
      formData.append("product_category_id", product.product_category_id);
      formData.append("product_name", product.product_name);
      formData.append("product_description", product.product_description);
      formData.append("product_price", product.product_price);
      formData.append("product_weight", product.product_weight);
      formData.append("quantity_in_stock", product.quantity_in_stock);

      if (product.product_images) {
        Array.from(product.product_images).forEach((image) => {
          formData.append(`product_images`, image);
        });
      }

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/products`,
        formData,
        getConfig(true)
      );
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      throw error.response
    }
  };
}

export function updateProduct(productId: string, product: string) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/admin/products/${productId}`,
        product,
        getConfig()
      );
      dispatch(setLoading(false));
      response.status === 200 && dispatch(fetchProduct(productId))
    } catch (error: any) {
      dispatch(setLoading(false));
      throw error.response
    }
  };
}

export function uploadImage(file: File, productId: string, imageId: string) {
  return async (dispatch: AppDispatch) => {
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("product_image", file);

    try {
      dispatch(setLoading(true));
      let response;
      if (imageId) {
        // Jika gambar sudah ada, lakukan pembaruan
        response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/admin/products/image/${imageId}`,
          formData,
          getConfig(true)
        );
      } else {
        // Jika tidak, unggah gambar baru
        response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/products/image`,
          formData,
          getConfig(true)
        );
      }
      dispatch(setLoading(false));
      dispatch(fetchProduct(productId));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      throw error
    }
  };
}

export function deleteImage(imageId: string, productId: string) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      console.log(imageId);
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/products/image/${imageId}/permanently?productId=${productId}`,
        getConfig()
      );
      dispatch(fetchProduct(productId));
    } catch (error) {
      dispatch(setLoading(false));
      throw error
    }
  };
}
