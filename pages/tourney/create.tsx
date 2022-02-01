import { useUser } from "../../components/session-manager";
import SigninSection from "../../components/signin-section";
import SimpleLayout from "../../components/simple-layout";
import CreateTourneySection from "../../components/tourney/create-tourney-section";

const Create = () => {
  const user = useUser();

  return (
    <SimpleLayout>
      {user === null ? <SigninSection /> : <CreateTourneySection />}
    </SimpleLayout>
  );
};

export default Create;
