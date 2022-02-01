import {
  CreateTourneyRequest,
  CreateTourneyResponse,
  CREATE_TOURNEY_REQUEST_SCHEMA,
} from "../../../../lib/api-types";
import { MAX_USER_TOURNEYS } from "../../../../lib/limits";
import { serializeTourney } from "../../../../lib/server/conversions";
import {
  countUserTourneys,
  createTourney,
  fetchUser,
  transaction,
} from "../../../../lib/server/db";
import {
  BadRequestException,
  postAuthed,
  ResourceLimitException,
} from "../../../../lib/server/route";

export default postAuthed<CreateTourneyRequest, CreateTourneyResponse>(
  CREATE_TOURNEY_REQUEST_SCHEMA,
  ({ user, data: { name } }) =>
    transaction(async (db) => {
      const userProof = await fetchUser(db, user.id);
      if (userProof === null) {
        throw new BadRequestException();
      }

      const tourneyCount = await countUserTourneys(db, user.id);
      if (tourneyCount >= MAX_USER_TOURNEYS) {
        throw new ResourceLimitException();
      }

      const result = await createTourney(db, { name, ownerId: user.id });
      return serializeTourney(result);
    })
);
