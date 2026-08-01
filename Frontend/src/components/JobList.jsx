import JobCard from "./JobCard";

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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No freelance projects found.
          </p>

          <p className="text-gray-400 text-sm mt-2">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default JobList;