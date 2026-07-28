import { Search } from "lucide-react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-blue-100 p-5 mb-6">

      <div className="relative">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={22}
        />

        <input
          type="text"
          placeholder="Search jobs, companies or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />

      </div>

    </div>
  );
}

export default SearchBar;