import React, {useState} from 'react'
import {Loader} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import {useAuthStore} from "../store/useAuthStore.js";
import {useNavigate} from "react-router-dom";

import {GoogleLogin, } from "@react-oauth/google";
import {auth} from "../firebase.js";
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'


const Login = () => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {getAuthUser, signin, isLoading, googleAuth } = useAuthStore()

    const handleSignIn = async (event) => {
       event.preventDefault()
       const data = {email, password}
        await signin(data)

    }
    const onError = () => {
        toast.error('Не удалось авторизироваться при помощи Google')
        return
    }

    const navigate = useNavigate()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const handleGoogleAuth = async (e) => {
        try {
           e.preventDefault()
            const provider = new GoogleAuthProvider()

            const result = await signInWithPopup(auth, provider)

            const user = result.user
            const { displayName,  email, photoURL} = user;
            const userName = email.split('@')[0];

            await googleAuth({
                fullName: displayName,
                userName,
                email,
                profilePic: photoURL})


        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setIsGoogleLoading(false)
        }
    }


    return (
        <div className='bg-bll min-h-screen relative flex flex-col justify-center  py-12 sm:px-6 lg:px-8 '>

            <div>
                <svg className='vkitPageWrapper__logo--flxSR' width='100%' height='100%' viewBox='0 0 1266 900'
                     xmlns='http://www.w3.org/2000/svg' fill='none' preserveAspectRatio='xMidYMax slice'>
                    <path stroke-width='1.60111' stroke='white'
                          d='M626.614 0V484.725M626.614 484.725V900C138.607 900 1 153.071 1 0M626.614 484.725C1063.56 484.725 1159.45 175.749 1202.58 0M626.614 484.725C1011.06 484.725 1216.2 785.481 1265 900'>

                    </path>
                </svg>
            </div>
            <div className='mx-auto w-full z-40  max-w-md absolute h-full left-1/2 top-[10%] -translate-x-1/2 flex justify-center'>
                <div className='w-[350px] h-[440px] bg-white absolute  z-20 rounded-xl flex items-center justify-center'>

                    <form onSubmit={handleSignIn}
                          className='w-[350px] h-[440px]  bg-white absolute  z-20 rounded-xl flex items-center py-4 px-3 flex-col'>
                        <div>
                            <svg width='48' height='48' xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 448 512">
                                <path fill="#0091ff"
                                      d="M31.5 63.5C0 95 0 145.7 0 247V265C0 366.3 0 417 31.5 448.5C63 480 113.7 480 215 480H233C334.3 480 385 480 416.5 448.5C448 417 448 366.3 448 265V247C448 145.7 448 95 416.5 63.5C385 32 334.3 32 233 32H215C113.7 32 63 32 31.5 63.5zM75.6 168.3H126.7C128.4 253.8 166.1 290 196 297.4V168.3H244.2V242C273.7 238.8 304.6 205.2 315.1 168.3H363.3C359.3 187.4 351.5 205.6 340.2 221.6C328.9 237.6 314.5 251.1 297.7 261.2C316.4 270.5 332.9 283.6 346.1 299.8C359.4 315.9 369 334.6 374.5 354.7H321.4C316.6 337.3 306.6 321.6 292.9 309.8C279.1 297.9 262.2 290.4 244.2 288.1V354.7H238.4C136.3 354.7 78 284.7 75.6 168.3z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className='font-semibold text-lg text-center'>Авторизация Вконтакте</h1>
                            <p className='text-center text-gray-500 text-sm px-4'>Ваши данные которые будут
                                использоваться
                                для входа в аккаунт</p>
                        </div>


                        <div className='flex gap-4 flex-col items-center justify-center mt-8 w-full px-8'>


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

                        <p className='text-center text-sm mt-3 '>Нету аккаунта? <span
                            className='text-blue-500 hover:underline transition-all cursor-pointer' onClick={() => {
                            navigate('/signup')
                        }}>Зарегистироваться</span></p>

                    </form>

                    <form className='absolute bottom-8 z-20' id='google-form' onSubmit={handleGoogleAuth}>
                        <div className='bg-gray-400 w-full h-[0.1px] absolute  '>

                        </div>
                        <button className='text-3xl border border-gray-500 transition hover:scale-105 px-4 py-0.5 rounded-md mt-4 text-black text-[14px] flex items-center gap-2' type='submit'>
                            <img src="https://static.cdnlogo.com/logos/g/38/google-icon.svg" className='w-6 h-6'
                                 alt=""/>
                            Зарегистрироваться через <b>Google</b>

                        </button>

                    </form>
                </div>
            </div>

        </div>
    )
}
export default Login
