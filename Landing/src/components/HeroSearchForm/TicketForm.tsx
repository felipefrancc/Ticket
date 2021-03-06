import { useEffect, useState } from "react";
import { FC } from "react";
import moment from "moment";
import CommonLayout from "containers/PageAddListing1/CommonLayout";
import FormItem from "containers/PageAddListing1/FormItem";
import Input from "shared/Input/Input";
import Label from "components/Label/Label";
import TicketDatesRangeInput from "./TicketDatesRangeInput";
import Textarea from "shared/Textarea/Textarea";
import useWindowSize from "hooks/useWindowResize";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";

import EventDateInput from "./EventDateInput";
import Select from "shared/Select/Select";
import ListInput from "./ListInput";

export interface TicketFormProps {
  defaultValue: object[];
  onChange?: (e: { components: any }) => void;
}
const TicketForm: FC<TicketFormProps> = ({ defaultValue, onChange }) => {
  var baseTicket = {
    nome: "º Ingresso",
    valor: 0,
    quatidade: 0,
    vmeia: 0,
    qmeia: 0,
    descricao: "",
    checkboxes: { meia: false, absorver: false, lote: false },
    data: {
      defaultValue,
      dateRange: {
        startDate: moment(),
        endDate: moment().add(4, "days"),
      },
      startLote: "",
      endDate: moment().add(2, "days"),
      hora: {
        startTime: moment().hour().toString() + ":00",
        endTime: moment().hour().toString() + ":00",
      },
    },
    utils: { mouseOnTax: 0, focus: false },
  };
  const [components, setComponents] = useState([baseTicket]);

  function addComponent() {
    setComponents([...components, baseTicket]);
  }

  function removeItem<T>(arr: Array<T>, value: any): Array<T> {
    var index = arr.indexOf(value);
    if (arr.length > 1) {
      if (index !== -1) {
        arr.splice(index, 1);
      }
    }
    setComponents([...components]);
    return arr;
  }

  useEffect(() => {
    if (onChange) {
      onChange({ components });
    }
  }, [components]);

  const windowSize = useWindowSize();

  const renderCheckbox = (
    name: string,
    id: string,
    label: string,
    index: number,
    obj: any,
    minValue?: boolean,
    arr?: boolean,
    subLabel?: string
  ) => {
    return (
      <div className="flex mt-3 items-center">
        <input
          id={id + name}
          name={name}
          type="checkbox"
          className="focus:ring-action-primary h-6 w-6 text-primary-500 border-primary rounded border-neutral-500 bg-white dark:bg-neutral-700  dark:checked:bg-primary-500 focus:ring-primary-500"
          onChange={(e) => {
            obj.checkboxes[name] = e.target.checked;
            setComponents([...components]);
          }}
          checked={obj.checkboxes[name]}
        />
        {label && (
          <label
            htmlFor={name}
            className="ml-3.5 flex flex-col flex-1 justify-center"
          >
            <span className=" text-neutral-900 dark:text-neutral-100">
              {label}
            </span>
            {subLabel && (
              <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm font-light">
                {subLabel}
              </p>
            )}
          </label>
        )}
      </div>
    );
  };

  const renderMeia = (obj: any, i: any) => {
    if (obj.valor === 0 || obj.valor === undefined || isNaN(obj.valor)) {
      obj.checkboxes.meia = false;
    }
    if (obj.checkboxes.meia) {
      obj.vmeia = obj.valor / 2;
      return (
        <div
          className={`flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0 ${
            windowSize.width > 1200 ? "items-end" : ""
          }`}
        >
          <FormItem label={windowSize.width > 1200 ? "" : "Nome"}>
            <Input
              value={
                obj.nome === baseTicket.nome || obj.nome.length === 0
                  ? "Ingresso-Meia"
                  : obj.nome + "-Meia"
              }
              type="text"
              readOnly
            />
          </FormItem>
          <div>
            <div className="flex justify-end">
              <>{renderTaxa(obj, i, true)}</>
            </div>
            {windowSize.width > 1200 ? (
              ""
            ) : (
              <Label className="pr-3">Preço</Label>
            )}
            <div className="mt-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">R$ </span>
                </div>
                <Input
                  className="!pl-8 !pr-10"
                  value={(obj.valor === 0 || isNaN(obj.valor) ? 0 : obj.vmeia)
                    .toFixed(2)
                    .toString()}
                  readOnly={true}
                  type="number"
                  min="0"
                />
              </div>
            </div>
          </div>
          <FormItem label={windowSize.width > 1200 ? "" : "Quantidade"}>
            <Input
              type="number"
              min="0"
              value={
                components[i].qmeia === baseTicket.qmeia ||
                components[i].qmeia === 0
                  ? ""
                  : checkNegative(components[i].qmeia)
              }
              onChange={(e) => {
                obj.qmeia = e.target.valueAsNumber;
                setComponents([...components]);
              }}
            />
          </FormItem>
        </div>
      );
    } else {
      return;
    }
  };

  const renderTaxa = (obj: any, i: any, isMeia: boolean) => {
    if (
      obj.valor < 2.5 ||
      obj.valor < 2.5 ||
      isNaN(obj.valor) ||
      isNaN(obj.vmeia)
    ) {
      obj.checkboxes.absorver = false;
    }
    if (isMeia) {
      var valor = obj.vmeia;
    } else {
      valor = obj.valor;
    }
    if (valor * 0.1 > 2.5) {
      var taxa = valor * 0.1;
    } else if (valor === 0) {
      taxa = 0;
    } else {
      taxa = 2.5;
    }
    if (obj.checkboxes.absorver) {
      valor = valor - taxa;
    }
    if (isNaN(valor)) {
      valor = 0;
      taxa = 0;
    }
    return (
      <div className="flex-row flex justify-end">
        {/*Code Block for white tooltip starts*/}
        <div
          className="relative mt-1"
          onMouseEnter={() => {
            obj.utils.mouseOnTax = 1;
            setComponents([...components]);
          }}
          onMouseLeave={() => {
            obj.utils.mouseOnTax = 0;
            setComponents([...components]);
          }}
        >
          <div className="mr-2 text-gray-500 cursor-pointer flex justify-center items-center">
            <span className="">
              {"Valor Final R$" + (valor + taxa).toFixed(2)}
            </span>
            <svg
              aria-haspopup="true"
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-info-circle ml-1"
              width={25}
              height={25}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#A0AEC0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx={12} cy={12} r={9} />
              <line x1={12} y1={8} x2="12.01" y2={8} />
              <polyline points="11 12 12 12 12 16 13 16" />
            </svg>
          </div>
          {obj.utils.mouseOnTax === 1 && (
            <div role="tooltip" className="z-20 min-w-full absolute">
              <span className="px-3 flex shadow-lg rounded-2xl bg-white border border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700">
                Preço: R${valor.toFixed(2)} + Taxa: R$
                {taxa.toFixed(2)}
              </span>
            </div>
          )}{" "}
        </div>
      </div>
    );
  };

  const cleanLote = () => {
    var index = lote.indexOf("");
    if (index !== -1) {
      lote.splice(index, 1);
    }
  };

  const [lote, setLote] = useState<string[]>([]);

  const getTicketsName = () => {
    setLote([]);
    var nameArr: string[] = [];
    components.forEach((ticket) => {
      nameArr.push(ticket.nome);
    });
    setLote(nameArr);
  };

  const setFocus = (index: number) => {
    if (components[index].utils.focus === undefined) {
      components[index].utils.focus = false;
    }
    return components[index].utils.focus;
  };

  function removelistItem(arr: any, value: any) {
    var list: string[] = ["Selecione um ingresso"];
    arr.forEach((ticket: any) => {
      list.push(ticket.nome);
    });
    var index = list.indexOf(value);
    if (list.length > 1) {
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
    return list;
  }

  // check if valor is negative
  const checkNegative = (value: number) => {
    if (value < 0) {
      return value * -1;
    } else {
      return value;
    }
  };

  const renderForm = () => {
    return (
      <CommonLayout className="w-full" index="3. Ingressos">
        {cleanLote()}
        <div
          className={`grid  ${
            windowSize.width > 1200 ? "grid-cols-2 gap-5" : "grid-cols-1"
          }   justify-center items-start`}
        >
          {components.map((item, i) => (
            <div
              key={item.nome + i}
              className="relative flex-shrink-0 items-center"
            >
              <div
                className={`absolute inset-y-1 right-3 top-0 ${
                  components.length > 1 ? "" : "hidden"
                }`}
              >
                <ButtonSecondary
                  className="w-1 h-1"
                  onClick={() => {
                    removeItem(components, item);
                    removeItem(lote, item.nome);
                  }}
                >
                  x
                </ButtonSecondary>
              </div>
              <CommonLayout
                className="w-full"
                index={
                  components[i].nome === baseTicket.nome ||
                  components[i].nome.length === 0
                    ? i + 1 + baseTicket.nome
                    : components[i].nome
                }
              >
                {/*Ticketform*/}
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0 items-strech">
                    <FormItem label="Nome" className="">
                      <Input
                        placeholder="Ingresso"
                        value={
                          components[i].nome === baseTicket.nome ||
                          components[i].nome.length === 0
                            ? ""
                            : components[i].nome
                        }
                        type="text"
                        onChange={(e) => {
                          item.nome = e.target.value;
                          setComponents([...components]);
                          getTicketsName();
                        }}
                      />
                    </FormItem>
                    <div>
                      <div className="flex justify-between">
                        <Label className="pr-3">{"Preço"}</Label>
                        <>{renderTaxa(components[i], i, false)}</>
                      </div>
                      <div className="mt-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">R$ </span>
                          </div>
                          <Input
                            className="!pl-8 !pr-10"
                            placeholder="0.00"
                            value={
                              components[i].valor === baseTicket.valor ||
                              components[i].valor === 0
                                ? ""
                                : checkNegative(components[i].valor)
                            }
                            type="number"
                            min="0"
                            step=".01"
                            onChange={(e) => {
                              item.valor = e.target.valueAsNumber;
                              //item.vmeia = e.target.valueAsNumber / 2;
                              setComponents([...components]);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <FormItem label="Quantidade" className="col-span-2">
                      <Input
                        placeholder="0"
                        type="number"
                        min="0"
                        value={
                          components[i].quatidade === baseTicket.quatidade ||
                          components[i].quatidade === 0
                            ? ""
                            : checkNegative(components[i].quatidade)
                        }
                        onChange={(e) => {
                          components[i].quatidade = e.target.valueAsNumber;
                          setComponents([...components]);
                        }}
                      />
                    </FormItem>
                  </div>
                  {renderMeia(components[i], i)}
                  <div className="flex flex-col lg:flex-row justify-around lg:space-x-10">
                    {renderCheckbox(
                      "meia",
                      i + " meia",
                      "Criar meia-entrada",
                      i,
                      components[i]
                    )}
                    {renderCheckbox(
                      "absorver",
                      "Absorver taxa",
                      "Absorver taxa",
                      i,
                      components[i]
                    )}
                  </div>
                </div>
                <div>
                  <FormItem
                    label="Duração das vendas"
                    className="flex flex-col justify-end"
                  >
                    <TicketDatesRangeInput
                      defaultDateValue={components[i].data.dateRange}
                      defaultTimeValue={components[i].data.hora}
                      onFocusChange={() => {}}
                      numberOfMonths={1}
                      fieldClassName="p-5"
                      wrapFieldClassName={`w-full mt-2 relative flex flex-col md:flex-row md:items-center 
                        rounded-3xl bg-white border border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700
                        ${
                          windowSize.width > 1200 ? "divide-x" : "divide-y"
                        } divide-neutral-200 dark:divide-neutral-700 ${
                        components[i].checkboxes.lote ? "hidden" : ""
                      }`}
                      onChange={(data) => {
                        components[i].data.dateRange = data.stateDate;
                        components[i].data.hora = data.stateTimeRage;
                        setComponents([...components]);
                      }}
                      anchorDirection={
                        windowSize.width > 1200 ? "left" : "right"
                      }
                    />
                    <div
                      className={`w-full  relative flex flex-col md:flex-row md:items-center 
                      rounded-3xl bg-white border border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700
                      ${
                        windowSize.width > 1200 ? "divide-x" : "divide-y"
                      } divide-neutral-200 dark:divide-neutral-700 ${
                        components[i].checkboxes.lote ? "" : "hidden"
                      }`}
                    >
                      <div
                        className={windowSize.width > 1200 ? "w-1/2" : "hidden"}
                      >
                        <ListInput
                          defaultValue={components[i].data.startLote}
                          onChange={(e) => {
                            components[i].data.startLote = e;
                            setComponents([...components]);
                          }}
                          onInputDone={() => setLote(lote)}
                          list={components}
                          placeHolder="Selecione um Ingresso"
                          desc="Vendas se inciarão após"
                          object={item}
                        />
                      </div>
                      <div
                        className={
                          windowSize.width > 1200
                            ? "hidden"
                            : "rounded-full w-full"
                        }
                      >
                        <Select className="outline-none">
                          {removelistItem(components, components[i].nome).map(
                            (category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            )
                          )}
                        </Select>
                      </div>
                      <EventDateInput
                        sub="Final"
                        className=""
                        label="Data do evento"
                        defaultValue={components[i].data.endDate}
                        defaultTimeValue={components[i].data.hora}
                        defaultFocus={setFocus(i)}
                        onFocusChange={(focus: boolean) => {
                          components[i].utils.focus = focus;
                          setComponents([...components]);
                        }}
                        onChange={(data) => {
                          components[i].data.endDate = data.startDate;
                          components[i].data.hora = data.stateTimeRage;
                          setComponents([...components]);
                        }}
                        anchorDirection={
                          windowSize.width > 1200 ? "left" : "right"
                        }
                      />
                    </div>
                    <div className={i > 0 ? "" : "hidden"}>
                      {renderCheckbox(
                        "lote",
                        "Iniciar por Lote",
                        "Iniciar por Lote",
                        i,
                        components[i]
                      )}
                    </div>
                  </FormItem>
                </div>
                <FormItem
                  label="Descrição do ingresso"
                  className={i > 0 ? "" : "pt-2"}
                >
                  <Textarea
                    placeholder="Ex: Na compra desse ingresso ganhe uma camiseta!"
                    rows={5}
                    onChange={(e) => {
                      components[i].descricao = e.target.value;
                      setComponents([...components]);
                    }}
                  />
                </FormItem>
              </CommonLayout>
            </div>
          ))}
          <div className="flex justify-center">
            <ButtonPrimary className="h-1 w-5" onClick={addComponent}>
              +
            </ButtonPrimary>
          </div>
        </div>
      </CommonLayout>
    );
  };

  return renderForm();
};

export default TicketForm;
