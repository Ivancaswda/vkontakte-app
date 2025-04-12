import React, {useEffect, useState} from 'react'
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axiosInstance from "../lib/axios.js";
import toast, {ErrorIcon} from "react-hot-toast";
import {useAuthStore} from "../store/useAuthStore.js";
import {ArrowRight, User} from "lucide-react";

const Navbar = () => {
    const location = useLocation()
    const {authUser, getUserAuth,  connections, logout,  getConnectionRequests, getAllUsers, allUsers, } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [isNotifying, setIsNotifying] = useState(false)
    const [usersForNavbar, setUsersForNavbar] = useState([])
    const getNotifications = async () => {
        try {
            setIsNotifying(true)
            const response = await axiosInstance.get('/notification')

            setNotifications(response.data.notifications)

        } catch (error) {

            toast.error(error.message)
        } finally {
            setIsNotifying(false)
        }
    }

    const getUsersForNavbar =  async () => {
        try {
            const response= await axiosInstance.get('/user/suggestions')

            if (response.data.success) {
                setUsersForNavbar(response.data.suggestedUser)

            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    const [showUsers, setShowUsers] = useState(false)


    const socket = useAuthStore.getState().socket
    useEffect(() => {
            getUserAuth()
        getNotifications()
            getUsersForNavbar()
            getConnectionRequests()

        const interval = setInterval(() => {
            getNotifications()
            getConnectionRequests()
        }, 2000)
        return () => clearInterval(interval)



    }, [socket])

    console.log(usersForNavbar)
    const [userInput, setUserInput] = useState('')
    const filteredUsers = usersForNavbar.filter((user) => {
        return user.fullName.toLowerCase().includes(userInput.toLowerCase())
    })

    const unreadNotificationCount = notifications?.filter((notif) => !notif.read).length

    if (location.pathname === '/signup' || location.pathname === '/login') {
        return (
            <div className='w-full flex items-center justify-between  px-10 py-2'>
               <div className='relative'>


                    <input  type="text" className='bg-stone-100 pl-12 pr-4 py-1 rounded-xl' placeholder='Поиск Вконтакте'/>
                    <svg className='absolute left-2 z-20 top-2' width='18' height='18' xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path fill='gray'
                            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>


               </div>

                <button className='font-semibold px-8 rounded-lg text-[13px] py-[3px] bg-stone-50 border border-gray-200 text-gray-700'>
                    Создать бизнес аккаунт
                </button>
            </div>
        )
    }
    if ( location.pathname === '/chat') {
        return
    }


    return (
        <div className='w-full flex items-center justify-between  gap-4    py-4'>
            <div className='flex items-center  gap-4'>

                <div className='pl-4'>
                    <NavLink to='/'>
                        <svg className=' w-[55px] md:w-[240px]' xmlns="http://www.w3.org/2000/svg" fill='currentColor'
                             width='240' height='25'>

                            <path
                                d="M67 12.5c0 3.34-2.43 5.5-5.88 5.5-3.45 0-5.88-2.16-5.88-5.5S57.67 7 61.12 7C64.57 7 67 9.16 67 12.5Zm-9.22 0c0 2.07 1.35 3.5 3.34 3.5s3.34-1.43 3.34-3.5-1.35-3.45-3.34-3.45-3.34 1.38-3.34 3.45Zm-17.03-.21c.95-.44 1.56-1.18 1.56-2.33 0-1.73-1.58-2.96-3.87-2.96h-5.27v11h5.5c2.37 0 4.02-1.29 4.02-3.05 0-1.33-.87-2.32-1.94-2.66ZM35.6 9.01h2.83c.85 0 1.44.5 1.44 1.2s-.6 1.2-1.44 1.2h-2.83V9ZM38.67 16h-3.06V13.3h3.06c.96 0 1.59.55 1.59 1.36 0 .8-.63 1.33-1.59 1.33ZM51.84 18h3.19l-5.06-5.71L54.61 7h-2.9l-3.68 4.27h-.6V7H45v11h2.44v-4.38h.59l3.8 4.38ZM76.47 7v4.34h-4.93V7H69.1v11h2.43v-4.44h4.93V18h2.43V7h-2.43ZM86.9 18h-2.44V9.22h-3.8V7H90.7v2.22h-3.8V18Zm9.7-11c-2.14 0-4.02.89-4.57 2.8l2.24.37a2.38 2.38 0 0 1 2.2-1.25c1.33 0 2.12.9 2.22 2.33h-2.37c-3.23 0-4.84 1.42-4.84 3.45 0 2.05 1.59 3.3 3.83 3.3 1.8 0 3-.82 3.53-1.73l.5 1.73h1.8v-6.18c0-3.19-1.73-4.82-4.54-4.82Zm-.72 9.16c-1.19 0-1.95-.61-1.95-1.57 0-.84.62-1.43 2.48-1.43h2.3c0 1.8-1.14 3-2.83 3ZM113.73 18h-3.2l-3.8-4.38h-.6V18h-2.42V7h2.43v4.27h.59L110.4 7h2.9l-4.63 5.29 5.05 5.71Zm4.27 0h2.44V9.22h3.8V7H114.2v2.22h3.8V18Zm12.3-11c3.33 0 5.7 2.2 5.7 5.37 0 .3-.02.55-.04.79h-8.84c.23 1.69 1.46 2.83 3.32 2.83 1.29 0 2.3-.55 2.83-1.33l2.29.38c-.83 2.1-2.98 2.96-5.27 2.96-3.34 0-5.71-2.18-5.71-5.5s2.37-5.5 5.71-5.5Zm3.06 4.25A3.06 3.06 0 0 0 130.29 9a3 3 0 0 0-3.02 2.25h6.09Z"></path>
                            <path fill="#07F"
                                  d="M11.5 24h1c5.44 0 8.15 0 9.83-1.68C24 20.64 24 17.92 24 12.5v-1.02c0-5.4 0-8.12-1.67-9.8C20.65 0 17.93 0 12.5 0h-1C6.06 0 3.35 0 1.67 1.68 0 3.36 0 6.08 0 11.5v1.02c0 5.4 0 8.12 1.68 9.8C3.36 24 6.08 24 11.5 24Z"></path>
                            <path fill="#07F"
                                  d="M12.77 17.29c-5.47 0-8.59-3.75-8.72-9.99h2.74c.09 4.58 2.11 6.52 3.71 6.92V7.3h2.58v3.95c1.58-.17 3.24-1.97 3.8-3.95h2.58a7.62 7.62 0 0 1-3.51 4.98 7.9 7.9 0 0 1 4.11 5.01h-2.84a4.94 4.94 0 0 0-4.14-3.57v3.57h-.31Z"></path>

                            <svg fill='white' width='24' height='24' xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 448 512">
                                <path fill="white"
                                      d="M31.5 63.5C0 95 0 145.7 0 247V265C0 366.3 0 417 31.5 448.5C63 480 113.7 480 215 480H233C334.3 480 385 480 416.5 448.5C448 417 448 366.3 448 265V247C448 145.7 448 95 416.5 63.5C385 32 334.3 32 233 32H215C113.7 32 63 32 31.5 63.5zM75.6 168.3H126.7C128.4 253.8 166.1 290 196 297.4V168.3H244.2V242C273.7 238.8 304.6 205.2 315.1 168.3H363.3C359.3 187.4 351.5 205.6 340.2 221.6C328.9 237.6 314.5 251.1 297.7 261.2C316.4 270.5 332.9 283.6 346.1 299.8C359.4 315.9 369 334.6 374.5 354.7H321.4C316.6 337.3 306.6 321.6 292.9 309.8C279.1 297.9 262.2 290.4 244.2 288.1V354.7H238.4C136.3 354.7 78 284.7 75.6 168.3z"/>
                            </svg>
                        </svg>
                    </NavLink>
                </div>
               <div className='relative' onClick={() => setShowUsers(!showUsers)}>


                   <input  value={userInput} onChange={(e) => setUserInput(e.target.value)} type="text" className='bg-stone-100 pl-8 w-[90%] md:w-100  pr-2 md:pl-12 md:pr-4 py-1 rounded-xl'
                          placeholder='Поиск Вконтакте'/>
                   <svg className='absolute left-2 z-20 top-2' width='18' height='18' xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                       <path fill='gray'
                             d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                   </svg>
                   {showUsers &&
                   <div className='absolute z-40 overflow-y-auto h-[400px] md:min-w-[320px] w-[100%] min-w-[200px]  top-[33px] bg-white py-2 px-4 w-full'>
                        <div className='flex items-start justify-center gap-2 flex-col'>
                            {filteredUsers.length > 0 ?  (filteredUsers.map((user) => (
                                <div onClick={() => navigate(`/profile/${user.userName}`)} className='hover:bg-gray-100 w-full rounded-md py-1 cursor-pointer' key={user._id}>
                                    <div className='flex items-center gap-4'>

                                        {user.profilePic ? <img className='w-[39px] object-cover h-[40px] rounded-full'
                                                                src={user.profilePic} alt=""/> : <div
                                            className='bg-blue-600  w-[37px] justify-center h-[35px] rounded-full   flex items-center'>
                                            <User size={24} className='rounded-full text-white '/>
                                        </div>}

                                        <p className='font-semibold'>{user.fullName}</p>

                                    </div>
                                </div>
                            ))) : <p className='flex w-full gap-2 py-4 items-center justify-center flex-col text-gray-700'>
                                    <ErrorIcon className='text-gray-700'/>
                                Пользователи не найдены!</p>}

                       </div>

                   </div>}
               </div>
               <Link to='/notifications' className='relative'>
                   <svg width='22' height='22' xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512">
                       <path fill='gray'
                             d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/>
                   </svg>
                   {unreadNotificationCount > 0 && (
                       <span className=' absolute top-[-5px] left-[2px]
                                     bg-blue-500 font-semibold ml-2 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center'>
                                        {unreadNotificationCount}
                                    </span>
                   )}
               </Link>

               <svg className='md:block hidden' width='22' height='22' xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512">
                   <path fill='gray'
                         d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/>
               </svg>

           </div>
            <div>
                {authUser ? <button onClick={logout} className='px-4 flex items-center gap-1 py-1 border border-gray-300 rounded-lg text-sm font-semibold bg-stone-100 text-gray-800'>Выйти
                    <ArrowRight className='size-4 '/>
                </button> :
                    <button onClick={() => {
                        navigate('/login')
                    }} className='px-4  py-1 text-sm border border-gray-300 rounded-lg font-semibold bg-blue-500 text-white'>Войти</button>}
                <img src="" alt=""/>

            </div>
        </div>
    )
}
export default Navbar
