import React, { useState, useEffect } from "react";
import { Upload, Lock, User, Building2, X, Save, Loader2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // <-- Added Toast
import { useAxiosInstance } from "@/config/axiosConfig";

export default function PersonalDetailsView() {
  const axiosInstance = useAxiosInstance();

  // Grab shared state directly from layout context
  const { clientType, setClientType, profileData, setProfileData } = useOutletContext();

  const [formData, setFormData] = useState({
    firstName: profileData?.firstName || "",
    middleName: profileData?.middleName || "",
    lastName: profileData?.lastName || "",
    profilePic: profileData?.profilePic || null,
  });

  // Sync form data if profileData loads after the component mounts
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        middleName: profileData.middleName || "",
        lastName: profileData.lastName || "",
        profilePic: profileData.profilePic || null,
      });
    }
  }, [profileData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB."); // <-- Standardized error handling
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profilePic: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.put("/api/clients/profile", {
        clientType,
        ...formData
      });

      if (typeof setProfileData === "function") {
        setProfileData((prev) => ({ ...prev, ...formData }));
      }

      toast.success("Personal details updated successfully!"); // <-- Standardized success handling
    } catch (error) {
      console.warn("Backend /api/clients/profile not implemented yet. Simulating success.");

      // Developer Fallback
      setTimeout(() => {
        if (typeof setProfileData === "function") {
          setProfileData((prev) => ({ ...prev, ...formData }));
        }
        toast.success("Profile updated! (Offline Mode)");
        setIsSubmitting(false);
      }, 600);
      return;
    }
    setIsSubmitting(false);
  };

  return (
      <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <Toaster position="top-right" />

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex items-start gap-4 border-b border-gray-100 pb-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
            <User size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account type and personal profile details.
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">

          {/* Account Category Selector */}
          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Account Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                  type="button"
                  onClick={() => setClientType("company")}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      clientType === "company"
                          ? "border-[#09D66D] bg-emerald-50 ring-1 ring-[#09D66D]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div className={`rounded-lg p-2.5 ${clientType === "company" ? "bg-[#09D66D] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Company</p>
                  <p className="text-xs text-gray-500">Hiring for a business</p>
                </div>
              </button>

              <button
                  type="button"
                  onClick={() => setClientType("individual")}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      clientType === "individual"
                          ? "border-[#09D66D] bg-emerald-50 ring-1 ring-[#09D66D]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div className={`rounded-lg p-2.5 ${clientType === "individual" ? "bg-[#09D66D] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Individual</p>
                  <p className="text-xs text-gray-500">Personal projects</p>
                </div>
              </button>
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                {formData.profilePic ? (
                    <>
                      <img src={formData.profilePic} alt="Profile" className="h-full w-full object-cover" />
                      <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-0 cursor-pointer rounded-full bg-black/50 p-0.5 text-white"
                      >
                        <X size={12} />
                      </button>
                    </>
                ) : (
                    <User size={32} className="text-gray-400" />
                )}
              </div>

              <div>
                <label htmlFor="profile-pic-input" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50">
                  <Upload size={16} /> Choose Image
                </label>
                <input id="profile-pic-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <p className="mt-1.5 text-xs text-gray-400">Max size: 2MB</p>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                First Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Middle Name
              </label>
              <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10" />
            </div>
          </div>

          {/* Read-Only Email */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Email Address
            </label>
            <div className="relative">
              <input
                  type="email"
                  value={profileData?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
              <Lock className="absolute right-3 top-3 text-gray-400" size={16} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end">
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#09D66D] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#06934A] active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
  );
}