import {
  DeleteTourneyRequest,
  DeleteTourneyResponse,
  DELETE_TOURNEY_REQUEST_SCHEMA,
} from "../../../../../lib/api-types";
import {
  deleteOwnedTourney,
  fetchTourney,
  transaction,
} from "../../../../../lib/server/db";
import {
  ForbiddenException,
  NotFoundException,
  postAuthed,
} from "../../../../../lib/server/route";
import { castString } from "../../../../../lib/util";

export default postAuthed<DeleteTourneyRequest, DeleteTourneyResponse>(
  DELETE_TOURNEY_REQUEST_SCHEMA,
  ({ user, req }) =>
    transaction(async (db) => {
      const id = castString(req.query.tourneyId);

      const deleted = await deleteOwnedTourney(db, id, user.id);

      if (deleted) {
        return {};
      } else {
        const tourney = await fetchTourney(db, id);

        if (tourney === null) {
          throw new NotFoundException();
        } else {
          throw new ForbiddenException();
        }
      }
    })
);
