import React, {useState} from 'react'
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

import {jwtDecode} from 'jwt-decode'

import {Loader} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore.js";
import {useNavigate} from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../firebase.js";

const Signup = () => {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {getAuthUser, signup, googleAuth} = useAuthStore()
    const handleSignUp = async (event) => {
        event.preventDefault()
        const data = {fullName, userName, email, password}
        await signup(data)
    }




    return (
        <div className='bg-bll min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 '>

            <div>
                <svg className='vkitPageWrapper__logo--flxSR' width='100%' height='100%' viewBox='0 0 1266 900'
                     xmlns='http://www.w3.org/2000/svg' fill='none' preserveAspectRatio='xMidYMax slice'>
                    <path stroke-width='1.60111'  stroke='white' d='M626.614 0V484.725M626.614 484.725V900C138.607 900 1 153.071 1 0M626.614 484.725C1063.56 484.725 1159.45 175.749 1202.58 0M626.614 484.725C1011.06 484.725 1216.2 785.481 1265 900'>

                    </path>
                </svg>
            </div>
            <div className='mx-auto w-full z-40  max-w-md absolute h-full left-1/2 top-[0%] -translate-x-1/2 flex justify-center '>

                <form onSubmit={handleSignUp}
                      className='w-[350px] h-[400px] bg-white absolute top-[25%] rounded-xl flex items-center py-4 px-3 flex-col'>
                    <div>
                        <svg width='48' height='48' xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path fill="#0091ff"
                                  d="M31.5 63.5C0 95 0 145.7 0 247V265C0 366.3 0 417 31.5 448.5C63 480 113.7 480 215 480H233C334.3 480 385 480 416.5 448.5C448 417 448 366.3 448 265V247C448 145.7 448 95 416.5 63.5C385 32 334.3 32 233 32H215C113.7 32 63 32 31.5 63.5zM75.6 168.3H126.7C128.4 253.8 166.1 290 196 297.4V168.3H244.2V242C273.7 238.8 304.6 205.2 315.1 168.3H363.3C359.3 187.4 351.5 205.6 340.2 221.6C328.9 237.6 314.5 251.1 297.7 261.2C316.4 270.5 332.9 283.6 346.1 299.8C359.4 315.9 369 334.6 374.5 354.7H321.4C316.6 337.3 306.6 321.6 292.9 309.8C279.1 297.9 262.2 290.4 244.2 288.1V354.7H238.4C136.3 354.7 78 284.7 75.6 168.3z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className='font-semibold text-lg text-center'>Регистрация Вконтакте</h1>
                        <p className='text-center text-gray-500 text-sm px-4'>Ваши данные которые будут использоваться
                            для входа в аккаунт</p>
                    </div>
                    <div className='flex gap-4 flex-col items-center justify-center mt-8 w-full px-8'>
                        <div className='flex items-center gap-4'>
                            <input value={fullName} onChange={(event) => {
                                setFullName(event.target.value)
                            }} type="text" placeholder='Введите ваше имя'
                                   className='px-2 py-1 w-full border border-gray-300 text-[13px] rounded-lg bg-gray-50'/>

                            <input value={userName} onChange={(event) => {
                                setUserName(event.target.value)
                            }} type="text" placeholder='Введите ваше имя пользователя'
                                   className='px-2 py-1 w-full border border-gray-300 text-[13px] rounded-lg bg-gray-50'/>

                        </div>

                        <input value={email} onChange={(event) => {
                            setEmail(event.target.value)
                        }} type="email" placeholder='Введите ваш email'
                               className='px-4 text-[13px] py-1 w-full border border-gray-300 rounded-lg bg-gray-50'/>

                        <input value={password} onChange={(event) => {
                            setPassword(event.target.value)
                        }} type="password" placeholder='Введите ваш пароль'
                               className='px-4 text-[13px] py-1 w-full border border-gray-300 rounded-lg bg-gray-50'/>
                    </div>


                    <div className='px-8 w-full'>


                        <button disabled={isLoading} type='submit'
                                className='px-2 mt-8 w-full rounded-lg font-semibold flex items-center justify-center  py-1 bg-blue-500 text-white'>{isLoading ?
                            <Loader className='size-5 animate-spin'/> : 'продолжить'}</button>
                    </div>
                    <p className='text-center text-sm mt-3'>Уже были у нас? <span
                        className='text-blue-500 hover:underline transition-all cursor-pointer' onClick={() => {
                        navigate('/login')
                    }}>Войти в аккаунт</span></p>
                </form>

            </div>
        </div>
    )
}
export default Signup
