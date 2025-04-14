import React, {useEffect, useMemo, useState} from 'react'
import {useParams} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js";
import {Briefcase, Camera, Clock, Loader, MapPin, School, User, UserCheck, X} from "lucide-react";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import {formatDate} from "../utils/dateUtils.js";


const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState({})
    const {username} = useParams()
    const [statusData, setStatusData] = useState(null)
    const [userProfileData, setUserProfileData] = useState(null)
    const [loadingProfileData, setLoadingProfileData] = useState(false)
    const [userStatus, setUserStatus] = useState(statusData?.status || null)

    const {authUser, updateProfile, isProfileLoading,
        getUserProfile,  refetchConnectionStatus, sendConnectionRequest, deleteConnectionRequest} = useAuthStore()

    console.log(username)
    const OwnUserData = authUser.user || {}
    const isOwnProfile = OwnUserData.userName === username

    const fetchUserProfileData = async (username) => {


        try {
            setLoadingProfileData(true)
            const response = await axiosInstance.get(`/user/${username}`)
            if (response.data.success) {

                if (response.data.user.length < 0) {
                    toast.error('Нету данных', response.data.message)
                }
                toast.success('информация получена!')
                setUserProfileData(response.data.user)
                console.log(response.data.user)
            } else {
                toast.error('Нету данных', response.data.message)
            }
        } catch (error) {

            toast.error(error.message)
            console.log(error.message)
        } finally {
            setLoadingProfileData(false)
        }
    }

    useEffect(() => {
        console.log(username)
        fetchUserProfileData(username)
        // getUserProfile(username)
        console.log(userProfileData)

    }, [username])
    console.log(userProfileData)
    const userData = useMemo(() => {
        return isOwnProfile ? OwnUserData : userProfileData
    }, [isOwnProfile , OwnUserData, userProfileData])
    console.log(userData)



    const [newExperience, setNewExperience] = useState({
        title: '',
        company: "",
        startDate: "",
        endDate: '',
        description: '',
        currentlyWorking: false

    })

    const [educations, setEducations] = useState(userData?.education || [])
    const [newEducation, setNewEducation] = useState({
        school: '',
        fieldOfStudy: "",
        startYear: '',
        endYear: ''
    })

    const handleAddEducation =  async () => {
        if (newEducation.school && newEducation.fieldOfStudy && newEducation.startYear) {
            setEducations([...educations, newEducation]) // keep old and add a new one
            setIsEditing(false)
            setNewEducation({ // fill the bassic form
                school: '',
                fieldOfStudy: '',
                startYear: "",
                endYear: ""
            })
        }

        await onSave({education: [...educations, newEducation]}) // сохраняем education
    }
    useEffect(() => {
        if (userData?.education) {
            setEducations(userData.education)
        }
    }, [userData])
    const handleDeleteEducation = (id) => {
        setEducations(educations.filter((ed) => ed._id !== id))
    }

    const handleSaveEducation = async () => {
        await onSave({education: educations})
        setIsEditing(false)
    }

    const [skills, setSkills] = useState( [])
    const [newSkill, setNewSkill] = useState('')



    const handleAddSkill = async () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill])
            setNewSkill('')
        }
        await onSave({skills: [...skills, newSkill]})
    }

    const handleSaveSkill = async () => {
        await onSave({skills: skills})
        setIsEditing(false)
    }
    const handleDeleteSkill = (skill) => {
        setSkills(skills.filter((s) => skill !== s))
    }


    const handleAddExperience = () => {
        if (newExperience.title && newExperience.company && newExperience.startDate) {
            setExperiences([...experiences, newExperience]) // keep old and add new

            setNewExperience({
                title: '',
                company: "",
                startDate: "",
                endDate: "",
                description: '',
                currentlyWorking: false
            })
        }
    }

    useEffect(() => {
        if (userProfileData) {
            setAbout(userProfileData.about || '')
            setSkills(userProfileData.skills || [])
            setEducations(userProfileData.education || [])
            setExperiences(userProfileData.experiences || [])
        }
    }, [userProfileData])
    const handleDeleteExperience = (id) => {
        setExperiences(experiences.filter((experience) => {
            return experience._id !== id
        }))
    }

    const handleCurrentlyWorkingChange = (event) => {
        // updating new experience value
        // if im currently working we take off date input

        setNewExperience({
            ...newExperience,
            currentlyWorking: event.target.checked,
            endDate: !event.target.checked ? newExperience.endDate : ''
        })
    }
    const [refreshKey, setRefreshKey] = useState(0)
    const handleUpdateProfile = async (data) => {
        try {

            const response = await axiosInstance.put('/user/update-profile', data)
            if (response.data.success) {
                toast.success('Профиль успешно обновлёен')
                await fetchUserProfileData(username)
                setRefreshKey((prev) => prev +1)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const onSave = async (updateData) => {
       await handleUpdateProfile(updateData)
    }
    const handleSave = async () => {
        console.log(editedData)
        await onSave(editedData)

        setUserProfileData({...userProfileData, ...editedData}) // updating information after saving it
        setIsEditing(false)
    }

    const handleSaveAbout = async () => {
        setIsEditing(false)
        await onSave({about})
        setUserProfileData((prev) => ({
            ...prev,
                about
        }))
        await getUserProfile(username)


    }



    const [about, setAbout] = useState(userData?.about )

    const [experiences, setExperiences] = useState([])
    const fetchStatus = async () => {

        const response = await axiosInstance.get(`/connection/status/${userData?.user?._id}`)
        console.log(response.data.status)
        setStatusData(response.data)
        setUserStatus(response.data.status)

    };
    useEffect(() => {

        fetchStatus();
    }, [username]);

    useEffect(() => {
        if (userData?.experiences) {
            setExperiences(userData?.experiences) // если есть данные то дисплэим их из db

        }

    }, [])
    console.log(experiences)
    const handleSaveExp = async () => {

        await onSave({experiences: experiences})
        setIsEditing(false)

    }

    const isConnected = userData?.connections.some((connection) => connection._id === authUser._id)

    // проверям пользователь в друзьях с тобой



    const acceptConnection = async (requestId) => {
        const response = await axiosInstance.put(`/connection/accept/${requestId}`)

        if (response.data.success) {
            toast.success('Вы приняли заявку в друзья')
            setStatusData(response.data)
            setUserStatus(response.data.status)
        } else {
            console.log(response.data.message)
            toast.error(response.data.message)
        }
    }

    const declineConnection = async (requestId) => {
        const {data} = await axiosInstance.put(`/connection/reject/${requestId}`)

        if (data.success) {
            toast.success('Вы отклонили заявку в друзья')
            setStatusData(data)
            setUserStatus(data.status)
        } else {
            toast.error(data.message)
        }
    }

    if (isProfileLoading) {
        return <Loader size={48} className='animate-spin'></Loader>
    }
    console.log(userData)

    console.log()




    const getConnectionState = () => {
        if (isConnected) {
            return 'connected'
        }
        if (!isConnected) {
            return 'not_connected'
        }



        return userStatus || statusData.status
    }
    const deleteConnection  = async (userId) => {
        try {
            const response = await axiosInstance.delete(`/connection/removeC/${userId}`)

            if (response.data.success) {
                toast.success('Пользователь удалён из ваших друзей!')
            } else {
                toast.error(response.data.message)
                console.log(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }


    const renderConnectionButton = () => {


        const baseClass = 'text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'

        switch (getConnectionState()) {
            case "connected":
                return (
                    <div className='flex gap-2 justify-center'>
                        <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
                            <UserCheck size={20} className='mr-2'/>
                            В друзьях
                        </div>
                        <button className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
                        onClick={ async () => {
                            await deleteConnection(userData._id)

                            setUserProfileData((prev) => ({
                                ...prev,
                                connections: prev.connections.filter((conn) => conn._id !== authUser._id)
                            }))



                        }}
                        >
                            <X size={20} className='mr-2'/>
                            Удалить из друзей
                        </button>
                    </div>
                )
            case 'pending':
                return (
                    <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600 text-sm`}>
                        <Clock size={20} className={'mr-2'}/>
                        Ожидание
                    </button>
                )
            case 'received':
                return (
                    <div className='flex gap-2 justify-center'>
                        <button className='bg-green-500 hover:bg-green-600 text-sm' onClick={() => acceptConnection(statusData?.requestId)}>Принять</button>
                        <button className='bg-orange-500 hover:bg-orange-600 text-sm' onClick={() => declineConnection(statusData?.requestId)}>Отклонить</button>
                    </div>
                )
            case 'not_connected':
                return (
                    <button onClick={ async () => {
                        await sendConnectionRequest(userData._id)
                        setUserStatus('pending')
                    }} className={`${baseClass} bg-blue-500 hover:bg-blue-600 text-sm font-semibold`}>
                        Предложить дружбу
                    </button>
                )
        }

    }
    const handleImageChange = (event) => {
        const file = event.target.files[0]
        const name = event.target.name // это 'profilePic' или 'bannerImg'

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setEditedData((prev) => ({ ...prev, [name]: reader.result }))
            }
            console.log(file)
            reader.readAsDataURL(file)
        }
    }

    if (isProfileLoading) {
        return <div className='flex items-center justify-center w-full h-[100vh]'>
            <Loader className='size-38 animate-spin text-blue-600'/>
        </div>
    }
    if (!userData) {
        return <div className='flex items-center justify-center w-full h-[100vh]'>
            <Loader className='size-38 animate-spin text-blue-600'/>
        </div>
    }
    return (
        <div className='max-w-4xl mx-auto p-4'>
            {/* -------------- header profile information------------- */}
            <div className='bg-white shadow rounded-lg mb-6'>
                <div className='relative h-[80px] rounded-t-lg bg-cover bg-center'
                     style={{backgroundImage: `url(${editedData?.bannerImg || userData?.bannerImg || "/banner.png"})`}}>
                    {isEditing && (
                        <label className='absolute z-20 top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
                            <Camera size={20} />
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                                name='bannerImg'
                                className='hidden'
                            />
                        </label>
                    )}

                </div>

                <div className='p-4'>
                    <div className='relative -mt-20 mb-4'>


                        {!editedData?.profilePic && !userData?.profilePic ? (
                                <div
                                    className='bg-blue-600  w-[90px] justify-center h-[86px] rounded-full mx-auto object-cover   flex items-center'>
                                    <User size={60} className='rounded-full text-white '/>
                                </div>) :
                            <img src={editedData.profilePic || userData.profilePic || '/avatar.png'}
                                 className='size-12 rounded-full mx-auto object-cover' alt=""/>}
                        {isEditing && (
                            <label className='absolute bottom-0
                            right-1/2 transform translate-x-16 bg-white
                            p-2 rounded-full shadow cursor-pointer'>
                                <Camera size={20} />
                                <input
                                    type="file"
                                    className="hidden"
                                    name="profilePic"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </label>
                        )}

                    </div>
                    <div className='text-center mb-4 flex flex-col items-center justify-center'>
                        {isEditing ? (
                            <input type="text" value={editedData.fullName || userData.fullName}
                                   onChange={(event) => {
                                       setEditedData({...editedData, fullName: event.target.value})
                                   }} className='text-2xl font-semibold mb-2'/>
                        ) : <h1 className='text-2xl font-semibold mb-2'>{userData.fullName}</h1>}

                        {isEditing ? (<input type='text' value={editedData.headline ?? userData.headline}
                                             onChange={(event) => setEditedData({
                                                 ...editedData,
                                                 headline: event.target.value
                                             })}
                        />) : (<p className='text-gray-600'>{userData?.headline}</p>)}

                        <div className='flex justify-center items-center mt-2'>
                            <MapPin size='16' className='text-gray-500 mr-1'/>
                            {isEditing ? (
                                <input type="text" value={editedData.location || userData.location}
                                       onChange={(event) => setEditedData({
                                           ...editedData,
                                           location: event.target.value
                                       })}
                                />
                            ) : <span className='text-gray-600'>{userData.location}</span>}
                        </div>
                    </div>

                    {isOwnProfile ? (
                        isEditing ? (
                            <button
                                className='w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
                                onClick={handleSave}
                            >
                                Сохранить профиль
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
                            >
                                Редактировать профиль
                            </button>
                        )
                    ) : (
                        <div className='flex justify-center'>{renderConnectionButton()}</div>
                    )}

                </div>

            </div>
            {/* -------------- About section------------- */}

            <div className='bg-white shadow rounded-lg p-6 mb-6'>
                <h2 className='text-xl font-semibold mb-4'>Описание</h2>
                {isOwnProfile ? (
                    <>
                        {isEditing ? (
                            <>
							<textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className='w-full p-2 border rounded'
                                rows='4'
                            />
                                <button
                                    onClick={handleSaveAbout}
                                    className='mt-2 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark
								transition duration-300'
                                >
                                    Сохранить
                                </button>
                            </>
                        ) : (
                            <>
                                <p>{userData.about}</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className='mt-2 text-blue-500 hover:text-blue-500-dark transition duration-300'
                                >
                                    Редактировать
                                </button>
                            </>
                        )}
                    </>
                ) : <p>{about}</p>}
            </div>

            {/* ------EXPERIENCE SECTION---------- */}
            <div className='bg-white shadow rounded-lg p-6 mb-6'>
                <h2 className='text-xl font-semibold mb-4'>Работа</h2>
                {experiences.map((exp) => (
                    <div key={exp._id} className='mb-4 flex justify-between items-start'>
                        <div className='flex items-start'>
                            <Briefcase size={20} className='mr-2 mt-1'/>
                            <div>
                                <h3 className='font-semibold'>{exp.title}</h3>
                                <p className='text-gray-600'>{exp.company}</p>
                                <p className='text-gray-500 text-sm'>
                                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Только что"}
                                </p>
                                <p className='text-gray-700'>{exp.description}</p>
                            </div>
                        </div>
                        {isEditing && (
                            <button onClick={() => handleDeleteExperience(exp._id)} className='text-red-500'>
                                <X size={20}/>
                            </button>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <div className='mt-4'>
                        <input
                            type='text'
                            placeholder='Название'
                            value={newExperience.title}
                            onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                            className='w-full p-2 border rounded mb-2'
                        />
                        <input
                            type='text'
                            placeholder='Компания'
                            value={newExperience.company}
                            onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                            className='w-full p-2 border rounded mb-2'
                        />
                        <input
                            type='date'
                            placeholder='Дата начала'
                            value={newExperience.startDate}
                            onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                            className='w-full p-2 border rounded mb-2'
                        />
                        <div className='flex items-center mb-2'>
                            <input
                                type='checkbox'
                                id='currentlyWorking'
                                checked={newExperience.currentlyWorking}
                                onChange={handleCurrentlyWorkingChange}
                                className='mr-2'
                            />
                            <label htmlFor='currentlyWorking'>Данная работа является текущей</label>
                        </div>
                        {!newExperience.currentlyWorking && (
                            <input
                                type='date'
                                placeholder='Дата конца'
                                value={newExperience.endDate}
                                onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                                className='w-full p-2 border rounded mb-2'
                            />
                        )}
                        <textarea
                            placeholder='Описание'
                            value={newExperience.description}
                            onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                            className='w-full p-2 border rounded mb-2'
                        />
                        <button
                            onClick={handleAddExperience}
                            className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500-dark transition duration-300'
                        >
                            Добавить опыт
                        </button>
                    </div>
                )}

                {isOwnProfile && (
                    <>
                        {isEditing ? (
                            <button
                                onClick={handleSaveExp}
                                className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300'
                            >
                                Сохранить изменения
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='mt-4 text-blue-500 hover:text-blue-500 transition duration-300'
                            >
                                Изменить опыт
                            </button>
                        )}
                    </>
                )}
            </div>
            {/*------------education part--------------- */}
            <div className='bg-white shadow rounded-lg p-6 mb-6'>
                <h2 className='text-xl font-semibold mb-4'>Образование</h2>
                {educations.map((edu) => (
                    <div key={edu._id} className='mb-4 flex justify-between items-start'>
                        <div className='flex items-start'>
                            <School size={20} className='mr-2 mt-1'/>
                            <div>
                                <h3 className='font-semibold'>{edu.fieldOfStudy}</h3>
                                <p className='text-gray-600'>{edu.school}</p>
                                <p className='text-gray-500 text-sm'>
                                    {edu.startYear} - {edu.endYear || "Present"}
                                </p>
                            </div>
                        </div>
                        {isEditing && (
                            <button onClick={() => handleDeleteEducation(edu._id)} className='text-red-500'>
                                <X size={20}/>
                            </button>
                        )}
                    </div>
                ))}
                {isEditing && (
                    <div className='mt-4'>
                        <input
                            type='text'
                            placeholder='Школьное образование'
                            value={newEducation.school}
                            onChange={(e) => setNewEducation({...newEducation, school: e.target.value})}
                            className='w-full p-2 border rounded mb-2'
                        />
                        <input
                            type='text'
                            placeholder='Поле учёбы'
                            value={newEducation.fieldOfStudy}
                            onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}

                            className='w-full p-2 border rounded mb-2'
                        />
                        <input
                            type='number'
                            placeholder='Начало года'
                            value={newEducation.startYear}

                            onChange={(e) => setNewEducation({...newEducation, startYear: e.target.value})}
                            className='w-full p-2 border rounded mb-2'
                        />
                        <input
                            type='number'
                            placeholder='Конец года'
                            value={newEducation.endYear}
                            onChange={(e) => setNewEducation({...newEducation, endYear: e.target.value})}
                            className='w-full p-2 border rounded mb-2'
                        />
                        <button
                            onClick={handleAddEducation}
                            className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300'
                        >
                            Добавить образование
                        </button>
                    </div>
                )}

                {isOwnProfile && (
                    <>
                        {isEditing ? (
                            <button
                                onClick={handleSaveEducation}
                                className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500
							 transition duration-300'
                            >
                                Сохранить изменения
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='mt-4 text-blue-500 hover:text-blue-500 transition duration-300'
                            >
                                Изменить образования
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* SKILLS SECTION*/}

            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-xl font-semibold mb-4'>Умения</h2>
                <div className='flex flex-wrap'>
                    {skills.map((skill, index) => (
                        <span
                            key={index}
                            className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center'
                        >
						{skill}
                            {isEditing && (
                                <button onClick={() => handleDeleteSkill(skill)} className='ml-2 text-red-500'>
                                    <X size={14}/>
                                </button>
                            )}
					</span>
                    ))}
                </div>

                {isEditing && (
                    <div className='mt-4 flex'>
                        <input
                            type='text'
                            placeholder='Новое умение'
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className='flex-grow p-2 border rounded-l'
                        />
                        <button
                            onClick={handleAddSkill}
                            className='bg-blue-500 text-white py-2 px-4 rounded-r hover:bg-primary-dark transition duration-300'
                        >
                            Добавить умение
                        </button>
                    </div>
                )}

                {isOwnProfile && (
                    <>
                        {isEditing ? (
                            <button
                                onClick={handleSaveSkill}
                                className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
                            >
                               Сохранить изменения
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='mt-4 text-blue-500 hover:text-primary-dark transition duration-300'
                            >
                                Редактировать умения
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
export default ProfilePage
