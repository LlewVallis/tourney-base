import { IncomingMessage } from "http";
import { BurstyRateLimiter, RateLimiterMemory } from "rate-limiter-flexible";
import { getClientIp } from "request-ip";
import { UserInfo } from "../auth";

const PER_SECOND = 2;
const PER_MINUTE = 60;
const IP_FACTOR = 4;

const IP_LIMITER = new BurstyRateLimiter(
  new RateLimiterMemory({
    keyPrefix: "ip",
    points: PER_SECOND * IP_FACTOR,
    duration: 1,
  }),
  new RateLimiterMemory({
    keyPrefix: "ip-burst",
    points: PER_MINUTE * IP_FACTOR,
    duration: 60,
  })
);

const USER_LIMITER = new BurstyRateLimiter(
  new RateLimiterMemory({ keyPrefix: "user", points: PER_SECOND, duration: 1 }),
  new RateLimiterMemory({
    keyPrefix: "user-burst",
    points: PER_MINUTE,
    duration: 60,
  })
);

export default async function rateLimit(
  req: IncomingMessage,
  user: UserInfo | null
): Promise<boolean> {
  const ip = getClientIp(req);
  if (ip === null) {
    return true;
  }

  try {
    await IP_LIMITER.consume(ip);

    if (user !== null) {
      await USER_LIMITER.consume(user.id);
    }
  } catch (e) {
    return true;
  }

  return false;
}
