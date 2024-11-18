import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js";
import Cart, { generateCartItemsFrom } from "./Cart.js";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  // to store the data of product
  const [productsData, setProductData] = useState([]);

  const [productsFilterData, setProductFilterData] = useState([]);

  // to get store all the info about the products in cart
  const [items, setItems] = useState([]);

  // making state for loading animation and setting initial value as false
  const [loading, setLoading] = useState(false);

  // making state for searching the data
  const [searchData, setSearchData] = useState("");

  // making state for search text is matching with products
  const [isProductAvaliable, setIsProductAvaliable] = useState(true);

  // making state for timeout-id for debouncing
  const [timeOutId, setTimeOutId] = useState("");

  const token = localStorage.getItem("token");

  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setLoading(true);
    try {
      const getProductData = await axios.get(`${config.endpoint}/products`);
      if (getProductData.status === 200) {
        setProductData(getProductData.data);
        setProductFilterData(getProductData.data);
        return getProductData.data;
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await performAPICall();
      const cartData = await fetchCart(token);
      const cartDetails = await generateCartItemsFrom(cartData, productsData);

      setItems(cartDetails);
    };
    onLoadHandler();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      let filterProducts = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      if (filterProducts.status === 200) {
        setIsProductAvaliable(true);
        setProductFilterData(filterProducts.data);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setIsProductAvaliable(false);
      } else {
        setProductFilterData(productsData);
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(timeOutId);
    setSearchData(event);
    const updatedTimeOutId = setTimeout(
      () => performSearch(event),
      debounceTimeout
    );

    setTimeOutId(updatedTimeOutId);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const res = await axios(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setCartProduct(res.data);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const updateCartItems = (cartData, productsData) => {
    const cartItems = generateCartItemsFrom(cartData, productsData);
    setItems(cartItems);
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    if (items) {
      return items.findIndex((item) => item.productId === productId);
    }
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  // when user click the Add to cart button this function will execute
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    // if user is not login
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    // if user is adding item which is already present in cart
    if (options.preventDuplicate && isItemInCart(items, productId) !== -1) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }
    try {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateCartItems(res.data, productsData);
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Could not update the cart. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  return (
    <div>
      <Header hasHiddenAuthButton="false">
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          // fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          value={searchData}
          onChange={(e) => {
            debounceSearch(e.target.value, 500);
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        value={searchData}
        onChange={(e) => {
          debounceSearch(e.target.value, 500);
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid
          item
          className="product-heroImg"
          xs={12}
          md={token && productsData.length ? 9 : 12}
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">PAL FASHION</span>{" "}
              Exclusive Styles for Kids
            </p>
          </Box>
          {loading ? (
            <div className="loadingReg">
              <CircularProgress color="success" />
              <p>Loading Products...</p>
            </div>
          ) : isProductAvaliable ? (
            <Grid container spacing={2} className="product-grid">
              {productsFilterData.map((product) => (
                // console.log(product)
                <Grid item key={product._id} xs={6} md={3}>
                  <ProductCard
                    product={product}
                    handleAddToCart={async () => {
                      await addToCart(
                        token,
                        items,
                        productsData,
                        product._id,
                        1,
                        { preventDuplicate: true }
                      );
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <div className="loading">
              <SentimentDissatisfied />
              <p>No products found</p>
            </div>
          )}
        </Grid>

        <Grid item className="product-cart" xs={12} md={3}>
          {token && (
            <Cart
              products={productsData}
              items={items}
              handleQuantity={addToCart}
            />
          )}
        </Grid>
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
