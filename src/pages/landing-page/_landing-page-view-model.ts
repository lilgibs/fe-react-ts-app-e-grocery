import { useRef } from 'react'
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import useGlobalHooks from '../../hooks/useGlobalHooks';
import useCategory from '../../hooks/useCategory';
import useProduct from '../../hooks/useProduct';

export default function useLandingPageViewModel() {
  const globalHooks = useGlobalHooks();

  const userToken = localStorage.getItem("user_token");
  const { store_id } = useSelector((state: RootState) => state.location.location.nearestStore);
  const nearestStore = useSelector((state: RootState) => state.location.location.nearestStore.store_name);
  const nearestDistance = useSelector((state: RootState) => state.location.location.kmToNearestStore);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<Slider>(null)

  const categories = useCategory()
  const products = useProduct({ storeId: store_id })

  //carousel
  const carouselSettings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "10px" });

  const cards = [
    `${process.env.REACT_APP_API_UPLOAD_URL}/banner1.png`,
    `${process.env.REACT_APP_API_UPLOAD_URL}/banner2.png`,
    `${process.env.REACT_APP_API_UPLOAD_URL}/banner3.png`,
  ];

  return {
    globalHooks,
    userToken,
    carouselSettings,
    top,
    side,
    cards,
    products,
    categories,
    nearestStore,
    nearestDistance,
    sliderRef,
    cancelRef,
    isOpen, onOpen, onClose,
  }
}
