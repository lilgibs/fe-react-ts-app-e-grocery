import { useSelector } from "react-redux";
import useCategory from "../../hooks/useCategory"
import useProduct from "../../hooks/useProduct"
import { RootState } from "../../app/store";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useProductsViewModel() {

  const [isFilterVisible, setFilterVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { store_id, store_name } = useSelector((state: RootState) => state.location.location.nearestStore);

  const { watch, register, setValue } = useForm({
    values: {
      category: "",
      sortBy: "",
      sortType: "",
      page: 1,
      limit: 20,
    }
  });

  const categories = useCategory()
  const products = useProduct({
    storeId: store_id,
    search: searchParams.get("search") || "",
    category: watch("category"),
    page: watch("page"),
    limit: watch("limit"),
    sortOrder: watch("sortBy"),
    sortType: watch("sortType"),
  })

  useEffect(() => {
    searchParams.set("page", String(watch("page")));
    setSearchParams(new URLSearchParams(searchParams.toString()));
    window.scrollTo(0, 0);
  }, [watch("page")])

  useEffect(() => {
    searchParams.set("category", watch("category"));
    searchParams.set("sort_type", watch("sortType"));
    searchParams.set("sort_order", watch("sortBy"));
    searchParams.set("page", "1");
    searchParams.set("limit", String(watch("limit")));
    setSearchParams(new URLSearchParams(searchParams.toString()));
  }, [watch("sortBy"), watch("sortType"), watch("category"), watch("limit")])

  useEffect(() => {
    setValue("category", searchParams.get("category") || "");
    setValue("sortType", searchParams.get("sort_type") || "");
    setValue("sortBy", searchParams.get("sort_order") || "");
    setValue("page", Number(searchParams.get("page")) || 1);
    setValue("limit", Number(searchParams.get("limit")) || 20);
  }, [window.location.href])

  return {
    store_name,
    products,
    categories,
    watch, register, setValue,
    isFilterVisible, setFilterVisible,
  }
}
