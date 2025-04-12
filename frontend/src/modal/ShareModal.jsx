import ReactDom from "react-dom";
import './ShareModal.css'
import {useAuthStore} from "../store/useAuthStore.js";

export default function ShareModal(props) {
    const {children} = props
    const {showShareModal, setShowShareModal} = useAuthStore()
    return ReactDom.createPortal(
        <div className='modal-container'>
            <button onClick={() => {
                setShowShareModal(false)
            }}  className='modal-underlay'></button>
            <div className='modal-content w-100 md:w-100 '>
                {children}
            </div>
        </div>,

        document.getElementById('share')
    )
}