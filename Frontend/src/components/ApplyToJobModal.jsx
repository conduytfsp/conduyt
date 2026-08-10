import { useState } from "react";
import { X, ArrowLeft, FileText, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from '@/config/axiosConfig';
import { freelancerApi } from "../api/freelancerApi";
import { seedProfile, seedPortfolio } from "../lib/mockData";

/**
 * ApplyToJobModal
 * ------------------
 * A separate popup for the pitch-only apply flow. Kept independent of
 * JobModal.jsx on purpose — it doesn't modify or depend on that file's
 * internals, just its `job` shape. Open it from wherever "Apply Now" is
 * clicked (e.g. FindWork.jsx), pass the same `job` object.
 */
function ApplyToJobModal({ job, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["freelancer", "profile"],
    queryFn: () => freelancerApi.getProfile(axios),
    placeholderData: seedProfile,
    enabled: !!job,
  });
  const { data: portfolio } = useQuery({
    queryKey: ["freelancer", "portfolio"],
    queryFn: () => freelancerApi.getPortfolio(axios),
    placeholderData: seedPortfolio,
    enabled: !!job,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { coverLetter: "" } });

  const applyMutation = useMutation({
    mutationFn: (coverLetter) => freelancerApi.applyToJob(axios, job.id, coverLetter),
    onSuccess: () => {
      queryClient.setQueryData(["freelancer", "jobs"], (prev) =>
        Array.isArray(prev) ? prev.map((j) => (j.id === job.id ? { ...j, applied: true } : j)) : prev
      );
      setSubmitted(true);
    },
  });

  if (!job) return null;

  const close = () => {
    reset();
    setSubmitted(false);
    onClose();
  };

  const initials = `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase();
  const hasResume = !!portfolio?.resumeFileName;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={close}
    >
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#D7EAF5]"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Application sent</h2>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Your pitch, profile, and résumé were sent to {job.company} for "{job.title}". You'll hear back through
              Conduyt if they want to move forward.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-6 bg-gradient-to-r from-[#1798D7] to-[#4372B5] text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">Applying to</p>
                <h2 className="text-lg font-bold text-gray-800">{job.title}</h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#EAF6FC] hover:text-[#1798D7] transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {/* Sent automatically */}
              <div className="bg-[#EAF6FC] rounded-2xl p-4 space-y-3 border border-[#D7EAF5]">
                <p className="text-xs font-bold uppercase tracking-wide text-[#4372B5]">Sent automatically</p>

                <div className="flex items-center gap-3">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.firstName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#D7EAF5] text-[#1798D7] flex items-center justify-center font-bold text-sm">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      Applying as {profile?.firstName} {profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{profile?.professionalTitle}</p>
                  </div>
                </div>

                <div className="h-px bg-[#D7EAF5]" />

                <div className="flex items-center gap-2 text-xs">
                  {hasResume ? (
                    <>
                      <FileText size={15} className="text-[#1798D7] shrink-0" />
                      <span className="text-gray-600 truncate">
                        <span className="font-medium text-gray-800">{portfolio.resumeFileName}</span> will be attached automatically
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                      <span className="text-gray-600">
                        No résumé on file — add one in Portfolio before applying, if you can.
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Your skills and profile summary are shared automatically — no need to repeat them below.
                </p>
              </div>

              {/* Pitch form */}
              <form
                onSubmit={handleSubmit((values) => applyMutation.mutate(values.coverLetter))}
                className="mt-5"
              >
                <label htmlFor="coverLetter" className="text-sm font-semibold text-gray-800">
                  Your pitch
                </label>
                <textarea
                  id="coverLetter"
                  rows={6}
                  placeholder="Why are you a good fit for this job? Mention your approach and any directly relevant experience…"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1798D7] focus:border-transparent"
                  {...register("coverLetter", {
                    required: "Write a short pitch before submitting",
                    minLength: { value: 40, message: "Give the client a bit more to go on (40+ characters)" },
                  })}
                />
                {errors.coverLetter && (
                  <p className="text-xs text-red-500 mt-1">{errors.coverLetter.message}</p>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={close}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applyMutation.isPending}
                    className="bg-gradient-to-r from-[#1798D7] to-[#4372B5] text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {applyMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                    {applyMutation.isPending ? "Sending…" : "Send application"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ApplyToJobModal;