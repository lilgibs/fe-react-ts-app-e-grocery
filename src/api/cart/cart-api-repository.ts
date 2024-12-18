import axios from 'axios';

export interface ICartProps {
  cart_count: number,
  cart_items: any[],
  shipping_courier_cart: string,
  shipping_address: string,
  shipping_option: string,
}

export class CartApiRepository {
  async get(props: {
    storeId?: string,
    userId?: string
  }): Promise<{ cart: ICartProps }> {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
        params: {
          storeId: props.storeId,
          userId: props.userId,
        }
      });

      return data;
    } catch (error) {
      console.error(error);
      throw error
    };
  }

  async addCart(props: {
    user_id: string,
    product_id: string,
    quantity: number,
    store_id: string,
    discount: number,
  }): Promise<{ cart: ICartProps }> {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/cart`, props);
      return data;
    } catch (error) {
      console.error(error);
      throw error
    };
  }
};
