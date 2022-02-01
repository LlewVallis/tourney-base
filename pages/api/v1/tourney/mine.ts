import { MyTourneysResponse } from "../../../../lib/api-types";
import { serializeTourney } from "../../../../lib/server/conversions";
import { fetchUserTourneys, transaction } from "../../../../lib/server/db";
import { get } from "../../../../lib/server/route";

export default get<MyTourneysResponse>(({ user }) =>
  transaction(async (db) => {
    if (user === null) {
      return { tourneys: null };
    }

    const dbTourneys = await fetchUserTourneys(db, user.id);
    const tourneys = dbTourneys.map(serializeTourney);

    return { tourneys };
  })
);
