import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter,
        createRoutesFromElements,
        Route,
        RouterProvider} from 'react-router-dom';
import {Provider} from 'react-redux';
import { HelmetProvider} from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css'
import './assets/styles/index.css';
import App from './App';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import store from './store';
import PrivateRoute from './components/PrivateRoute';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentMethod from './screens/PaymentMethod';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminRoute from './components/AdminRoute';
import OrderListScreen from './screens/Admin/OrderListScreen';
import ProductListScreen from './screens/Admin/ProductListScreen';
import ProductEditScreen from './screens/Admin/ProductEditScreen';
import UserListScreen from './screens/Admin/UserListScreen';
import UserEditScreen from './screens/Admin/UserEditScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path ='/' element={<App />}>

        {/* public routes */}
        <Route index={true} path='/' element={<HomeScreen />}/>
        <Route path='/search/:keyword' element={<HomeScreen/>} />
        <Route path='/page/:pageNumber' element={<HomeScreen/>} />
        <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen/>} />
        <Route path = '/product/:id' element={<ProductScreen/>} />
        <Route path ='/cart' element={<CartScreen/>} />
        <Route path='/login' element={<LoginScreen/>} />
        <Route path='/register' element={<RegisterScreen/>} />

            {/* AdminRoutes */}
        <Route path='' element={<AdminRoute />}>
          <Route path='/admin/orderlist' element={<OrderListScreen/>}/>
          <Route path='/admin/productlist' element={<ProductListScreen />} />
          <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
          <Route path='/admin/product/:id/edit' element = {<ProductEditScreen/>} />
          <Route path='/admin/userlist' element={<UserListScreen />} />
          <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
        </Route>
        
          {/* PrivateRoutes - other users */}
        <Route path='' element={<PrivateRoute />} >
        <Route path='/shipping' element={<ShippingScreen/>} />
        <Route path='/payment' element={<PaymentMethod />} />
        <Route path = '/placeorder' element = {<PlaceOrderScreen />} />
        <Route path='/order/:id' element = {<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen/>}/>
        </Route>

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
        <Provider store = {store}>
          <PayPalScriptProvider deferLoading={true}>
            <RouterProvider router = {router} />
          </PayPalScriptProvider>
        </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

