import React, {useState} from 'react'
import {useNavigate } from 'react-router-dom';

import { IoClose } from "react-icons/io5";
import axios from 'axios'



function Edit(props) {
    const userId= props.userId;
    const navigate = useNavigate()
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: props.title,
        content: props.content,
        id:props.id,
        status: props.status,
        dueDate: props.dueDate
       }) 


    function handleFormData(event) {

         const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setFormData ({...formData, [fieldName]:fieldValue})
    }

    async function handleSubmit (event) {
        event.preventDefault();
        setLoading(true)

        await axios.post("http://localhost:4000/updatenote",  [formData, userId])
         .then (response => {
            //  console.log(response.data) 
            //  console.log("Successful") 
             setLoading(false)
             handleClose()
             navigate("/dashboard")
             })


          
            .catch((error) => {
               setMessage(error.response.data.error)
               setLoading(false)
            })

    }
    function handleClose() {
        props.onEClose()
        setMessage("")

}
const formatDateforEdit = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (props.trigger)? (
    <div className='view-popup'>
        <div className="edit-note" id={props.id}> 
        <IoClose onMouseUp={handleClose} className='close-btn'></IoClose>

        <form onSubmit={handleSubmit}>
        <div className="idfied"> <input name='id' value={formData.id}  type='hidden' ></input></div>
              {message && <p className='holdmsg'>{message}</p>}
              <div><label>Task Title</label></div>
               <div className="tilefied"> <input name='title' value={formData.title}  onChange={handleFormData} size="50" maxLength="35" id='title'></input></div>
               <div><label>Task Status</label></div>
               <div className="statusfied"> 
               <select name='status' value={formData.status} onChange={handleFormData} id='notestat' >
                    
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
               </div>
                <div><label>Due Date</label></div>
                <div className="datefied"> <input type="date" name="dueDate" value={formatDateforEdit(formData.dueDate)} onChange={handleFormData} id="duedate" /></div>
               <div><label>Task Description</label></div>
               <div className="contentfied"> <textarea name='content' value={formData.content} onChange={handleFormData} id='notecon' ></textarea></div>

               <div className="sbtn"> <button type='submit'>{loading ? "Updating..." : "Update Task"}</button></div>


                </form>

        </div>

      
    </div> 
  ):"";
}

export default Edit
