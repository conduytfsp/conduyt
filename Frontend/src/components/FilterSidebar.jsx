function FilterSidebar({
  skill,
  setSkill,
  budget,
  setBudget,
  match,
  setMatch,
}) {
  const resetFilters = () => {
    setSkill("");
    setBudget("");
    setMatch("");
  };

  const skills = [
    "React",
    "JavaScript",
    "Python",
    "Java",
    "Spring Boot",
    "Node.js",
    "MongoDB",
    "Tailwind",
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#D7EAF5] shadow-lg p-6">

      {/* Header */}

      <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1798D7] to-[#4372B5] bg-clip-text text-transparent mb-6">
        Filters
      </h2>

      {/* Skill */}

      <div className="mb-6">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🔍 Skill
        </label>

        <div className="flex flex-wrap gap-2">

          {skills.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setSkill(skill === item ? "" : item)
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                skill === item
                  ? "bg-[#1798D7] text-white border-[#1798D7]"
                  : "bg-[#EAF6FC] text-[#4372B5] border-[#C8E4F2] hover:bg-[#D8F0FA]"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* Minimum Budget */}

      <div className="mb-6">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          💰 Minimum Budget
        </label>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border border-[#B9D9EA] rounded-xl px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1798D7]"
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

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ✨ AI Match
        </label>

        <div className="flex flex-wrap gap-2">

          {[
            { label: "All", value: "" },
            { label: "80%+", value: "80" },
            { label: "90%+", value: "90" },
            { label: "95%+", value: "95" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setMatch(item.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                match === item.value
                  ? "bg-[#4372B5] text-white border-[#4372B5]"
                  : "bg-[#EEF3F9] text-[#4372B5] border-[#D2DFEA] hover:bg-[#E2EBF4]"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>

      </div>

      {/* Reset */}

      <button
        type="button"
        onClick={resetFilters}
        className="w-full bg-gradient-to-r from-[#1798D7] to-[#4372B5] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
      >
        Reset Filters
      </button>

    </div>
  );
}

export default FilterSidebar;