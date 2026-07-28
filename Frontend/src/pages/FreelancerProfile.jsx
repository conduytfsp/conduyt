import React from 'react'
import FreelancerNav from "../components/layout/FreelancerNav.jsx"
import { useState } from "react";
import Button from '../components/ui/Button.jsx';
import { NavLink } from "react-router-dom";

function FreelancerProfile() {

  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [profileData, setProfileData] = useState({
    profilePicture: null,
    coverPicture: null,
  });

  const freelancer = {
  name: "Elena Rodriguez",
  title: "Full Stack Developer",
  skills: ["React", "Node.js", "AWS"],
  location: "Kolkata, India",
  experience: "5 Years Experience",
  rating: "4.9",
};


  const handleImageChange = (e) => {
    const { name, files } = e.target;

    const selectedFile = files[0];

    if (!selectedFile) return;


    setProfileData((prev) => ({
      ...prev,
      [name]: selectedFile,
    }));


    const preview = URL.createObjectURL(selectedFile);


    if (name === "profilePicture") {
      setProfilePreview(preview);
    }

    if (name === "coverPicture") {
      setCoverPreview(preview);
    }
  };


  return (
    <>
     <div className="flex min-h-screen flex-col">
    <FreelancerNav/>
    <main className="flex-1">
      {/* Cover Inane */}
      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-200">

        {coverPreview ? (
       <img
        src={coverPreview}
        alt="Cover Preview"
        className="h-full w-full object-cover"
      />
  ) : (
    <div className="flex h-full items-center justify-center text-gray-400">
      Add Cover Image
    </div>
  )}


  <label className="
      absolute 
      right-5 
      bottom-5 
      flex 
      h-10 
      w-10 
      cursor-pointer 
      items-center 
      justify-center 
      rounded-full 
      bg-white 
      shadow-lg
      hover:bg-gray-100
  ">
    📷

    <input
      type="file"
      name="coverPicture"
      accept="image/*"
      onChange={handleImageChange}
      className="absolute inset-0 cursor-pointer opacity-0"
    />

  </label>

</div>

{/* {Profile img} */}
<div className="relative mt-8 rounded-2xl bg-white p-8 shadow-lg">

  <div className="flex flex-col items-center gap-8 md:flex-row">

    {/* LEFT SIDE - PROFILE IMAGE */}
    <div className="relative shrink-0">

      <div
        className="
          group
          relative
          h-52
          w-52
          cursor-pointer
          overflow-hidden
          rounded-full
          border-4
          border-white
          bg-gray-100
          shadow-xl
        "
      >

        {profilePreview ? (
          <img
            src={profilePreview}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <span className="text-5xl">📷</span>
            <span className="mt-2 text-sm">
              Upload
            </span>
          </div>
        )}

        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleImageChange}
          className="
            absolute
            inset-0
            cursor-pointer
            opacity-0
          "
        />

      </div>


    </div>


    {/* RIGHT SIDE - USER INFORMATION */}
    <div className="flex-1 text-center md:text-left">

  <h1 className="text-3xl font-bold text-[#141b2b]">
    {freelancer.name}
  </h1>


  <p className="mt-2 text-lg text-gray-600">
    {freelancer.title} • {freelancer.skills.join(" • ")}
  </p>


  <div className="my-5 flex flex-wrap justify-center gap-5 text-sm text-gray-500 md:justify-start">

    <span>
       {freelancer.location}
    </span>

    <span>
       {freelancer.experience}
    </span>

    <span>
       {freelancer.rating}
    </span>

  </div>


      <Button as={NavLink} to="/EditProfile">
        Edit Profile
      </Button>

    </div>

  </div>

</div>
</main>
</div>
    </>
  );
}
export default FreelancerProfile