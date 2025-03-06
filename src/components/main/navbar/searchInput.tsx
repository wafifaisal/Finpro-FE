import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import "react-datepicker/dist/react-datepicker.css";
import { SearchValues, Property } from "../../../types/types";

// Fungsi format tanggal dengan waktu lokal
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function useSearchbar() {
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Menambahkan properti "category" pada state
  const [searchValues, setSearchValues] = useState<SearchValues>({
    where: "",
    checkIn: today,
    checkOut: tomorrow,
    who: 1,
    dateRange: [today, tomorrow],
    category: "", // properti category ditambahkan
  });

  const [text] = useDebounce(searchValues.where, 1000);
  const [isScrolled, setIsScrolled] = useState(pathname !== "/" ? true : false);
  const [loading, setLoading] = useState(true);

  const isSearchDisabled = Object.values(searchValues).every(
    (val) => val === "" || val === null
  );

  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem("scrollPos");
    if (savedScrollPos) {
      window.scrollTo(0, parseInt(savedScrollPos, 10));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("scrollPos", window.scrollY.toString());
      if (pathname !== "/") {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsScrolled(true);
    } else {
      setIsScrolled(window.scrollY > 0);
    }
  }, [pathname]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValues.checkIn) {
      params.set("checkIn", formatDateLocal(searchValues.checkIn));
    } else {
      params.delete("checkIn");
    }
    if (searchValues.checkOut) {
      params.set("checkOut", formatDateLocal(searchValues.checkOut));
    } else {
      params.delete("checkOut");
    }
    if (searchValues.category) {
      params.set("category", String(searchValues.category));
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    searchValues.checkIn,
    searchValues.checkOut,
    searchValues.category,
    pathname,
    router,
    searchParams,
  ]);

  const fetchProperties = useCallback(async () => {
    try {
      const url = text.trim()
        ? `${base_url_be}/property?where=${text}`
        : `${base_url_be}/property`;

      const response = await fetch(url);
      const data = await response.json();

      const properties: Property[] = data.result || [];
      let cities: string[] = Array.from(
        new Set(properties.map((p) => p.location.city))
      );

      if (text.trim()) {
        cities = cities.filter((city) =>
          city.toLowerCase().includes(text.toLowerCase())
        );
      }

      setSuggestions(cities);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }, [base_url_be, text]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (text) {
      params.set("keyword", text);
    } else {
      params.delete("keyword");
    }
    router.replace(`${pathname}?${params.toString()}`);
    fetchProperties();
  }, [text, fetchProperties, pathname, router, searchParams]);

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (searchValues.where) params.append("where", searchValues.where);
    if (searchValues.checkIn)
      params.append("checkIn", formatDateLocal(searchValues.checkIn));
    if (searchValues.checkOut)
      params.append("checkOut", formatDateLocal(searchValues.checkOut));
    if (searchValues.who) params.append("who", searchValues.who.toString());
    if (searchValues.category)
      params.append("category", String(searchValues.category));

    try {
      await fetch(`${base_url_be}/property?${params.toString()}`);
      router.push(`/property/search-result?${params.toString()}`);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const highlightMatch = (text: string, match: string) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <strong key={idx} className="font-bold">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValues((prev) => ({ ...prev, where: suggestion }));
    setSuggestions([]);
  };

  const incrementWho = () => {
    setSearchValues((prev) => ({
      ...prev,
      who: prev.who + 1,
    }));
  };

  const decrementWho = () => {
    setSearchValues((prev) => ({
      ...prev,
      who: prev.who > 0 ? prev.who - 1 : 0,
    }));
  };

  return {
    searchValues,
    setSearchValues,
    suggestions,
    isScrolled,
    isSearchDisabled,
    loading,
    handleSearch,
    text,
    highlightMatch,
    handleSuggestionClick,
    incrementWho,
    decrementWho,
  };
}
