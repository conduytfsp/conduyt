import { MapPin, Clock, Heart } from "lucide-react";

function JobCard({ job, setSelectedJob }) {
  return (
    <div
      onClick={() => setSelectedJob(job)}
      className="bg-white rounded-2xl border border-[#D7EAF5] shadow-md p-5 mb-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >

      {/* Top Section */}

      <div className="flex justify-between items-start gap-4">

        <div className="flex-1">

          <h2 className="text-xl font-bold text-[#4372B5]">
            {job.title}
          </h2>

          {/* Client */}

          <div className="flex items-center gap-3 mt-3">

            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1798D7] to-[#4372B5] text-white flex items-center justify-center font-bold">
              {job.company.charAt(0)}
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                {job.company}
              </p>

              <p className="text-xs text-gray-500">
                ✓ Verified Client
              </p>
            </div>

          </div>

        </div>

        {/* AI Match */}

        <div className="bg-[#E1F3FA] text-[#1798D7] px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
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
            className="bg-[#EAF6FC] text-[#4372B5] border border-[#C8E4F2] px-3 py-1 rounded-full text-xs font-medium"
          >
            {skill}
          </span>

        ))}

      </div>

      {/* Bottom Buttons */}

      <div className="flex justify-between items-center mt-5">

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-2 text-[#4372B5] hover:text-[#1798D7] font-medium transition"
        >
          <Heart size={18} />
          Save
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedJob(job);
          }}
          className="bg-gradient-to-r from-[#1798D7] to-[#4372B5] text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          Apply Now →
        </button>

      </div>

    </div>
  );
}

export default JobCard;