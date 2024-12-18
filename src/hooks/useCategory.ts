import { useEffect, useState } from "react";
import { CategoryApiRepository } from "../api/category/category-api-repository"

export default function useCategory() {
  const ApiRepo = new CategoryApiRepository()

  const [data, setData] = useState<{ value: string; label: string; image: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      setIsError(false)
      const response = await ApiRepo.get()
      setData(response.formattedCategories);
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
