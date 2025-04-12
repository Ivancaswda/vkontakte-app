import React, {useEffect, useState} from 'react'
import {useAuthStore} from "../store/useAuthStore.js";
import {Link, useParams} from "react-router-dom";
import {Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2, User} from "lucide-react";
import {formatDistanceToNow} from 'date-fns'
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const PostComponent = ({post}) => {
    const {postId} = useParams()
    const {authUser, removePost,  createComment, isLoading, getPosts, likePost, postData, setPostData} = useAuthStore()
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState(post?.comments || [])
    const isOwner = authUser.user._id === post.author._id
    const {showShareModal, setShowShareModal} = useAuthStore()
    const isLiked = post.likes?.includes(authUser.user._id)


    useEffect(() => {
        getPosts()


    },[getPosts])
    console.log(post)

    console.log(showShareModal)

    const handleRemovePost = async (event) => {
        event.preventDefault()

        await removePost(post)
        await getPosts()

    }

    const handleAddComment = async (event) => {

        event.preventDefault()

        if (newComment.trim()) {
            await createComment(post, newComment)
            setNewComment('')
            setComments([
                ...comments,
                {
                    content: newComment,
                    user: {
                        _id: authUser.user._id,
                        fullName: authUser.user.fullName,
                        profilePic: authUser.user.profilePic || "",
                    },
                    createdAt: new Date().toISOString(), // ✅ Store as a string
                },
            ]);
        }
    }


    return (
        <div className='bg-blue-50 rounded-lg shadow mb-4'>
            <div className='p-4 flex items-start justify-between'>
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-start'>
                        <Link className='mr-4' to={`/profile/${post?.author?.userName}`}>
                            {!post?.author?.profilePic ? (<div
                                    className='bg-blue-600  mr-3 w-11 justify-center h-11 rounded-full   flex items-center'>
                                    <User size={30} className='rounded-full text-white '/>
                                </div>) :
                                <img src={post?.author?.profilePic} className='w-[48px] h-[47px] object-cover rounded-full mr-5' alt=""/>}
                        </Link>
                        <div>
                            <Link to={`/profile/${post?.author?.userName}`}>
                                <h3 className='font-semibold flex items-center gap-4'>{post?.author?.fullName} <p
                                    className='text-xs  text-gray-500'>{formatDistanceToNow(new Date(post.createdAt), {addSuffix: true})}</p>
                                </h3>

                            </Link>
                            <p className='text-xs text-blue-400'>{post?.author?.headline}</p>
                            <img className='mt-4 rounded-md' src={post?.image} alt=""/>
                            <p className='mt-2'>{post.content}</p>

                        </div>


                    </div>

                </div>


                {isOwner && (
                    <button onClick={handleRemovePost} className='text-red-500 hover:text-red-700 transition-all'>
                        {isLoading ? <Loader size={18} className='animate-spin'/> : <Trash2 size={18}/>}
                    </button>
                )}
            </div>


            <div className='flex justify-between px-4 py-4 '>

                <button className={'flex items-center'} onClick={ async () => {
                  await  likePost(post)
                   await getPosts()
                }}>
                    <span className='mr-1'><ThumbsUp size={18} className={isLiked ? 'text-blue-500 fill-blue-500' : ''}
                    /></span>
                    <span className='hidden sm:inline text-sm'>{`Лайки (${post.likes.length})`}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className={'flex items-center'}>
                    <span className={`mr-1 ${showComments && 'text-blue-600'}`}><MessageCircle size={18}
                    /></span>
                    <span className='hidden sm:inline text-sm'>{`Комментарии ${comments.length}`}</span>
                </button>


                <button onClick={() => {
                    setPostData(post)
                    setShowShareModal(true)
                }} className={'flex items-center'}>
                    <span className='mr-1'><Share2 size={18}/></span>
                    <span  className='hidden sm:inline text-sm'>Поделиться</span>
                </button>

            </div>

            {showComments && (
                <div className='px-4 pb-4'>
                    <div className='mb-4 max-h-60 overflow-y-auto'>
                        {comments?.map((comment, index) => (
                            <div key={index} className={'mb-2 bg-base-100 p-2 rounded flex items-start'}>
                                {comment?.user?.profilePic ? (
                                    <img src={comment?.user?.profilePic} alt="Profile"
                                         className='size-12 rounded-full mr-3'/>
                                ) : (
                                    <div
                                        className='bg-blue-600 mr-3 w-11 h-11 rounded-full flex items-center justify-center'>
                                        <User size={30} className='text-white'/>
                                    </div>
                                )}
                                <div className='flex-grow'>
                                    <div className='flex items-center mb-1'>
                                        <span className='font-semibold mr-2'>{comment?.user?.fullName}</span>
                                        <span className='text-xs text-gray-500'>{formatDistanceToNow(new Date(post.createdAt), {addSuffix: true})}</span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form action="" onSubmit={handleAddComment} className='flex items-center'>
                        <input placeholder='Что думаете об этом посте?' className='flex-grow p-2 rounded-l-full
                                     bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary' type="text"
                               value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                        <button disabled={isLoading}
                                className='bg-blue-500 text-white p-3 rounded-r-full hover:bg-blue-400 transition-all'
                                type='submit'>
                            {isLoading ? <Loader size={18} className='animate-spin'/> : <Send size={18}/>}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
export default PostComponent
