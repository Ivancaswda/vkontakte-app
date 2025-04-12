import React, {useEffect, useState} from 'react'
import MainPage from "./components/MainPage.jsx";
import Navbar from "./components/Navbar.jsx";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import toast, {Toaster} from "react-hot-toast";
import axiosInstance from "./lib/axios.js";
import {useAuthStore} from "./store/useAuthStore.js";
import RecommendedUsers from "./pages/RecommendedUsers.jsx";
import Sidebar from "./components/Sidebar.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ShareModal from "./modal/ShareModal.jsx";
import ShareComponent from "./components/ShareComponent.jsx";

const App = () => {
    const {authUser, getUserAuth} = useAuthStore()
    const location = useLocation()
    useEffect(() => {
        getUserAuth()
        console.log(authUser)
    }, [getUserAuth])
    const {showShareModal, setShowShareModal} = useAuthStore()
    return (
        <div className='flex items-start justify-center min-h-screen  '>

            {showShareModal && <ShareModal  >
                <ShareComponent/>
            </ShareModal>}

            <div className={` ${location.pathname !== '/login' && location.pathname !== '/signup'  ? "lg:max-w-[78%] w-[100%]" : 'w-full'} `}>


                <Navbar/>
                <main className={` ${location.pathname !== '/login' && location.pathname !== '/signup' && 'flex items-start  gap-2 sm:gap-12'} `}>


                    { location.pathname !== '/login' && location.pathname !== '/signup'   && <div className='block col-span-2 lg:col-span-2  '>
                        <Sidebar/>
                    </div>}
                    <div className='w-[100%] min-h-screen '>
                        <Routes>
                            <Route path='/' element={authUser ? <MainPage/> : <Navigate to='login'/>}/>
                            <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to='/'/>}/>
                            <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/'/>}/>
                            <Route path='/friends' element={authUser ? <RecommendedUsers/> : <Navigate to='/login'/>}/>
                            <Route path='/chat' element={authUser ? <ChatPage/> : <Navigate to='/login'/>}/>
                            <Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to='/login'/> }/>
                            <Route path='/network' element={authUser ? <NetworkPage/> : <Navigate to='/login'/>}/>
                            <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={'/login'}/>}/>
                            <Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
                        </Routes>
                    </div>
                </main>
                <Toaster/>
            </div>
        </div>
    )
}
export default App
