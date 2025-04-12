import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import {Bell, Home, MessageCircle, MessageSquare, ShoppingBag, User, User2Icon, UserPlus} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore.js";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";



const Sidebar = () => {

    const { authUser, getConnectionRequests, connectionRequests, notification,subscribeToRealTime, unsubscribeOfRealTime} = useAuthStore()

    const [notifications, setNotifications] = useState(notification || [])
    const [isNotifying, setIsNotifying] = useState(false)
    const [connections, setConnections] = useState([])
    const [connectioning, setConnectioning] = useState(false)
    const getNotifications = async () => {
        try {
            setIsNotifying(true)
            const response = await axiosInstance.get('/notification')

            setNotifications(response.data.notifications)
            console.log(response.data)
        } catch (error) {

            toast.error(error.message)
        } finally {
            setIsNotifying(false)
        }
    }
    const getConnections =  async () => {
        try {
            setConnectioning(true)
            const response = await axiosInstance.get('/connection/requests')

            setConnections(response.data.requests)

        } catch (error) {
            toast.error(error.message)

        } finally {
            setConnectioning(false)
        }
    }

    const socket = useAuthStore.getState().socket
    useEffect(() => {


            getNotifications()
            getConnections()
            getConnectionRequests()
            console.log(notifications)
            console.log(connections)

        const interval = setInterval(() => { // checking value each 2 second
            getNotifications()
            getConnections()
            getConnectionRequests()
        }, 2000)

        return () => clearInterval(interval)


    }, [])

    console.log(socket)
    console.log(connectionRequests)
    console.log(notifications)
    console.log(connections)
    const unreadNotificationCount = notifications?.filter(notif => !notif.read).length;
    console.log(unreadNotificationCount)
    const    unreadConnectionsCount = connections?.length
    console.log(unreadConnectionsCount)
    return (
        <div className='bg-white rounded-lg shadow '>
            {/* <div className='p-4 text-center'>
                <div
                    className='h-16 rounded-t-lg bg-cover bg-center'
                    style={{
                        backgroundImage: `url("${user.bannerImg || ""}")`,
                    }}
                />
                <Link to={`/profile/${user.username}`}>
                    <img
                        src={user.profilePicture || "https://avatars.mds.yandex.net/i?id=5a3ffdd177450896ae0bdf659cf1c9e4_l-7745047-images-thumbs&n=13"}
                        alt={user.name}
                        className='w-20 h-20 rounded-full mx-auto mt-[-40px]'
                    />
                    <h2 className='text-xl font-semibold mt-2'>{user.name}</h2>
                </Link>
                <p className='text-info'>{user.headline}</p>
                <p className='text-info text-xs'>{user?.connections?.length} connections</p>
            </div> */}
            <div className='border-t border-base-100  '>
                <nav>
                    <ul className='space-y-2 w-[60px] sm:w-full'>
                        <li>
                            <Link
                                to='/'
                                className='flex items-center py-2 px-4 text-sm font-semibold rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                            >
                                <Home className='mr-2 text-sm' size={16}/> <p className='sm:block hidden'>Главная страница</p>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/friends'
                                className='flex items-center text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                            >
                                <UserPlus className='mr-2 text-sm font-semibold' size={16}/><p className='sm:block hidden'>Мои друзья</p>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/chat'
                                className='flex items-center text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                            >
                                <MessageCircle className='mr-2 text-sm font-semibold' size={16}/><p
                                className='sm:block hidden'> Чаты</p>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/notifications'
                                className='flex  items-center text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                            >
                                <Bell className='mr-2 text-sm font-semibold' size={16}/>
                                <span className='text-xs hidden sm:block'><p className='sm:block hidden'>Уведомления</p></span>
                                {unreadNotificationCount > 0 && (
                                    <span className='
                                     bg-blue-500 ml-2 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center'>
                                        {unreadNotificationCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/profile/${authUser?.user?.userName}`}
                                className='flex items-center text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                            >
                                <User2Icon className='mr-2 text-sm font-semibold' size={16}/> <p
                                className='sm:block hidden'>Ваш профиль</p>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/network'
                                className='flex items-center text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition-colors'
                            >
                                <Bell className='mr-2 text-sm font-semibold ' size={16}/> <p
                                className='sm:block hidden'>Запросы в друзья</p>
                                {unreadConnectionsCount > 0 && (
                                    <span className='
                                     bg-blue-500 ml-2 text-white text-xs rounded-full  w-[24px] h-[18px]  flex items-center justify-center'>
                                        {unreadConnectionsCount}
                                    </span>
                                )}
                            </Link>
                        </li>

                        <li className={'flex items-center justify-center py-1 hidden md:block'}>
                            <a href='https://quanto-market-main.vercel.app/'>
                                <button
                                    className="relative  text-white font-semibold  px-4 py-[4px]  rounded-3xl bg-green-500 border-[3px] border-transparent overflow-hidden">
                                    <span className="z-10 relative text-sm text-center  flex items-center"> Кванто-маркет</span>

                                    <div
                                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 animate-border"></div>

                                    <div className="absolute inset-0 flex items-center justify-center dots"></div>
                                </button>
                            </a>
                        </li>
                    </ul>

                </nav>
            </div>

        </div>
    )
}
export default Sidebar
