import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

//JSON is used to exchange data to/from a web server
//when receiving data from web server, data is always is string

//JSON.parse() converts string into javascript object
//check, wheather items present in local storage or not, if present, we are parsing else
//state is set to empty
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Paypal' };

const cartSlice = createSlice({
  //cart is state name
  //initialState is variable name
  //reducer holds 2 parameters action and state
  name: "cart",
  initialState,
  reducers: {

    //any function created inside reducers is nothing but it is action
    //addToCart() is action, it is used to add number of item's quantity from cart state
    addToCart :  (state, action) => {
        
        // response received from API is stored in payload(action)
        //storing in 'item' variable
        const item = action.payload
       
        //when request sent to API, API checks with product_id
        // if that item present in server, then
        //API returns that particular item and we storing in 'existItem' variable
        const existItem = state.cartItems.find((x) => x._id === item._id)

        //after storing in existItem, we have display that particular item in browser
        if(existItem){
            state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? 
            item : x ) 
        } else{
            //if any new item present, then we add new item to existing state, 
            //using spreadoperator
            state.cartItems = [...state.cartItems ,item]
        }
      //to store locally in client side we returning state in updateCart(), becoz in updateCart()
      // we have written localstorage()
        return updateCart(state)
    },

    //any function created inside reducers is nothing but it is action
    //removeFromCart() is action, it is used to remove number of item's quantity from cart state
    
    removeFromCart: (state, action) => {

      //to delete item from cart
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)

      //to store locally in client side we returning state in updateCart(), becoz in updateCart()
      // we have written localstorage()
      return updateCart(state)
    },

    //any function created inside reducers is nothing but it is action
    //saveShippingAddress() is action, it is used to save shipping address in cart state
    saveShippingAddress: (state, action) => {
      state.shippingAddress  = action.payload
      return updateCart(state)
    },

    //any function created inside reducers is nothing but it is action
   //savePaymentMethod() is action, it is used to save shipping address in cart state
    savePaymentMethod : (state, action) => {
      state.paymentMethod = action.payload
      return updateCart(state)
    },

     //any function created inside reducers is nothing but it is action
     //clearclearCartItems is action, it is used to clear cartItem, once user is placed the order
     clearCartItems: (state, action) => {
        state.cartItems = []
        return updateCart(state)
     }
  },
});

//any function created inside reducers is nothing but it is action
//we need to export action and import in ProductScreen.js file
//import savePaymentMethod and saveShippingAddress in shippingScreen,js
export const {addToCart, removeFromCart, saveShippingAddress,
savePaymentMethod, clearCartItems} = cartSlice.actions;

// use to import cartSlice.reducer in store.js file
export default cartSlice.reducer;