import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/user/HomePage'
import Login from './pages/Login'
import UserLayout from './layouts/UserLayout'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ProductDetail from './pages/user/ProductDetail'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nhóm các page khách hàng */}
        <Route path='/' element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>

        {/* Trang login */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
