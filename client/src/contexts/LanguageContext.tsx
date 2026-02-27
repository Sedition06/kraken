import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { LABELS_DE, LABELS_EN } from "@/lib/config";

type Language = "de" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof LABELS_DE;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("language="));
    if (cookie) {
      const val = cookie.split("=")[1]?.trim();
      return val === "en" ? "en" : "de";
    }
    return "de";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `language=${newLang};expires=${d.toUTCString()};path=/`;
  };

  const t = lang === "en" ? LABELS_EN : LABELS_DE;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
