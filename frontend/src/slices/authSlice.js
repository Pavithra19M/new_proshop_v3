import { createSlice } from "@reduxjs/toolkit";

//JSON is used to exchange data to/from a web server
//when receiving data from web server, data is always is string

//JSON.parse() converts string into javascript object
//check, wheather userInfo present in local storage or not, if present, we are parsing else
//state is set to empty
const initialState = {
   userInfo: localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')) : null
}

const authSlice = createSlice({
  //auth is state name
  //initialState is variable name
  //reducer holds 2 parameters action and state
    name : 'auth',
    initialState,
    reducers: {

        //login action
        setCredentials: (state, action) => {
            // response received from API is stored in payload(action)
            //storing in 'userInfo' state
            state.userInfo = action.payload;
            //saving in localSorage
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        
          //logout() is action, it is used to logout user from client
        logout: (state, action) => {
            // setting state to null
            state.userInfo = null;
            //removing from local storage, wen user loggedout
            localStorage.removeItem('userInfo')
        }
    }
})
//any function created inside reducers is nothing but it is action
//we need to export setCredentials action and import in LoginScreen.js file
//we need to export logout action and import in Header.js file
export const {setCredentials , logout } = authSlice.actions;

// use to import authSlice.reducer in store.js file
export default authSlice.reducer;