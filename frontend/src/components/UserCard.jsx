import React from 'react'
import {NavLink} from "react-router-dom";
import {User} from "lucide-react";

const UserCard = ({user, isConnection, connectioning, setConnectioning}) => {
    console.log(user)
    if (connectioning) {
        return <div className='w-full h-full flex items-center justify-center'>
            <Loader size={20} className='animate-spin text-blue-500'/>
        </div>
    }
    return (
        <div className=' cursor-pointer bg-white rounded-lg p-4 flex flex-col items-center transition-all hover:shadow-md'>
            <NavLink to={`/profile/${user.userName}`} className='flex flex-col items-center'>


                {!user.profilePic ? (
                    <div className='bg-blue-600 mb-4  w-[84px] justify-center h-[80px] rounded-full   flex items-center'>
                        <User size={60} className='rounded-full text-white '/>
                    </div>) : <img src={user.profilePic} className='w-24 h-24 rounded-full object-cover mb-4' alt=""/>}
                <h3 className='font-semibold text-lg text-center'>{user.fullName}</h3>
            </NavLink>
            <p className='text-gray-600 text-center text-sm'>{user.headline}</p>
            <p className='text-sm text-gray-500 mt-2'>Друзей: {user.connections?.length}</p>
            <button className='bg-blue-500 mt-4 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full'>
                {isConnection ? 'В друзьях' : 'Стать другом'}
            </button>

        </div>
    )
}
export default UserCard
