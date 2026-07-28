import { Building2, MapPin, Clock, Heart } from "lucide-react";
function JobCard({ job, setSelectedJob }) {
  return (
    <div
  onClick={() => setSelectedJob(job)}
  className="bg-white rounded-3xl shadow-md p-7 mb-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-blue-100"
>

      <div className="flex justify-between">

        <div>

          <h2 className="text-2xl font-bold text-blue-700">
            <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold">
    ⭐ Featured
</span>
            {job.title}
          </h2>

          <div className="flex items-center gap-3 mt-2">

  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">

    {job.company.charAt(0)}

  </div>

  <div>

    <p className="font-semibold text-gray-700">
      {job.company}
    </p>

    <p className="text-sm text-gray-500">
      Verified Employer
    </p>

  </div>

</div>
        </div>

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

  🤖 {job.match} Match

</div>

      </div>

      <p className="mt-4 text-gray-700">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-5 mt-5 text-gray-600">

  <span className="font-medium">
    💰 {job.budget}
  </span>

  <span className="flex items-center gap-1">

    <MapPin size={16} />

    {job.type}

  </span>

  <span className="flex items-center gap-1">

    <Clock size={16} />

    {job.posted}

  </span>

</div>
      <div className="flex flex-wrap gap-3 mt-5">

        {job.skills.map((skill,index)=>(

          <span
            key={index}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
          >
            {skill}
          </span>

        ))}

      </div>

      <div className="flex justify-between items-center mt-7">

  <button
  onClick={(e) => {
    e.stopPropagation();
    alert("Job Saved!");
  }}
  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
>
  <Heart size={20} />
  Save Job
</button>
  <button
className="bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition-all duration-300 text-white px-7 py-3 rounded-full font-semibold">
    🚀 View Details
  </button>

</div>
    </div>
  );
}

export default JobCard;