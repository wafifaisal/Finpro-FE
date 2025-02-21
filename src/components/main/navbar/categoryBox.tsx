import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname(); // Mendapatkan path saat ini

  const handleClick = useCallback(() => {
    let currentQuery: Record<string, string | undefined> = {};
    if (params) {
      currentQuery = qs.parse(params.toString()) as Record<string, string>;
    }

    const updateQuery: Record<string, string | undefined> = {
      ...currentQuery,
      category: label.toLowerCase(),
    };

    if (params?.get("category") === label.toLowerCase()) {
      delete updateQuery.category;
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updateQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, params, label, pathname]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-1 px-3 py-1 border-b-2 hover:text-neutral-800 transition cursor-pointer ${
        selected ? "border-b-neutral-800" : "border-transparent"
      } ${selected ? "text-neutral-800" : "text-neutral-500"}`}
    >
      <Icon className="sm:text-3xl md:text-xl lg:text-xl" />
      <div className="font-medium text-xs">{label}</div>
    </div>
  );
};

export default CategoryBox;
