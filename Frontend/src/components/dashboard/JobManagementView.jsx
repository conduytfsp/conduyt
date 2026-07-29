import React from "react";
import { Plus } from "lucide-react";

export default function JobManagementView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Active Postings</h2>
        <button className="bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Job Title</th>
              <th className="p-4 font-semibold text-gray-600">Applicants</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="p-4 font-medium">Senior React Developer</td>
              <td className="p-4">42 applications</td>
              <td className="p-4"><span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">Active</span></td>
              <td className="p-4"><button className="text-[#00628e] hover:underline font-medium">Manage</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}