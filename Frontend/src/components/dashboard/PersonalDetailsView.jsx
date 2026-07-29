import React, { useState } from "react";
import { Upload, Lock, AlertCircle, User, Building2, X } from "lucide-react";
// Import your custom axios hook
import { useAxiosInstance } from "../../config/axiosConfig";

export default function PersonalDetailsView({
  clientType,
  setClientType,
  profileData,
  setProfileData,
}) {
  const axiosInstance = useAxiosInstance();

  // Local form state initialized from current saved profileData
  const [formData, setFormData] = useState({
    firstName: profileData?.firstName || "",
    middleName: profileData?.middleName || "",
    lastName: profileData?.lastName || "",
    profilePic: profileData?.profilePic || null,
  });

  const [fileError, setFileError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert uploaded image to Base64 string for preview & upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFileError("File size exceeds 2MB.");
        return;
      }
      setFileError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded picture
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profilePic: null }));
    setFileError("");
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");
    setSaveSuccess(false);

    try {
      // TEMPORARY MOCK API CALL (Simulates 1s network delay until backend is ready)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      /* 
      // REAL AXIOS CALL (Uncomment when your friend gives you the backend URL):
      const payload = {
        clientType,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        profilePic: formData.profilePic || "",
      };
      await axiosInstance.put("/user/profile", payload);
      */

      // Update global/parent state on success
      if (typeof setProfileData === "function") {
        setProfileData((prev) => ({
          ...prev,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          profilePic: formData.profilePic,
        }));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      console.error("Failed to update profile details:", error);
      setApiError("Failed to save profile changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 rounded-xl border border-[#09D66D]/20 bg-white p-6 shadow-sm md:p-8">
      <div>
        <h2 className="mb-1 text-xl font-bold text-[#141b2b]">
          Personal Information
        </h2>
        <p className="text-sm text-gray-500">
          Manage your account category and personal profile details.
        </p>
      </div>

      {/* Account Category Selector */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Account Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setClientType("company")}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              clientType === "company"
                ? "border-[#09D66D] bg-[#09D66D]/5 ring-2 ring-[#09D66D]/20"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div
              className={`rounded-lg p-2.5 ${
                clientType === "company"
                  ? "bg-[#09D66D] text-white"
                  : "bg-[#09D66D]/10 text-[#09D66D]"
              }`}
            >
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Company / Organization
              </p>
              <p className="text-xs text-gray-500">
                Hiring on behalf of a company
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setClientType("individual")}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              clientType === "individual"
                ? "border-[#09D66D] bg-[#09D66D]/5 ring-2 ring-[#09D66D]/20"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div
              className={`rounded-lg p-2.5 ${
                clientType === "individual"
                  ? "bg-[#09D66D] text-white"
                  : "bg-[#09D66D]/10 text-[#09D66D]"
              }`}
            >
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Individual / Solo Client
              </p>
              <p className="text-xs text-gray-500">
                Hiring freelancers for personal projects
              </p>
            </div>
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
        {/* Profile Picture Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-[#09D66D] bg-[#09D66D]/10 text-[#09D66D]">
              {formData.profilePic ? (
                <>
                  <img
                    src={formData.profilePic}
                    alt="Profile Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <User size={36} />
              )}
            </div>

            <div>
              <label
                htmlFor="profile-pic-input"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#09D66D]/30 bg-[#e6fbf2] px-4 py-2 text-sm font-medium text-[#09D66D] transition-colors hover:bg-[#d0f7e5]"
              >
                <Upload size={16} /> Choose Image
              </label>
              <input
                id="profile-pic-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="mt-2 text-xs text-gray-500">Max file size: 2MB</p>
              {fileError && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle size={14} /> {fileError}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Name Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              autoComplete="off"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#09D66D]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              autoComplete="off"
              placeholder="Enter middle name"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#09D66D]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              autoComplete="off"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#09D66D]"
            />
          </div>
        </div>

        {/* Read-Only Email */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Lock size={12} /> Cannot be changed
            </span>
          </div>
          <input
            type="email"
            value={profileData?.email || ""}
            disabled
            className="w-full select-none rounded-lg border border-gray-200 bg-gray-100 p-2.5 text-sm text-gray-500 cursor-not-allowed outline-none"
          />
        </div>

        {/* Error Feedback */}
        {apiError && (
          <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
            <AlertCircle size={14} /> {apiError}
          </p>
        )}

        {/* Success Feedback */}
        {saveSuccess && (
          <p className="text-xs font-semibold text-[#09D66D]">
            ✓ Personal details saved and profile updated across dashboard!
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving Changes..." : "Save & Update Profile"}
        </button>
      </form>
    </div>
  );
}