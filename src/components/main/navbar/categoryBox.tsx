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
  const pathname = usePathname();
  const isSemuaProperti = label.toLowerCase() === "semua properti";

  const handleClick = useCallback(() => {
    let currentQuery: Record<string, string | undefined> = {};
    if (params) {
      currentQuery = qs.parse(params.toString()) as Record<string, string>;
    }

    if (isSemuaProperti) {
      delete currentQuery.category;
    } else {
      if (currentQuery.category === label.toLowerCase()) {
        delete currentQuery.category;
      } else {
        currentQuery.category = label.toLowerCase();
      }
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: currentQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, params, label, pathname, isSemuaProperti]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition cursor-pointer ${
        isSemuaProperti
          ? "border-b-0 text-neutral-500 hover:text-neutral-800"
          : selected
          ? "border-b-2 border-b-neutral-800 text-neutral-800"
          : "border-b-2 border-transparent text-neutral-500 hover:text-neutral-800"
      }`}
    >
      <Icon className="text-3xl md:text-xl" />
      <div className="font-medium text-xs">{label}</div>
    </div>
  );
};

export default CategoryBox;
