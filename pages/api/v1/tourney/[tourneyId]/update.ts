import {
  UpdateTourneyRequest,
  UpdateTourneyResponse,
  UPDATE_TOURNEY_REQUEST_SCHEMA,
} from "../../../../../lib/api-types";
import { serializeTourney } from "../../../../../lib/server/conversions";
import {
  fetchTourney,
  transaction,
  updateOwnedTourney,
} from "../../../../../lib/server/db";
import {
  ForbiddenException,
  NotFoundException,
  postAuthed,
} from "../../../../../lib/server/route";
import { castString } from "../../../../../lib/util";

export default postAuthed<UpdateTourneyRequest, UpdateTourneyResponse>(
  UPDATE_TOURNEY_REQUEST_SCHEMA,
  ({ user, data: { name }, req }) =>
    transaction(async (db) => {
      const id = castString(req.query.tourneyId);

      const updated = await updateOwnedTourney(db, id, user.id, { name });
      const tourney = await fetchTourney(db, id);

      if (updated) {
        return serializeTourney(tourney!!);
      } else if (tourney === null) {
        throw new NotFoundException();
      } else {
        throw new ForbiddenException();
      }
    })
);
