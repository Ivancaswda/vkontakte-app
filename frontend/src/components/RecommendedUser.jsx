import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import {Check, Clock, User, UserCheck, UserPlus, X} from "lucide-react";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const RecommendedUser = ({ user }) => {
    const { isLoading, sendConnectionRequest, getConnectionStatus, acceptConnectionRequest, rejectConnectionRequest } = useAuthStore();
    const [userStatus, setUserStatus] = useState("not_connected"); // Локальный статус
    const [statusData, setStatusData] = useState(null)

    const fetchStatus = async () => {

        const response = await axiosInstance.get(`/connection/status/${user._id}`)
        console.log(response.data.status)

        setStatusData(response.data)
        setUserStatus(response.data.status);  // Устанавливаем статус ТОЛЬКО для этого пользователя
    };

    useEffect(() => {

        fetchStatus();
    }, [user._id]);

    const handleConnect = async () => {
        if (userStatus === "not_connected") {
            await sendConnectionRequest(user._id);
            setUserStatus("pending")
        }
    };
    const acceptConnection = async (requestId) => {
        const response = await axiosInstance.put(`/connection/accept/${requestId}`)

        if (response.data.success) {
            toast.success('Вы приняли заявку в друзья')
            await fetchStatus()
            setUserStatus("connected");


        } else {
            console.log(response.data.message)
            toast.error(response.data.message)
        }
    }
    const declineStatus = async (requestId) => {
        const {data} = await axiosInstance.put(`/connection/reject/${requestId}`)

        if (data.success) {
            toast.success('Вы отклонили заявку в друзья')
            await fetchStatus()
            setUserStatus("rejected")
        } else {
            toast.error(data.message)
        }
    }
    const renderBtn = () => {
        if (isLoading) {
            return (
                <button className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500" disabled={true}>
                    Загрузка...
                </button>
        );
        }

        switch (userStatus) {
            case "pending":
                return (
                    <button className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center" disabled>
                        <Clock size={16} className="mr-1" />
                        <p className='hidden sm:block'>Ожидается</p>
                    </button>
                );
            case "received":
                return (
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => acceptConnection(statusData.requestId)}
                            className="rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
                        >
                            <Check size={16} />
                        </button>
                        <button
                            onClick={() => declineStatus(statusData?.requestId)}
                            className="rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                );
            case "connected":
                return (
                    <button className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center" disabled>
                        <UserCheck size={16} className="mr-1" />
                        <p className='hidden sm:block'>В друзьях</p>
                    </button>
                );
            default:
                return (
                    <button
                        className="px-3 py-1 rounded-full text-sm border border-blue-500 text-blue-500 hover:bg-primary hover:text-white transition-colors duration-200 flex items-center"
                        onClick={handleConnect}
                    >
                        <UserPlus size={16} className="mr-1" />
                        <p className='hidden sm:block'>Предложить дружбу</p>
                    </button>
                );
        }
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <Link to={`/profile/${user.userName}`} className="flex gap-4 items-center flex-grow">
                {!user.profilePic ? (<div className='bg-blue-600  w-[47px] justify-center h-[45px] rounded-full   flex items-center'>
                    <User size={30} className='rounded-full text-white '/>
                </div>) : <img src={user.profilePic} className='size-12 rounded-full object-cover' alt=""/>}
                <div>
                    <h3 className="font-semibold text-sm">{user.fullName}</h3>
                    <p className="text-xs text-info">{user.headline}</p>
                </div>
            </Link>
            {renderBtn()}
        </div>
    );
};

export default RecommendedUser;
