import { useEffect, useState } from "react";
import { SingleDatePicker, AnchorDirectionShape } from "react-dates";
import { FC } from "react";
import moment from "moment";
import useWindowSize from "hooks/useWindowResize";
import { TimeRage } from "./RentalCarSearchForm";
import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";


export interface EventDateInputProps {
  label?:string
  defaultValue: moment.Moment;
  defaultTimeValue: TimeRage;
  sub: string
  onChange?: (date: { startDate: moment.Moment ; stateTimeRage: TimeRage}) => void;
  defaultFocus?: boolean;
  fieldClassName?: string;
  onFocusChange: (focused: boolean) => void;
  className?: string;
  anchorDirection?: AnchorDirectionShape;
}

type Fields = "pickUp" | "dropOff";

const EventDateInput: FC<EventDateInputProps> = ({
  label,
  defaultValue,
  defaultTimeValue,
  onChange,
  defaultFocus = true,
  onFocusChange,
  anchorDirection,
  className = "",
  fieldClassName = "[ nc-hero-field-padding ]",
  sub
}) => {
  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  const [startDate, setStartDate] = useState(defaultValue);
  const [stateTimeRage, setStateTimeRage] = useState(defaultTimeValue);

  const windowSize = useWindowSize();

  useEffect(() => {
    setStartDate(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setFocusedInput(defaultFocus);
  }, [defaultFocus]);

  useEffect(() => {
    if (onChange) {
      onChange({startDate, stateTimeRage});
    }
  }, [startDate, stateTimeRage]);


  const handleDateFocusChange = (arg: { focused: boolean }) => {
    setFocusedInput(arg.focused);
    onFocusChange && onFocusChange(arg.focused);
  };


  const renderEditTime = (field: Fields) => {
    const times = [
      "00:00",
      "00:30",
      "1:00",
      "1:30",
      "2:00",
      "2:30",
      "3:00",
      "3:30",
      "4:00",
      "4:30",
      "5:00",
      "5:30",
      "6:00",
      "6:30",
      "7:00",
      "7:30",
      "8:00",
      "8:30",
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
      "22:00",
      "22:30",
      "23:00",
      "23:30",
    ];
    let timeValue = stateTimeRage.startTime;
    if (field === "dropOff") {
      timeValue = stateTimeRage.endTime;
    }
    return (
      <Listbox
        value={stateTimeRage.startTime}
        onChange={(time) => {
          if (field === "pickUp") {
            return setStateTimeRage((state) => ({ ...state, startTime: time }));
          }
          setStateTimeRage((state) => ({ ...state, endTime: time }));
        }}
        as="div"
        className="relative flex-shrink-0"
      >
        <Listbox.Button className="focus:outline-none inline-flex items-center group">
          <span className="block text-neutral-400 leading-none font-light">
            {`, ` + timeValue}
          </span>
          <span className="ml-1 absolute left-full top-0 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </span>

        </Listbox.Button>

        <Listbox.Options className="absolute z-40 min-w-max overflow-auto text-base bg-white dark:bg-neutral-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {times.map((time, index) => (
            <Listbox.Option
              key={index}
              className={({ active }) =>
                `${
                  active
                    ? "text-amber-900 bg-amber-100"
                    : "text-gray-900 dark:text-neutral-200"
                } cursor-default select-none relative py-2 pl-10 pr-4`
              }
              value={time}
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={`${
                      selected ? "font-medium" : "font-normal"
                    } block truncate`}
                  >
                    {time}
                  </span>
                  {selected ? (
                    <span
                      className={`${
                        active ? "text-amber-600" : "text-amber-600"
                      }  absolute inset-y-0 left-0 flex items-center pl-3`}
                    >
                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    );
  };

  const renderInputCheckInDate = ( sub : string ) => {
    const focused = focusedInput;
    return (
      <div
        className={`flex w-full ${fieldClassName}  items-center space-x-3 cursor-pointer ${
          focused ? "shadow-2xl rounded-full dark:bg-neutral-800" : ""
        }`}
        onClick={() => handleDateFocusChange({ focused: true })}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-grow">
          <span className=" xl:text-lg font-semibold flex">
            {startDate ? startDate.format("DD MMM") : "Dia"}
            {renderEditTime("pickUp")}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {sub}
          </span>
          {startDate && focused}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${className}`} style={{ flex: "1 0 0%" }}>
      <div className="absolute inset-x-1 bottom-0">
        <SingleDatePicker
          date={startDate}
          onDateChange={(date) => {setStartDate(date === null ? moment() : date )}}
          id={"nc-hero-EventDateInput-startDateId"}
          focused={focusedInput}
          daySize={windowSize.width > 425 ? 56 : undefined}
          orientation={"horizontal"}
          onFocusChange={handleDateFocusChange}
          noBorder
          hideKeyboardShortcutsPanel
          numberOfMonths={1}
          anchorDirection={anchorDirection}
        />
      </div>

      {renderInputCheckInDate(sub)}
    </div>
  );
};

export default EventDateInput;
