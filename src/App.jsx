import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/user/HomePage'
import Login from './pages/Login'
import UserLayout from './layouts/UserLayout'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nhóm các page khách hàng */}
        <Route path='/' element={<UserLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Trang login */}
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
