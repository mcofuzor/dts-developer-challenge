import React from 'react'
import  '../components/Popup.css'
import { IoClose } from "react-icons/io5";


function View(props) {
    function handleClose() {
                props.onClose()

    }

  return (props.trigger) ? (  
    <div className='view-popup'>
        <div className="popup-note" id={props.id}> 
        <IoClose onMouseUp={handleClose} className='close-btn'></IoClose>

        <div className="pop-title"><h2>Task: {props.title}</h2></div>
        <div className="pop-content">{props.content}</div>

        </div>

      
    </div> 
  ):"";
}

export default View
