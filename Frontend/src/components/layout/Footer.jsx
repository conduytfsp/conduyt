import React from 'react'
import logo from "../../../public/assets/Conduyt-blue.png"
import { NavLink } from "react-router-dom";
function Footer() {
  return (

      <footer className="w-full bg-blue-100 py-6 mt-10">
        <div className='fexl justify-between gap-3 mx-3'>
          <img src={logo} alt='logo' className="w-30 object-contain"></img>
          <p className='border-t border-gray-700 mt-6 pt-4 text-sm text-white"'>&copy; {new Date().getFullYear()} Conduyt. All rights reserved.</p>
        </div>
        {/* <nav>
          <ul>
           <li className="hover:text-freelancer-primary transition cursor-pointer">
               <NavLink to={"/TermsofService"}>Terms of Service</NavLink>
              </li>
              <li className="hover:text-freelancer-primary transition cursor-pointer">
               <NavLink to={"/Privacy"}>Privacy Policy</NavLink>
              </li>
              <li className="hover:text-freelancer-primary transition cursor-pointer">
               <NavLink to={"/Contact"}>Contact</NavLink>
              </li>
          </ul>
        </nav> */}
      </footer>
  )
}

export default Footer