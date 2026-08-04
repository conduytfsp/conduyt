import React, { useState, useEffect } from "react";
import logo from "../../../public/assets/Conduyt-blue.png"
import clientlogo from "../../../public/assets/Conduyt-green.png"
import { NavLink } from "react-router-dom";
import Button from '../ui/Button'
import { Bell,Mail, User} from "lucide-react";
import SearchBar from '../ui/SearchBar';

function FreelancerNav() {
   const [isClientMode, setIsClientMode] = useState(
    document.documentElement.dataset.mode === "client"
  );
useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsClientMode(
        document.documentElement.dataset.mode === "client"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => observer.disconnect();
  }, []);

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
            
            <li>
          <NavLink to="/">
            <img
              src={isClientMode ? clientlogo : logo}
              alt="logo"
              className="w-30 object-contain"
            />
          </NavLink>
        </li>
              <li className="hover:text-freelancer-primary transition cursor-pointer [[data-mode='client']_&]:hover:text-primary">
                <NavLink to={"/findWork"}>Find Work</NavLink>
              </li>

              <li className="hover:text-freelancer-primary transition cursor-pointer [[data-mode='client']_&]:hover:text-primary">
               <NavLink to={"/aiFeatures"}>AI Features</NavLink>
              </li>

              <li className="hover:text-freelancer-primary transition cursor-pointer [[data-mode='client']_&]:hover:text-primary">
              <NavLink to={"/about"}>About</NavLink>
              </li>

         </ul>

         <SearchBar />
           <div className='flex gap-3 mx-5' >
            {/* <Button as={NavLink} to="/roleSwitch" className="whitespace-normal text-center leading-tight">
             Smart Role Switch
            </Button> */}

             <NavLink to="/notifications">
                <Bell className="w-6 h-6  hover:text-freelancer-primary [[data-mode='client']_&]:hover:text-primary" />
             </NavLink>
             <NavLink to="/message">
               <Mail className="w-6 h-6  hover:text-freelancer-primary [[data-mode='client']_&]:hover:text-primary" />
             </NavLink>

              <NavLink to="/freelancerdashboard">
                  <User className="w-6 h-6  hover:text-freelancer-primary [[data-mode='client']_&]:hover:text-primary" />
             </NavLink>
    </div>
    </nav>
    
)

}

export default FreelancerNav