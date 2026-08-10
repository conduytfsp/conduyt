import { MapPin, Clock, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function JobCard({ job, setSelectedJob }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => setSelectedJob(job)}
      className="bg-white rounded-2xl border border-green-100 shadow-md p-5 mb-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >

      {/* Top Section */}

      <div className="flex justify-between items-start gap-4">

        <div className="flex-1">

          {/* Job Title */}

          <h2 className="text-xl font-bold text-[#087F4E]">
            {job.title}
          </h2>


          {/* Client */}

          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/client-profile/${job.clientId}`);
            }}
            className="flex items-center gap-3 mt-3 cursor-pointer"
          >

            {/* Client Avatar */}

            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white flex items-center justify-center font-bold">
              {job.company.charAt(0)}
            </div>


            {/* Client Name */}

            <div>

              <p className="font-semibold text-gray-700 hover:text-[#09D66D]">
                {job.company}
              </p>

              <p className="text-xs text-gray-500">
                ✓ Verified Client
              </p>

            </div>

          </div>

        </div>


        {/* AI Match */}

        <div className="bg-green-50 text-[#09D66D] px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
          ✨ {job.match} Match
        </div>

      </div>


      {/* Description */}

      <p className="mt-4 text-gray-600 text-sm leading-6">
        {job.description}
      </p>


      {/* Job Information */}

      <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">

        <span className="font-medium">
          💰 {job.budget}
        </span>

        <span className="flex items-center gap-1">
          <MapPin size={15} />
          {job.type}
        </span>

        <span className="flex items-center gap-1">
          <Clock size={15} />
          {job.posted}
        </span>

      </div>


      {/* Skills */}

      <div className="flex flex-wrap gap-2 mt-4">

        {job.skills.map((skill, index) => (

          <span
            key={index}
            className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-xs font-medium"
          >
            {skill}
          </span>

        ))}

      </div>


      {/* Bottom Buttons */}

      <div className="flex justify-between items-center mt-5">


        {/* Save */}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-2 text-[#087F4E] hover:text-[#09D66D] font-medium transition"
        >
          <Heart size={18} />
          Save
        </button>


        {/* Apply Now */}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedJob(job);
          }}
          className="bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          Apply Now →
        </button>

      </div>

    </div>
  );
}

export default JobCard;