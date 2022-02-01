import { PrismaClient } from "@prisma/client";

export const rawDb: PrismaClient = (global as any).prisma ?? new PrismaClient();

if (process.env.NODE_ENV === "development") (global as any).prisma = rawDb;

export type Db = Parameters<Parameters<typeof rawDb.$transaction>[0]>[0];

export function transaction<T>(f: (db: Db) => T | Promise<T>): Promise<T> {
  return rawDb.$transaction(async (db) => await f(db));
}

export function fetchUser(db: Db, id: string) {
  return db.user.findUnique({ where: { id } });
}

const TOURNEY_INCLUDE = {
  participants: { orderBy: { index: "asc" } },
  matchResults: { orderBy: { created: "asc" } },
} as const;

export function fetchTourney(db: Db, id: string) {
  return db.tourney.findUnique({
    include: TOURNEY_INCLUDE,
    where: { id },
  });
}

export function fetchUserTourneys(db: Db, ownerId: string) {
  return db.tourney.findMany({
    include: TOURNEY_INCLUDE,
    where: { ownerId },
    orderBy: { modified: "desc" },
  });
}

export function countUserTourneys(db: Db, userId: string) {
  return db.tourney.count({ where: { ownerId: userId } });
}

export function createTourney(
  db: Db,
  { name, ownerId }: { name: string; ownerId: string }
) {
  return db.tourney.create({
    include: TOURNEY_INCLUDE,
    data: { name, ownerId },
  });
}

export async function updateOwnedTourney(
  db: Db,
  id: string,
  ownerId: string,
  { name }: { name: string }
) {
  const result = await db.tourney.updateMany({
    where: { id, ownerId },
    data: { name, modified: new Date() },
  });

  return result.count > 0;
}

export async function deleteOwnedTourney(db: Db, id: string, ownerId: string) {
  const result = await db.tourney.deleteMany({ where: { id, ownerId } });
  return result.count > 0;
}

export function fetchParticipant(db: Db, tourneyId: string, id: string) {
  return db.participant.findFirst({ where: { id, tourneyId } });
}

export async function createParticipant(
  db: Db,
  tourneyId: string,
  { name }: { name: string }
) {
  await db.tourney.update({
    where: { id: tourneyId },
    data: { modified: new Date() },
  });

  const count = await db.participant.count({ where: { tourneyId } });

  return await db.participant.create({
    data: { name, tourneyId, index: count },
  });
}

export async function updateOwnedParticipant(
  db: Db,
  tourneyId: string,
  id: string,
  ownerId: string,
  { name }: { name: string }
) {
  await db.tourney.update({
    where: { id: tourneyId },
    data: { modified: new Date() },
  });

  const result = await db.participant.updateMany({
    where: { id, tourney: { id: tourneyId, ownerId } },
    data: { name },
  });

  return result.count > 0;
}

export async function moveOwnedParticipant(
  db: Db,
  tourneyId: string,
  id: string,
  ownerId: string,
  { indexDelta }: { indexDelta: number }
) {
  await db.tourney.update({
    where: { id: tourneyId },
    data: { modified: new Date() },
  });

  const result = await db.participant.findFirst({
    include: {
      tourney: { include: { _count: { select: { participants: true } } } },
    },
    where: { id, tourney: { id: tourneyId, ownerId } },
  });

  if (result === null) {
    return false;
  }

  const {
    tourney: {
      _count: { participants: count },
    },
    ...participant
  } = result;

  const oldIndex = participant.index;
  const newIndex = Math.max(0, Math.min(count - 1, oldIndex + indexDelta));

  if (newIndex < oldIndex) {
    await db.participant.updateMany({
      where: { tourneyId, index: { gte: newIndex, lt: oldIndex } },
      data: { index: { increment: 1 } },
    });
  } else if (newIndex > oldIndex) {
    await db.participant.updateMany({
      where: { tourneyId, index: { gt: oldIndex, lte: newIndex } },
      data: { index: { decrement: 1 } },
    });
  }

  if (newIndex !== oldIndex) {
    await db.participant.update({ where: { id }, data: { index: newIndex } });
  }

  return true;
}

export async function deleteOwnedParticipant(
  db: Db,
  tourneyId: string,
  id: string,
  ownerId: string
) {
  await db.tourney.update({
    where: { id: tourneyId },
    data: { modified: new Date() },
  });

  const participant = await db.participant.findFirst({
    where: { id, tourney: { id: tourneyId, ownerId } },
  });

  if (participant === null) {
    return false;
  }

  await db.participant.delete({ where: { id } });
  await db.participant.updateMany({
    where: { index: { gt: participant.index } },
    data: { index: { decrement: 1 } },
  });

  return true;
}

export function fetchMatchResult(db: Db, tourneyId: string, id: string) {
  return db.matchResult.findFirst({ where: { id, tourneyId } });
}

export async function createMatchResult(
  db: Db,
  tourneyId: string,
  { winnerId, loserId }: { winnerId: string; loserId: string }
) {
  await db.tourney.update({
    where: { id: tourneyId },
    data: { modified: new Date() },
  });

  return await db.matchResult.create({
    data: { tourneyId, winnerId, loserId },
  });
}

export async function updateOwnedMatchResult(
  db: Db,
  tourneyId: string,
  id: string,
  ownerId: string,
  { winnerId, loserId }: { winnerId: string; loserId: string }
) {
  await db.tourney.update({
    where: { id: tourneyId },
    data: { modified: new Date() },
  });

  const result = await db.matchResult.updateMany({
    where: { id, tourney: { id: tourneyId, ownerId } },
    data: { winnerId, loserId },
  });

  return result.count > 0;
}

export async function deleteOwnedMatchResult(
  db: Db,
  tourneyId: string,
  id: string,
  ownerId: string
) {
  await db.tourney.update({
    where: { id: tourneyId },
    data: { modified: new Date() },
  });

  const result = await db.matchResult.deleteMany({
    where: { id, tourney: { id: tourneyId, ownerId } },
  });

  return result.count > 0;
}
