import axios from "axios";

export class ProductApiRepository {
  async get(props: {
    storeId?: string,
    search?: string,
    category?: string,
    page?: number,
    limit?: number,
    sortType?: string,
    sortOrder?: string
  }): Promise<any[]> {
    try {
      const { storeId, search, category, page, limit, sortType, sortOrder } = props

      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/products/categories/`, {
        params: {
          ...(storeId && { storeId }),
          ...(search && { search }),
          ...(category && { category }),
          ...(page && { page }),
          ...(limit && { limit }),
          ...(sortType && { sortType }),
          ...(sortOrder && { sortOrder }),
        },
      });
      return data;
    }
    catch (error) {
      console.error(error);
    };
  }
}