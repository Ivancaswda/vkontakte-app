import React, {useEffect, useState} from 'react'
import {useAuthStore} from "../store/useAuthStore.js";
import {ExternalLink, Eye, Loader, MessageCircle, MessageSquare, ThumbsUp, Trash2, User, UserPlus} from "lucide-react";
import {Link, NavLink} from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import {formatDistanceToNow} from "date-fns";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const NotificationPage = () => {

    const {authUser, markAsReadNotification, deleteNotification, } = useAuthStore()

    const [notifications, setNotifications] = useState([])
    const [isNotifying, setIsNotifying] = useState(false)
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
    useEffect(() => {
        getNotifications()


    }, [])

    const handleMarkNotification = async (id) => {
        try {
            setIsNotifying(true)
            const response = await axiosInstance.put(`/notification/${id}/read`)

            if (response.data.success) {
                toast.success(response.data.message)
                getNotifications()
            }


        } catch (error) {

            toast.error(error.message)
        } finally {
            setIsNotifying(false)
        }
    }

    const handleDeleteNotification = async (id) => {
        try {
            setIsNotifying(true)
            const response = await axiosInstance.delete(`/notification/${id}`)

            if (response.data.success) {
                toast.success(response.data.message)
                getNotifications()
            }
        } catch (error) {

            toast.error(error.message)
        } finally {
            setIsNotifying(false)
        }
    }


    const renderNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return null
            case 'comment':
                return null
            case 'connectionAccepted':
                return null
            default:
                return  null
        }
    }

    const renderNotificationContent = (notification) => {
        switch (notification.type) {
            case 'like':
                return (
                    <span className='flex items-center gap-1'><strong
                        className='mr-2'>{notification.relatedUser.fullName} </strong> <ThumbsUp
                        className='text-blue-500 size-6'/> <p>понравился ваш пост</p></span>
                )
            case 'comment':
                return (
                    <span className='flex items-center gap-1'>
                        <Link to={`/profile/${notification.relatedUser.userName}`} className='font-bold mr-2'>
                            {notification.relatedUser.fullName}
                        </Link>
                        <MessageSquare className='text-blue-500 size-6 ml-20'/>
                        <p>
                       комментировал ваш пост</p>
                    </span>

                )
            case 'connectionAccepted':
                return <span className='flex items-center gap-1'>
                    <Link to={`/profile/${notification.relatedUser.userName}`} className='font-bold mr-2'>
                        {notification.relatedUser.fullName}

                    </Link>
                    <UserPlus className='text-blue-500 size-6 ml-20'/>
                    <p>
                    принял вашу заявку на дружбу</p>
                </span>
            case 'message':
                return <span className='flex items-center gap-1'>
                    <Link to={`/chat`} className='font-bold mr-2'>
                        {notification.relatedUser.fullName}

                    </Link>
                    <MessageCircle className='text-blue-500 size-6 ml-20'/>
                    <p>Написал вам сообщение</p>
                </span>
            default:
                return null
        }
    }

    const renderRelatedPost = (relatedPost) => {
        if (!relatedPost) {
            return null;
        }

        return (
            <Link to={`/post/${relatedPost._id}`}
                  className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'>
                {relatedPost.image && (
                    <img src={relatedPost.image} className='w-10 h-10 object-cover rounded' alt=""/>
                )}
                <div className='flex-1 overflow-hidden'>
                     <p className='text-sm text-gray-600 truncate'>{relatedPost.content.slice(0, 10)}</p>
                </div>
                <ExternalLink size={14} className='text-gray-400'/>
            </Link>
        )

    }

    return (
        <div className='flex flex-col gap-6'>

            <div className='col-span-1 lg:col-span-3'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold mb-6'>Уведомления</h1>

                    {isNotifying ? (<div className='w-full flex items-center justify-center'>
                        <Loader className='text-blue-500 animate-spin'/>
                    </div>) : notifications && notifications.length > 0 ? (
                        <ul>
                            {notifications.map((notification) => (
                                <li className={`bg-white rounded-lg p-4 transition-all hover:shadow-md ${!notification.read ? 'border-blue-500' : 'border-gray-200'}`}>
                                    <p className='text-xs text-gray-500 mt-1 mb-1'>
                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                            addSuffix: true
                                        })}
                                    </p>
                                    <div className='flex items-center justify-between'>


                                        <div className='flex items-center gap-4'>
                                            <div className='flex items-center space-x-4'>
                                                <NavLink to={`/profile/${notification.relatedUser.userName}`}>

                                                    {!notification.relatedUser.profilePic ? (<div
                                                        className='bg-blue-600  w-[40px] justify-center h-[40px] rounded-full   flex items-center'>
                                                        <User size={24} className='rounded-full text-white '/>
                                                    </div>) : <img src={notification.relatedUser.profilePic}
                                                                   className='size-12 rounded-full object-cover'
                                                                   alt=""/>}
                                                </NavLink>
                                            </div>
                                            <div className='flex items-center gap-1'>

                                                <p className='text-sm'>{renderNotificationContent(notification)}</p>
                                            </div>
                                        </div>


                                        {renderRelatedPost(notification.relatedPost)}

                                        <div className={'flex gap-2'}>
                                            {!notification.read && (
                                                <button aria-label='Отметить как прочитанное'
                                                        className='bg-blue-100 px-1 text-red-600 rounded hover:bg-red-200 transition-all hover:shadow-md'
                                                        onClick={() => handleMarkNotification(notification._id)}>
                                                    <Eye className='text-blue-500' size={16}/>
                                                </button>
                                            )}
                                            <button aria-label='удалить уведомление'
                                                    className='p-1 bg-blue-100 text-red-600 rounded hover:bg-red-200 transition-colors'
                                                    onClick={() => handleDeleteNotification(notification._id)}>
                                                <Trash2 className='text-blue-500' size={16}/>
                                            </button>
                                        </div>

                                    </div>


                                </li>
                            ))}
                        </ul>
                    ) : (<p>Уведомлений не обнаружено</p>)}
                </div>
            </div>
        </div>
    )
}
export default NotificationPage
