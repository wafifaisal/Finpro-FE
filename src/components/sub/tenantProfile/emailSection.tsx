import { useSession } from "@/context/useSessionHook";
import { FaEnvelope } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

export default function ProfilEmail() {
  const { tenant } = useSession();

  return (
    <div className="space-y-4">
      <div className="flex md:flex-row items-center justify-between flex-col">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-gray-400" />
          <span className="text-gray-600">{tenant?.email}</span>
          <FaCheck className="text-green-500" />
        </div>
      </div>
    </div>
  );
}
