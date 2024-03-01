import React from 'react'
import logo from '../pictures/logo-no-background.png'
import { MdTrolley } from "react-icons/md";
import './Navbar.css'

function Navbar() {

  return (
    <div>
      <div className='navbar-bg'>
      <div className='navbar-row'>
        <img className='logo' src={logo} alt='logo' width={70} height={70} />
        <h1 className='navbar-end'><MdTrolley size={50}/>  </h1>
        <h1 >ตะกร้าสินค้า | บัญชีของฉัน</h1>
      </div>
      </div>
    </div> 
  )
}

export default Navbar