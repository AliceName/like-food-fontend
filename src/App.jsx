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

// ADMIN
import AdminDashboard from './pages/admin/AdminDashboard'

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
        </Route>

        {/* Nhóm các page admin */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
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
