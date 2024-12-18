import { useEffect, useState } from 'react'
import useGlobalHooks from '../../../hooks/useGlobalHooks'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { fetchCart } from '../../../features/cartSlice';
import useCart from '../../../hooks/useCart';
import { fetchProductUser } from '../../../features/productSlice';

export default function useProductViewModel() {
  const globalHooks = useGlobalHooks()

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>();

  const { productName } = useParams();

  const { user_id } = useSelector((state: RootState) => state.user.user);
  const product = useSelector((state: RootState) => state.product.product);
  const { isLoading } = useSelector((state: RootState) => state.product);
  const { store_id, store_name } = useSelector((state: RootState) => state.location.location.nearestStore);
  const userGlobal = useSelector((state: RootState) => state.user.user);

  const cartHooks = useCart({
    storeId: store_id,
    userId: user_id,
  })

  // fungsi untuk menambah quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity === product.quantity_in_stock ? prevQuantity : prevQuantity + 1));
  };

  // fungsi untuk mengurangi quantity
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Handle manual input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    const stock = product.quantity_in_stock;

    // Ensure value is a number and is at least 1
    let quantity = isNaN(value) ? 1 : value < 1 ? 1 : value;

    // Ensure quantity does not exceed stock
    quantity = Math.min(quantity, stock);

    setQuantity(quantity);
  };

  const handleAddToCart = async () => {
    try {
      let cart = {
        user_id: user_id,
        product_id: product.product_id,
        quantity: quantity,
        store_id: store_id,
        discount: product.discounted_price,
      };
      cartHooks.insertData(cart);
      globalHooks.dispatch(fetchCart(userGlobal.user_id, store_id));
      globalHooks.dispatch(fetchProductUser(productName || "", store_id));
      alert("Product added to cart");
    } catch (error) {
      alert(`Add to cart fails. Amount in cart (${quantity}) exceeds product's stock`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await globalHooks.dispatch(fetchProductUser(productName || "", store_id));
      } catch (error: any) {
        alert(error.response.data);
        globalHooks.navigate("/products");
      }
    };

    fetchData();
  }, [productName, store_id]);

  useEffect(() => {
    if (product && product.product_images && product.product_images.length > 0) {
      setSelectedImage(`${process.env.REACT_APP_API_IMG_URL + product.product_images[0].image_url}`);
    }
  }, [product]);

  return {
    user_id,
    product,
    isLoading,
    globalHooks,
    quantity, setQuantity,
    selectedImage, setSelectedImage,
    handleInputChange,
    handleAddToCart,
    increaseQuantity,
    decreaseQuantity,
  }
}
