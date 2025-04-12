import {create} from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../firebase.js";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    allUsers: [],
    connectionStatus: null,
    connectionRequests: [],
    notification: [],
    connections: null,
    isLoading: false,
    recomendedUsers: null,
    isNotifying: false,
    posts: null,
    isSending: false,
    isAccepting: false,
    isRejecting: false,
    specificPost: null,
    userProfileData: null,
    isProfileLoading: false,
    isSidebarLoading: false,
    usersForSidebar: [],
    messages: [],
    isMessagesLoading: false,
    onlineUsers: [],
    isPurging: false,
    postData: null,



    getUserAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/get-user')
            if (response.data.success) {
                console.log(response.data)
                console.log('gasgsaasg')
                set({authUser: response.data})
                if (response.data) {
                    get().connectSocket()
                }
            } else {
                set({authUser: null})
                console.log('asgasgasasg')
                console.log(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    },
    signup:  async (data) => {
        try {
            set({isLoading: true})


            const response = await axiosInstance.post('/auth/signup', data)


            if (response.data.success) {
                toast.success('Вы успешно зарегистрировались Вконтакте')
                set({authUser: response.data})
                get().connectSocket()
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
            set({authUser: null})
        } finally {
            set({isLoading: false})
        }
    },
    signin: async (data) => {
        try {

            set({isLoading: true})

            const response = await axiosInstance.post('/auth/login', data)
            if (response.data.success) {
                toast.success('Вы успешно вошли в аккаунт вк!')
                set({authUser: response.data})
                get().connectSocket()
            }
        } catch (error) {
            toast.error(error.message)
            set({authUser: null})
        } finally {
            set({isLoading: false})
        }
    },
    googleAuth: async (data) => {
        try {
            set({isLoading: true})







            const res = await axiosInstance.post('/auth/google-auth', data);
            console.log(res.data)
            if (res.data.success) {
                toast.success(res.data.message)
                set({authUser: res.data})
                get().connectSocket()

            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            set({isLoading: false})
        }
    },
    logout: async () => {
        try {
            set({isLoading: true})
            await axiosInstance.post('/auth/logout')
            set({authUser: null})
            get().disconnectSocket()
        }   catch (error) {
            toast.error(error.message)

        } finally {
            set({isLoading: false})
        }
    },
    getNotifications: async () => {
        try {

            const response = await axiosInstance.get('/notification')

            set({ notification:response.data.notifications})

            console.log(response.data)
        } catch (error) {

            toast.error(error.message)
        }

    },
    markAsReadNotification: async (id) => {

    },
    deleteNotification: async (id) => {
        try {
            set({isNotifying: true})
            const response = await axiosInstance.delete(`/notification/${id}/delete`)

            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            set({isNotifying: false})
            toast.error(error.message)
        } finally {
            set({isNotifying: false})
        }
    },

    getConnectionRequests: async () => {
        try {
            const response = await axiosInstance.get('/connection/requests')
            if (response.data.success) {
                console.log(response.data)
                set({connectionRequests: response.data.requests})
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    },// filtering out notification which were read
    recommendedUsers: async () => {

    },
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get('/user/all-users')

            if (response.data.success){
                set({allUsers: response.data.allUsers})
            }


        } catch (error) {
            toast.error(error.message)

        }
    },
    getPosts: async () => {
        try {
            const response= await axiosInstance.get('/post/get-connected-post')

            if (response.data.success) {
                console.log(response.data.posts)
                set({posts: response.data.posts})
            }
        } catch (error) {
            toast.error(error.message)
        }
    },
    createPost: async (postData) => {
        try {
            set({isLoading: true})

            const response = await axiosInstance.post('/post/create', postData, {
                headers: {"Content-Type": "application/json"}
            })

            if (response.data.success) {
                toast.success("Пост успешно опубликован!")
                console.log(
                    response.data.message
                )
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            set({isLoading: false})
        }
    },
    removePost: async (post) => {
        try {
            set({isLoading: true})
            const response = await axiosInstance.delete(`/post/remove/${post._id}`)

            if (response.data.success) {
                toast.success('Пост успешно удалён')

            } else {
                console.log(response.data)
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            set({isLoading: false})
        }
    },
    createComment: async (post, newComment) => {
      try {
          set({isLoading: true})
          const response = await axiosInstance.post(`/post/${post._id}/comments`, {content: newComment})
          if (response.data.success) {
              toast.success(response.data.message)
          } else {
              toast.error(response.data.message)
          }
      } catch (error) {
            toast.error(error.message)
            console.log(error)
      } finally {
          set({isLoading: false})
      }

    },
    likePost: async (post) => {
        try {


            const response = await axiosInstance.post(`/post/${post._id}/like`)


        } catch (error) {
            toast.error(error.message)
        }
    },
    getConnectionStatus: async (userId) => {

    },
    sendConnectionRequest: async (userId) => {
        try {
            set({isSending: true})
            const response = await axiosInstance.post(`/connection/request/${userId}`)

            if (response.data.success) {
              toast.success('Вы отправили предложение о дружбе')
            } else {
                toast.error(response.data.message)

            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            set({isSending: false})
        }
    },
    acceptConnectionRequest: async (requestId) => {

    },
    rejectConnectionRequest: async  (requestId) => {

    },
    deleteConnectionRequest: async (userId) => {
      try {
            const response = await axiosInstance.delete(`/connection/removeC/${userId}`)

            if (response.data.success) {
                toast.success('Пользователь удалён из ваших друзей!')
            } else {
                toast.error(response.data.message)
            }

      } catch (error) {
          toast.error(error.message)
          console.log(error)
      }
    },
    getSpecificPost: async (postId) => {
        try {
            const {data} = await axiosInstance(`/post/${postId}`)


            if (data.success) {
                set({specificPost: data.post})
            }
        } catch (error) {
            toast.error(error.message)
        }
    },
    getUserProfile: async (userName) => {
        try {
            set({isProfileLoading: true})
            const response = await axiosInstance.get(`/user/${userName}`)
            if (response.data.success) {
                set({userProfileData: response.data})
                if (response.data.user.length < 0) {
                    toast.error('Нету данных', response.data.message)
                }
                console.log(response.data.user)
            } else {
                toast.error('Нету данных', response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message)
        } finally {
            set({isProfileLoading: false})
        }
    },
    updateProfile: async () => {

    },
    refetchConnectionStatus: async () => {

    },
    getUsersForSidebar: async () => {
        try {
           set({isSidebarLoading: true})

           const response = await axiosInstance.get('/connection')

            if (response.data.success) {
                set({usersForSidebar: response.data.connections})
                console.log(response.data)
            } else {
                toast.error(response.data.message)
            }


        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            set({isSidebarLoading: false})
        }
    },
    getMessages: async (id) => {
        try {
            set({isMessagesLoading: true})
            const response = await axiosInstance.get(`/message/get/${id}`)
            if (response.data.success) {
                set({messages: response.data.messages})
            } else {
                set({messages: []})
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            set({isMessagesLoading: false})
        }
    },
    sendMessage: async (data) => {
        try {

            const {messages, selectedUser} = get()

            set({isMessagesLoading: true})
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`, data) // передаём данные
            if (response.data.success) {
                set({messages: [...messages, response.data.newMessage]})
               toast.success('Сообщение успешно отправлено')
            } else {
                    toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }finally {
            set({isMessagesLoading: false})
        }
    },

    setSelectedUser: (selectedUser) => set((state) => ({
        selectedUser,
    })),
    connectSocket: () => {
        const {authUser} = get()

        if (!authUser || get().socket?.connected) { // если socket уже подключен или пользователя просто нету то пропускаем
            return
        }
        const socket = io(import.meta.env.NODE_ENV === 'development' ? 'http://localhost:2101/' : '/', {
            query: {
                userId: authUser.user._id
            }
        })


        socket.connect()
        set({socket: socket})

        socket.on('getOnlineUsers', (userIds) => {
            set({onlineUsers: userIds})

        })


    },
    disconnectSocket: () => {
        if (get().socket?.connected) { // если подплючено то выключаем
            get().socket.disconnect()
        }
    },
    subscribeToMessages: () => {
        const {selectedUser} = get()

        const socket = useAuthStore.getState().socket

        socket.on('newMessage', (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage?.senderId !== selectedUser._id
            if (isMessageSentFromSelectedUser) {
                return;
            }

            set((state) => {

                const isChatOpen = state.selectedUser?._id === newMessage.senderId

                const newUnreadMessages = {...state.unreadMessages}
                    // anulling unread messages
                if (!isChatOpen) {
                    newUnreadMessages[newMessage.senderId] = (newUnreadMessages[newMessage.senderId] || 0) + 1
                }

                return {
                    messages: isChatOpen ? [...state.messages, newMessage] : state.messages,
                    unreadMessages: newUnreadMessages
                }



            })

        })

    },
    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
    },
    subscribeToRealTime: () => {


        const socket = useAuthStore.getState().socket

        if (!socket) {
            toast.error('нету socket')
            return
        }

        socket.on('new-notification', async () => {
            const {getNotifications} = get()
            getNotifications()


        })

        socket.on('new-connection', async () => {
            const {getConnectionRequests} = get()
            getConnectionRequests()

        })
    },
    unsubscribeOfRealTime: () => {
        const socket = useAuthStore.getState().socket

        socket.off('new-notification')
        socket.off('new-connection')
    },

    setPostData: (postData) => set({postData}),
    showShareModal: false,
    setShowShareModal: (showShareModal) => set({showShareModal})

}))