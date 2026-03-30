// src/pages/components/person_components/personModalOptions.ts

export type Option = { value: string; label: string };

export type Gun = {
  id: string;
  label: string;
  faid: string;
  serial_number: string;
  firearm_info: string;
  status: string;
  validated: string;
};

export const FIXED_UNIT = "PRO 11";

export const SUB_UNITS: Option[] = [
  { value: "HQS", label: "HQS" },
  { value: "DCPO", label: "DCPO" },
  { value: "DSPPO", label: "DSPPO" },
  { value: "DNPPO", label: "DNPPO" },
  { value: "DDOPPO", label: "DDOPPO" },
  { value: "DOPPO", label: "DOPPO" },
];

export const STATIONS: Option[] = [
  { value: "RHQ", label: "RHQ" },
  { value: "Digos CPS", label: "Digos CPS" },
  { value: "Tagum CPS", label: "Tagum CPS" },
  { value: "Nabunturan MPS", label: "Nabunturan MPS" },
  { value: "Mati CPS", label: "Mati CPS" },
  { value: "PS2 - San Pedro PS", label: "PS2 - San Pedro PS" },
  { value: "Malita CPS", label: "Malita CPS" },
];

export const GUNS: Gun[] = [
  {
    id: "1",
    label: "Glock 19 (9mm) - SFA20190425-00061310",
    faid: "FAID-0001",
    serial_number: "SFA20190425-00061310",
    firearm_info: "GLOCK / 19 / 9MM",
    status: "SERVICEABLE",
    validated: "Validated",
  },
  {
    id: "2",
    label: "Colt 1911 (.45) - COLT1911-12345",
    faid: "FAID-0002",
    serial_number: "COLT1911-12345",
    firearm_info: "COLT / 1911 / .45",
    status: "SERVICEABLE",
    validated: "Validated",
  },
];