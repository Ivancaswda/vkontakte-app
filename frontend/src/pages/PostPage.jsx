import React from 'react'
import {useParams} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js";
import Sidebar from "../components/Sidebar.jsx";
import PostComponent from "../components/PostComponent.jsx";

const PostPage = () => {
    // post on whole page

    const {postId} = useParams()
    const {authUser, specificPost, getSpecificPost} = useAuthStore()
    const {showShareModal, setShowShareModal} = useAuthStore()
    // getting post id from url
    return (
        <div className='grid grid-cols lg:grid-cols-4 gap-6'>
            <div className='col-span-1 lg:col-span-3'>
                <PostComponent  post={specificPost}/>
            </div>
        </div>
    )
}
export default PostPage
