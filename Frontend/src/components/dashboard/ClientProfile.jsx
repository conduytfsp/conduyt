import React from "react";
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

export default function ClientProfileView({
  profileData,
  companyData,
  clientType,
  onEditProfile,
}) {
  const fullName = `${profileData?.firstName || "Client"} ${
    profileData?.middleName ? profileData.middleName + " " : ""
  }${profileData?.lastName || ""}`.trim();

  return (
    <div className="max-w-4xl space-y-6">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#141b2b]">Profile</h1>
         
        </div>
        <button
          onClick={onEditProfile}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Edit size={16} /> Edit Details
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="space-y-6 rounded-xl border border-[#09D66D]/20 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            {/* AVATAR */}
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#09D66D] bg-[#09D66D]/10 text-[#09D66D]">
              {profileData?.profilePic ? (
                <img
                  src={profileData.profilePic}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={40} />
              )}
            </div>

            {/* NAME & ROLE */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#141b2b]">{fullName}</h2>
                <span className="flex items-center gap-1 rounded-full bg-[#09D66D]/15 px-2.5 py-0.5 text-xs font-semibold text-[#09D66D]">
                  <CheckCircle2 size={13} /> Verified Client
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {clientType === "company" || clientType === "COMPANY"
                  ? companyData?.companyName || "Company Account"
                  : "Individual Client"}
              </p>
              <p className="flex items-center gap-1 pt-1 text-xs text-gray-400">
                <Calendar size={13} className="text-[#09D66D]" /> Member since 2026
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* PERSONAL INFO */}
          <div className="space-y-4">
            <h3 className="border-b border-gray-100 pb-2 text-base font-bold text-[#141b2b]">
              Personal Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={16} className="text-[#09D66D]" />
                <span>{profileData?.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <User size={16} className="text-[#09D66D]" />
                <span className="capitalize">
                  Account Type: <strong>{clientType || "Individual"}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* COMPANY INFO (IF COMPANY TYPE) */}
          {(clientType === "company" || clientType === "COMPANY") && (
            <div className="space-y-4">
              <h3 className="border-b border-gray-100 pb-2 text-base font-bold text-[#141b2b]">
                Company Information
              </h3>
              <div className="space-y-3 text-sm">
                {/* Company Name */}
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 size={16} className="text-[#09D66D]" />
                  <span>{companyData?.companyName || "Not set"}</span>
                </div>

                {/* Company Role */}
                {companyData?.companyRole && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase size={16} className="text-[#09D66D]" />
                    <span>Role: {companyData.companyRole}</span>
                  </div>
                )}

                {/* Website */}
                {companyData?.companyWebsite && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Globe size={16} className="text-[#09D66D]" />
                    <a
                      href={companyData.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#09D66D] hover:underline"
                    >
                      {companyData.companyWebsite}
                    </a>
                  </div>
                )}

                {/* Contact Number */}
                {companyData?.contactNumber && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={16} className="text-[#09D66D]" />
                    <span>{companyData.contactNumber}</span>
                  </div>
                )}

                {/* GSTIN */}
                {companyData?.gstin && (
                  <div className="flex items-center gap-3 text-gray-600 font-mono">
                    <FileText size={16} className="text-[#09D66D]" />
                    <span>GSTIN: {companyData.gstin}</span>
                  </div>
                )}

                {/* Address */}
                {companyData?.companyAddress && (
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin size={16} className="mt-0.5 text-[#09D66D]" />
                    <span>{companyData.companyAddress}</span>
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