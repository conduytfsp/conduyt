import React, { useState, useEffect } from "react";
import { Building2, Save, Loader2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "@/config/axiosConfig";

export default function CompanyDetailsView() {
  const axiosInstance = useAxiosInstance();

  // Grab shared company data directly from the layout context
  const { companyData, setCompanyData } = useOutletContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. LOCAL FORM STATE (Removed companyRole)
  const [localFormData, setLocalFormData] = useState({
    companyName: companyData?.companyName || "",
    companyWebsite: companyData?.companyWebsite || "",
    contactNumber: companyData?.contactNumber || "",
    gstin: companyData?.gstin || "",
    companyAddress: companyData?.companyAddress || "",
  });

  // Keep local state synced if companyData is loaded externally
  useEffect(() => {
    if (companyData) {
      setLocalFormData({
        companyName: companyData.companyName || "",
        companyWebsite: companyData.companyWebsite || "",
        contactNumber: companyData.contactNumber || "",
        gstin: companyData.gstin || "",
        companyAddress: companyData.companyAddress || "",
      });
    }
  }, [companyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Changed to POST to support backend upsert (create or update) logic
      const response = await axiosInstance.post("/api/clients/company", localFormData);

      // SAVE CHANGES: Update the parent state so headers/sidebars reflect the change
      if (typeof setCompanyData === "function") {
        setCompanyData(response.data?.data || response.data || localFormData);
      }

      toast.success("Company details saved successfully!");
    } catch (error) {
      console.error("Failed to save company details:", error);
      toast.error(
          error.response?.data?.message || "Failed to save company details. Please try again."
      );
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
            <Building2 size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Organization Profile</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your official company credentials and business tax details.
            </p>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">

          {/* Row 1: Company Name & Contact Number */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  name="companyName"
                  autoComplete="off"
                  required
                  placeholder="e.g. Acme Technologies"
                  value={localFormData.companyName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                  type="tel"
                  name="contactNumber"
                  autoComplete="off"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={localFormData.contactNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
              />
            </div>
          </div>

          {/* Row 2: Website URL & GSTIN */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Website URL <span className="text-red-500">*</span>
              </label>
              <input
                  type="url"
                  name="companyWebsite"
                  autoComplete="off"
                  required
                  placeholder="https://example.com"
                  value={localFormData.companyWebsite}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Tax ID (GSTIN) <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  name="gstin"
                  autoComplete="new-password"
                  required
                  maxLength={15}
                  placeholder="Enter 15-digit GSTIN"
                  value={localFormData.gstin}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-mono text-sm uppercase text-gray-900 outline-none transition-all focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Headquarters Address <span className="text-red-500">*</span>
            </label>
            <textarea
                rows="3"
                name="companyAddress"
                autoComplete="off"
                required
                placeholder="Enter official office address..."
                value={localFormData.companyAddress}
                onChange={handleChange}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
            />
          </div>

          {/* ================= ACTION BUTTON ================= */}
          <div className="flex justify-end pt-4">
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#09D66D] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#06934A] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
              ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
              )}
            </button>
          </div>
        </form>
      </div>
  );
}