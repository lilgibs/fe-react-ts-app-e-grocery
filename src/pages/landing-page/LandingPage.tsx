import { Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Box, IconButton } from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import ProductNotFound from "../../components/ProductNotFound";
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import useLandingPageViewModel from "./_landing-page-view-model";

const LandingPage = () => {
  const model = useLandingPageViewModel()

  return (
    <div className="bg-white">
      <div className="relative isolate lg:px-20">
        <div className="px-4 my-5 md:px-10">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">
            Nearest store:
            <a className="text-green-500"> {model.nearestStore}</a>
          </h3>
        </div>

        {/* alert distance */}

        <AlertDialog
          size="lg"
          isOpen={model.isOpen}
          leastDestructiveRef={model.cancelRef}
          onClose={model.onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                ⚠ Nearest branch is too far away
              </AlertDialogHeader>

              <AlertDialogBody>
                <Text mb="2">Sorry, we are unnable to service your location at the moment.</Text>
                <Text>You may browse our products, but you'd need to change your address to make orders.</Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    model.globalHooks.navigate("/products");
                  }}
                  ml={3}
                >
                  Browse products
                </Button>
                <Button
                  colorScheme="green"
                  onClick={
                    model.userToken
                      ? () => {
                        model.globalHooks.navigate("/profile");
                      }
                      : () => {
                        model.globalHooks.navigate("/login");
                      }
                  }
                  ml={3}
                >
                  Change address
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        {/*  */}

        <Box position={"relative"} height={"450px"} width={"full"} overflow={"hidden"}>
          <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />

          <IconButton
            aria-label="left-arrow"
            colorScheme="green"
            borderRadius="full"
            position="absolute"
            left={model.side}
            top={model.top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            onClick={() => model.sliderRef.current.slickPrev()}
          >
            <BiLeftArrowAlt />
          </IconButton>

          <IconButton
            aria-label="right-arrow"
            colorScheme="green"
            borderRadius="full"
            position="absolute"
            right={model.side}
            top={model.top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            onClick={() => model.sliderRef.current.slickNext()}
          >
            <BiRightArrowAlt />
          </IconButton>

          <Slider
            ref={model.sliderRef}
            {...model.carouselSettings}
          >
            {model.cards.map((url, index) => (
              <Box
                key={index}
                height="450px"
                position="relative"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="contain"
                backgroundImage={`url(${url})`}
              />
            ))}
          </Slider>
        </Box>

        <br />

        <div className="px-4 py-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Shop
                <a className="text-green-400"> by Categories</a>
              </h1>
            </div>

            <div className="mt-5 md:justify-self-end md:mt-0">
              <Button
                variant="outline"
                color="green.500"
                size="sm" p="3"
                borderRadius="full"
                onClick={() => model.globalHooks.navigate("/products")}
              >
                Browse categories
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-3 md:flex">
            {model.categories.data.slice(0, 8).map((category) => (
              <Button
                variant="outline"
                colorScheme="green"
                h={{ base: "80px", md: "120px", lg: "150px" }}
                w={{ base: "80px", md: "120px", lg: "150px" }}
                fontSize="sm"
                onClick={() => model.globalHooks.navigate(`/products?category=${category.label}`)}
              >
                <div className="grid grid-row-2 justify-center">
                  <img className="h-5 mx-auto mb-1 md:h-7 md:mb-2" src={`${process.env.REACT_APP_API_IMG_URL + category.image}`} alt="" />
                  <a>{category.label}</a>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <br />

        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 mb-6 sm:grid-cols-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                Browse
                <a className="text-green-400"> our Products</a>
              </h1>
            </div>

            <div className=" md:justify-self-end">
              <Button variant="outline" color="green.500" size="sm" p="3" borderRadius="full" onClick={() => model.globalHooks.navigate("/products")}>
                Browse all products
              </Button>
            </div>
          </div>

          {model.products.data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-5 h-auto">
              {model.products.data.slice(0, 6).map((product) => (
                <ProductCard product={product} key={product.product_id} />
              ))}
            </div>
          ) : (
            <ProductNotFound />
          )}
        </div>

        <br />

        <div className="text-center mx-7 my-8 py-8 lg:my-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Online Grocery Web App</h1>
          <p className="mt-8 text-gray-600 text-md md:text-xl">Stay home and get your daily needs delivered to your doorstep</p>
          <div className="mt-8 mx-5 flex flex-col items-center justify-center gap-2 md:flex-row">
            {model.userToken ? (
              <>
                <Button
                  bg="green.400"
                  color="white"
                  variant="solid"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => model.globalHooks.navigate("/products")}
                >
                  Start shopping
                </Button>
              </>
            ) : (
              <>
                <Button
                  bg="green.400"
                  color="white"
                  variant="solid"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => model.globalHooks.navigate("/register")}
                >
                  Register
                </Button>
                <Button
                  colorScheme="gray"
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto mt-2 sm:mt-0"
                  onClick={() => model.globalHooks.navigate("/login")}
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>

        <br />

        <hr className="border-1 border-gray-300" />
        {Footer()}
      </div>
    </div>
  );
};

export default LandingPage;
