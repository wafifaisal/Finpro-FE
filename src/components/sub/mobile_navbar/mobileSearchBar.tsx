import { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { SearchFields, SearchValues } from "@/constants/constants";

const MobileSearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeField, setActiveField] = useState<number | null>(null);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    where: "",
    checkIn: "",
    checkOut: "",
    who: "1 guest",
  });

  const isSearchDisabled = Object.values(searchValues).some(
    (value) => value.trim() === ""
  );

  const handleSearch = () => {
    console.log("Search initiated with values:", searchValues);
  };

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 z-50 p-4 ">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-white shadow-lg border border-gray-200 rounded-full py-3 px-4 flex items-center justify-center"
        >
          <div className="flex items-center space-x-3">
            <Search size={20} className="text-gray-600" />
            <span className="text-gray-600">Where to?</span>
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="fixed bg-white z-50 overflow-y-auto w-full">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setIsExpanded(false)}>
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold">Search</h2>
              <span></span>
            </div>

            <div className="space-y-4">
              {SearchFields.map((field, index) => (
                <div
                  key={index}
                  className={`bg-gray-100 rounded-lg p-3 transition-transform duration-300 ${
                    activeField === index ? "ring-2 ring-red-500" : ""
                  }`}
                  onClick={() => setActiveField(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-xs text-gray-600">
                        {field.label}
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        {field.icon}
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={searchValues[field.key]}
                          onChange={(e) =>
                            setSearchValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          className="w-full outline-none bg-transparent text-sm"
                        />
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>
              ))}

              <button
                onClick={handleSearch}
                disabled={isSearchDisabled}
                className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 ${
                  isSearchDisabled
                    ? "bg-gray-300 text-gray-500"
                    : "bg-red-500 text-white"
                }`}
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
