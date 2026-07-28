import { X } from "lucide-react";

function JobModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[650px] max-w-[95%] rounded-3xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">

          <div>
            <h2 className="text-3xl font-bold text-blue-700">
              {job.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {job.company}
            </p>

            <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ✔ Verified Employer
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 hover:rotate-90 transition-all duration-300"
          >
            <X size={28} />
          </button>

        </div>

        {/* AI Match */}
        <div className="mt-5">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            🤖 AI Match: {job.match}
          </span>
        </div>

        {/* Job Info */}
        <div className="mt-6 space-y-3 text-gray-700">

          <p>💰 <strong>Budget:</strong> {job.budget}</p>

          <p>📍 <strong>Type:</strong> {job.type}</p>

          <p>🕒 <strong>Posted:</strong> {job.posted}</p>

        </div>

        {/* Description */}
        <div className="mt-6">

          <h3 className="text-xl font-semibold mb-2">
            Job Description
          </h3>

          <p className="text-gray-700 leading-7">
            {job.description}
          </p>

        </div>

        {/* Skills */}
        <div className="mt-6">

          <h3 className="text-xl font-semibold mb-3">
            Required Skills
          </h3>

          <div className="flex flex-wrap gap-3">

            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Close
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl"
          >
            🚀 Apply Now
          </button>

        </div>

      </div>
    </div>
  );
}

export default JobModal;