import React from 'react'
import logo from '../pictures/logo-no-background.png'
import { MdTrolley } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import './Navbar.css';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  const handlelogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <div className='navbar-bg'>
        <div className='navbar-row'>
          <Link to=''>
            <img className='logo' src={logo} alt='logo' width={70} height={70} />
          </Link>
          {currentUser && <a href='/' className='navbar-end' >
            <button
              style={{ borderRadius: 10, width: 100, height: 55, color: 'darkcyan', backgroundColor: 'yellow' }}
            >ข้อมูลคำสั่งซื้อลูกค้า</button>
          </a>}
          <h1 className='navbar-end'><MdTrolley size={50} /></h1>
          <a href='/Cart' style={{ color: 'white', margin: 15 }}>ตะกร้าสินค้า </a>
          <a href='/customerdetail' style={{ margin: 10, color: 'white' }}>ดูคำสั่งซื้อ | บัญชีของฉัน</a>
          {currentUser ? (
            <div className='login-show'>
              <h1 className='user-margin'>{currentUser.email}</h1>
              <Link to='/'>
                <button className='button is-normal is-success is-rounded' onClick={handlelogout}>Log out</button>
              </Link>
            </div>
          ) : (
            <div>
              <a href='/register'>
                <button className='button is-normal is-success is-rounded'> Register </button>
              </a>
              <a href='/login'>
                <button className='button is-normal is-success is-rounded'><FaRegUser className='icon-margin' /> Login  </button>
              </a>
            </div>
          )}
          {/* <div>
       {currentUser ? <p>User is signed in</p> : <p>User is signed out</p>}
    </div> */}
        </div>
      </div>
    </div>
  )
}

export default Navbar