import { useRouter } from "next/router";
import { TourneyProps } from ".";
import SimpleLayout from "../../../components/simple-layout";
import TourneySettingsSection from "../../../components/tourney/tourney-settings-section";
import { useTourney } from "../../../lib/client/api";
import loadTourneyPros from "../../../lib/client/load-tourney-props";

const Settings = ({ tourney: fallback }: TourneyProps) => {
  const [tourney, tourneyUpdater, apiResponse] = useTourney(fallback);

  const router = useRouter();
  if (apiResponse?.code === 404) {
    router.replace("/");
  }

  return (
    <SimpleLayout>
      <TourneySettingsSection
        tourney={tourney}
        tourneyUpdater={tourneyUpdater}
      />
    </SimpleLayout>
  );
};

export default Settings;

export const getServerSideProps = loadTourneyPros(true);
