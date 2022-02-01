import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { toast } from "react-toastify";
import styled from "styled-components";
import { NAME_PATTERN, Tourney } from "../../lib/api-types";
import { ApiUpdater, deleteTourney, updateTourney } from "../../lib/client/api";
import { cleanedValue } from "../../lib/client/util";
import { ButtonCancel, ButtonError } from "../button";
import { SmallContent } from "../content-sizer";
import Form, { Field, FormFullWidth, SubmitButton } from "../form";
import { HeadingWithIconLink } from "../heading";
import Modal from "../modal";

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const TourneySettingsSection = ({
  tourney,
  tourneyUpdater,
}: {
  tourney: Tourney;
  tourneyUpdater: ApiUpdater<Tourney>;
}) => {
  const [processing, setProcessing] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <HeadingWithIconLink
        content={`Settings for ${tourney.name}`}
        href={`/tourney/${encodeURIComponent(tourney.id)}`}
      >
        <MdArrowBack />
      </HeadingWithIconLink>

      <SmallContent>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();

            if (processing) return;
            setProcessing(true);

            const name = cleanedValue(nameRef);

            const result = await updateTourney(tourney.id, { name });

            if (result.data === null) {
              console.error(result);
              toast.error("Could not save changes");
            } else {
              tourneyUpdater(result.data);
              toast.info("Changes saved");
            }

            setProcessing(false);
          }}
        >
          <Field
            pattern={NAME_PATTERN}
            ref={nameRef}
            defaultValue={tourney.name}
            required
          >
            Name
          </Field>

          <FormFullWidth>
            <ButtonsContainer>
              <SubmitButton disabled={processing}>Save</SubmitButton>

              <DeleteButton
                tourney={tourney}
                tourneyUpdater={tourneyUpdater}
                processing={processing}
                setProcessing={setProcessing}
              />
            </ButtonsContainer>
          </FormFullWidth>
        </Form>
      </SmallContent>
    </>
  );
};

export default TourneySettingsSection;

const DeleteButtonElement = styled(ButtonError)`
  margin-top: 1rem;
  width: 100%;
`;

const ConfirmTitle = styled.h1`
  font-size: 110%;
  text-align: center;
  margin: 0;
  margin-bottom: 1.25rem;
`;

const ConfirmButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const DeleteButton = ({
  tourney,
  tourneyUpdater,
  processing,
  setProcessing,
}: {
  tourney: Tourney;
  tourneyUpdater: ApiUpdater<Tourney>;
  processing: boolean;
  setProcessing(value: boolean): void;
}) => {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  return (
    <>
      <DeleteButtonElement
        disabled={processing}
        onClick={async (e) => {
          e.preventDefault();
          if (processing) return;
          setConfirming(true);
        }}
      >
        Delete
      </DeleteButtonElement>

      <Modal isOpen={confirming} onRequestClose={() => setConfirming(false)}>
        <ConfirmTitle>Are you sure?</ConfirmTitle>

        <ConfirmButtonsContainer>
          <ButtonError
            disabled={processing}
            onClick={async () => {
              if (processing) return;
              setProcessing(true);

              const result = await deleteTourney(tourney.id);
              if (result.data === null) {
                console.error(result);
                toast.error("Could not delete tourney");
                tourneyUpdater.revalidate();
                setProcessing(false);
              } else {
                router.replace("/");
              }
            }}
          >
            Delete
          </ButtonError>

          <ButtonCancel
            disabled={processing}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </ButtonCancel>
        </ConfirmButtonsContainer>
      </Modal>
    </>
  );
};
