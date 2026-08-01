import { Search, X } from "lucide-react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="bg-white border border-[#D7EAF5] rounded-2xl shadow-md p-4">
      
      <div className="flex items-center gap-3">

        {/* Search Icon */}

        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E1F3FA] text-[#1798D7]">
          <Search size={20} />
        </div>

        {/* Search Input */}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, clients or skills..."
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />

        {/* Clear Button */}

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1798D7] hover:bg-[#EAF6FC] transition"
          >
            <X size={18} />
          </button>
        )}

      </div>

      {/* Small helper text */}

      <p className="text-xs text-gray-400 mt-2 ml-1">
        Search by project title, client name or required skill
      </p>

    </div>
  );
}

export default SearchBar;