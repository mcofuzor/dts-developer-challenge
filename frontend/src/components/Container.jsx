import React, {useState, useEffect} from 'react'
import './main.css';
import {useNavigate } from 'react-router-dom';
import axios from 'axios'

// export const {UserContext} = createContext(null);


function Container () {
     const [signIn, setSignIn] = useState(false);
     const [signUp, setSignUp] = useState(false);
     const [linkClicked, setlinkClicked] = useState(false);
     const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      newpass:'',
      confirmpass:'',
      changepstoken:''
     })
     const [loading, setLoading] = useState(false);
     const [message, setMessage] = useState("");
     const [forgetps, SetForgetps] = useState("");
     const [activeNewps, setActiveNewps] = useState(false)
     const [changepsToken, setChangepsToken] = useState(false)
    

     let userInfo;

     



    // function UserContextProvider (props) {
    //   const contextValue = userInfo;

    //   return (
    //   <UserContext.Provider value={contextValue} >
    //     {props}
    //     </UserContext.Provider>)

    //  }

     const navigate = useNavigate();


    useEffect (() => {
      const path = window.location.pathname;
      if (path === "/login") {
      handleClick({target: {name: "login"}})
    } if (path === "/signup") {
      handleClick({target: {name: "sign-up"}})
    }
  }, []);


     function handleClick (event) {
      setlinkClicked (true)
      const name = event.target.name
        if (name === "login") {
          setMessage("")
          setSignIn(true)
          
        }
        if (name === "sign-up") {
          setMessage("")
          setSignUp(true)
          
        }
      



      // setEndPoint(url);

      // axios.get("/auth/google")
      //   .then (response => {
      //       console.log(response)  
      //       console.log("Successful")  
      //       setisLoggedIn(true)
      //   })
      //   .catch(error => {
      //   // Handle errors
      //   console.log('Error fetching data:', error);
      // });

      // // event.preventDefault();
     }
     function handleFormData (event) {
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      setFormData ({...formData, [fieldName]:fieldValue})


     }
     
     async function handleSignin (){
             setLoading(true)
       await axios.post("https://noteapi.mcofuzordesign.co.uk/login",  formData)
        .then (response => {
            // console.log(response.data) 
            // console.log("Successful")  
            localStorage.setItem("token", response.data.token);   
            localStorage.setItem("User", response.data.user.username); 
            localStorage.setItem("UserId", response.data.user.id);   


            userInfo =  response.data.user;

            setLoading(false)
            navigate("/dashboard", {userInfo} )        // setisLoggedIn(true)
        }
        
      )
    
        .catch(error => {
        // Handle errors
        setMessage(error.response.data.error || "An error occurred during login.");
        setLoading(false)
        setFormData({
          username: '',
          email: '',
          password: ''
        })
        // console.log('Error fetching data:', error);
      });

      // event.preventDefault();

     }
     async function handleSignup (){
       setLoading(true)
      await axios.post("https://noteapi.mcofuzordesign.co.uk/signup",  formData)
        .then (response => {
            // console.log(response.data) 
            // console.log("Successful")  
            localStorage.setItem("token", response.data.token);   
            
            setFormData ({
              username: '',
              email: '',
              password: ''

            }) 
            setMessage("Registration successful! Please log in.")
            setLoading(false)
            navigate("/")        // setisLoggedIn(true)
        }
        
      )
        .catch(error => {
          setMessage(error.response.data.error || "An error occurred during registration.");
          // console.log(error)
          setLoading(false)
          setFormData({
            username: '',
            email: '',
            password: ''
          })
        // Handle errors
        // console.log('Error fetching data:', error);
      });

      // event.preventDefault();

     }
    

     const controlSubmit = (event) => {
      event.preventDefault();

     }

  
      const handleForgetps = async (event) =>{
              event.preventDefault();
              setLoading(true);
              await axios.post("/forgetpsemail", formData)
              .then (response => {
            // console.log(response.data.email) 
            setChangepsToken(true)
            setMessage("Email sent! Please check your inbox to reset your password.");
            SetForgetps(false)
            
            
           
            setLoading(false)
        }
        
      )
        .catch(error => {
          setMessage(error.response.data.error || "Unable to verify email.");
          console.log(error)
          setLoading(false)
          // setFormData({
          //   email: '',
          // })

        // Handle errors
        // console.log('Error fetching data:', error);
      });
      } 

      async function handlepsToken  (event){
         event.preventDefault();
              setLoading(true);
              await axios.post("https://noteapi.mcofuzordesign.co.uk/changetoken", formData)
              .then (response => {
            // console.log(response.data) 
            setChangepsToken(false)
            setActiveNewps(true)
            setMessage("Email Verified!. Change your password now");


            setFormData ({...formData, changepstoken:''

            }) 
            setLoading(false)
        }
        
      )
        .catch(error => {
          setMessage(error.response.data.error || "Unable to verify email.");
          // console.log(error)
          setLoading(false)
          setFormData({...formData,
            changepstoken:''

          })
        // Handle errors
        // console.log('Error fetching data:', error);
      });

      }
      
      const handleNewps = async (event) =>{
         event.preventDefault();
              setLoading(true);
              await axios.post("https://noteapi.mcofuzordesign.co.uk/changepass", formData)
              .then (response => {
            // console.log(response.data) 
            setActiveNewps(false)
            setMessage("Password changed successfully! Login into your account.");
            setSignIn(true)
            
            
            setLoading(false)
        }
        
      )
        .catch(error => {
          setMessage(error.response.data.error || "Unable to change password.");
          // console.log(error)
          setLoading(false)
          setFormData({...formData,
           newpass:'',
            confirmpass: ''

          })
        // Handle errors
        // console.log('Error fetching data:', error);
      });

      }
     
      
    

  return (
    <div className='container'>
     <div className={linkClicked?"localauth":null}>
     {linkClicked ?
     <div className='log-field'>
      <form className='input-form'onSubmit={controlSubmit}>
      {signIn &&<h2> Sign In Account</h2>}
      {signUp &&<h2> Rigister Account</h2>}
      {forgetps || changepsToken || activeNewps ? <h2> Foget Password</h2>:null}



      {message ? <p className='message'>{message}</p> : null}
      {signUp ?<input type='text' onChange={handleFormData} value={formData.username} name='username' placeholder='User Name' required></input>:null}
      {signUp || signIn || forgetps ?<input onChange={handleFormData} type='email' value={formData.email} name='email' placeholder='Email Address' required></input> : null}
       {signUp || signIn ?<input type='password' onChange={handleFormData} value={formData.password} name='password' placeholder='Password' required></input> :null }
       {activeNewps  ?<input type='password' onChange={handleFormData} value={formData.newpass} name='newpass' placeholder='New Password' required></input> :null }
      {activeNewps  ?<input type='password' onChange={handleFormData} value={formData.confirmpass} name='confirmpass' placeholder='Confirm Password' required></input> :null }

      {changepsToken && <input type='text' onChange={handleFormData} value={formData.changepstoken} name='changepstoken' placeholder='Verification Token' required></input>}

     {signIn ? <button  onClick={handleSignin} type='submit' >  {loading?"Loading...":"Sign In"}</button> : null}
      {forgetps ? <button  onClick={handleForgetps} type='submit' >  {loading?"Loading...":"Confirm Email"}</button> : null}
      {changepsToken ? <button  onClick={handlepsToken} type='submit' >  {loading?"Loading...":"Verify"}</button> : null}
      {activeNewps ? <button  onClick={handleNewps} type='submit' >  {loading?"Loading...":"Change Password"}</button> : null}
     {signUp ? <button  onClick={handleSignup} type='submit' >  {loading?"Loading...":"Register"}</button> : null}
     {signIn&&<p> <span onClick={() => {setSignUp(false); setSignIn(false); setMessage(""); SetForgetps(true) }} className='quick-link'> Forget Password</span></p>}

      {signIn && <p>Don't have an Account? <span onClick={() => {setSignUp(true); setSignIn(false); SetForgetps(false); setMessage("") }} 
      className='quick-link'>Sign-Up</span></p>}
      {signUp && <p>Already have an Account?<span className='quick-link' onClick={() => {setSignUp(false); setSignIn(true); SetForgetps(false); setMessage("") }}> Sign-In</span></p>}
      {forgetps || changepsToken || activeNewps ? <p>Already have an Account?<span className='quick-link' onClick={() => {setSignUp(false); setSignIn(true); SetForgetps(false); setActiveNewps(false); setChangepsToken(false); setMessage("") }}> Sign-In</span></p>:null}

      </form>
     </div> :
    <div className="auth">
    <div className="google-login">
     <button  onClick={handleClick}  name="login" className='auth-link'>  Sign In</button>
    
    </div>
    <hr/>
    <div className="google-login">
    <button  onClick={handleClick}  name="sign-up" className='auth-link'>  Sign Up</button>
    </div>

    </div>
      }
      </div>
    </div>
  )
}

export default Container
