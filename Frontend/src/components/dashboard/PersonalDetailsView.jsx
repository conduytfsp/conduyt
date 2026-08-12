import React, { useState, useEffect } from "react";
import { Upload, Lock, User, Building2, X, Save, Loader2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "@/config/axiosConfig";

export default function PersonalDetailsView() {
  const axiosInstance = useAxiosInstance();

  // Grab shared state directly from layout context
  const { clientType, setClientType, profileData, setProfileData } = useOutletContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Form Data for Text Fields
  const [formData, setFormData] = useState({
    firstName: profileData?.firstName || "",
    middleName: profileData?.middleName || "",
    lastName: profileData?.lastName || "",
  });

  // 2. Separate State for the Image
  const [selectedFile, setSelectedFile] = useState(null); // The actual file to send to backend
  const [imagePreview, setImagePreview] = useState(profileData?.profilePic || null); // URL for UI preview

  // Sync state if profileData loads after the component mounts
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        middleName: profileData.middleName || "",
        lastName: profileData.lastName || "",
      });
      if (!selectedFile) {
        setImagePreview(profileData.profilePic || null);
      }
    }
  }, [profileData, selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB.");
        return;
      }
      setSelectedFile(file); // Store the actual file
      setImagePreview(URL.createObjectURL(file)); // Generate local preview URL
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ================= MULTIPART FORM DATA =================
    const payload = new FormData();

    // A. Attach the DTO as a JSON Blob (Separate Entity)
    const dtoData = {
      clientType,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
    };
    payload.append("dto", new Blob([JSON.stringify(dtoData)], { type: "application/json" }));

    // B. Attach the Image File (Separate Entity)
    if (selectedFile) {
      payload.append("file", selectedFile);
    }

    try {
      // Note: We use put/post with multipart/form-data header
      const res = await axiosInstance.put("/api/clients/profile", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming backend returns the updated profile URL in res.data.profilePic
      const updatedProfilePic = res.data?.data?.profilePic || imagePreview;

      if (typeof setProfileData === "function") {
        setProfileData((prev) => ({
          ...prev,
          ...formData,
          profilePic: updatedProfilePic
        }));
      }

      toast.success("Personal details updated successfully!");
    } catch (error) {
      console.warn("Backend /api/clients/profile failed or not updated yet.");
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
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
                {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Profile Preview" className="h-full w-full object-cover" />
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