
import { formatRupiah } from "../../../utils/formatRupiah";
import useProductViewModel from "./_product-view-model";

function Product() {
  const model = useProductViewModel()

  if (model.isLoading) {
    return <div>Loadings...</div>;
  }

  return (
    <div className="flex flex-col gap-5 lg:mt-10">
      <div className="md:w-[95%] xl:max-w-screen-lg mx-auto lg:border rounded-md p-5 ">
        <div className="flex flex-col sm:flex-row gap-5 h-auto">
          {/*  */}
          <div className=" md:w-[40%] flex flex-col-reverse lg:flex-row gap-3 justify-end">
            {/* Image List - START */}
            <div className="lg:w-1/5 flex flex-row lg:flex-col gap-2">
              {model.product.product_images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    model.setSelectedImage(`${process.env.REACT_APP_API_IMG_URL + image.image_url}`);
                  }}
                  className={`rounded-md w-1/5 lg:w-full cursor-pointer ${model.selectedImage === `${process.env.REACT_APP_API_IMG_URL + image.image_url}` ? "outline outline-offset-2 outline-1 outline-green-500" : ""}`}
                >
                  <img className="w-full" src={`${process.env.REACT_APP_API_IMG_URL + image.image_url}`} alt="" />
                </div>
              ))}
            </div>
            {/* Image List - END */}

            {/* Preview */}
            <div className="w-full lg:w-4/5">
              <img className="w-full" src={model.selectedImage} alt="" />
            </div>
          </div>

          {/*  */}
          <div className="md:w-[60%] flex flex-col gap-5">
            <h2 className="font-semibold text-xl md:text-2xl">{model.product.product_name}</h2>
            {model.product.discounted_price ? (
              <div className="flex gap-2 bg-neutral-100  p-3 items-center rounded">
                <p
                  className=" text-sm md:text-lg bg-neutral-100 text-neutral-500 line-through">
                  {formatRupiah(model.product.product_price)}
                </p>
                <p
                  className="font-semibold text-2xl md:text-3xl bg-neutral-100 rounded-md text-rose-500">
                  {formatRupiah(model.product.discounted_price)}
                </p>
                {model.product.discount_value_type == "PERCENTAGE" ? 
                <p className="bg-red-600 text-white px-1 rounded-sm text-xs font-bold">
                  {model.product.discount_value}% OFF
                  </p> : null}
              </div>
            ) : (
              <p className="font-semibold text-2xl md:text-3xl bg-neutral-100 rounded p-3 text-rose-500">{formatRupiah(model.product.product_price)}</p>
            )}
            {
              model.product.promo_info == "BUY 1 GET 1" ?
                (
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <p className="bg-green-100 text-green-600 font-bold p-1 rounded">BUY 1 GET 1</p>
                  </div>
                ) : null
            }

            <div>
              <p className="md:text-lg font-semibold">Description</p>
              <p className=" md:text-lg">{model.product.product_description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="md:text-lg font-semibold">Quantity</p>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-row px-4 py-2 rounded-md border justify-between font-semibold">
                  <button onClick={model.decreaseQuantity}>-</button>
                  <input type="number" className="text-center mx-2" value={model.quantity} onChange={model.handleInputChange} />
                  <button onClick={model.increaseQuantity}>+</button>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold rounded-md disabled:cursor-not-allowed"
                  disabled={!model.user_id || model.product.quantity_in_stock === 0}
                  onClick={() => {
                    model.handleAddToCart();
                  }}
                >
                  Add To Cart
                </button>
              </div>
              <div className="text-neutral-400">Stock: {model.product.quantity_in_stock}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
