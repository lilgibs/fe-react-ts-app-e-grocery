import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import ProductFilterDrawer from "../../components/ProductFilterDrawer";
import ProductCard from "../../components/ProductCard";
import ProductNotFound from "../../components/ProductNotFound";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import useProductsViewModel from "./_products-view-model";
import { sortOptions } from "../../utils/sortOptions";

function Products() {
  const model = useProductsViewModel();

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full">
        <img className="hidden sm:block" src={process.env.REACT_APP_API_UPLOAD_URL + `/products_banner.jpg`} alt="" />
        <img className="sm:hidden" src={process.env.REACT_APP_API_UPLOAD_URL + `/products_banner2.jpg`} alt="" />
      </div>
      <div className="md:w-[95%] xl:max-w-screen-xl mx-auto w-full">
        <div className="flex gap-5 min-h-screen">
          {/* Sidebar - START */}
          <div className="hidden lg:flex flex-col w-[20%] gap-5">
            <div className="text-xl ">
              <p className="font-semibold">
                Store: <span className="text-green-500">{model.store_name}</span>
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {/* Category - START */}
              <div className="flex flex-col gap-2 ">
                <p className="font-semibold text-lg border-b-2 border-neutral-200 pb-2 text-neutral-600">Category</p>
                <div className="flex flex-col gap-2 overflow-y-auto h-[300px] pr-2">
                  {model.categories.data.map((category) => (
                    <div
                      className={`flex border px-4 py-2 rounded-md gap-5 items-center cursor-pointer hover:translate-x-1 duration-100
                        ${model.watch("category") === category.label.toLowerCase() ? "font-semibold border-green-500 text-green-500" : ""}`}
                      onClick={() => model.setValue("category", category.label.toLowerCase())}
                    >
                      <img className="h-5" src={`${process.env.REACT_APP_API_IMG_URL + category.image}`} alt="" />
                      <p className="">{category.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Category - END */}
            </div>
          </div>
          {/* Sidebar - END */}
          {/* Content - START */}
          <div className="flex flex-col gap-5 w-[90%] lg:w-[80%] mx-auto">
            {/* Content Header - START */}
            <div className="flex lg:justify-end">
              {/* Filter - START */}
              <div className="lg:hidden">
                <div
                  onClick={() => model.setFilterVisible(true)}
                  className=" hover:bg-green-500 text-green-500 hover:text-white border-2 border-green-500 px-4 py-1 rounded-full flex items-center gap-1 cursor-pointer duration-150"
                >
                  <FaFilter size={15} />
                  <p className="font-semibold">Filter</p>
                </div>
                <ProductFilterDrawer
                  isOpen={model.isFilterVisible}
                  onClose={() => model.setFilterVisible(false)}
                  handleSortChange={
                    (val) => {
                      const [sortType, sortOrder] = val.split("_");
                      model.setValue("sortBy", sortOrder);
                      model.setValue("sortType", sortType);
                    }
                  }
                  sortType={model.watch("sortType")}
                  sortOrder={model.watch("sortBy")}
                  categories={model.categories.data}
                  selectedCategory={model.watch("category")}
                  handleSetCategory={(category) => model.setValue("category", category)}
                />
              </div>
              {/* Filter - END */}
              <div className="hidden lg:flex w-[30%] gap-2 items-center">
                <p className="font-semibold">Urutkan: </p>
                <Select
                  className="w-full"
                  id="product_sort_id"
                  name="product_sort_id"
                  placeholder="Sort by"
                  options={sortOptions}
                  isClearable={true}
                  onChange={(e) => {
                    const [sortType, sortOrder] = e?.value.split("_") ?? ["", ""];
                    model.setValue("sortBy", sortOrder);
                    model.setValue("sortType", sortType);
                  }}
                />
              </div>
            </div>
            {/* Content Header - END */}

            {/* Content Body - START */}
            {model.products.data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-auto">
                {model.products.data.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.product_id}
                  />
                ))}
              </div>
            ) : (
              <ProductNotFound />
            )}
            {/* Content Body - END */}
            <div>
              <div>
                {model.products.data.length > model.watch("limit") && (
                  <Pagination
                    pageCount={Math.ceil(model.products.data.length / model.watch("limit"))}
                    onPageChange={(e: { selected: number }) => model.setValue("page", e.selected + 1)}
                    forcePage={model.watch("page") - 1}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Content - END */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Products;
