import React, {useState} from 'react'
import {useAuthStore} from "../store/useAuthStore.js";
import toast from "react-hot-toast";
import {Image, Loader, User, X} from "lucide-react";

const PostCreation = () => {

    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const {createPost, authUser, isLoading, posts, getPosts} = useAuthStore()

    const handlePostCreation = async () => {
        try {




            let postData = {content}

            if (image) {

                postData.image = await readFileAsDataURL(image); // Convert to Base64

                console.log(postData)
                console.log( 'text with image')
            }


            await createPost(postData);
           await getPosts()
            setContent("");
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    const handleImageChange = async (e) => {
        try {
            const file = e.target.files[0]
            setImage(file)
            if (file) {
                readFileAsDataURL(file).then(setImagePreview) // getting image which was loaded into imagePreview property
            } else {
                setImagePreview(null)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }
    const readFileAsDataURL = (file) => { // reading image in base 64 format (string)
       return new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.onloadend = () => resolve(reader.result)
           reader.onerror = reject
           reader.readAsDataURL(file)
       })
    }



    return (
        <div className='rounded-lg shadow mb-4 p-4'>
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row  sm:flex space-x-3'>                 {/* w-12 h-12 */}
                {!authUser.user.profilePic ? (<div className='bg-blue-600 min-w-[52px] w-[52px] justify-center min-h-[40px] h-12 rounded-full   flex items-center'>
                    <User size={30} className='rounded-full text-white '/>
                </div>) : <img src={authUser.user.profilePic} className='size-12 rounded-full object-cover' alt=""/>}

                <textarea value={content} onChange={(event) => setContent(event.target.value)} className={'w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 ' +
                    ' outline-none resize-none transition-all duration-200 min-h-[100px] '} placeholder='О чём сегодня хочешь поделиться?'>

                </textarea>

                <div className='flex flex-col justify-between items-center gap-4 mt-4'>
                        <div className='flex space-x-2 items-center w-full sm:w-30 justify-center '>
                            <label className='flex items-center transition-all cursor-pointer' >
                                <Image size={20} className='mr-2'/>
                                <span>Фотография</span>
                                <input type="file" className='hidden' onChange={handleImageChange} accept='image/*'/>
                            </label>
                        </div>
                    <button onClick={handlePostCreation} disabled={isLoading} className='bg-blue-500 w-full sm:w-30 text-white rounded-lg px-4 py-2 hover:bg-blue-400 transition-all'>
                        {isLoading ? <Loader size={15} className='animate-spin'/> : 'Поделиться'}
                    </button>
                </div>
            </div>
            {imagePreview && (
                <div className='mt-4 flex items-center gap-4'>
                    <img src={imagePreview} className='w-[200px] object-cover border border-gray-600 h-auto rounded-lg' alt=""/>
                    <X title='Убрать изображение' className='p-2 bg-red-600 cursor-pointer size-8 rounded-full text-white' onClick={() => setImagePreview(null)}/>
                </div>
            )}
        </div>
    )
}
export default PostCreation
