import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import { userFromSession, UserInfo } from "../auth";

export async function getUserInfo(
  req: IncomingMessage
): Promise<UserInfo | null> {
  const session = await getSession({ req });
  if (session === null) return null;
  return userFromSession(session);
}
