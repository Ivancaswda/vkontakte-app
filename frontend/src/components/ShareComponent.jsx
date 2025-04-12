import React, {useEffect} from 'react'
import {useAuthStore} from "../store/useAuthStore.js";
import {User, X} from "lucide-react";
import toast from "react-hot-toast";

const ShareComponent = () => {
    const {postData, setPostData} = useAuthStore()
    const link = `${window.location.origin}/post/${postData._id}` // putting url of post
    useEffect(() => {
        if (postData) {
            console.log(postData)
        }
    },[])

    const handleCopyLink =  async () => { // копируем ссылку
        try {
            await navigator.clipboard.writeText(link) // копируем в один клик
            toast.success('Ссылка успешно скопирована')
        } catch (error) {
            toast.error(error.message)
        }
    }
    const {showShareModal, setShowShareModal} = useAuthStore()
    // добавляем возмонжость делится своим постом в
    // других соц сетяц используя встроенную react функцию encodeURIComponent
    return (
        <div className='py-4 px-2 w-[90%]'>
            <X onClick={() => setShowShareModal(false)} className='text-gray-700 size-10 cursor-pointer absolute hover:bg-gray-100 transition-all p-2 rounded-full right-4 top-4'/>
            <div className='mt-8'>
                <h1 className={'font-semibold text-xl text-center '}>Поделитесь этим постом в соцсетях</h1>

                <div className='flex items-center justify-center gap-2 justify-start mt-4 bg-gray-100  rounded-lg py-2 '>
                    {!postData.author.profilePic ?
                        <div className='bg-blue-600  w-[32px] justify-center h-[30px] rounded-full   flex items-center'>
                            <User size={20} className='rounded-full text-white rounded-lg '/>
                        </div> :
                        <img src={postData.author.profilePic} className='size-[30px] rounded-full object-cover'
                             alt=""/>}
                    <h1 className='font-semibold text-sm'>{postData.author.fullName}</h1>

                    <div className='px-2 py-1 rounded-lg flex items-center justify-start gap-4 border border-gray-700 bg-white'>

                        {postData.image && <img src={postData?.image} className='w-[40px] h-[40px]' alt=""/>}

                        <div>
                        <p>{postData.content.slice(0, 30)}</p>
                        </div>
                    </div>
                </div>

                <div className='mt-16 flex items-center gap-4 justify-center cursor-pointer'>
                    <a target='_blank' href={`https://connect.ok.ru/offer/url=${encodeURIComponent(link)}`}><img className='w-[42px] rounded-full'
                                                                                                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Odnoklassniki.svg/2059px-Odnoklassniki.svg.png"
                                                                                                              alt=""/></a>
                    <a target='_blank' href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${postData.content}`}><img className='w-[42px] rounded-full'
                              src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Telegram_Messenger.png"
                              alt=""/></a>
                    <a target='_blank' href={`https://wa.me/?text=${encodeURIComponent(link)}`}><img className='w-[42px] rounded-full'
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzGtNuMouqfaHavtmYAf4jCG6kcn-M_-lvLw&s"
                              alt=""/></a>
                    <a target='_blank' href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${postData.content}`}><img className='w-[42px] rounded-full'
                              src="https://img.freepik.com/free-vector/twitter-new-2023-x-logo-white-background-vector_1017-45422.jpg?semt=ais_hybrid&w=740"
                              alt=""/></a>
                    <a target='_blank' href={`https://vk.com/share.php?url=${encodeURIComponent(link)}`}><img className='w-[42px] rounded-full'
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/VK_Compact_Logo_%282021-present%29.svg/2048px-VK_Compact_Logo_%282021-present%29.svg.png"
                              alt=""/></a>
                </div>

                <div className='w-full flex justify-center mt-10'>
                    <div style={{height: '60px', borderBottomLeftRadius: '40px', borderTopLeftRadius: '40px'}}
                         className='w-80 text-lg text-left   border text-gray-700 border-gray-300 flex items-center justify-center'>
                        <p>{link.slice(0, 26)}...</p>
                    </div>
                    <button onClick={handleCopyLink}
                            style={{height: '60px', borderBottomRightRadius: '40px', borderTopRightRadius: '40px'}}
                            className='text-sm whitespace-nowrap px-2 font-semibold bg-black text-white'>Копировать
                        ссылку
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ShareComponent
