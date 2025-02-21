import { useState, useEffect } from "react";
import { Search, X, Plus, Minus, Loader } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSearchbar from "@/components/main/navbar/searchInput";
import { usePathname } from "next/navigation";

const MobileSearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const {
    searchValues,
    setSearchValues,
    suggestions,
    handleSearch,
    highlightMatch,
    handleSuggestionClick,
    incrementWho,
    decrementWho,
  } = useSearchbar();

  useEffect(() => {
    if (pathname === "/property/search-result") {
      setIsExpanded(false);
    }
  }, [pathname]);

  const handleSearchClick = async () => {
    setLoading(true);
    await handleSearch();
    setIsExpanded(false);
    setLoading(false);
  };

  const isSearchDisabled = Object.values(searchValues).some(
    (value) => value === "" || value === null
  );

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 z-40 p-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-white shadow-lg border border-gray-200 rounded-full py-3 px-4 flex items-center justify-center"
        >
          <div className="flex items-center space-x-3">
            <Search size={20} className="text-gray-600" />
            <span className="text-gray-600">Mau Kemana Hari Ini?</span>
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="fixed bg-white z-50 overflow-y-auto w-full h-full">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setIsExpanded(false)}>
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold">Pencarian</h2>
              <span></span>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <label className="text-xs text-gray-600">Lokasi</label>
                <input
                  type="text"
                  placeholder="Masukkan lokasi"
                  value={searchValues.where}
                  onChange={(e) =>
                    setSearchValues((prev) => ({
                      ...prev,
                      where: e.target.value,
                    }))
                  }
                  className="w-full outline-none bg-transparent text-sm mt-1"
                />
                {suggestions.length > 0 && (
                  <ul className="mt-2 bg-white border rounded-md shadow-md">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {highlightMatch(suggestion, searchValues.where)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-gray-100 rounded-lg p-3">
                <label className="text-xs text-gray-600">
                  Tanggal Check-in
                </label>
                <DatePicker
                  selected={searchValues.checkIn}
                  onChange={(date) =>
                    setSearchValues((prev) => ({ ...prev, checkIn: date }))
                  }
                  minDate={new Date()}
                  dateFormat="d MMM"
                  placeholderText="Pilih tanggal"
                  className="w-full outline-none bg-transparent text-sm mt-1 mx-5"
                  calendarClassName="custom-calendar"
                />
              </div>

              <div className="bg-gray-100 rounded-lg p-3">
                <label className="text-xs text-gray-600">
                  Tanggal Check-out
                </label>
                <DatePicker
                  selected={searchValues.checkOut}
                  onChange={(date) =>
                    setSearchValues((prev) => ({ ...prev, checkOut: date }))
                  }
                  minDate={searchValues.checkIn || new Date()}
                  dateFormat="d MMM"
                  placeholderText="Pilih tanggal"
                  className="w-full outline-none bg-transparent text-sm mt-1 mx-3"
                  calendarClassName="custom-calendar"
                />
              </div>

              <div className="bg-gray-100 rounded-lg p-3">
                <label className="text-xs text-gray-600">Jumlah Tamu</label>
                <div className="flex items-center space-x-4 mt-1">
                  <button
                    onClick={decrementWho}
                    className="p-2 bg-gray-300 rounded-full"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{searchValues.who} Tamu</span>
                  <button
                    onClick={incrementWho}
                    className="p-2 bg-gray-300 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSearchClick}
                disabled={isSearchDisabled || loading}
                className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 ${
                  isSearchDisabled || loading
                    ? "bg-gray-300 text-gray-500"
                    : "bg-red-500 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Cari</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
