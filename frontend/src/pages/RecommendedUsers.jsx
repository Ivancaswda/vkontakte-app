import React, {useEffect, useState} from 'react'
import RecommendedUser from "../components/RecommendedUser.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {Loader} from "lucide-react";
import UserCard from "../components/UserCard.jsx";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

const RecommendedUsers = () => {
    const {recomendedUsers, recommendedUsers, isNotifying} = useAuthStore()
    console.log(recomendedUsers)
    const [connectionLoading, setConnectionLoading] = useState(false)
    const [connections, setConnections] = useState([])
    const getConnections = async () => {
        try {
            setConnectionLoading(true)
            const response= await axiosInstance.get('/connection')
            if (response.data.success) {
                setConnections(response.data.connections)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setConnectionLoading(false)
        }
    }
    const [visibleUsers, setVisibleUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoadMore, setIsLoadMore] =useState(false)
    const loadRecommendedUsers = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/user/suggestions', {
                params: { page: page, limit: 5 }
            });

            if (response.data.success) {
                if (page === 1) {
                    setVisibleUsers(response.data.suggestedUser); // Если это первая страница, заменяем список
                } else {
                    setVisibleUsers((prevUsers) => [...prevUsers, ...response.data.suggestedUser]); // Добавляем новых пользователей, если это не первая страница
                }
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для загрузки следующих пользователей
    const loadMore = async () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage); // Увеличиваем номер страницы
        await loadRecommendedUsers(nextPage); // Загружаем пользователей для следующей страницы
    };

    // В useEffect загружаем начальные пользователи
    useEffect(() => {
        loadRecommendedUsers(currentPage); // Загружаем пользователей при монтировании компонента
        console.log(visibleUsers)
        getConnections()
    }, []);


    return (
        <div>

            {visibleUsers.length > 0 && (
                <div className="col-span-1 lg:col-span-1 block">
                    <div className="bg-blue-50 rounded-lg shadow p-4">
                        <h2 className="font-semibold mb-4">Люди которых ты можешь знать</h2>

                        {!isLoadMore ? (visibleUsers.slice(0, 5).map((item, index) => {
                                return <RecommendedUser key={item._id} user={item} />; // Рендерим каждого пользователя
                            })) :   (visibleUsers.map((item, index) => {
                            return <RecommendedUser key={item._id} user={item} />; // Рендерим каждого пользователя
                        }))}
                        {visibleUsers.length > 5 && ( // Если пользователей больше 5, показываем кнопку
                            <button
                                onClick={() => setIsLoadMore(!isLoadMore)} // При клике на кнопку загружаются новые пользователи
                                disabled={isLoading} // Ожидание загрузки
                                className="w-full hover:bg-blue-500 transition-all duration-500 hover:text-white px-4 py-1 border border-blue-500 rounded-2xl"
                            >
                                {isLoading ? (
                                    <Loader className="text-blue-500 animate-spin" />
                                ) : isLoadMore ? 'Скрыть до 5 пользователей' : 'Показать больше'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className='mt-4'>
                {connections?.length > 0 && (
                    <div className='mb-8'>
                        <h2 className='text-xl font-semibold mb-4'>Мои друзья</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {connectionLoading &&(<div className='flex items-center justify-center w-full'>
                                <Loader className='animate-spin text-blue-500'/>
                            </div>)}
                            {connections.map((connection, index) => (
                                <UserCard connectioning={connectionLoading} setConnectioning={connectionLoading} key={connection._id} user={connection} isConnection={true}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>

    )
}
export default RecommendedUsers