import { useEffect, useState } from "react";
import { CartApiRepository, ICartProps } from "../api/cart/cart-api-repository";

export default function useCart(props: {
  storeId?: string,
  userId?: string,
}) {
  const ApiRepo = new CartApiRepository()

  const [data, setData] = useState<ICartProps>();
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      setIsError(false)
      const response = await ApiRepo.get(props)
      setData(response.cart);
      setIsSuccess(false)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const insertData = async (props: {
    user_id: string,
    product_id: string,
    quantity: number,
    store_id: string,
    discount: number,
  }) => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      setIsError(false)
      const response = await ApiRepo.addCart(props)
      setData(response.cart);
      setIsSuccess(false)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (props.storeId && props.userId) {
      fetchData()
    }
  }, [])

  return {
    fetchData,
    insertData,
    isLoading,
    isSuccess,
    isError,
    data,
  }
}
