import React, { useState, useEffect } from "react";
import { ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
// Import your custom axios hook
import { useAxiosInstance } from "../../config/axiosConfig";

export default function SecurityView() {
  const axiosInstance = useAxiosInstance();

  // Password Reset State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // 2FA State (Defaults to false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isToggling2FA, setIsToggling2FA] = useState(false);
  const [isLoading2FAStatus, setIsLoading2FAStatus] = useState(true);

  // FETCH CURRENT 2FA STATUS ON MOUNT
  useEffect(() => {
    let isMounted = true;

    const fetch2FAStatus = async () => {
      try {
        // TEMPORARY MOCK DELAY (Simulates network check)
        await new Promise((resolve) => setTimeout(resolve, 300));

        /* 
        // REAL AXIOS CALL (Uncomment when backend API is live):
        const response = await axiosInstance.get("/user/2fa/status");
        if (isMounted) {
          setIs2FAEnabled(Boolean(response.data?.is2FAEnabled));
        }
        */
      } catch (error) {
        console.error("Failed to load 2FA status:", error);
      } finally {
        if (isMounted) {
          setIsLoading2FAStatus(false);
        }
      }
    };

    fetch2FAStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Password Reset via Axios
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSubmittingPassword(true);

    try {
      // TEMPORARY MOCK DELAY
      await new Promise((resolve) => setTimeout(resolve, 800));

      /* 
      // REAL AXIOS CALL:
      const payload = { currentPassword, newPassword };
      await axiosInstance.post("/user/reset-password", payload);
      */

      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password reset failed:", error);
      setPasswordError(
        error.response?.data?.message ||
          "Failed to reset password. Please check your current password."
      );
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Toggle 2FA Handler via Axios
  const handle2FAToggle = async () => {
    const nextState = !is2FAEnabled;
    setIsToggling2FA(true);

    try {
      // TEMPORARY MOCK DELAY
      await new Promise((resolve) => setTimeout(resolve, 500));

      /* 
      // REAL AXIOS CALL:
      await axiosInstance.post("/user/2fa/toggle", { enabled: nextState });
      */

      setIs2FAEnabled(nextState);
      if (nextState) {
        alert("Two-Factor Authentication is now ENABLED. You will receive an OTP prompt on login.");
      } else {
        alert("Two-Factor Authentication has been DISABLED.");
      }
    } catch (error) {
      console.error("Failed to toggle 2FA:", error);
      alert(
        error.response?.data?.message ||
          "Failed to change 2FA setting. Please try again."
      );
    } finally {
      setIsToggling2FA(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#141b2b]">Security Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account password and extra authentication safeguards.
        </p>
      </header>

      {/* ================= 1. RESET PASSWORD SECTION ================= */}
      <div className="space-y-4 rounded-xl border border-[#09D66D]/20 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
          <div className="rounded-lg bg-[#09D66D]/10 p-2.5 text-[#09D66D]">
            <KeyRound size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#141b2b]">Reset Password</h2>
            <p className="text-xs text-gray-500">
              Update your account password regularly to keep your hiring portal secure.
            </p>
          </div>
        </div>

        <form className="space-y-4 pt-2" onSubmit={handlePasswordReset} autoComplete="off">
          {/* Current Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#09D66D]"
            />
          </div>

          {/* New & Confirm Passwords */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#09D66D]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#09D66D]"
              />
            </div>
          </div>

          {/* Error & Success Messages */}
          {passwordError && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <AlertCircle size={14} /> {passwordError}
            </p>
          )}

          {passwordSuccess && (
            <p className="flex items-center gap-1 text-xs font-semibold text-[#09D66D]">
              <CheckCircle2 size={14} /> {passwordSuccess}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingPassword ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= 2. TWO-FACTOR AUTHENTICATION (2FA) ================= */}
      <div className="rounded-xl border border-[#09D66D]/20 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#09D66D]/10 p-2.5 text-[#09D66D]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#141b2b]">
                Two-Factor Authentication (2FA)
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Add an extra layer of security using an authenticator app or SMS code.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            disabled={isToggling2FA || isLoading2FAStatus}
            onClick={handle2FAToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              is2FAEnabled ? "bg-[#09D66D]" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={is2FAEnabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                is2FAEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}