import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import "react-datepicker/dist/react-datepicker.css";

interface SearchValues {
  where: string;
  checkIn: Date | null;
  checkOut: Date | null;
  dateRange: [Date | null, Date | null];
  who: number;
}

interface Property {
  id: number;
  name: string;
  location: { address: string; city: string; country: string };
}

export default function useSearchbar() {
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Inisialisasi nilai default: checkIn = hari ini, checkOut = besok, who = 1
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [searchValues, setSearchValues] = useState<SearchValues>({
    where: "",
    checkIn: today,
    checkOut: tomorrow,
    who: 1,
    dateRange: [today, tomorrow],
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

  // Perbarui query parameter setiap kali checkIn atau checkOut berubah
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValues.checkIn) {
      params.set("checkIn", searchValues.checkIn.toISOString().split("T")[0]);
    } else {
      params.delete("checkIn");
    }
    if (searchValues.checkOut) {
      params.set("checkOut", searchValues.checkOut.toISOString().split("T")[0]);
    } else {
      params.delete("checkOut");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    searchValues.checkIn,
    searchValues.checkOut,
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

  // Perbarui query parameter untuk keyword dan fetch properties saat keyword berubah
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
      params.append(
        "checkIn",
        searchValues.checkIn.toISOString().split("T")[0]
      );
    if (searchValues.checkOut)
      params.append(
        "checkOut",
        searchValues.checkOut.toISOString().split("T")[0]
      );
    if (searchValues.who) params.append("who", searchValues.who.toString());

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
