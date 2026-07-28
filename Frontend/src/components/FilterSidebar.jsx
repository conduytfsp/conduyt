import { Search, BadgeIndianRupee, Sparkles } from "lucide-react";

function FilterSidebar({
  skill,
  setSkill,
  budget,
  setBudget,
  match,
  setMatch,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8">

      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Filters
      </h2>

      {/* Skill */}

      <div className="mb-6">

        <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">

          <Search size={18} />

          Skill

        </label>

        <input
          type="text"
          placeholder="React, Java, Python..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Budget */}

      <div className="mb-6">

        <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">

          <BadgeIndianRupee size={18} />

          Minimum Budget

        </label>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Budgets</option>
          <option value="5000">₹5,000+</option>
          <option value="10000">₹10,000+</option>
          <option value="25000">₹25,000+</option>
          <option value="50000">₹50,000+</option>
        </select>

      </div>

      {/* AI Match */}

      <div className="mb-6">

        <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">

          <Sparkles size={18} />

          AI Match

        </label>

        <select
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Matches</option>
          <option value="80">80%+</option>
          <option value="90">90%+</option>
          <option value="95">95%+</option>
        </select>

      </div>

      {/* Reset Button */}

      <button
        onClick={() => {
          setSkill("");
          setBudget("");
          setMatch("");
        }}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 text-white py-3 rounded-full font-semibold transition-all duration-300"
      >
        Reset Filters
      </button>

    </div>
  );
}

export default FilterSidebar;