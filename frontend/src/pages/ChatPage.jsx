import React, {useEffect, useState} from 'react'
import UserSidebar from "../components/UserSidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const ChatPage = () => {

    const {selectedUser} = useAuthStore()

    return (
        <div className='min-h-screen  '>

            {!selectedUser ? <UserSidebar/> : <ChatContainer/>}
        </div>
    )
}
export default ChatPage

