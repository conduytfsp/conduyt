import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; // <-- Added Router hooks
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Calendar,
  User,
  Edit,
  FileText,
  Briefcase,
} from "lucide-react";

export default function ClientProfileView() {
  const navigate = useNavigate();

  // Grab shared data directly from the Dashboard Layout Wrapper
  const { profileData, companyData, clientType } = useOutletContext();

  const fullName = `${profileData?.firstName || "Client User"} ${
      profileData?.middleName ? profileData.middleName + " " : ""
  }${profileData?.lastName || ""}`.trim();

  const isCompany = clientType === "company" || clientType === "COMPANY";

  return (
      <div className="max-w-4xl space-y-6">

        {/* ================= HEADER BAR ================= */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              View your personal and organizational details.
            </p>
          </div>
          <button
              // 🚀 ROUTER FIX: Navigate directly to the edit form
              onClick={() => navigate("/dashboard/personal")}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#09D66D] hover:text-[#09D66D] hover:bg-gray-50 active:scale-95"
          >
            <Edit size={16} /> Edit Details
          </button>
        </div>

        {/* ================= MAIN PROFILE CARD ================= */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

          {/* TOP SECTION: Avatar & Titles */}
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">

            {/* AVATAR */}
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 p-1">
              {profileData?.profilePic ? (
                  <img
                      src={profileData.profilePic}
                      alt={fullName}
                      className="h-full w-full rounded-full object-cover"
                  />
              ) : (
                  <div className="flex h-full w-full rounded-full items-center justify-center bg-gray-100 text-gray-400">
                    <User size={32} />
                  </div>
              )}
            </div>

            {/* NAME & BADGES */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                <span className="flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#09D66D]">
                <CheckCircle2 size={12} strokeWidth={2.5} /> Verified
              </span>
              </div>

              <p className="text-sm font-medium text-gray-600">
                {isCompany ? companyData?.companyName || "Company Account" : "Individual Client"}
              </p>

              <p className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-gray-400">
                <Calendar size={14} className="text-gray-400" /> Member since 2026
              </p>
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* ================= DETAILS GRID ================= */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

            {/* PERSONAL INFO COLUMN */}
            <div className="space-y-5">
              <h3 className="border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                Personal Information
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Email Address</p>
                    <p className="font-medium text-gray-900">{profileData?.email || "No email provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Account Type</p>
                    <p className="font-medium text-gray-900 capitalize">{clientType || "Individual"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPANY INFO COLUMN (Only shows if they are a company) */}
            {isCompany && (
                <div className="space-y-5">
                  <h3 className="border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Company Information
                  </h3>

                  <div className="space-y-4 text-sm">

                    {/* Company Name */}
                    <div className="flex items-start gap-3">
                      <Building2 size={18} className="mt-0.5 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-400">Organization</p>
                        <p className="font-medium text-gray-900">{companyData?.companyName || "Not set"}</p>
                      </div>
                    </div>

                    {/* Company Role */}
                    {companyData?.companyRole && (
                        <div className="flex items-start gap-3">
                          <Briefcase size={18} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-400">Your Role</p>
                            <p className="font-medium text-gray-900">{companyData.companyRole}</p>
                          </div>
                        </div>
                    )}

                    {/* Website */}
                    {companyData?.companyWebsite && (
                        <div className="flex items-start gap-3">
                          <Globe size={18} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-400">Website</p>
                            <a
                                href={companyData.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-[#09D66D] hover:underline cursor-pointer"
                            >
                              {companyData.companyWebsite}
                            </a>
                          </div>
                        </div>
                    )}

                    {/* Contact Number */}
                    {companyData?.contactNumber && (
                        <div className="flex items-start gap-3">
                          <Phone size={18} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-400">Contact Number</p>
                            <p className="font-medium text-gray-900">{companyData.contactNumber}</p>
                          </div>
                        </div>
                    )}

                    {/* GSTIN */}
                    {companyData?.gstin && (
                        <div className="flex items-start gap-3">
                          <FileText size={18} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-400">Tax ID (GSTIN)</p>
                            <p className="font-mono font-medium text-gray-900">{companyData.gstin}</p>
                          </div>
                        </div>
                    )}

                    {/* Address */}
                    {companyData?.companyAddress && (
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-400">Headquarters</p>
                            <p className="font-medium text-gray-900 leading-snug">{companyData.companyAddress}</p>
                          </div>
                        </div>
                    )}

                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}