import { useState, useCallback } from "react";

export interface KrakenFormState {
  environment: string;
  company: string; // footprint
  regions: string[];
  results: string;
  o2: boolean;
  bewohnerPlus: boolean;
  oxgFiber: boolean;
  plz: string;
  // Workflow
  wfKaa: string;
  wfKad: string;
  wfKai: string;
  // Technical parameters
  selfinstall: string;
  direktVersorgt: string;
  maxWeVon: string;
  maxWeBis: string;
  dsVon: string;
  dsBis: string;
  usVon: string;
  usBis: string;
  docsis: string;
  abk: string;
  fttb: string;
  ne4Status: string;
  // Technical availability
  tvKaa: string;
  tvKad: string;
  tvKai: string;
  uepZustand: string;
  fiberStatus: string;
  // Contract situation (VKD)
  vertragsnummer: string;
  kundennummer: string;
  gestattungsvertrag: string;
  anschlussvertrag: string;
  salessegment: string;
  vertragscodes: string[];
  // Contract situation (UM)
  gs2Element: string;
  // BewohnerPlus
  bpKaa: string;
  bpKad: string;
  bpKai: string;
}

const initialState: KrakenFormState = {
  environment: "",
  company: "",
  regions: [],
  results: "",
  o2: false,
  bewohnerPlus: false,
  oxgFiber: false,
  plz: "",
  wfKaa: "",
  wfKad: "",
  wfKai: "",
  selfinstall: "",
  direktVersorgt: "",
  maxWeVon: "",
  maxWeBis: "",
  dsVon: "",
  dsBis: "",
  usVon: "",
  usBis: "",
  docsis: "",
  abk: "",
  fttb: "",
  ne4Status: "",
  tvKaa: "",
  tvKad: "",
  tvKai: "",
  uepZustand: "",
  fiberStatus: "",
  vertragsnummer: "",
  kundennummer: "",
  gestattungsvertrag: "",
  anschlussvertrag: "",
  salessegment: "",
  vertragscodes: [],
  gs2Element: "",
  bpKaa: "N",
  bpKad: "N",
  bpKai: "N",
};

export function useKrakenForm() {
  const [form, setForm] = useState<KrakenFormState>(initialState);

  const updateField = useCallback(<K extends keyof KrakenFormState>(field: K, value: KrakenFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setForm((prev) => ({
      ...initialState,
      environment: prev.environment,
      company: prev.company,
    }));
  }, []);

  const initializeForm = useCallback(() => {
    setForm(initialState);
  }, []);

  const isUnitymedia = form.company === "Unitymedia";
  const isVKD = form.company === "Vodafone Kabel";

  return {
    form,
    setForm,
    updateField,
    resetForm,
    initializeForm,
    isUnitymedia,
    isVKD,
  };
}
