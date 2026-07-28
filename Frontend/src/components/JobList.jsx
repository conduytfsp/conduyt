import JobCard from "./JobCard";
import { SearchX } from "lucide-react";

function JobList({ jobs, setSelectedJob }) {
  return (
    <div>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            setSelectedJob={setSelectedJob}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20">

          <SearchX
            size={70}
            className="text-blue-300 mb-5"
          />

          <h2 className="text-2xl font-bold text-gray-700">
            No Jobs Found
          </h2>

          <p className="text-gray-500 mt-2 text-center">
            Try changing your search or filter options.
          </p>

        </div>
      )}
    </div>
  );
}

export default JobList;