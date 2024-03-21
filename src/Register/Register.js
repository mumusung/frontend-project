import React from 'react'
import './Register.css'
import { useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [tel, setTel] = useState()
    const [closepage , setClosepage] = useState(true)
    //     // Import the functions you need from the SDKs you need
    // import { initializeApp } from "firebase/app";
    // // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-librarie

    // // Your web app's Firebase configuration
    
  const closeOnClick = () =>{
    setClosepage(false)
  }
    const handleSubmit = (e) => {
        console.log(e);
        const firebaseConfig = {
            apiKey: "AIzaSyARxzjctp9xGO4GlHD_CBdrf116YI5Ci6c",
            authDomain: "frontend-project-user-database.firebaseapp.com",
            projectId: "frontend-project-user-database",
            storageBucket: "frontend-project-user-database.appspot.com",
            messagingSenderId: "879037419636",
            appId: "1:879037419636:web:c51dc57220852d7d504121"
        };
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = {
                firstname: firstname,
                lastname: lastname,
                email: userCredential.user.email,
                tel:tel,
                password:password,
            };
            console.log("User registered:", user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Registration error:", errorCode, errorMessage);
        });
}
    return (
        <div>
            <div>
                {closepage && <form class="box " onSubmit={handleSubmit}>
                <button className='close-button' onClick={closeOnClick}>X</button>
                    <div class="field">
                        <label>Firstname</label>
                        <input className="input is-fullwidth" type="text" placeholder="firstname" onChange={e => setFirstname(e.target.value)}/>
                    </div>
                    <div class="field">
                        <label>Lastname</label>
                        <input className="input is-fullwidth" type="text" placeholder="lastname" onChange={e => setLastname(e.target.value)}/>
                    </div>
                    <div class="field">
                        <label>Tel</label>
                        <input className="input is-fullwidth" type="text" placeholder="Tel" onChange={e => setTel(e.target.value)}/>
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <input className="input is-fullwidth" type="email" placeholder="email" onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input className="input is-fullwidth" type="tel" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <button class="button is-link" type='submit' >Sign up</button>
                </form>}
            </div>
        </div>
    )
}

export default Register