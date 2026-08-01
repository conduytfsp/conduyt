import React, { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  BriefcaseBusiness,
  CalendarDays,
  Users,
  User,
  Mail,
} from "lucide-react";

export default function JobManagementView() {
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem("clientJobs");

    if (savedJobs) {
      return JSON.parse(savedJobs);
    }

    return [
      {
        id: 1,
        title: "Senior React Developer",
        budget: "₹60,000",
        budgetType: "Fixed",
        postedDate: "01 Aug 2026",
        status: "Open",
        proposals: 42,
        freelancer: null,
      },
      {
        id: 2,
        title: "UI/UX Designer",
        budget: "₹40,000",
        budgetType: "Fixed",
        postedDate: "28 Jul 2026",
        status: "In Progress",
        proposals: 18,
        freelancer: {
          name: "Rahul Sharma",
          email: "rahul@example.com",
        },
      },
      {
        id: 3,
        title: "Backend API Development",
        budget: "₹75,000",
        budgetType: "Fixed",
        postedDate: "20 Jul 2026",
        status: "Completed",
        proposals: 27,
        freelancer: {
          name: "Priya Das",
          email: "priya@example.com",
        },
      },
      {
        id: 4,
        title: "Mobile App Development",
        budget: "₹90,000",
        budgetType: "Fixed",
        postedDate: "15 Jul 2026",
        status: "Cancelled",
        proposals: 12,
        freelancer: null,
      },
    ];
  });

  const [showPostForm, setShowPostForm] = useState(false);

  const [newJob, setNewJob] = useState({
    title: "",
    budget: "",
    budgetType: "Fixed",
  });

  // Save jobs locally so they don't disappear after refresh
  useEffect(() => {
    localStorage.setItem("clientJobs", JSON.stringify(jobs));
  }, [jobs]);

  // --------------------------------
  // POST NEW JOB
  // --------------------------------
  const handlePostJob = (e) => {
    e.preventDefault();

    if (!newJob.title || !newJob.budget) {
      alert("Please enter job title and budget.");
      return;
    }

    const job = {
      id: Date.now(),
      title: newJob.title,
      budget: `₹${newJob.budget}`,
      budgetType: newJob.budgetType,
      postedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Open",
      proposals: 0,
      freelancer: null,
    };

    setJobs([job, ...jobs]);

    setNewJob({
      title: "",
      budget: "",
      budgetType: "Fixed",
    });

    setShowPostForm(false);
  };

  // --------------------------------
  // CLOSE JOB
  // --------------------------------
  const closeJob = (id) => {
    setJobs(
      jobs.map((job) =>
        job.id === id
          ? { ...job, status: "Cancelled" }
          : job
      )
    );
  };

  // --------------------------------
  // MARK AS COMPLETED
  // --------------------------------
  const markCompleted = (id) => {
    setJobs(
      jobs.map((job) =>
        job.id === id
          ? { ...job, status: "Completed" }
          : job
      )
    );
  };

  // --------------------------------
  // VIEW DETAILS
  // --------------------------------
  const viewDetails = (job) => {
    alert(
      `Job: ${job.title}\n\nBudget: ${job.budget}\nType: ${job.budgetType}\nPosted: ${job.postedDate}\nStatus: ${job.status}`
    );
  };

  // --------------------------------
  // STATUS STYLE
  // --------------------------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* --------------------------------
          HEADER
      -------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness
              size={22}
              className="text-[#09D66D]"
            />

            <h2 className="text-2xl font-bold text-gray-800">
              Jobs I Have Posted
            </h2>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Manage your hiring pipeline and track active work.
          </p>
        </div>

        <button
          onClick={() => setShowPostForm(true)}
          className="
            bg-gradient-to-r
            from-[#09D66D]
            to-[#4AB7B2]
            hover:opacity-90
            text-white
            font-semibold
            px-5
            py-2.5
            rounded-lg
            text-sm
            flex
            items-center
            justify-center
            gap-2
            transition
          "
        >
          <Plus size={17} />
          Post New Job
        </button>

      </div>

      {/* --------------------------------
          POST JOB FORM
      -------------------------------- */}
      {showPostForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

          <h3 className="text-lg font-bold text-gray-800 mb-5">
            Post a New Job
          </h3>

          <form
            onSubmit={handlePostJob}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
  Job Title <span className="text-red-500">*</span>
</label>

              <input
                type="text"
                placeholder="e.g. React Developer"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    title: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-3
                  py-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#09D66D]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
  Budget <span className="text-red-500">*</span>
</label>

              <input
                type="number"
                placeholder="50000"
                value={newJob.budget}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    budget: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-3
                  py-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#09D66D]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
  Budget Type <span className="text-red-500">*</span>
</label>

              <select
                value={newJob.budgetType}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    budgetType: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-3
                  py-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#09D66D]
                "
              >
                <option value="Fixed">Fixed</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>

            <div className="md:col-span-3 flex gap-3">

              <button
                type="submit"
                className="
                  bg-gradient-to-r
                  from-[#09D66D]
                  to-[#4AB7B2]
                  text-white
                  px-5
                  py-2
                  rounded-lg
                  font-medium
                "
              >
                Post Job
              </button>

              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="
                  border
                  border-gray-300
                  px-5
                  py-2
                  rounded-lg
                  text-gray-600
                "
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* --------------------------------
          JOB CARDS
      -------------------------------- */}
      <div className="space-y-4">

        {jobs.map((job) => (

          <div
            key={job.id}
            className="
              bg-white
              rounded-xl
              border
              border-gray-200
              shadow-sm
              p-5
              hover:shadow-md
              transition
            "
          >

            {/* TOP */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <h3 className="text-lg font-bold text-gray-800">
                    {job.title}
                  </h3>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${getStatusStyle(job.status)}
                    `}
                  >
                    {job.status}
                  </span>

                </div>

                {/* JOB DETAILS */}

                <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-500">

                  <div className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={15} />
                    {job.budget}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <FileText size={15} />
                    {job.budgetType}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    {job.postedDate}
                  </div>

                  {job.status === "Open" && (
                    <div className="flex items-center gap-1.5">
                      <Users size={15} />
                      {job.proposals} proposals
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* --------------------------------
                POST-HIRE INFORMATION
            -------------------------------- */}

            {(job.status === "In Progress" ||
              job.status === "Completed") &&
              job.freelancer && (

                <div className="
                  mt-5
                  border-t
                  border-gray-100
                  pt-4
                  bg-gray-50
                  rounded-lg
                  p-4
                ">

                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Hired Freelancer
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    <div className="
                      w-10
                      h-10
                      rounded-full
                      bg-gradient-to-r
                      from-[#09D66D]
                      to-[#4AB7B2]
                      flex
                      items-center
                      justify-center
                      text-white
                      font-bold
                    ">
                      {job.freelancer.name.charAt(0)}
                    </div>

                    <div>

                      <div className="flex items-center gap-2">
                        <User size={15} className="text-gray-500" />

                        <p className="font-semibold text-gray-800">
                          {job.freelancer.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-1">

                        <Mail size={14} className="text-gray-500" />

                        <p className="text-sm text-gray-500">
                          {job.freelancer.email}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              )}

            {/* --------------------------------
                ACTIONS
            -------------------------------- */}

            <div className="
              mt-5
              pt-4
              border-t
              border-gray-100
              flex
              flex-wrap
              gap-3
            ">

              {/* OPEN */}

              {job.status === "Open" && (
                <>
                  <button
                    onClick={() =>
                      alert(
                        `Opening proposals for ${job.title}`
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      text-[#00628e]
                      hover:text-[#004f70]
                      font-medium
                      text-sm
                    "
                  >
                    <Eye size={16} />
                    View Proposals
                  </button>

                  <button
                    onClick={() => closeJob(job.id)}
                    className="
                      flex
                      items-center
                      gap-2
                      text-red-600
                      hover:text-red-700
                      font-medium
                      text-sm
                    "
                  >
                    <XCircle size={16} />
                    Close Job
                  </button>
                </>
              )}

              {/* IN PROGRESS */}

              {job.status === "In Progress" && (
                <button
                  onClick={() => markCompleted(job.id)}
                  className="
                    flex
                    items-center
                    gap-2
                    text-green-600
                    hover:text-green-700
                    font-semibold
                    text-sm
                  "
                >
                  <CheckCircle size={16} />
                  Mark as Completed
                </button>
              )}

              {/* COMPLETED */}

              {job.status === "Completed" && (
                <button
                  onClick={() => viewDetails(job)}
                  className="
                    flex
                    items-center
                    gap-2
                    text-[#00628e]
                    hover:text-[#004f70]
                    font-medium
                    text-sm
                  "
                >
                  <Eye size={16} />
                  View Details
                </button>
              )}

              {/* CANCELLED */}

              {job.status === "Cancelled" && (
                <span className="text-sm text-gray-400">
                  This job posting has been cancelled.
                </span>
              )}

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY STATE */}

      {jobs.length === 0 && (
        <div className="
          bg-white
          border
          border-gray-200
          rounded-xl
          p-10
          text-center
        ">

          <BriefcaseBusiness
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="font-semibold text-gray-700 mt-3">
            No jobs posted yet
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Click "Post New Job" to create your first job.
          </p>

        </div>
      )}

    </div>
  );
}