import React, {useState} from 'react'
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import View from '../components/View';
import Edit from '../components/Edit';



function Notes(props) {
    const [trigger, setTrigger] = useState(false)
    const [editRrigger, setEditTrigger] = useState(false)
    function viewNotes () {
        setTrigger(props.trigger)
        props.onViewNotes(props.id) 

        
    }
    function editNotes () {
        setEditTrigger(true)
        props.submitRequest(props.id) 

    }

    function deleteNotes () {

        props.onDeleteNotes(props.id) 
        alert("Successful Deleted")


    }
    function activeClose () {
        props.onSetTrigger(false)
        setTrigger(false)

    }
    function activeEditClose () {
        props.setEditTrigger(false)
        setEditTrigger(false)

    }
 function editSubmit (){
    props.handleUpdate()
    props.setEditTrigger(false)
    setEditTrigger(false)

 }

 const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
    
console.log(props.dueDate)
console.log(props.status)

  return (
    <div className='notecomp'> 
    <div  className="notelist">
   <div className='note-title'> <h2>TASK: {props.title} </h2></div>
   <div className='note-content'> <p>{props.content.slice(0, 155)}.....</p></div>
   <div className='note-status'> <p>Status:<span className='q-task'>{props.status}</span></p>
   <p>Due Date:<span className='d-task'>{formatDate(props.dueDate)}</span></p>
   <p>Task ID:<span className='id-task'>{props.taskID}</span></p>
   </div>
   
   <div className='note-veiw' onClick={viewNotes}>  <View 
        trigger={trigger}
        id={props.id}
        title={props.title}
        content={props.content}
        onClose={activeClose}
        setOnTrigger={setEditTrigger}
        
        ></View> View Task Details</div>
   <div className='note-btn'><span onClick={editNotes}><Edit
    id={props.id}
    trigger={editRrigger}
    title={props.title}
    status={props.status}
    dueDate={props.dueDate}
    content={props.content}
    setOnTrigger={setEditTrigger}
    onEClose={activeEditClose}
    editSubmit={editSubmit}
    userId={props.userId}
   
    
></Edit><FaEdit/></span>
   
   
   <span onClick={deleteNotes}><MdDeleteForever/></span></div>


    </div>

      
    </div>
  )
}

export default Notes
