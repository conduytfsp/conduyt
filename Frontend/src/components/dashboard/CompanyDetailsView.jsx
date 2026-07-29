import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
// Import your custom axios hook
import { useAxiosInstance } from "../../config/axiosConfig";

export default function CompanyDetailsView({ companyData, setCompanyData }) {
  const axiosInstance = useAxiosInstance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. LOCAL FORM STATE: Stores typing locally without updating header/parent state in real-time
  const [localFormData, setLocalFormData] = useState({
    companyName: companyData?.companyName || "",
    companyRole: companyData?.companyRole || "",
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
        companyRole: companyData.companyRole || "",
        companyWebsite: companyData.companyWebsite || "",
        contactNumber: companyData.contactNumber || "",
        gstin: companyData.gstin || "",
        companyAddress: companyData.companyAddress || "",
      });
    }
  }, [companyData]);

  // Updates ONLY local state while typing
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
      // -------------------------------------------------------------
      // TEMPORARY MOCK API CALL (Simulates network delay while backend is offline)
      // -------------------------------------------------------------
      await new Promise((resolve) => setTimeout(resolve, 800));

      /* 
      // REAL AXIOS CALL (Uncomment when your backend server is connected):
      const response = await axiosInstance.put("/client/company", localFormData);
      */
      // -------------------------------------------------------------

      // 2. SAVE CHANGES: Only now do we update the parent state (header updates now!)
      if (typeof setCompanyData === "function") {
        setCompanyData(localFormData);
      }

      alert("Company details updated successfully!");
    } catch (error) {
      console.error("Failed to update company details:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update company details. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-xl border border-[#09D66D]/20 bg-white p-6 shadow-sm md:p-8">
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="rounded-lg bg-[#09D66D]/10 p-2 text-[#09D66D]">
          <Building2 size={22} />
        </div>
        <h2 className="text-xl font-bold text-[#141b2b]">Organization Profile</h2>
      </div>
      <p className="mb-6 text-sm text-gray-500">
        Manage your official company credentials, role, and business tax details.
      </p>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
        {/* Company Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            autoComplete="off"
            required
            placeholder="Enter company name"
            value={localFormData.companyName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#09D66D]"
          />
        </div>

        {/* Website & Phone */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Website URL *
            </label>
            <input
              type="url"
              name="companyWebsite"
              autoComplete="off"
              required
              placeholder="https://example.com"
              value={localFormData.companyWebsite}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#09D66D]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contact Number *
            </label>
            <input
              type="tel"
              name="contactNumber"
              autoComplete="off"
              required
              placeholder="+91 9876543210"
              value={localFormData.contactNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#09D66D]"
            />
          </div>
        </div>

        {/* GSTIN */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            GSTIN *
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
            className="w-full rounded-lg border border-gray-300 p-2.5 font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-[#09D66D]"
          />
        </div>

        {/* Address */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Company Address *
          </label>
          <textarea
            rows="3"
            name="companyAddress"
            autoComplete="off"
            required
            placeholder="Enter office address..."
            value={localFormData.companyAddress}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#09D66D]"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}