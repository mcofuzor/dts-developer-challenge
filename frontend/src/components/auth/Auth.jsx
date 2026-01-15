import React, {useState, useEffect, use} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Google from '../img/google.png'
import axios from 'axios'

function Auth() {
 const [login, setLogin] = useState(true)
 const navigate = useNavigate();
 const [signup, setSignup] = useState(false)
 const [loginError, setLoginError] = useState("")
 const [forgetPassword, setForgetPassword] = useState(false)
 const [passwordReset, setPasswordReset] = useState(false)
 const [passwordToken, setPasswordToken] = useState(false)
 const [confirmEmail , setConfirmEmail] = useState(false)
 const [userEmail, setUserEmail] = useState("");
 const [lognsign, setLognSign] = useState(false)
 const [togglePassword, setTogglePassword] = useState(false)
 const [verifySignup, setVerifySignup] = useState(false)

 const backendURL = "http://localhost:4000"




 const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  signupToken: '',
  token: ''
 })

 const [passFormData, setPassFormData] = useState({
  email: '',
  token: '',
  newpassword: '',
  confirmpassword: ''
  })





function handleLogin(){
  setLogin(true)        
    setSignup(false)
    setForgetPassword(false)
    setPasswordReset(false)
    setVerifySignup(false)
    setLoginError("")
    setLognSign(true)
    
    document.querySelector('.login').style.borderBottom = '2px solid #4955d6'
    document.querySelector('.signup').style.borderBottom = 'none'
}
function handleSignup(){            
    setSignup(true)
    setLogin(false)
    setForgetPassword(false)
    setPasswordReset(false)
    setVerifySignup(false)
    setLoginError("")
     setLognSign(true)
    document.querySelector('.signup').style.borderBottom = '2px solid #4955d6'
    document.querySelector('.login').style.borderBottom = 'none'
}



useEffect(() => {
    const path=window.location.pathname
    if(path==='/login'){
        handleLogin()}
    else if(path==='/signup'){
        handleSignup()
    }
    else if (path==='/'){
      setLognSign(true) 

}
}
, [])


useEffect(() => {
  setTimeout(() => {
    setTogglePassword(false);

  }, 5000);
}, [togglePassword]);

  


function handleFormData (event) {
  const fieldName = event.target.name;
  const fieldValue = event.target.value;
  setFormData ({...formData, [fieldName]:fieldValue})


 }

async function loginForm (event){
  event.preventDefault();
  await axios.post(`${backendURL}/login`,  formData)
   .then (response => {
      //  console.log(response.data) 
      //  console.log("Successful")  


     

       navigate("/dashboard" )        // setisLoggedIn(true)
   }
   
 )

   .catch(error => {
   // Handle errors
   setLoginError("Invalid username or password");
   // You can also set a state variable to show an error message in the UI
   console.log('Error fetching data:', error);
 });

};

async function signupForm (event){
    event.preventDefault();
  await axios.post(`${backendURL}/signup`,  formData)
    .then (response => {
        // console.log(response.data) 
        // console.log("Successful")  
        // localStorage.setItem("token", response.data.token);   
        setLoginError("Account Created Successfully. You can now login.");
        // console.log(response.data)
        setSignup(false);
        setLogin(true);
        setFormData ({
          username: '',
          email: '',
          password: ''

        }) 
        // navigate("/login")       // setisLoggedIn(true)
    }
    
  )
    .catch(error => {
      setLoginError("Signup failed. Please try again.");
    // Handle errors
    // console.log('Error fetching data:', error);
  });


 }

 async function handleGoogle () {
  // const goapi = await axios.get("https://api.jobenhanceai.co.uk/auth/google", {headers:{"Content-Type":"application/json"}, credentials: 'include'})
    const goapi = `${backendURL}/auth/google`;
  window.open(goapi, "_self")
  // .then (response => {
  //     console.log(response.data) 
  //     console.log("Successful")  
      
      navigate("/dashboard")        // setisLoggedIn(true)
  // }
  
// )
//   .catch(error => {
//   // Handle errors
//   console.log('Error fetching data:', error);
// });

 }



const handleForgetForm = (e) => {
  if (confirmEmail) {
    handlePasswordReset(e);
  } else if (passwordReset) {
    handleConfirmEmail(e);
  } else if (passwordToken) {
    handlePasswordToken(e);
  }
};
 

 function handlePData (event) {
  const fieldName = event.target.name;
  const fieldValue = event.target.value;
  setPassFormData ({...passFormData, [fieldName]:fieldValue})


 }

 const handleForgotPassword = () => {
  setForgetPassword(true);
  setLogin(false);
  setSignup(false);
  setConfirmEmail(true);
  setPasswordReset(false);
  setPasswordToken(false);
  setLognSign(false);
  setLoginError("");


  };

  

  const handlePasswordReset =  async (e) => {
  e.preventDefault();
  setLogin(false);
  setSignup(false);
  await axios.post(`${backendURL}/confirmemail`,  passFormData)
   .then (response => {
      //  console.log(response.data) 
      setConfirmEmail(false);
      setPasswordReset(true);  
       
      setLoginError("A verification token has been sent to your email. Please check your inbox.");
      setUserEmail (response.data.email);
      // console.log(response.data.email);
     })
   .catch(error => {
   // Handle errors
   console.log(error);
   setLoginError("Email not found. Please try again.");
   setForgetPassword(true);
 });

  
}

const handleConfirmEmail = async (e) => {
  e.preventDefault();
  setLogin(false);
  setSignup(false);
  setPassFormData({
    email: userEmail,
  });
  // console.log(passFormData.email);
    await axios.post(`${backendURL}/confirmtoken`,  {email: passFormData.email,
  token: passFormData.token})
   .then (response => {
      //  console.log(response.data) 
      setPasswordToken(true);  
      setPasswordReset(false);

       
      setLoginError("");
    })
    .catch(error => {
    // Handle errors
    setLoginError("Invalid token. Please try again.");
    setPassFormData({
      token: '',
    })
    });
  

}
  const handleSignupVerify = async (e) => {
    e.preventDefault();
    setVerifySignup(true);
    setLogin(false);
    setSignup(false);
    setForgetPassword(false);
    setPasswordReset(false);
    setLoginError("");
    setLognSign(false);
   await axios.post(`${backendURL}/signupverify`,  {email: formData.email})
    .then (response => {

      setFormData ({
        ...formData,
        token: response.data.token
      });
        // console.log(formData.token)
       //  console.log(response.data) 
        setLoginError("A verification token has been sent to your email. Please check your inbox.");
      // console.log(response.data.email);
      })
    .catch(error => {
    // Handle errors
    setLoginError(error.response.data.error);
    setVerifySignup(false);
    setSignup(true);
    setLognSign(true);
  });
}

const authSignupVerify = async (e) => {
  e.preventDefault();
  setSignup(false);
  axios.post(`${backendURL}/signuptoken`,  {token: formData.token, signupToken: formData.signupToken})
    .then (response => {
       //  console.log(response.data) 
       signupForm(e);
       setVerifySignup(false);
       setLogin(true);
       setLognSign(true);

       setLoginError("Signup completed successfully. You can now login.");
    
      // console.log(response.data.email);
      })
    .catch(error => {
    // Handle errors
    setLoginError(error.response.data.error);
  });
}


  const handlePasswordToken = async (e) => {
  e.preventDefault();
  setLogin(false);
  setSignup(false);
  setPassFormData({
    email: userEmail,
  });
  
  
    if (passFormData.newpassword !== passFormData.confirmpassword) {
      setLoginError("Passwords do not match. Please try again.");
      return;
    }  if (passFormData.newpassword.length < 6) {
      setLoginError("Password must be at least 6 characters long.");
      return;
    }
  if (passwordToken) {
    await axios.post(`${backendURL}/frontchangepassword`,  {email: passFormData.email,
  newpassword: passFormData.newpassword, confirmpassword: passFormData.confirmpassword})
   .then (response => {
      //  console.log(response.data) 
       setLoginError("Password changed successfully. You can now login.");
       setPasswordToken(false);
       window.location.href = "/login"; // Redirect to login page
   })
   .catch(error => {
   // Handle errors
   setLoginError("Failed to change password. Please try again.");
   });
  }
  
}

const handleToggle  = () => {
  setTogglePassword(!togglePassword);
  // document.getElementById('pass').type = togglePassword ? 'text' : 'password';
}


  return (
    <div className='auth-container'>
        <div className='auth-hold'> 
        <div className='auth-head'> <span className='login' onClick={handleLogin}>Login</span>
        <span className='signup' onClick={handleSignup}>Signup</span></div>
      
        <div className='auth-content'>
          <div className='auth-title'>
          <button type='submit' onClick={handleGoogle} className='google-btn'> <img src={Google} alt='google' ></img> <span> Continue with Google</span></button>
            
          </div>
          <div className='auth-or'><hr/> <span>OR</span><hr/></div>
          {loginError && <div className='login-error'>{loginError}</div>}
          <div className='auth-form'>
            {lognsign && <form onSubmit={signup ? handleSignupVerify:loginForm }>
            {signup && <div className='form-group'>
                <label>  Username</label>
                <input type='text' name='username' required onChange={handleFormData} value={formData.username} placeholder='Username' />
              </div> }
               <div className='form-group'>
                <label>  Email</label>
                <input type='email' name='email' required onChange={handleFormData} value={formData.email} placeholder='Enter your email' />
              </div> 
              <div className='form-group password-field'>
                <label>Password</label>
                <input type={togglePassword ? 'text' : 'password'} id='pass' required name='password' onChange={handleFormData} value={formData.password} placeholder='Enter your password' />
                <span
                  className='toggle-password'
                  onClick={handleToggle}
                  style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-40%)',
                  cursor: 'pointer',
                  zIndex:2,
                  fontSize: '1.2rem',
                    }}
                  >
                {togglePassword ? <FaEyeSlash /> : <FaEye />}
               </span>
              </div>
              <button  type='submit'>{signup?"Sign Up":"Sign In"}</button>
              {login && <div className='auth-forgot'>
                <Link  onClick={handleForgotPassword}>Forgot Password?</Link> </div> }
            </form>}
            <div className='auth-forgot'>
              {signup && <span>Already have an account? <Link onClick={handleLogin} to="/login">Login</Link></span>} {login && <span>Don't have an account? <Link onClick={handleSignup} to="/signup">Sign Up</Link></span>}
              </div>
              

              {verifySignup && <form onSubmit={verifySignup && authSignupVerify }>
            {verifySignup && <div className='form-group'>
                <label>  Verify Token</label>
               {verifySignup && <input type='text' name='signupToken' required onChange={handleFormData} value={formData.signupToken} placeholder='Enter verification token' />}
              </div> }
              <button  type='submit'>Verify</button>
              {signup && <div className='auth-forgot'>
                <Link  onClick={handleSignup}>Back to Signup</Link> </div> }
            </form>}


              {forgetPassword && <form onSubmit={handleForgetForm}>
              {confirmEmail && 
             
            <div className='form-group'>
                <label>  Email Address</label>
                <input type='email' required name='email' onChange={handlePData} value={passFormData.email} placeholder='Email Address' />
              </div>}
              {passwordReset &&  <div className='form-group'>
                <label> Verification Token</label>
                <input type='text' required name='token' onChange={handlePData} value={passFormData.token} placeholder='Verification Token' />
              </div> }
               
              {passwordToken && <div className='form-group password-field'>
                <label>New Password</label>
                <input type={togglePassword ? 'text' : 'password'} name='newpassword' required onChange={handlePData} value={passFormData.newpassword} placeholder='New Password' />
                 <span
                  className='toggle-password'
                  onClick={handleToggle}
                  style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-40%)',
                  cursor: 'pointer',
                  zIndex:2,
                  fontSize: '1.2rem',
                    }}
                  >
                {togglePassword ? <FaEyeSlash /> : <FaEye />}
               </span>
              </div>}
               {passwordToken && <div className='form-group password-field'>
                <label>Confirm New Password</label>
                <input type={togglePassword ? 'text' : 'password'}  required name='confirmpassword' onChange={handlePData} value={formData.confirmpassword} placeholder='Confirm New Password' />
                 <span
                  className='toggle-password'
                  onClick={handleToggle}
                  style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-40%)',
                  cursor: 'pointer',
                  zIndex:2,
                  fontSize: '1.2rem',
                    }}
                  >
                {togglePassword ? <FaEyeSlash /> : <FaEye />}
               </span>
              </div>}
              
              
              
              {confirmEmail && <button  type='submit'>Verify Email</button>}
              {passwordReset && <button  type='submit'>Verify Token</button>}
              {passwordToken && <button  type='submit'>Change Password</button>}
              {login && <div className='auth-forgot'>
                <Link to="/forgot-password" onClick={handleForgotPassword}>Forgot Password?</Link> </div> }
            </form>}
           
          </div>
        </div>
        </div>
    </div>
  )
}

export default Auth
