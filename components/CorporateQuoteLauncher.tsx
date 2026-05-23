"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import CorporateQuoteWidget from "./CorporateQuoteWidget";
import CorporateQuoteModal from "./CorporateQuoteModal";

const SHOW_ON = ["/", "/corporate"];

export default function CorporateQuoteLauncher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!SHOW_ON.includes(pathname)) return null;

  return (
    <>
      <CorporateQuoteWidget onOpen={() => setIsOpen(true)} />
      <CorporateQuoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
