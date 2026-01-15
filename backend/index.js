import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
// import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import  MemoryStore  from  "memorystore";
import pgSession from "connect-pg-simple";


const app = express();
const port = 4000;
const saltRounds = 10;
env.config();




const storage = multer.memoryStorage();
const upload = multer({ storage:storage });



app.use(session({
  // store: new (pgSession(session))({
  //   pool : pgPool,
  //   tableName: 'session', // default table name
  //   createTableIfMissing: true,
  //   pgPromise: pgPool,

  // }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));



const corsOptions = {
    origin: 'http://localhost:3000',
    methods: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Authorization', 'Accept', 'Access-Control-Request-Headers'],
  
   
};
    
app.use(cors(corsOptions));
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.json());


app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());




// app.options("/auth/google", cors({
//     methods: ['GET', 'POST', 'PUT']}))



const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  db.connect();






const mailDate = new Date().getFullYear();


app.post("/signupverify", async (req, res) => {
  const  {email}  = req.body;
  console.log(email)
  const signupToken = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // This should be generated dynamically in a real application
  console.log(signupToken)
  const checkEmail = await db.query("SELECT * FROM userlogin WHERE email = $1", [
    email,
  ]);
  if (checkEmail.rows.length > 0) {
    return res.status(400).json({ error: "User Already Exist" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'jobenhanceai.co.uk',
      port: '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: "DTS App <noreply@jobenhanceai.co.uk>",
      to: email,
      subject: 'Signup Email Verification',
      html: `<div>
           <h2>Signup Email Verification</h2>
           </br>
           <p>Your verification token is: <strong>${signupToken}</strong></p>
           </br>
           <p>If you did not request this, please ignore this email.</p>
           <p>© ${mailDate} DTS App UK</p>
         </div>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Email sent successfully", token: signupToken });
      }
    });
    
  } catch (error) {
    console.error("Error in contact form:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

});

app.post("/signuptoken", async (req, res) => {
  const {token, signupToken} = req.body;
  console.log(token)
  console.log(signupToken)
  if (token === signupToken) {
    return res.status(200).json({ message: "Token verified successfully" });
  } else {
    return res.status(400).json({ error: "Invalid token" });
  }
});

app.post("/signup",  async (req, res) => {
  const {username, email, password} = req.body;
  
  const result = await db.query("SELECT * FROM userlogin WHERE email = $1", [
    email,
  ]);
  if (result.rows.length > 0) {

    return res.status(400).json({ error: "User Already Exist" }); }

    else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO userlogin (email, username, password) VALUES ($1, $2, $3)",
            [email, username, hash]
          );
          return res.json({ message: "Account Successfully Created" }); 
          console.log("created")

        }})}
 



});

app.post("/confirmemail", async (req, res) => {
  const {email} = req.body;
  // console.log(email)
  const token = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // This should be generated dynamically in a real application
  const result = await db.query("SELECT * FROM userlogin WHERE email = $1 ", [
    email,
  ]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    
    try {
    const transporter = nodemailer.createTransport({
      host: 'jobenhanceai.co.uk',
      port: '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: "Job Enhance AI <noreply@jobenhanceai.co.uk>",
      to: user.email,
      subject: 'Forget Password Email Verification',
      // text: `Token: ${token}`,
      html: `<div>
           <h2>Password Reset Verification</h2>
           </br>
           <p>Your verification token is: <strong>${token}</strong></p>
           </br>
           <p>If you did not request this, please ignore this email.</p>
           <p>© ${mailDate} DTS App UK</p>
         </div>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

    await db.query("UPDATE userlogin SET token = $1 WHERE email = $2", [token, email]);

    return res.json({ email: user.email, username: user.username });}
    else {
      return res.status(400).json({ error: "Email Not Found" }); 
      console.log("not found")}

}
);

app.post("/confirmtoken", async (req, res) => {
  const {email, token} = req.body;
  // console.log(email)
  // console.log(token)
  const result = await db.query("SELECT * FROM userlogin WHERE email = $1 ", [
    email,
  ]);

  if (result.rows.length > 0) {
    const user = result.rows[0];
    const neToken = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // This should be generated dynamically in a real application
    if (user.token === token) {
    await db.query("UPDATE userlogin SET token = $1 WHERE email = $2", [neToken, user.email]);
      return res.json({ email: user.email, username: user.username });
    } else {
      return res.status(400).json({ error: "Invalid Token" }); 
      console.log("invalid token")
    }
  } else {
    return res.status(400).json({ error: "Email Not Found" }); 
    console.log("not found")
  }

});

app.post("/frontchangepassword", async (req, res) => {
  const {email, newpassword, confirmpassword} = req.body;
  // console.log(email)
  // console.log(newpassword)
  if (newpassword !== confirmpassword) {
    return res.status(400).json({ error: "Passwords do not match" }); 
    console.log("passwords do not match")
  }
  const result = await db.query("SELECT * FROM userlogin WHERE email = $1 ", [
    email,
  ]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    bcrypt.hash(newpassword, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        await db.query("UPDATE userlogin SET password = $1 WHERE email = $2", [hash, user.email]);
        return res.json({ message: "Password Changed Successfully" });
      }
    });
  } else {
    return res.status(400).json({ error: "Email Not Found" }); 
    console.log("not found")
  } 
});




app.post(
  "/login", async  (req, res) => {
    passport.authenticate("local", (error, user, info) =>{
        if (error) {
            return res.status(401).json({error:"Invalid Email"})
        }
        if (!user) {
            return res.status(401).json(info)
        }
        req.login(user, (error) => {
            if (error) {
                
            } else {
                res.status(200).json({email:user.email, username:user.username})
            }

    } )} )(req, res)
  }


    )

const authMiddleware = (req, res, next) => {
  
  if (req.isAuthenticated()){
    // console.log(req.user)
    return next()
  } else {
    res.status(401).json({error:"User not logged in"})
  }


};



app.get("/getuser", authMiddleware, (req, res) => {
    res.json({username:req.user.username, email:req.user.email, id:req.user.id});


});


app.get("/dashboard", authMiddleware, async (req, res) => {
  const userID = req.user.id;
  console.log(userID);
  
  const result = await db.query("SELECT * FROM note WHERE user_id = $1 ORDER BY duedate ASC", [
    userID]);
  
    const note = result.rows;

  if (!note) return res.status(400).json({ error: "No Task Found" });
 

  else { return res.json(note)};


});



app.get("/notes", authMiddleware, async (req, res) => {
  const userID = req.body.userId;
  // console.log(userID);
  
  const result = await db.query("SELECT * FROM note WHERE user_id = $1 ", [
    userID]);
  if (result.rows.length > 0) {
    const note = result.rows;

  if (!note) return res.status(400).json({ error: "No Note Found" });
 

  else { return res.json(note)};


}});





app.post("/delete/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  // console.log(id);
  
  const result = await db.query("DELETE FROM note WHERE id = ($1) ", [
    id]);
  
    const note = result.rows;

  if (!note) return res.status(400).json({ error: "No Note Found" });
 

  else { return res.json(note)};


});


function countWords(str) {
  return str.length;
}


app.post("/newnote", authMiddleware, async (req, res) => {

  const {title,content, status, dueDate} = req.body[0];
  const userID = req.body[1];
  const taskID = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  // console.log(userID)
  // // console.log(content)
  if (!title || !content || !status || !dueDate) {
    return res.status(400).json({ error: "Every field is required" });
  }
  if (countWords(content) > 2000) {
    return res.status(400).json({ error: "Task description must be at most 2000 letters" });
    console.log("Task description must be at most 2000 letters")
  } else if(countWords(content) < 2000)
  {

  try {
      await db.query("INSERT INTO note (title, content, user_id, status, dueDate, taskID) VALUES (($1), ($2), ($3), ($4), ($5), ($6))", [title,  content,  userID, status, dueDate, taskID]);
      
      return res.status(200).json({ message: "Task Created Successfully" }); 
      console.log("Note Created")
    } catch (err) {
      console.log(err);
    }
  }
});


app.post("/searchnote/:searchTaskID", authMiddleware, async (req, res) => {
  const {searchTaskID} = req.params;
  const userID = req.user.id;
  console.log(searchTaskID)
  console.log(userID)
  const result = await db.query("SELECT * FROM note WHERE taskID = $1 AND user_id = $2", [
    searchTaskID, userID]);
  if (result.rows.length > 0) {
    const note = result.rows;

  if (!note) return res.status(400).json({ error: "No Task Found" });
  else { return res.json(note)};
}

  else {
    return res.status(400).json({ error: "No Task Found" });
  }

});



app.post("/logout", authMiddleware, async (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.json("Logout Successfully");
  });
});


app.post("/updatenote", authMiddleware, async (req, res) => {

  const {title,content, id} = req.body[0];
  const tId = parseInt(id)
  const userID = req.body[1];

  if (!title || !content) {
    return res.status(400).json({ error: "Title and Note are required" });
  }
  if (countWords(content) > 2000) {
    return res.status(400).json({ error: "Note must be at most 2000 letters" });
  }

  try {
      await db.query("UPDATE note SET title=($1), content=($2) WHERE id=($3)", [title,  content, tId]);
      
      return res.status(200).json({ message: "Note Updated Successfully" }); 
      console.log("Note Created")
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
      console.log(err);
    }
});





app.post("/changepassword", authMiddleware, async (req, res) => {
  const {oldPassword, newPassword} = req.body.formData;
  const user_id = req.user.id;
  let user;
  // console.log(user_id)
  const result = await db.query("SELECT * FROM userlogin WHERE id = $1 ", [
    user_id,
  ]);
  if (result.rows.length > 0) {
    user = result.rows[0];
    // console.log(user.password)

  if (!user) return res.status(400).json({ error: "User not found" });
    
  }
  
  const isValid = await bcrypt.compare(oldPassword, user.password);
  // const isValid =password === user.password; 
  if (!isValid) return res.status(400).json({ error: "Invalid credentials" });
  bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
    } else {
      const result = await db.query(
        "UPDATE userlogin SET password = $1 WHERE id = $2 RETURNING *",
        [hash, user_id]
      );

      return res.status(200).json({ message: "Password changed successfully" }); 
      console.log("changed")

    }}) 
  } )
app.post("/changeusername", authMiddleware, async (req, res) => {
  const {newUsername} = req.body.formData;
  const user_id = req.user.id;
  // console.log(user_id)
  try {
    await db.query("UPDATE userlogin SET username = $1 WHERE id = $2 RETURNING *",
            [newUsername, user_id] )
            return res.status(200).json( "Username Changed Successfully" ); 
            console.log("changed")}
          catch(error) {
          return res.status(401).json( "Not Changed" ); 
          console.log("unsuccessful")

          }
 



}
);





app.get(
  "/auth/google",
  passport.authenticate("google", {
  scope: ["profile", "email"],
})
);
app.get(
  "/auth/google/dashboard", 
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login",

})
);





passport.use("local",
    new Strategy(
      { usernameField: "email", passwordField: "password"},
      async function verify(email, password, cb) {
      
      try {
        const result = await db.query("SELECT * FROM userlogin WHERE email = $1 ", [
          email
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
           const isValid = await bcrypt.compare(password, user.password);
    // const isValid = password === user.password;
    if (!isValid) {
      return cb(null, false, {error:"Incorrect Password"});
            
            } else if (isValid) {
                return cb(null, user);
              } 
            }
          else {
          return cb("User not found");
          
        }
      } catch (err) {
        console.log(err);
      }
    })
  );


passport.use("google", new GoogleStrategy ({
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: "http://localhost:4000/auth/google/dashboard",  
userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, 
async (accessToken, refreshToken, profile, cb) => {
  try {
    // console.log(profile);
    const result = await db.query("SELECT * FROM userlogin WHERE email = $1", [
      profile.email,
    ]);
    if (result.rows.length === 0) {
      const newUser = await db.query(
        "INSERT INTO userlogin (email, username, password) VALUES ($1, $2, $3) RETURNING *",
        [profile.email, profile.given_name, "google" + profile.id] // Using a placeholder password for Google users
      );
      return cb(null, newUser.rows[0]);
    } else {
      return cb(null, result.rows[0]);
    }
  } catch (err) {
    return cb(err);
  }
}

))

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
