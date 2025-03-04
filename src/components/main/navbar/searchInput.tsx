import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import "react-datepicker/dist/react-datepicker.css";
import { SearchValues, Property } from "../../../types/types";

const formatDateLocal = (date: Date) => {
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

  useEffect(() => {
    if (pathname === "/") {
      setSearchValues({
        where: "",
        checkIn: today,
        checkOut: tomorrow,
        who: 1,
        dateRange: [today, tomorrow],
      });
    } else {
      const whereQuery = searchParams.get("where");
      const checkInQuery = searchParams.get("checkIn");
      const checkOutQuery = searchParams.get("checkOut");
      const whoQuery = searchParams.get("who");
      const categoryQuery = searchParams.get("category");

      if (
        whereQuery ||
        checkInQuery ||
        checkOutQuery ||
        whoQuery ||
        categoryQuery
      ) {
        setSearchValues((prev) => {
          const newCheckIn: Date = checkInQuery
            ? new Date(checkInQuery)
            : prev.checkIn || new Date();
          const newCheckOut: Date = checkOutQuery
            ? new Date(checkOutQuery)
            : prev.checkOut || new Date();
          return {
            ...prev,
            where: whereQuery || prev.where,
            checkIn: newCheckIn,
            checkOut: newCheckOut,
            who: whoQuery ? parseInt(whoQuery, 10) : prev.who,
            dateRange: [newCheckIn, newCheckOut],
          };
        });
      }
    }
  }, [pathname, searchParams]);

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
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      params.append("category", categoryQuery);
    }

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
