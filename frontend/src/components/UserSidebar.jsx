import React, {useEffect, useState} from 'react'
import {useAuthStore} from "../store/useAuthStore.js";
import {Search, User, Users} from "lucide-react";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const UserSidebar = () => {

    const {usersForSidebar, getUsersForSidebar, isSidebarLoading, onlineUsers, setSelectedUser, selectedUser} = useAuthStore()
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)
    const [inputValue, setInputValue] = useState('')
    useEffect(() => {
        getUsersForSidebar()
        console.log(usersForSidebar)
    }, [])
    console.log(onlineUsers)
    const filteredUsers = usersForSidebar.filter((user) => {
        return !showOnlineOnly || onlineUsers.includes(user._id)
    }).filter((user) => {
        return user.fullName.toLowerCase().includes(inputValue.toLowerCase())
    })

    console.log(usersForSidebar)

    const [notifications, setNotifications] = useState([])
    const getNotifications = async () => {
        try {

            const response = await axiosInstance.get('/notification')

            setNotifications(response.data.notifications)
            console.log(response.data)
        } catch (error) {

            toast.error(error.message)
        }
    }

    useEffect(() => {
        getNotifications()

    }, [])

    const messageNotifications = notifications.filter((notif) => { // checking on type of message
        return notif.type !== 'message'
    })
    console.log(notifications)
    console.log(messageNotifications)
        // проверяем по типу к какому  юзеру нам надо задисплэить уведомления

    const getUserMessageCount = (userId) => {
        return messageNotifications.filter((notif) => {
            return notif.relatedUser._id === userId
        }).length
    }

    // когда переходим в чат с пользователем с непрочитанным сообщением оно становится прочитанным!

    const markMessageAsRead = async () => {
        if (!selectedUser) return;

        try {
            const userNotifications = notifications.filter((notif) => notif.relatedUser._id === selectedUser._id && !notif.read);
            for (const notification of userNotifications) {
                await axiosInstance.put(`/notification/${notification._id}/read`);
            }

           await getNotifications();
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (selectedUser) {
            markMessageAsRead(selectedUser._id)
        }
    }, [selectedUser])

    return (
        <div
            className={`  h-screen w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] border-r border-base-300  flex flex-col  `}>
            {/* <Navbar profileData={profileData} setProfileData={setProfileData} openBurger={openBurger}
                    setOpenBurger={setOpenBurger} inputValue={inputValue} setInputValue={setInputValue}/>         <StatusContainer/> */}

            <aside
                className={`   h-full w-full  border-r overflow-y-auto border-base-300 flex-col transition-all duration-200`}>
                <div className='border-b border-base-300 w-full p-5'>
                    <div className='flex items-center gap-2'>

                        <Users size={16}/>
                        <span className='font-medium block'>Чаты</span>

                    </div>
                    <div className='flex relative items-center w-full mt-4 mb-4'>
                        <input placeholder='Напишите имя своего друга которого вы ищите' type="text" className='pl-11 pr-4 py-2 group bg-white rounded-md border border-blue-200 w-full transition-all focus:border-blue-500 outline-none' value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                        />
                        <Search className='size-6  text-blue-700 left-3 absolute '/>

                    </div>

                    {/* Online users filtered by toggle */}
                    <div className='mt-3  flex items-center gap-2'>
                        <label className='cursor-pointer flex items-center gap-2'> {/* TOGGLE OF ONLINE OFF OR ON */}
                            <input type="checkbox" className='checkbox checkbox-sm text-blue-600 border border-blue-600' checked={showOnlineOnly}
                                   onChange={(event) => setShowOnlineOnly(event.target.checked)}
                            />
                            <span className='text-sm'>Пользователи  в сети</span>
                        </label> {/* don`t count myself*/}
                        <span className='text-xs text-blue-500'>({onlineUsers.length - 1} В сети)</span>
                    </div>
                </div>
                <div className='overflow-y-auto w-full py-3 '>

                    {filteredUsers?.length > 0 ? (filteredUsers.map((user, index) => (
                        <button key={index} onClick={() => setSelectedUser(user)}
                                className={`w-full p-3  flex  items-center justify-between rounded-xl hover:bg-blue-50 transition-colors ${selectedUser?._id === user._id ? 'bg-blue-100 ring-1 ring-base-300' : ''} `}>
                        <div className='flex items-center gap-3'>


                            <div className='relative  sm:mx-0 rounded-full'>
                                {user.profilePic ? (
                                    <div><img src={user?.profilePic}
                                              className='w-[46px] h-[45px] rounded-full object-cover' alt=""/></div>
                                ) : <div
                                    className='bg-blue-600  w-[45px] h-[45px]  justify-center rounded-full   flex items-center'>
                                    <User  className='rounded-full text-white '/>
                                </div>}
                                {onlineUsers.includes(user._id) && (
                                    <span
                                        className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900'>

                                </span>
                                )}
                            </div>

                            {/* User info - only visible on larger screens */}
                            <div className=' w-80  text-left min-w-0'>
                                <div
                                    className='font-medium truncate flex items-center gap-2'>{user.fullName}{user?.isPremium &&
                                    <img src="https://web.telegram.org/a/PremiumLogo.a5c0e88cd478f4d76d82.svg"
                                         className='w-4' alt=""/>}</div>
                                <div className='text-sm text-zinc-400'>
                                    {onlineUsers.includes(user._id) ? 'В сети' : 'Оффлайн'}
                                </div>
                            </div>
                        </div>
                            {getUserMessageCount(user._id) > 0 &&
                                <div className=' mr-20 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                                    {getUserMessageCount(user._id)}
                                </div>
                           }

                        </button>
                    ))) : (<div>Пользователи не найдены</div>)}
                </div>
            </aside>
        </div>
    )
}
export default UserSidebar
