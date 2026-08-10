import { X, MapPin, Clock, CheckCircle } from "lucide-react";

function JobModal({ job, onClose ,onApply }) {
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#D7EAF5]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}

        <div className="p-6 border-b border-gray-100">

          <div className="flex justify-between items-start gap-4">

            <div>

              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#E1F3FA] text-[#1798D7] px-3 py-1 rounded-full text-xs font-semibold">
                  Freelance Project
                </span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Verified Client
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1798D7] to-[#4372B5] bg-clip-text text-transparent">
                {job.title}
              </h2>

              <p className="text-gray-600 mt-2 font-medium">
                {job.company}
              </p>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#EAF6FC] hover:text-[#1798D7] transition"
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* Job Information */}

        <div className="p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-[#EAF6FC] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">
                AI Compatibility
              </p>

              <p className="text-xl font-bold text-[#1798D7]">
                ✨ {job.match}
              </p>
            </div>

            <div className="bg-[#EEF3F9] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">
                Project Budget
              </p>

              <p className="text-xl font-bold text-[#4372B5]">
                {job.budget}
              </p>
            </div>

          </div>

          {/* Details */}

          <div className="flex flex-wrap gap-5 mt-5 text-sm text-gray-600">

            <span className="flex items-center gap-2">
              <MapPin size={17} className="text-[#1798D7]" />
              {job.type}
            </span>

            <span className="flex items-center gap-2">
              <Clock size={17} className="text-[#1798D7]" />
              {job.posted}
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle size={17} className="text-green-500" />
              Verified Client
            </span>

          </div>

          {/* Description */}

          <div className="mt-7">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              About the Project
            </h3>

            <p className="text-gray-600 leading-7">
              {job.description}
            </p>

          </div>

          {/* Skills */}

          <div className="mt-6">

            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Required Skills
            </h3>

            <div className="flex flex-wrap gap-2">

              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#EAF6FC] text-[#4372B5] border border-[#C8E4F2] px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}

            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onApply}
              className="bg-gradient-to-r from-[#1798D7] to-[#4372B5] text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              🚀 Apply Now
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default JobModal;