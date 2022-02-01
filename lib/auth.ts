import { Session } from "next-auth";
import { castString } from "./util";

export interface UserInfo {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export function userFromSession(session: Session): UserInfo {
  return {
    id: castString(session.userId),
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  };
}
