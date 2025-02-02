import { useContext } from "react";
import { SessionContext } from "./sessionProvider";
import { SessionContext as ISessionContext } from "@/types/property";

export const useSession = (): ISessionContext => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
