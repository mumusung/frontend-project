import './App.css';
import Navbar from './Navbar/Navbar.js';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import { UserProvider } from './Usercontext/Usercontext';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Category from './Addcategory/Category';
import Product from './Product/Product.js';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import Cart from './Cart/Cart.js'
import Customerdetail from './Customerdetail/Customerdetail.js';


function App() {
  const [loginEmail, setLoginEmail] = useState(null)


  const firebaseConfig = {
    apiKey: "AIzaSyARxzjctp9xGO4GlHD_CBdrf116YI5Ci6c",
    authDomain: "frontend-project-user-database.firebaseapp.com",
    projectId: "frontend-project-user-database",
    storageBucket: "frontend-project-user-database.appspot.com",
    messagingSenderId: "879037419636",
    appId: "1:879037419636:web:c51dc57220852d7d504121",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(auth.currentUser);
  }, []);
  return (
    <BrowserRouter>
      <UserProvider>
        <Navbar loginEmail={loginEmail} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/customerdetail' element={<Customerdetail />}></Route>
          <Route path='/Cart' element={<Cart />}></Route>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setLoginEmail={setLoginEmail} />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <div className='App'>
        <Category />
        <Product />
      </div>
    </div>
  );
}
export default App;
