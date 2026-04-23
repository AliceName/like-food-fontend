import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

//  CÁC LAYOUT
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// USER
import HomePage from './pages/user/HomePage'
import ProductDetail from './pages/user/ProductDetail'
import Cart from './pages/user/Cart';
import UpdatePassword from './pages/UpdatePassword';
import Profile from './pages/user/UserProfile'
import Checkout from './pages/user/Checkout'
import UserOrder from './pages/user/UserOrders'
import Search from './pages/user/Search';
import Contact from './pages/user/Contact';
import Product from './pages/user/Products';

// ADMIN
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageOrder from './pages/admin/AdminOrders'
import AddProduct from './pages/admin/AdminAddProduct'
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nhóm các page khách hàng */}
        <Route path='/' element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/userOrder" element={<UserOrder />} />
          <Route path="search" element={<Search />} />
          <Route path="contact" element={<Contact />} />
          <Route path="products" element={<Product />} />
        </Route>

        {/* Nhóm các page admin */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/manageOrder" element={<ManageOrder />} />
          <Route path="/admin/addProduct" element={<AddProduct />} />
          <Route path="/admin/editProduct/:id" element={<AdminEditProduct />} />
          <Route path="/admin/manageUsers" element={<AdminUsers />} />
        </Route>
        {/* Trang login */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
