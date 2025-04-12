import React, {useEffect, useState} from 'react'
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";
import {User} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore.js";

const FriendRequest = ({connectionRequest, onRequestHandled}) => {
    const [userStatus, setUserStatus] = useState('')
    const {authUser} = useAuthStore()

    const fetchStatus = async () => {

        const response = await axiosInstance.get(`/connection/status/${authUser.user._id}`)
        console.log(response.data.status)


        setUserStatus(response.data.status);  // Устанавливаем статус ТОЛЬКО для этого пользователя
    };

    useEffect(() => {

        fetchStatus();
    }, [authUser.user._id]);
    const acceptConnection = async (requestId) => {
        const response = await axiosInstance.put(`/connection/accept/${requestId}`)

        if (response.data.success) {
            toast.success('Вы приняли заявку в друзья')
            await fetchStatus();
            onRequestHandled(requestId)
            setUserStatus('accepted')
        } else {
            console.log(response.data.message)
            toast.error(response.data.message)
        }
    }
    const declineConnection = async (requestId) => {
        const {data} = await axiosInstance.put(`/connection/reject/${requestId}`)

        if (data.success) {
            toast.success('Вы отклонили заявку в друзья')
            await fetchStatus();
            onRequestHandled(requestId) // dinamically updating the data after accepting or rejecting
            setUserStatus('rejected')
        } else {
            toast.error(data.message)
        }
    }

    return (
        <div className='bg-white rounded-lg w-full shadow p-4 flex gap-6 items-center justify-between transition-all hover:shadow-md'>
            <div className='flex items-center gap-4'>

                {!connectionRequest.sender.profilePic ? (<Link to={`/profile/${connectionRequest.sender.userName}`} className='bg-blue-600  min-w-[50px]  w-[50px] justify-center h-[50px] rounded-full   flex items-center'>
                    <User size={30} className='rounded-full text-white '/>
                </Link>) :<Link to={`/profile/${connectionRequest.sender.userName}`}>
                    <img className='w-16 h-16 rounded-full object-cover' src={connectionRequest.sender.profilePic} alt=""/>
                </Link>}

                <div>
                    <Link className='font-semibold text-lg' to={`/profile/${connectionRequest.sender.userName}`}>
                        {connectionRequest.sender.fullName}
                    </Link>
                    <p className={'text-gray-600'}>{connectionRequest.sender.headline}</p>
                </div>
            </div>
            {userStatus === 'accepted' ? <div className='px-3 text-white rounded-lg py-1  bg-green-500'><p>В друзьях</p></div> :
            <div className='flex items-center gap-2 justify-center'>
                <button onClick={() => acceptConnection(connectionRequest._id)} className='bg-blue-500 text-white px-4 py-2
                rounded-md text-sm font-semibold hover:bg-primary-dark transition-all'>
                    Подтвердить
                </button>

                <button onClick={() => declineConnection(connectionRequest._id)} className='text-sm font-semibold bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all'>
                    Отклонить
                </button>
            </div>
            }

        </div>
    )
}
export default FriendRequest
