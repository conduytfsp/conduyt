import "tailwindcss";
import React from 'react'
import Button from "../ui/Button.jsx";
import logo from "../../../public/assets/Conduyt-blue.png"
import { NavLink } from "react-router-dom";


function PublicNavbar() {

   return (
   <nav
          className="
            flex
            items-center
            justify-between
             w-full
           bg-white/60
             backdrop-blur-lg
             border-b
           border-gray-200
             sticky
             top-0
             z-50
             
             ">


       <ul className="
                flex
                gap-8
                items-center
                mx-5
                ">
            
            <li><NavLink to={'/'}>
                <img src={logo} alt="logo" className="w-30 object-contain " ></img>
                </NavLink>
             </li>
              <li className="hover:text-freelancer-primary transition cursor-pointer">
                <NavLink to={"/FindWork"}>Find Work</NavLink>
              </li>

              <li className="hover:text-freelancer-primary transition cursor-pointer">
               <NavLink to={"/AIFeatures"}>AI Features</NavLink>
              </li>

              {/* <li className="hover:text-freelancer-primary transition cursor-pointer">
              <NavLink to={"/Pricing"}>Pricing</NavLink>
              </li> */}

              <li className="hover:text-freelancer-primary transition cursor-pointer">
              <NavLink to={"/About"}>About</NavLink>
              </li>

         </ul>
        <Button className="mx-5 p-3"> <NavLink to={"/Login"}>SignUp/Login</NavLink>
        </Button>
    </nav>
)

}

export default PublicNavbar;