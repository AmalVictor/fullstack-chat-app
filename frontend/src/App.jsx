import React, { useEffect } from 'react'
import Navbar from './components/navbar'
import { Routes, Route, Navigate} from "react-router-dom"
import Homepage from "./pages/homepage"
import Signuppage from "./pages/signuppage"
import Loginpage from "./pages/loginpage"
import Settingspage from "./pages/settingspage"
import Profilepage from "./pages/profilepage"
import { axiosInstance } from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore'


const App = () => {
  const {authUser,checkAuth,isCheckingAuth, onlineUsers} = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  console.log({ authUser })

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div data-theme={theme}>
      

      <Navbar />

      <Routes>
          <Route path="/" element={authUser ? <Homepage/> : <Navigate to="/login"/>}/>
          <Route path="/signup" element={!authUser ? <Signuppage/> : <Navigate to="/"/>}/>
          <Route path="/login" element={!authUser ? <Loginpage/> : <Navigate to="/"/>}/>
          <Route path="/settings" element={<Settingspage/>}/>
          <Route path="/profile" element={authUser ? <Profilepage/> : <Navigate to="/login"/>}/>

      </Routes>

      <Toaster/>
    </div>
  )
}

export default App