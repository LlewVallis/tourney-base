import {
  DeleteParticipantRequest,
  DeleteParticipantResponse,
  DELETE_PARTICIPANT_REQUEST_SCHEMA,
} from "../../../../../../../lib/api-types";
import { serializeTourney } from "../../../../../../../lib/server/conversions";
import {
  deleteOwnedParticipant,
  fetchParticipant,
  fetchTourney,
  transaction,
} from "../../../../../../../lib/server/db";
import {
  ForbiddenException,
  NotFoundException,
  postAuthed,
} from "../../../../../../../lib/server/route";
import { castString } from "../../../../../../../lib/util";

export default postAuthed<DeleteParticipantRequest, DeleteParticipantResponse>(
  DELETE_PARTICIPANT_REQUEST_SCHEMA,
  ({ user, req }) =>
    transaction(async (db) => {
      const tourneyId = castString(req.query.tourneyId);
      const participantId = castString(req.query.participantId);

      const deleted = await deleteOwnedParticipant(
        db,
        tourneyId,
        participantId,
        user.id
      );

      if (deleted) {
        const tourney = await fetchTourney(db, tourneyId);
        return { tourney: serializeTourney(tourney!!) };
      } else {
        const participant = await fetchParticipant(
          db,
          tourneyId,
          participantId
        );

        if (participant === null) {
          throw new NotFoundException();
        } else {
          throw new ForbiddenException();
        }
      }
    })
);
