import React, {useEffect} from 'react'
import Navbar from "./Navbar.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import Sidebar from "./Sidebar.jsx";
import PostCreation from "./PostCreation.jsx";
import PostComponent from "./PostComponent.jsx";
import {Users} from "lucide-react";
import RecommendedUser from "./RecommendedUser.jsx";

const MainPage = () => {
    const {recommendedUsers, recomendedUsers, authUser, posts, getPosts} = useAuthStore()
    console.log(posts)
    useEffect(() => {
        recommendedUsers()
        getPosts()

        console.log(recomendedUsers)
    },[])

    return (
        <div className='w-full '>

            <div className='w-full'>


                <PostCreation/>

                {posts?.map((item, index) => {
                    return <PostComponent post={item} key={index}/>
                })}

                {posts?.length === 0 && (<div className='bg-white rounded-lg shadow p-8 text-center'>
                    <div className='bg-6'>
                        <Users size={64} className='mx-auto text-blue-600'/>
                    </div>
                    <h2 className='text-2xl font-bold mb-4 text-gray-800'>Пока нету постов</h2>
                    <p className='text-gray-600 mb-6'>Стань кому-нибудь другу чтобы видеть его посты!</p>
                </div>)}


            </div>
        </div>
    )
}
export default MainPage
