import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { NAME_PATTERN } from "../../lib/api-types";
import { createTourney } from "../../lib/client/api";
import { cleanedValue } from "../../lib/client/util";
import { SmallContent } from "../content-sizer";
import Form, { Field, SubmitButton } from "../form";
import { Heading } from "../heading";

const CreateTourneySection = () => {
  const [processing, setProcessing] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  return (
    <>
      <Heading content="New tourney" />

      <SmallContent>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();

            if (processing) return;
            setProcessing(true);

            const name = cleanedValue(nameRef);

            const result = await createTourney({ name });
            const tourney = result.data;

            if (tourney === null) {
              console.error(result);
              toast.error("Could not create tourney");
              setProcessing(false);
            } else {
              router.replace(`/tourney/${encodeURIComponent(tourney.id)}`);
            }
          }}
        >
          <Field pattern={NAME_PATTERN} ref={nameRef} required>
            Name
          </Field>
          <SubmitButton disabled={processing}>Create</SubmitButton>
        </Form>
      </SmallContent>
    </>
  );
};

export default CreateTourneySection;
