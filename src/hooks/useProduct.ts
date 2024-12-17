import { useEffect, useState } from "react";
import { ProductApiRepository } from "../api/product/product-api-repository";

export default function useProduct(props: { storeId: string }) {
  const ApiRepo = new ProductApiRepository()

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      setIsError(false)
      const response = await ApiRepo.get(props)
      setData(response);
      setIsSuccess(false)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    isLoading,
    isSuccess,
    isError,
    data,
  }
}
