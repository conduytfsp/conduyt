import React from 'react'
import logo from "../../../public/assets/Conduyt-blue.png"
import { NavLink } from "react-router-dom";
import Button from '../ui/Button'
import { Bell,Mail, User} from "lucide-react";
import SearchBar from '../ui/SearchBar';

function FreelancerNav() {

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
                <NavLink to={"/findWork"}>Find Work</NavLink>
              </li>

              <li className="hover:text-freelancer-primary transition cursor-pointer">
               <NavLink to={"/aiFeatures"}>AI Features</NavLink>
              </li>

              <li className="hover:text-freelancer-primary transition cursor-pointer">
              <NavLink to={"/about"}>About</NavLink>
              </li>

         </ul>

         <SearchBar />
           <div className='flex gap-3 mx-5' >
            <Button as={NavLink} to="/roleSwitch" className="whitespace-normal text-center leading-tight">
             Smart Role Switch
            </Button>

             <NavLink to="/notifications">
                <Bell className="w-6 h-6  hover:text-freelancer-primary" />
             </NavLink>
             <NavLink to="/message">
               <Mail className="w-6 h-6  hover:text-freelancer-primary" />
             </NavLink>

              <NavLink to="/freelancerProfile">
                  <User className="w-6 h-6  hover:text-freelancer-primary" />
             </NavLink>
    </div>
    </nav>
    
)

}

export default FreelancerNav