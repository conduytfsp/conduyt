import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import JobList from "../components/JobList";
import JobModal from "../components/JobModal";
import ApplyToJobModal from "../components/ApplyToJobModal";
import Navbar from "../components/Navbar.jsx";
import jobs from "../data/jobs";

function FindWork() {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [budget, setBudget] = useState("");
  const [match, setMatch] = useState("");
  const [sortBy, setSortBy] = useState("highest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
   const [applyingJob, setApplyingJob] = useState(null);

  const jobsPerPage = 2;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, skill, budget, match, sortBy]);

  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) =>
        s.toLowerCase().includes(search.toLowerCase())
      );

    const skillMatch =
      skill === "" || job.skills.includes(skill);

    const budgetMatch =
      budget === "" ||
      parseInt(job.budget.replace(/[^0-9]/g, "")) >= Number(budget);

    const aiMatch =
      match === "" ||
      parseInt(job.match) >= Number(match);

    return (
      searchMatch &&
      skillMatch &&
      budgetMatch &&
      aiMatch
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "highest") {
      return parseInt(b.match) - parseInt(a.match);
    }

    if (sortBy === "lowest") {
      return parseInt(a.match) - parseInt(b.match);
    }

    return 0;
  });

  const lastJobIndex = currentPage * jobsPerPage;
  const firstJobIndex = lastJobIndex - jobsPerPage;

  const currentJobs = sortedJobs.slice(
    firstJobIndex,
    lastJobIndex
  );

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 px-6 py-5">

      {/* Hero Section */}

      {/* Hero Section */}

<div className="mb-5">

  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
    ✨ AI Powered Freelance Marketplace
  </div>

  <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
    Find Your Next Project
  </h4>

  <p className="text-gray-500 text-base mt-2 max-w-2xl leading-7">
    Discover verified freelance projects from trusted clients.
    Search smarter with AI-powered recommendations and find work
    that matches your skills, experience and preferred budget.
  </p>

</div>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">

        {/* Sidebar */}

        <div className="lg:col-span-1">

          <FilterSidebar
            skill={skill}
            setSkill={setSkill}
            budget={budget}
            setBudget={setBudget}
            match={match}
            setMatch={setMatch}
          />

        </div>

        {/* Job Section */}

        <div className="lg:col-span-3 bg-white rounded-3xl border border-blue-100 shadow-lg p-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-8">

            <div className="text-gray-500 font-medium">

              Showing <span className="text-blue-600">{currentJobs.length}</span> of{" "}
<span className="text-blue-600">{filteredJobs.length}</span> freelance projects
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Recommended Jobs
            </h2>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-blue-200 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="highest">
                AI Match Highest
              </option>

              <option value="lowest">
                AI Match Lowest
              </option>

            </select>

          </div>

          <JobList
            jobs={currentJobs}
            setSelectedJob={setSelectedJob}
          />

          {/* Pagination */}

          <div className="flex justify-center items-center gap-5 mt-10">

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <span className="font-semibold text-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-semibold disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>

      <JobModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={() => {
     setApplyingJob(selectedJob);
     setSelectedJob(null);
   }}
  />
        <ApplyToJobModal
         job={applyingJob}
        onClose={() => setApplyingJob(null)}
 />
      
    </div>
    </>
  );
}

export default FindWork;