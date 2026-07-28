import React from "react";
import { Search } from "lucide-react";


function SearchBar(){

     return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />

      <input
        type="text"
        placeholder="Search"
        className="
          w-full
          rounded-full
          border border-gray-300
          bg-white
          py-3
          pl-12
          pr-4
          text-sm
          text-gray-700
          placeholder:text-gray-400
          shadow-sm
          transition-all
          duration-200
          focus:border-blue-600
          focus:ring-4
          focus:ring-blue-100
          focus:outline-none
        "
      />
    </div>
  );
}

export default SearchBar;