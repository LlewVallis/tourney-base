import Link from "next/link";
import { MdAdd, MdAddCircle, MdEdit, MdPerson } from "react-icons/md";
import { RiSwordFill } from "react-icons/ri";
import ReactTimeAgo from "react-time-ago";
import styled from "styled-components";
import { Tourney } from "../../lib/api-types";
import { BACKGROUND_COLOR_LIGHT, PRIMARY_COLOR } from "../../lib/client/theme";
import CenterParagraph from "../center-paragraph";
import { HeadingWithIconLink } from "../heading";

const TourneysSection = ({ tourneys }: { tourneys: Tourney[] }) => (
  <>
    <HeadingWithIconLink content="Your tourneys" href="/tourney/create">
      {tourneys.length === 0 ? null : <MdAdd />}
    </HeadingWithIconLink>

    <TourneysList tourneys={tourneys} />
  </>
);

export default TourneysSection;

const TourneysList = ({ tourneys }: { tourneys: Tourney[] }) => {
  if (tourneys.length === 0) {
    return (
      <CenterParagraph>
        You don't have any tourneys yet. Click{" "}
        <Link href="/tourney/create">
          <a>here</a>
        </Link>{" "}
        to create your first one!
      </CenterParagraph>
    );
  } else {
    return (
      <>
        {tourneys.map((tourney) => (
          <TourneyCard key={tourney.id} tourney={tourney} />
        ))}
      </>
    );
  }
};

const TourneyBox = styled.article`
  display: flex;
  align-items: center;
  font-size: 110%;
  background-color: ${BACKGROUND_COLOR_LIGHT};
  border-left: 0.25rem solid ${PRIMARY_COLOR};
  border-radius: 0.25rem;
  padding: 1rem;
  margin: 0.75rem 0;
  cursor: pointer;
  transition: filter 0.1s;

  &:hover {
    filter: brightness(95%);
  }
`;

const TourneyTitle = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1;
  font-weight: 500;
`;

const Indicators = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Indicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  width: 2rem;
  overflow: hidden;
`;

const IndicatorLarge = styled(Indicator)`
  width: 3.75rem;
`;

const TourneyCard = ({ tourney }: { tourney: Tourney }) => (
  <Link href={`/tourney/${encodeURIComponent(tourney.id)}`}>
    <TourneyBox>
      <TourneyTitle>{tourney.name}</TourneyTitle>
      <Indicators>
        <IndicatorLarge>
          <MdEdit />
          <Time timestamp={tourney.modified} />
        </IndicatorLarge>
        <IndicatorLarge>
          <MdAddCircle />
          <Time timestamp={tourney.created} />
        </IndicatorLarge>
        <Indicator>
          <MdPerson />
          {tourney.participants.length}
        </Indicator>
        <Indicator>
          <RiSwordFill />
          {tourney.matchResults.length}
        </Indicator>
      </Indicators>
    </TourneyBox>
  </Link>
);

const Time = ({ timestamp }: { timestamp: string }) => (
  <ReactTimeAgo date={new Date(timestamp)} timeStyle="mini" />
);
