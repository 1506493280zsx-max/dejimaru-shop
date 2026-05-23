"use client";
import { createContext, useContext, useState } from "react";

type CorporateQuoteCtx = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const CorporateQuoteContext = createContext<CorporateQuoteCtx>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function CorporateQuoteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CorporateQuoteContext.Provider value={{
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }}>
      {children}
    </CorporateQuoteContext.Provider>
  );
}

export const useCorporateQuote = () => useContext(CorporateQuoteContext);
