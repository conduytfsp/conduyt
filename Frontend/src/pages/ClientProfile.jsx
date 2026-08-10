import React from "react";
import {
  Building2,
  MapPin,
  CalendarDays,
  Briefcase,
  Star,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import clients from "../data/clients";

function ClientProfile() {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const client = clients.find(
    (c) => c.id === Number(clientId)
  );

  // If client does not exist
  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-slate-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Client not found
        </h2>

        <button
          onClick={() => navigate("/find-work")}
          className="mt-5 bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white px-5 py-2.5 rounded-xl font-semibold"
        >
          Back to Find Work
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 px-6 py-8">

      {/* Back Button */}

      <button
        onClick={() => navigate("/find-work")}
        className="flex items-center gap-2 text-[#09D66D] font-medium mb-6 hover:text-[#4AB7B2] transition"
      >
        <ArrowLeft size={18} />
        Back to Find Work
      </button>

      {/* Profile Card */}

      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">

          {/* Cover */}

          <div className="h-40 bg-gradient-to-r from-[#09D66D] to-[#4AB7B2]">
          </div>

          {/* Profile Information */}

          <div className="px-8 pb-8">

            {/* Profile Picture */}

            <div className="-mt-16 mb-5">

              <div className="w-28 h-28 rounded-full bg-white p-2 shadow-lg">

                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#09D66D] to-[#4AB7B2] flex items-center justify-center text-white text-4xl font-bold">
                  {client.company.charAt(0)}
                </div>

              </div>

            </div>

            {/* Name */}

            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-3xl font-bold text-gray-800">
                    {client.company}
                  </h1>

                  {client.verified && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Verified Client
                    </span>
                  )}

                </div>

                <p className="text-gray-500 mt-2">
                  {client.role}
                </p>

              </div>

              <button
                className="flex items-center gap-2 bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition"
              >
                <Mail size={18} />
                Contact Client
              </button>

            </div>

            {/* Basic Details */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              <div className="flex items-center gap-3 text-gray-600">
                <MapPin
                  className="text-[#09D66D]"
                  size={20}
                />
                <span>{client.location}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <CalendarDays
                  className="text-[#09D66D]"
                  size={20}
                />
                <span>
                  Member since {client.memberSince}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase
                  className="text-[#09D66D]"
                  size={20}
                />
                <span>
                  {client.jobsPosted} Jobs Posted
                </span>
              </div>

            </div>

            {/* About */}

            <div className="mt-10">

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                About the Client
              </h2>

              <p className="text-gray-600 leading-7">
                {client.about}
              </p>

            </div>

            {/* Client Statistics */}

            <div className="mt-8">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Client Statistics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* Rating */}

                <div className="bg-green-50 rounded-2xl p-5 text-center">

                  <h3 className="text-2xl font-bold text-[#09D66D]">
                    {client.rating}
                  </h3>

                  <div className="flex justify-center mt-1">

                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />

                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Client Rating
                  </p>

                </div>

                {/* Jobs Posted */}

                <div className="bg-green-50 rounded-2xl p-5 text-center">

                  <h3 className="text-2xl font-bold text-[#09D66D]">
                    {client.jobsPosted}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Jobs Posted
                  </p>

                </div>

                {/* Jobs Completed */}

                <div className="bg-green-50 rounded-2xl p-5 text-center">

                  <h3 className="text-2xl font-bold text-[#09D66D]">
                    {client.jobsCompleted}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Jobs Completed
                  </p>

                </div>

                {/* Hire Success */}

                <div className="bg-green-50 rounded-2xl p-5 text-center">

                  <h3 className="text-2xl font-bold text-[#09D66D]">
                    {client.hireSuccess}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Hire Success
                  </p>

                </div>

              </div>

            </div>

            {/* Areas of Expertise */}

            <div className="mt-10">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Areas of Expertise
              </h2>

              <div className="flex flex-wrap gap-2">

                {client.expertise.map((skill, index) => (

                  <span
                    key={index}
                    className="bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            </div>

            {/* Posted Jobs */}

            <div className="mt-10">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Jobs Posted by this Client
              </h2>

              <div className="border border-green-100 rounded-2xl p-5 hover:shadow-md transition">

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="font-bold text-lg text-gray-800">
                      Jobs from {client.company}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Explore projects posted by this client.
                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Active
                  </span>

                </div>

                <div className="flex gap-5 mt-4 text-sm text-gray-500">

                  <span>
                    {client.jobsPosted} Jobs
                  </span>

                  <span>
                    {client.hireSuccess} Hire Success
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ClientProfile;