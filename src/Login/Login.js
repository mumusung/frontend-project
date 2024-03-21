import React from 'react'
import { useState } from 'react';
import '../Register/Register.css'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { Link } from 'react-router-dom';
import { collection, addDoc, setDoc, doc, } from "firebase/firestore";
function Login({ setLoginEmail }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [closepage, setClosepage] = useState(true)
  const navigate = useNavigate();
  // const firebaseConfig = {
  //   apiKey: "AIzaSyARxzjctp9xGO4GlHD_CBdrf116YI5Ci6c",
  //   authDomain: "frontend-project-user-database.firebaseapp.com",
  //   projectId: "frontend-project-user-database",
  //   storageBucket: "frontend-project-user-database.appspot.com",
  //   messagingSenderId: "879037419636",
  //   appId: "1:879037419636:web:c51dc57220852d7d504121",
  // };
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  const closeOnClick = () => {
    setClosepage(false)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = {
        email: userCredential.user.email,
        password: password,
      }
      console.log("User login:", user);
      setLoginEmail(email);
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error:", errorCode, errorMessage);
    };
  }
  return (
    <div>
      {closepage && <form class="box " onSubmit={handleSubmit} >
        <button className='close-button' onClick={closeOnClick}>X</button>
        <div class="field">
          <label htmlFor='email'>Email</label>
          <input className="input is-fullwidth" type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div class="field">
          <label htmlFor='password'>Password</label>
          <input className="input is-fullwidth" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button class="button is-link" type='submit'>Sign in</button>
      </form>}
    </div>
  )
}

export default Login