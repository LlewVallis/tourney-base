import {
  UpdateParticipantRequest,
  UpdateParticipantResponse,
  UPDATE_PARTICIPANT_REQUEST_SCHEMA,
} from "../../../../../../../lib/api-types";
import {
  serializeParticipant,
  serializeTourney,
} from "../../../../../../../lib/server/conversions";
import {
  fetchParticipant,
  fetchTourney,
  transaction,
  updateOwnedParticipant,
} from "../../../../../../../lib/server/db";
import {
  ForbiddenException,
  NotFoundException,
  postAuthed,
} from "../../../../../../../lib/server/route";
import { castString } from "../../../../../../../lib/util";

export default postAuthed<UpdateParticipantRequest, UpdateParticipantResponse>(
  UPDATE_PARTICIPANT_REQUEST_SCHEMA,
  ({ user, data: { name }, req }) =>
    transaction(async (db) => {
      const tourneyId = castString(req.query.tourneyId);
      const participantId = castString(req.query.participantId);

      const updated = await updateOwnedParticipant(
        db,
        tourneyId,
        participantId,
        user.id,
        { name }
      );

      const participant = await fetchParticipant(db, tourneyId, participantId);

      if (updated) {
        const tourney = await fetchTourney(db, tourneyId);

        return {
          tourney: serializeTourney(tourney!!),
          participant: serializeParticipant(participant!!),
        };
      } else if (participant === null) {
        throw new NotFoundException();
      } else {
        throw new ForbiddenException();
      }
    })
);
