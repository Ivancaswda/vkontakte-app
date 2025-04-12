import React, {useEffect, useState} from 'react'
import {useAuthStore} from "../store/useAuthStore.js";
import Sidebar from "../components/Sidebar.jsx";
import {Loader, UserPlus} from "lucide-react";
import axiosInstance from "../lib/axios.js";
import FriendRequest from "../components/FriendRequest.jsx";
import toast from "react-hot-toast";
import UserCard from "../components/UserCard.jsx";

const NetworkPage = () => {
    const  {getConnectionRequests, connectionRequests} = useAuthStore()
    const [connectioning, setConnectioning] = useState(false)
    const [connections, setConnections] = useState(null)
    const getConnections =  async () => {
        try {
            setConnectioning(true)
            const response = await axiosInstance.get('/connection')

            setConnections(response.data.connections)

        } catch (error) {
            toast.error(error.message)

        } finally {
            setConnectioning(false)
        }
    }

    const [localRequests, setLocalRequests] = useState([]) // we ought dinamically update the data
    useEffect(() => {
        getConnectionRequests()
        getConnections()


    }, [])

    useEffect(() => {
        setLocalRequests(connectionRequests)
    },[connectionRequests])


    const handleRequestHandled = (requestId) => {
        setLocalRequests((prev) => {
            return prev.filter((request) => request._id !== requestId)
        })
    }

    return (
        <div className='flex-col flex gap-6 items-start w-full'>
            <div className='w-full lg:col-span-3'>
                <div className=' rounded-lg shadown p-6 mb-6'>
                    <h1 className='text-2xl font-bold mb-6'>Моё соединение</h1>

                    {localRequests?.length > 0 ? (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold mb-2'>Предложенные запросы дружбы</h2>
                            <div className='space-y-4 w-full'>
                                {connectionRequests.map((connectionRequest) => (
                                    <FriendRequest onRequestHandled={handleRequestHandled} key={connectionRequest._id} connectionRequest={connectionRequest}/>
                                ))}
                            </div>
                        </div>
                    ) : <div className={'bg-white rounded-lg shadow p-6 text-center mb-6'}>
                            <UserPlus size={48} className='mx-auto text-gray-400 mb-4'/>
                            <h3 className='text-xl font-semibold mb-2'>нет отправленных запросов дружбы</h3>
                            <p className='text-gray-600'>
                                У вас нет ожидающих запрос дружбы
                            </p>
                            <p className='text-gray-600 mt-2'>
                                Изучите предложенных людей для увеличения ваших друзей
                            </p>
                    </div>}
                    {connections?.length > 0 && (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold mb-4'>Мои друзья</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {connectioning &&(<div className='flex items-center justify-center w-full'>
                                    <Loader className='animate-spin text-blue-500'/>
                                </div>)}
                                {connections.map((connection, index) => (
                                    <UserCard connectioning={connectioning} setConnectioning={setConnectioning} key={connection._id} user={connection} isConnection={true}/>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
export default NetworkPage
