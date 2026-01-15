import React, {useState, useEffect, } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios'
import Notes from './Notes';
import  '../components/main.css'


axios.defaults.withCredentials = true;


function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [searchTask, setSearchTask] = useState([]);
    const [viewNotes, setViewNotes] = useState(false);
    const [addNotes, setAddNotes] = useState(false);
    const [popupTrigger, setPopupTrigger] = useState(false)
    const [editTrigger, setEditTrigger] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage]= useState(false)
    const [user, setUser] = useState("")
      const [usersession, setUsersession] = useState({});
      const [activeSearch, setActiveSearch] = useState(false)
    const [searchTaskID, setSearchTaskID] = useState("")


    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: 'Pending',
        dueDate: '',
       })

    const backendURL = "http://localhost:4000"


    // const user = useContext(UserContext)


    // const userId = localStorage.getItem("UserId")
    // const liveToken = localStorage.getItem("token")


    const navigate = useNavigate();
      

    useEffect(   ()   =>  { 

        handleViewNotes ()


    }, []);

    async function fetchUser () {
   await axios.get(`${backendURL}/getuser`,  {withCredentials:true,  credentials: 'include'})
    .then (response => {
      setUser(response.data)
      setUsersession(response.data)
      handleViewNotes ()

        // console.log(response.data) 
        // console.log("Successful-Dash")  

  }
)
.catch(error => {

  // Handle errors
  // console.log(error.data?.error);
})
  .finally(() => {
    setLoading(false);
  });
  }

  useEffect(() => {
    fetchUser();
  }, []);
    
 


    function handleFormData (event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setFormData ({...formData, [fieldName]:fieldValue})
  
  
       }


    async function handleViewNotes () {
        await axios.get(`${backendURL}/dashboard`,   {userId:user.id })
        .then (response => {
           
            setNotes(response.data)
            setMessage("")
            console.log(response.data) 
            // console.log(notes)

        })
        
        .catch(error => {
            // Handle errors
            console.log('Error fetching data:', error);
          })


        setViewNotes(true)
        setAddNotes(false)
          setActiveSearch(false)
            
            navigate("/dashboard" ) 
        }
        
    //   )
    
    //     .catch(error => {
    //     // Handle errors
    //     console.log('Error fetching data:', error);
    //   });
    



    // }

    function handleAddNotes () {
        setAddNotes(true)
        setViewNotes(false)
        setActiveSearch(false)



    }
    function handleSearchNotes () {
        setActiveSearch(true)
        setAddNotes(false)
        setViewNotes(false)
    }

    async function handleSearchNotesSubmit (event) {
        event.preventDefault();

        await axios.post(`${backendURL}/searchnote/`+searchTaskID,   {userId:user.id} )
        .then (response => {

            setSearchTask(response.data)
            setMessage("")
            console.log(response.data) 
            // console.log(notes)
        })
        
        .catch(error => {
            // Handle errors
            console.log('Error fetching data:', error);
          });
        setActiveSearch(true)
        setAddNotes(false)
        setViewNotes(false)

    }
    async function handleSubmit (event){
               event.preventDefault();
               setLoading(true)

        await axios.post(`${backendURL}/newnote`,  [formData, user.id])
         .then (response => {
            //  console.log(response.data) 
            //  console.log("Successful")
            setMessage(response.data.message)
               setLoading(false)

             setViewNotes(true)
             setAddNotes (false)

             handleViewNotes ()

             setFormData({
                title: '',
                content: '',
               })
             
             navigate("/dashboard" )        // setisLoggedIn(true)
         }
         
       )
     
         .catch(error => {
          setMessage(error.response.data.error)
          setLoading(false)
         // Handle errors
        //  console.log('Error fetching data:', error);
       });
 
 
      }




      async function handleUpdate (){
     

 await axios.post(`${backendURL}/updatenote`,  [formData, user.id])
  .then (response => {
      // console.log(response.data) 
      // console.log("Successful")  
        
      setViewNotes(true)
      setAddNotes (false)

      handleViewNotes ()

      
      navigate("/dashboard" )        // setisLoggedIn(true)
  }
  
)

  .catch(error => {
  // Handle errors
  // console.log('Error fetching data:', error);
});


}




      async function handleDelete (id){
      

 await axios.post(`${backendURL}/delete/`+id, user.id)
  .then (response => {
      // console.log(response.data) 
      // console.log("Successful Deleted") 
      // console.log(id)  
        


      handleViewNotes ()
      
      navigate("/dashboard" )        // setisLoggedIn(true)
  }
  
)

  .catch(error => {
  // Handle errors
  // console.log('Error fetching data:', error);
});


}
function handleOnViewNote (id) {
    setPopupTrigger(true)
    



}
function handleEditNote (id) {
    setEditTrigger(true)
    



}
async function handleLogout () {

   axios.post(`${backendURL}/logout`, {}, { withCredentials: true })
    .then (response => {
        // console.log(response.data) 
        // console.log("Successful Logout")  
        setUsersession({})
         navigate("/login" ) 
    })  

      
        


}
 

 if (!usersession.username) {
    return null; // or a loading spinner
  }

  const username = user.username

  

  return  (
     
    <div>
        <Header/>
        
      <div>
        <div className="upbar">
            <span className="userinfo">Welcome <span>{username.toUpperCase()} </span></span>!
            <span className="logout" onClick={handleLogout}> Logout</span>
        </div>
        <div className="content">
            <div className="navar">
                <ul className="navitems" >
                    <li className={viewNotes?'active':null} onClick={handleViewNotes}>View Tasks</li>
                    <li className={addNotes?'active':null} onClick={handleAddNotes}>Add Task</li>
                    <li className={activeSearch?'active':null} onClick={handleSearchNotes}>Search for Task</li>
                </ul>
            </div>
            <div className="dashboard">
            {viewNotes && 
            
            <div className='hold-note'>
                {notes.map((note, index) =>  
                <Notes
                id={note.id}
                key={index}
                title={note.title}
                content={note.content}
                status={note.status}
                dueDate={note.duedate}
                taskID={note.taskid}
                onDeleteNotes={handleDelete}
                onViewNotes={handleOnViewNote}
                trigger ={popupTrigger}
                etrigger ={editTrigger}
                onSetTrigger={setPopupTrigger}
                setEditTrigger={setEditTrigger}
                submitRequest={handleEditNote}
                handleUpdate={handleUpdate}
                userId={user.id}
                />
                
                )}


            </div>
            
            }

            {addNotes && 
            
            <div className='note-form'>
                <form onSubmit={handleSubmit}>
                    <div>
                      {message&& <p className='holdmsg'>{message}</p>}
                <label >Task Name</label></div>
                <input name='title'value={formData.title}  onChange={handleFormData} size="40" maxLength="40" id='title'></input>
                <div><label >Task Status</label></div>
                <select name='status' value={formData.status} onChange={handleFormData} id='notestat' >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <div><label >Due Date</label></div>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleFormData} id="duedate" />
                <div>
                <label  >Description</label></div>
                <textarea name='content' value={formData.content} onChange={handleFormData} id='notecon'  maxLength="1000"></textarea>

                <button className='addnote' type='submit'>{loading ? "Adding Task..." : "Add Task"}</button>

                </form>
                </div>
            
            }

            {activeSearch && 
            <div className='note-search'>
                <div>
                  <label  >Enter Task ID to Search</label></div>
               <div> <input name='searchTaskID'value={searchTaskID}  onChange={(e) => setSearchTaskID(e.target.value)} size="40" maxLength="40" id='searchTaskID'></input></div>
               <div> <button onClick={handleSearchNotesSubmit} className='addnote' type='submit'>Search</button></div>

               <div className='hold-note'>
                {searchTask.map((note, index) =>  
                <Notes
                id={note.id}  
                key={index}
                title={note.title}
                content={note.content}  
                status={note.status}
                dueDate={note.duedate}
                taskID={note.taskid}
                onDeleteNotes={handleDelete}
                onViewNotes={handleOnViewNote}
                trigger ={popupTrigger}
                etrigger ={editTrigger}
                onSetTrigger={setPopupTrigger}
                setEditTrigger={setEditTrigger}
                submitRequest={handleEditNote}
                handleUpdate={handleUpdate}
                userId={user.id}
                />  
                )}
            </div>

            </div>
            }

            </div>
        </div>

      </div> 
    </div>
  )
}

export default Dashboard
