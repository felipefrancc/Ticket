import React, { useEffect, useState } from "react";
import LocationInput from "./LocationInput";
import ExperiencesDateSingleInput from "./ExperiencesDateSingleInput";
import ButtonSubmit from "./ButtonSubmit";
import moment from "moment";
import { FC } from "react";

// DEFAULT DATA FOR ARCHIVE PAGE
const defaultLocationValue = "Tokyo, Jappan";
const defaultDate = moment();


export interface ExperiencesSearchFormProps {
  haveDefaultValue?: boolean;
}

const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({
  haveDefaultValue,
}) => {
  const [dateValue, setdateValue] = useState<moment.Moment | null>(null);
  const [locationInputValue, setLocationInputValue] = useState("");

  const [dateFocused, setDateFocused] = useState<boolean>(false);
  //

  useEffect(() => {
    if (haveDefaultValue) {
      setdateValue(defaultDate);
      setLocationInputValue(defaultLocationValue);
    }
  }, []);

  //

  const renderForm = () => {
    return (
      <form className="w-full relative mt-8 flex flex-col md:flex-row md:items-center rounded-3xl md:rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700  md:divide-y-0">
        <LocationInput
          defaultValue={locationInputValue}
          onChange={(e) => setLocationInputValue(e)}
          onInputDone={() => setDateFocused(true)}
        />

        <ExperiencesDateSingleInput
          defaultValue={dateValue}
          onChange={(date) => setdateValue(date)}
          defaultFocus={dateFocused}
          onFocusChange={(focus: boolean) => {
            setDateFocused(focus);
          }}
        />
        {/* BUTTON SUBMIT OF FORM */}
        <div className="px-4 py-4 lg:py-0">
          <ButtonSubmit />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default ExperiencesSearchForm;
